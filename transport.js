const configuredOrigin = document.querySelector('meta[name="rnd-api-origin"]')?.content;
const pagesOrigin = configuredOrigin ? new URL(configuredOrigin).origin : '';
const sessionKey = 'rnd-session:' + pagesOrigin;
export const pagesBackend = Boolean(pagesOrigin);

export async function apiFetch(path, options = {}) {
  if (!pagesOrigin) return fetch(path, { ...options, credentials: 'same-origin' });

  const token = sessionStorage.getItem(sessionKey);
  const headers = new Headers(options.headers);
  if (token && path !== '/api/login') headers.set('Authorization', 'Bearer ' + token);
  const response = await fetch(pagesOrigin + path.replace(/^\/api\//, '/pages-api/'), {
    ...options, headers, credentials: 'omit', redirect: 'error',
  });

  if (path === '/api/login' && response.ok) {
    const { sessionToken } = await response.clone().json();
    if (typeof sessionToken !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(sessionToken)) {
      throw new Error('Сервер не выдал сессию. Повторите вход.');
    }
    sessionStorage.setItem(sessionKey, sessionToken);
  } else if ((path === '/api/logout' && response.ok) || response.status === 401) {
    if (sessionStorage.getItem(sessionKey) === token) sessionStorage.removeItem(sessionKey);
  }
  return response;
}
