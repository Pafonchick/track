const today = new Date();
const date = (offset) => { const d = new Date(today); d.setDate(d.getDate()+offset); return d.toISOString().slice(0,10); };
const now = () => new Date().toISOString();
const uid = () => crypto.randomUUID();
const stamp = { revision: 1, createdAt: now(), updatedAt: now() };
const people = [
  {id:'u1',name:'Александр Волков',email:'a.volkov@example.com',role:'admin',analystId:'',active:true,...stamp},
  {id:'u2',name:'Мария Соколова',email:'m.sokolova@example.com',role:'analyst',analystId:'',active:true,...stamp},
  {id:'u3',name:'Дмитрий Козлов',email:'d.kozlov@example.com',role:'analyst',analystId:'',active:true,...stamp},
  {id:'u4',name:'Иван Петров',email:'i.petrov@example.com',role:'developer',analystId:'u2',active:true,...stamp},
  {id:'u5',name:'Анна Морозова',email:'a.morozova@example.com',role:'developer',analystId:'u2',active:true,...stamp},
  {id:'u6',name:'Михаил Орлов',email:'m.orlov@example.com',role:'developer',analystId:'u3',active:true,...stamp},
  {id:'u7',name:'Елена Лебедева',email:'e.lebedeva@example.com',role:'developer',analystId:'u3',active:true,...stamp}
];
for(const user of people)user.login=user.email.split('@')[0];
const projects = [
  {id:'p1',key:'API',name:'Клиентский портал',description:'Единое пространство для клиентов: личный кабинет, API и управление доступом.',color:'#9982d2',memberIds:['u1','u2','u4','u5'],status:'active',...stamp},
  {id:'p2',key:'BI',name:'Система аналитики',description:'Дашборды, отчёты и показатели для принятия решений.',color:'#78a0c7',memberIds:['u1','u3','u6','u7'],status:'active',...stamp},
  {id:'p3',key:'RND',name:'Внутренние сервисы',description:'Инструменты команды, автоматизация процессов и документация.',color:'#c2a16e',memberIds:people.map(x=>x.id),status:'active',...stamp}
];
const task = (n, title, description, kind, status, priority, projectId, assigneeId, offset, comments=[]) => ({id:'t'+n,key:projects.find(p=>p.id===projectId).key+'-'+(100+n),title,description,kind,status,priority,projectId,assigneeId,authorId:people.find(p=>p.id===assigneeId)?.analystId||'u1',dueDate:date(offset),checklist:[],progress:status==='done'?100:status==='review'?90:status==='progress'?(n===4?45:n===5?20:65):0,startedAt:['progress','review','done'].includes(status)?new Date(Date.now()-(n+4)*3600000).toISOString():null,completedAt:status==='done'?new Date(Date.now()-n*1800000).toISOString():null,comments:comments.map((body,i)=>({id:'c'+n+'-'+i,body,authorId:i%2?'u4':'u2',createdAt:now()})),...stamp});
const seed = {
  users:people, projects,
  personalEntries:people.flatMap((user,index)=>[
    {id:'personal-note-'+user.id,ownerId:user.id,kind:'note',title:index===0?'Идеи на следующую неделю':'Мои рабочие заметки',body:index===0?'Продумать короткие встречи по проектам.\n\nСобрать обратную связь от аналитиков и программистов. Сохранить решения отдельно от общих задач.':'Здесь можно записать мысли, вопросы и черновики. Эту заметку видит только мой аккаунт.',items:[],pinned:true,archived:false,...stamp},
    {id:'personal-checklist-'+user.id,ownerId:user.id,kind:'checklist',title:index===0?'Перед началом рабочего дня':'Мой план на сегодня',body:'Личный список, который не попадает в задачи команды.',items:[{id:'item-'+user.id+'-1',text:'Проверить свои активные задачи',done:true},{id:'item-'+user.id+'-2',text:'Ответить на открытые вопросы',done:false},{id:'item-'+user.id+'-3',text:'Записать итоги дня',done:false}],pinned:false,archived:false,...stamp}
  ]),
  tasks:[
    task(1,'Спроектировать API авторизации','Описать методы входа, обновления сессии и восстановления доступа. Согласовать контракты с командой.','task','todo','high','p1','u4',2,['Добавила описание пользовательских сценариев.','Посмотрю формат ответов сегодня.']),
    task(2,'Согласовать метрики дашборда','Уточнить определения показателей и единицы измерения для нового отчёта.','question','todo','medium','p2','u3',3,['Нужен список обязательных срезов.']),
    task(3,'Подготовить описание ролей','Матрица доступа для администратора, аналитика и программиста.','task','todo','low','p3','u2',5),
    task(4,'Реализовать личный кабинет','Сверстать основные разделы профиля и подключить настройки уведомлений.','task','progress','high','p1','u5',1,['Макеты согласованы, можно начинать.','Есть вопрос по мобильной версии.','Мобильный макет добавлен.']),
    task(5,'Нет доступа к тестовому API','Стенд возвращает 403 при запросе отчёта. Проверить настройки тестового окружения.','problem','progress','critical','p2','u6',0,['Ошибка повторяется на тестовом аккаунте.','Проверяем права сервисной роли.']),
    task(6,'Настроить экспорт отчётов','Добавить выгрузку выбранного отчёта и обработку пустого результата.','task','progress','medium','p2','u7',3),
    task(7,'Проверить сценарии регистрации','Пройти сценарии валидации, повторной регистрации и приглашения в проект.','task','review','medium','p1','u2',1,['Все основные сценарии работают. Осталась проверка приглашений.']),
    task(8,'Уточнить правила округления','Какая точность нужна для итоговых показателей в ежемесячном отчёте?','question','review','low','p2','u3',2),
    task(9,'Обновить документацию проекта','Зафиксировать структуру API, порядок запуска и договорённости по работе в команде.','task','done','low','p3','u4',-1,['Документация обновлена.']),
    task(10,'Исправить фильтрацию по дате','Период включал лишний день при переходе между часовыми поясами.','problem','done','high','p2','u6',-2,['Проверено на граничных датах.']),
    task(11,'Собрать требования к порталу','Пользовательские сценарии, обязательные поля и приоритеты первого выпуска.','task','done','medium','p1','u2',-3)
  ],
  activity:[
    {id:'a1',userId:'u5',message:'перевела «Реализовать личный кабинет» в работу',entityType:'task',entityId:'t4',createdAt:new Date(Date.now()-12*60000).toISOString()},
    {id:'a2',userId:'u2',message:'добавила комментарий к API-101',entityType:'task',entityId:'t1',createdAt:new Date(Date.now()-38*60000).toISOString()},
    {id:'a3',userId:'u6',message:'закрыл проблему с фильтрацией по дате',entityType:'task',entityId:'t10',createdAt:new Date(Date.now()-65*60000).toISOString()}
  ], revision:1,storage:{mode:'demo',auth:'password',encrypted:false,provider:'demo-memory'}
};
const demoPoint=(id,text,assigneeId,dueDate,doneById=null,doneAt=null)=>({
  id,text,assigneeId,dueDate,done:!!doneById,doneById,doneAt,
  doneByName:people.find(user=>user.id===doneById)?.name||''
});
Object.assign(seed.tasks.find(task=>task.id==='t4'),{progress:33,checklist:[
  demoPoint('task-t4-item1','Согласовать состав разделов личного кабинета','u5',date(0),'u2',new Date(Date.now()-90*60000).toISOString()),
  demoPoint('task-t4-item2','Подключить настройки профиля','u4',date(2)),
  demoPoint('task-t4-item3','Проверить мобильную версию','u5',date(3))
]});
Object.assign(seed.tasks.find(task=>task.id==='t9'),{checklist:[
  demoPoint('task-t9-item1','Описать запуск и структуру API','u4',date(-1),'u4',new Date(Date.now()-6*3600000).toISOString()),
  demoPoint('task-t9-item2','Проверить ссылки и примеры','u4',date(-1),'u2',new Date(Date.now()-5*3600000).toISOString())
]});
function badTaskChecklist(message,code='invalid_checklist'){const error=new Error(message);error.status=400;error.code=code;throw error;}
const demoChecklistProgress=items=>Math.floor(items.filter(item=>item.done).length/items.length*100);
function markDemoPoint(item,done,actor) {
  if(!done)return {...item,done:false,doneById:null,doneByName:'',doneAt:null};
  if(item.done)return {...item};
  return {...item,done:true,doneById:actor.id,doneByName:actor.name,doneAt:now()};
}
function normalizeTaskChecklist(value,existing,project,sameProject,actor) {
  if(!Array.isArray(value)||value.length>200)badTaskChecklist('В чек-листе задачи может быть до 200 пунктов.');
  const known=new Map(existing.map(item=>[item.id,item]));
  const seen=new Set();
  return value.map(item=>{
    if(!item||typeof item!=='object'||Array.isArray(item)||
      Object.keys(item).some(key=>!['id','text','done','assigneeId','dueDate'].includes(key)))badTaskChecklist('Некорректный пункт чек-листа.');
    if(Object.hasOwn(item,'id')&&(!known.has(item.id)||seen.has(item.id)))badTaskChecklist('Идентификатор пункта неизвестен или повторяется.');
    const id=item.id||uid();
    seen.add(id);
    const previous=known.get(id);
    const text=typeof item.text==='string'?item.text.trim():'';
    if(!text||text.length>500)badTaskChecklist('Добавьте текст каждого пункта. Максимум 500 символов.');
    const done=Object.hasOwn(item,'done')?item.done:previous?.done??false;
    if(typeof done!=='boolean')badTaskChecklist('Состояние пункта должно быть true или false.');
    const assigneeId=Object.hasOwn(item,'assigneeId')?item.assigneeId:previous?.assigneeId||'';
    const previousAssignment=sameProject&&assigneeId===previous?.assigneeId;
    const eligible=db.users.some(user=>user.id===assigneeId&&user.active&&project.memberIds.includes(user.id));
    if(typeof assigneeId!=='string'||(assigneeId&&!previousAssignment&&!eligible))badTaskChecklist('Исполнитель пункта должен быть активным участником проекта.');
    const dueDate=Object.hasOwn(item,'dueDate')?item.dueDate:previous?.dueDate||'';
    if(typeof dueDate!=='string'||(dueDate&&!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)))badTaskChecklist('Некорректный срок пункта.');
    const parsed=dueDate&&new Date(dueDate+'T12:00:00Z');
    if(parsed&&(!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==dueDate))badTaskChecklist('Некорректный срок пункта.');
    return markDemoPoint({
      id,text,assigneeId,dueDate,done:previous?.done??false,
      doneById:previous?.doneById??null,doneByName:previous?.doneByName||'',doneAt:previous?.doneAt??null
    },done,actor);
  });
}
function sameDemoChecklist(left,right) {
  return left.length===right.length&&left.every((item,index)=>
    ['id','text','done','assigneeId','dueDate'].every(key=>item[key]===right[index][key]));
}
let db=structuredClone(seed), current='u1';
export const demoUsers=()=>db.users.filter(u=>u.active);
export function switchDemoUser(id){if(db.users.some(u=>u.id===id&&u.active))current=id;}
const demoManages=(actor,userId)=>actor.role==='analyst'&&db.users.some(user=>user.id===userId&&user.analystId===actor.id);
const canWriteTask=(task,actor)=>actor.role==='admin'||task.assigneeId===actor.id||demoManages(actor,task.assigneeId);
function canTask(task) {
  const user=db.users.find(user=>user.id===current);
  if(user.role==='admin')return true;
  if(!db.projects.find(project=>project.id===task.projectId)?.memberIds.includes(current))return false;
  return canWriteTask(task,user)||task.authorId===current||
    task.checklist.some(item=>item.assigneeId===current||demoManages(user,item.assigneeId));
}
function snapshot(){const u=db.users.find(x=>x.id===current),projects=u.role==='admin'?db.projects:db.projects.filter(p=>p.memberIds.includes(current)),visibleIds=new Set(projects.flatMap(p=>p.memberIds));return structuredClone({...db,user:u,personalEntries:db.personalEntries.filter(entry=>entry.ownerId===current),projects,tasks:db.tasks.filter(canTask),archivedTasks:db.tasks.filter(t=>t.status==='done'&&canTask(t)),users:u.role==='admin'?db.users:db.users.filter(x=>visibleIds.has(x.id)||x.id===current||x.analystId===current||x.id===u.analystId),activity:db.activity.filter(a=>a.entityType!=='task'||db.tasks.some(t=>t.id===a.entityId&&canTask(t)))});}
export async function demoRequest(path, method='GET', body={}){
  if(path==='/api/bootstrap')return snapshot();
  const user=db.users.find(u=>u.id===current);
  const parts=path.split('/').filter(Boolean), collection=parts[1], id=parts[2];
  const fail=(message)=>{const e=new Error(message);e.status=403;throw e;};
  if(collection==='personal'){
    const entry=id?db.personalEntries.find(x=>x.id===id&&x.ownerId===current):null;
    if(id&&!entry){const e=new Error('Личная запись не найдена.');e.status=404;throw e;}
    if(method==='GET')return id?{entry:structuredClone(entry)}:{personalEntries:structuredClone(db.personalEntries.filter(x=>x.ownerId===current))};
    if(entry&&body.revision!==entry.revision){const e=new Error('Запись уже изменилась. Обновите данные перед сохранением.');e.status=409;throw e;}
    if(method==='DELETE'){db.personalEntries=db.personalEntries.filter(x=>x.id!==id);db.revision++;return{ok:true};}
    const data={};for(const key of ['title','body','pinned','archived'])if(body[key]!==undefined)data[key]=body[key];
    const kind=entry?.kind||body.kind;
    if(!['note','checklist'].includes(kind))fail('Выберите тип личной записи.');
    if(!String(data.title??entry?.title??'').trim())fail('Добавьте название.');
    if(String(data.title??'').length>200||String(data.body??'').length>12000)fail('Текст слишком длинный.');
    if(body.items!==undefined){if(!Array.isArray(body.items)||body.items.length>200)fail('В чек-листе может быть до 200 пунктов.');data.items=kind==='note'?[]:body.items.map(item=>({id:item.id||uid(),text:String(item.text).trim(),done:item.done===true}));if(data.items.some(item=>!item.text||item.text.length>500))fail('Добавьте текст каждого пункта, до 500 символов.');}
    let result;
    if(method==='POST'){result={id:uid(),ownerId:current,kind,title:'',body:'',items:[],pinned:false,archived:false,...stamp,...data};db.personalEntries.push(result);}
    else{Object.assign(entry,data);entry.revision++;entry.updatedAt=now();result=entry;}
    db.revision++;return{entry:structuredClone(result)};
  }
  if(collection==='backup')fail('Демо-данные хранятся только в памяти. Зашифрованная копия доступна в рабочем пространстве.');
  if(collection==='me'){Object.assign(user,{name:body.name||user.name});return{user};}
  if(!['tasks','users','projects'].includes(collection))return{};
  if(collection!=='tasks'&&user.role!=='admin')fail('Это действие доступно администратору.');
  let item=db[collection].find(x=>x.id===id);
  if(collection==='tasks'&&parts[3]==='checklist'&&method==='PATCH'){
    const point=item?.checklist.find(point=>point.id===parts[4]);
    if(!point||!canTask(item)){
      const error=new Error('Пункт чек-листа не найден.');error.status=404;throw error;
    }
    if(!canWriteTask(item,user)&&point.assigneeId!==user.id)fail('Можно отмечать только назначенный вам пункт.');
    if(item.status==='done')badTaskChecklist('Сначала верните завершённую задачу в работу.','task_archived');
    if(body.revision!==item.revision){
      const error=new Error('Задача уже изменилась. Обновите данные перед сохранением.');error.status=409;throw error;
    }
    if(typeof body.done!=='boolean'||Object.keys(body).some(key=>!['done','revision'].includes(key)))badTaskChecklist('Некорректная отметка пункта.');
    if(point.done===body.done)return {task:structuredClone(item)};
    item.checklist=item.checklist.map(currentPoint=>currentPoint.id===point.id?markDemoPoint(currentPoint,body.done,user):currentPoint);
    item.progress=demoChecklistProgress(item.checklist);
    if(body.done&&!item.startedAt)item.startedAt=now();
    item.revision++;
    item.updatedAt=now();
    db.revision++;
    db.activity.unshift({id:uid(),userId:current,message:'обновил(а) пункт задачи «'+item.title+'»',entityType:'task',entityId:item.id,createdAt:now()});
    return {task:structuredClone(item)};
  }
  if(collection==='tasks'&&item&&!canTask(item))fail('У вас нет доступа к этой задаче.');
  if(collection==='tasks'&&item&&parts[3]!=='comments'&&!canWriteTask(item,user))fail('Можно изменять только свои задачи или задачи закреплённых программистов.');
  if(id&&!item)fail('Запись не найдена.');
  if(id&&parts[3]!=='comments'&&body.revision!==item.revision){const e=new Error('Запись уже изменилась. Обновите данные перед сохранением.');e.status=409;throw e;}
  if(method==='DELETE'){
    if(collection==='users'){if(id===current)fail('Нельзя отключить собственный аккаунт.');item.active=false;}
    else db[collection]=db[collection].filter(x=>x.id!==id);
    return{ok:true};
  }
  if(parts[3]==='comments'){item.comments.push({id:uid(),authorId:current,body:body.body,createdAt:now()});item.revision++;return{task:item};}
  const safe={...body};delete safe.id;delete safe.revision;delete safe.password;delete safe.startedAt;delete safe.completedAt;
  if(collection==='tasks'){
    const p=db.projects.find(x=>x.id===body.projectId||(item&&x.id===item.projectId));
    if(!p||!p.memberIds.includes(current)&&user.role!=='admin')fail('Вы не участвуете в этом проекте.');
    const assignee=body.assigneeId||item?.assigneeId||current;
    if(!p.memberIds.includes(assignee))fail('Исполнитель должен участвовать в проекте.');
    if(user.role==='developer'&&assignee!==current)fail('Можно назначить задачу только себе.');
    if(user.role==='analyst'&&assignee!==current&&db.users.find(x=>x.id===assignee)?.analystId!==current)fail('Можно назначить своего программиста.');
    const status=safe.status||item?.status||'todo';
    const existingChecklist=item?.checklist||[];
    const editableChecklist=existingChecklist.map(({id,text,done,assigneeId,dueDate})=>({id,text,done,assigneeId,dueDate}));
    const checklist=normalizeTaskChecklist(safe.checklist===undefined?editableChecklist:safe.checklist,existingChecklist,p,item?.projectId===p.id,user);
    safe.checklist=checklist;
    if(item?.status==='done'&&status==='done'&&!sameDemoChecklist(checklist,existingChecklist))badTaskChecklist('Сначала верните завершённую задачу в работу, чтобы изменить чек-лист.','task_archived');
    let progress=safe.progress??item?.progress??0;
    if(!Number.isInteger(progress)||progress<0||progress>100)fail('Процент выполнения должен быть целым числом от 0 до 100.');
    if(checklist.length){const automatic=demoChecklistProgress(checklist);if(body.progress!==undefined&&body.progress!==automatic)badTaskChecklist('Процент выполнения рассчитывается по чек-листу.','checklist_progress');progress=automatic;if(status==='done'&&checklist.some(point=>!point.done))badTaskChecklist('Выполните все пункты чек-листа перед завершением задачи.','checklist_incomplete');}
    if(status==='done'){progress=100;safe.completedAt=item?.completedAt||now();}
    else{safe.completedAt=null;if(!checklist.length&&item?.status==='done'&&progress===100)progress=99;}
    safe.progress=progress;safe.startedAt=item?.startedAt||((status==='progress'||status==='done'||progress>0||checklist.some(point=>point.done))?now():null);
  }
  if(method==='POST'){
    item={id:uid(),...stamp,...safe};
    if(collection==='tasks')Object.assign(item,{key:(db.projects.find(p=>p.id===body.projectId)?.key||'RND')+'-'+(db.tasks.length+101),authorId:current,comments:[],description:body.description||'',dueDate:body.dueDate||''});
    if(collection==='users')Object.assign(item,{active:true,analystId:body.analystId||''});
    db[collection].push(item);
  }else{Object.assign(item,safe);item.revision++;item.updatedAt=now();}
  db.revision++;
  db.activity.unshift({id:uid(),userId:current,message:(method==='POST'?'создал(а) ':'обновил(а) ')+(collection==='tasks'?'задачу «'+item.title+'»':collection==='projects'?'проект «'+item.name+'»':'участника «'+item.name+'»'),entityType:collection==='tasks'?'task':collection==='projects'?'project':'user',entityId:item.id,createdAt:now()});
  return{[collection==='tasks'?'task':collection==='projects'?'project':'user']:structuredClone(item)};
}
