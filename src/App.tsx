import { useMemo, useState } from "react";
import { BellRing, CalendarDays, Clock3, Users, Palmtree, Settings, Plus, Search, Download, ShieldCheck, Coffee, LogOut, Sun, Menu, Check, Trash2 } from "lucide-react";

type Employee = { id: number; name: string; email: string; team: string; active: boolean; schedule: string };
type Schedule = { entry: string; lunchOut: string; lunchIn: string; exit: string; saturday: boolean; sunday: boolean };
type Exception = { id: number; employee: string; type: string; start: string; end: string; note: string };
const initialEmployees: Employee[] = [
  { id: 1, name: "Ana Souza", email: "ana@empresa.com", team: "Administrativo", active: true, schedule: "Comercial" },
  { id: 2, name: "Carlos Lima", email: "carlos@empresa.com", team: "Operações", active: true, schedule: "Comercial" },
  { id: 3, name: "Mariana Alves", email: "mariana@empresa.com", team: "Administrativo", active: true, schedule: "Comercial" },
  { id: 4, name: "João Pereira", email: "joao@empresa.com", team: "Operações", active: false, schedule: "Comercial" }
];
const defaultSchedule: Schedule = { entry: "08:00", lunchOut: "12:00", lunchIn: "13:00", exit: "17:00", saturday: false, sunday: false };
const week = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const fmtDate = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

export default function App() {
  const [section, setSection] = useState("Visão geral");
  const [employees, setEmployees] = useState(initialEmployees);
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [search, setSearch] = useState("");
  const [showEmployee, setShowEmployee] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newTeam, setNewTeam] = useState("Administrativo");
  const [exceptionType, setExceptionType] = useState("Férias");
  const [exceptionEmployee, setExceptionEmployee] = useState("Todos");
  const [exceptionStart, setExceptionStart] = useState(new Date().toISOString().slice(0, 10));
  const [exceptionEnd, setExceptionEnd] = useState(new Date().toISOString().slice(0, 10));
  const [exceptionNote, setExceptionNote] = useState("");
  const [notice, setNotice] = useState("");
  const activeCount = employees.filter(e => e.active).length;
  const filteredEmployees = useMemo(() => employees.filter(e => `${e.name} ${e.email} ${e.team}`.toLowerCase().includes(search.toLowerCase())), [employees, search]);
  const today = new Date();
  const alertRows = [
    { time: schedule.entry, label: "Entrada", icon: Sun },
    { time: schedule.lunchOut, label: "Saída para almoço", icon: Coffee },
    { time: schedule.lunchIn, label: "Retorno do almoço", icon: Clock3 },
    { time: schedule.exit, label: "Saída", icon: LogOut }
  ].sort((a,b) => a.time.localeCompare(b.time));

  function addEmployee(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    setEmployees(prev => [...prev, { id: Date.now(), name: newName.trim(), email: newEmail.trim(), team: newTeam, active: true, schedule: "Comercial" }]);
    setNewName(""); setNewEmail(""); setShowEmployee(false); setNotice("Funcionário adicionado à lista de demonstração.");
  }
  function addException(e: React.FormEvent) {
    e.preventDefault();
    setExceptions(prev => [...prev, { id: Date.now(), employee: exceptionEmployee, type: exceptionType, start: exceptionStart, end: exceptionEnd, note: exceptionNote }]);
    setExceptionNote(""); setNotice("Exceção salva nesta demonstração.");
  }
  async function enableNotifications() {
    if (!("Notification" in window)) { setNotice("Este navegador não oferece suporte a notificações."); return; }
    const permission = await Notification.requestPermission();
    setNotice(permission === "granted" ? "Permissão de notificações concedida neste navegador. O envio em segundo plano exige configurar Web Push no servidor." : "Permissão não concedida. Ative as notificações nas configurações do navegador.");
  }
  async function installApp() {
    const promptEvent = (window as any).deferredPrompt;
    if (promptEvent) { promptEvent.prompt(); await promptEvent.userChoice; (window as any).deferredPrompt = null; }
    else setNotice("No Android/Chrome, use o menu do navegador e escolha 'Instalar app' ou 'Adicionar à tela inicial'.");
  }
  function toggleEmployee(id: number) { setEmployees(prev => prev.map(e => e.id === id ? { ...e, active: !e.active } : e)); }
  function exportCsv() {
    const csv = ["Nome,E-mail,Equipe,Ativo,Escala", ...employees.map(e => [e.name,e.email,e.team,e.active ? "Sim" : "Não",e.schedule].map(v => `"${v.replaceAll('"','""')}"`).join(","))].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\ufeff"+csv], { type: "text/csv;charset=utf-8" })); a.download = "funcionarios-alerta-de-ponto.csv"; a.click(); URL.revokeObjectURL(a.href);
  }

  const nav = [
    { label: "Visão geral", icon: CalendarDays },
    { label: "Funcionários", icon: Users },
    { label: "Escalas e horários", icon: Clock3 },
    { label: "Férias e folgas", icon: Palmtree },
    { label: "Notificações", icon: BellRing },
    { label: "Configurações", icon: Settings }
  ];
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><BellRing size={22}/></div><div><strong>Alerta de Ponto</strong><small>Painel administrativo</small></div></div>
      <div className="workspace"><span className="workspace-dot"/> Ambiente de demonstração</div>
      <nav>{nav.map(item => <button key={item.label} className={`nav-item ${section===item.label?"selected":""}`} onClick={() => setSection(item.label)}><item.icon size={18}/><span>{item.label}</span></button>)}</nav>
      <div className="sidebar-bottom"><ShieldCheck size={17}/><span>Acesso administrativo</span></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="mobile-brand"><Menu size={20}/><strong>Alerta de Ponto</strong></div><div className="crumb">Painel <span>/</span> {section}</div><div className="top-actions"><button className="icon-button" title="Notificações" onClick={enableNotifications}><BellRing size={18}/></button><div className="avatar">AD</div><div className="admin-label"><b>Administrador</b><small>Conta de demonstração</small></div></div></header>
      <div className="content">
        {notice && <div className="notice"><Check size={17}/><span>{notice}</span><button onClick={() => setNotice("")}>Fechar</button></div>}
        {section==="Visão geral" && <>
          <div className="page-heading"><div><div className="eyebrow">RESUMO OPERACIONAL</div><h1>Visão geral</h1><p>Acompanhe os lembretes e as escalas da sua equipe.</p></div><button className="primary" onClick={() => setSection("Escalas e horários")}><Plus size={17}/> Configurar horários</button></div>
          <div className="stats-grid">
            <Stat icon={<Users/>} label="Funcionários ativos" value={String(activeCount).padStart(2,"0")} note="na equipe" tone="teal"/>
            <Stat icon={<BellRing/>} label="Alertas por dia" value={String(alertRows.length)} note="por funcionário na escala padrão" tone="purple"/>
            <Stat icon={<CalendarDays/>} label="Exceções cadastradas" value={String(exceptions.length).padStart(2,"0")} note="férias, folgas e feriados" tone="orange"/>
            <Stat icon={<ShieldCheck/>} label="Canal de alertas" value="PWA" note="notificações a configurar" tone="blue"/>
          </div>
          <div className="dashboard-grid">
            <section className="panel schedule-panel"><div className="panel-heading"><div><h2>Horários padrão de hoje</h2><p>Escala Comercial • exemplo editável</p></div><span className="pill green">Ativa</span></div>
              <div className="today-date"><CalendarDays size={17}/>{week[(today.getDay()+6)%7]}, {fmtDate.format(today)}</div>
              <div className="timeline">{alertRows.map((row,i)=><div className="timeline-row" key={row.label}><div className="timeline-icon"><row.icon size={17}/></div><div className="timeline-copy"><b>{row.label}</b><small>Lembrete programado</small></div><time>{row.time}</time><span className="timeline-dot"/></div>)}</div>
              <button className="text-button" onClick={() => setSection("Escalas e horários")}>Editar escala <span>→</span></button>
            </section>
            <section className="panel quick-panel"><div className="panel-heading"><div><h2>Ações rápidas</h2><p>Gerencie as principais funções</p></div></div>
              <QuickAction icon={<Users/>} title="Adicionar funcionário" detail="Cadastrar membro da equipe" onClick={() => setShowEmployee(true)}/>
              <QuickAction icon={<Clock3/>} title="Editar horários" detail="Entrada, almoço e saída" onClick={() => setSection("Escalas e horários")}/>
              <QuickAction icon={<Palmtree/>} title="Registrar férias ou folga" detail="Suspender lembretes no período" onClick={() => setSection("Férias e folgas")}/>
              <QuickAction icon={<BellRing/>} title="Ativar notificações" detail="Solicitar permissão do navegador" onClick={enableNotifications}/>
            </section>
          </div>
          <section className="panel bottom-panel"><div className="panel-heading"><div><h2>Próximos passos</h2><p>Para transformar a demonstração em sistema de produção</p></div></div><div className="steps"><Step n="01" title="Configurar o servidor" text="Conectar autenticação e banco de dados."/><Step n="02" title="Ativar Web Push" text="Enviar alertas mesmo com o app fechado, quando suportado."/><Step n="03" title="Cadastrar equipe" text="Importar funcionários e atribuir escalas individuais."/></div></section>
        </>}
        {section==="Funcionários" && <><div className="page-heading"><div><div className="eyebrow">GESTÃO DA EQUIPE</div><h1>Funcionários</h1><p>Cadastre e organize quem receberá os lembretes.</p></div><button className="primary" onClick={() => setShowEmployee(true)}><Plus size={17}/> Novo funcionário</button></div><section className="panel"><div className="table-toolbar"><div><h2>Lista de funcionários</h2><p>{activeCount} ativos de {employees.length} cadastrados</p></div><div className="toolbar-actions"><label className="search"><Search size={16}/><input placeholder="Buscar funcionário" value={search} onChange={e=>setSearch(e.target.value)}/></label><button className="secondary" onClick={exportCsv}><Download size={16}/> Exportar CSV</button></div></div><div className="table-wrap"><table><thead><tr><th>Funcionário</th><th>Equipe</th><th>Escala</th><th>Status</th><th>Ação</th></tr></thead><tbody>{filteredEmployees.map(e=><tr key={e.id}><td><div className="person"><div className="person-avatar">{e.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</div><div><b>{e.name}</b><small>{e.email}</small></div></div></td><td>{e.team}</td><td><span className="pill">{e.schedule}</span></td><td><span className={`status ${e.active?"active":"inactive"}`}>{e.active?"Ativo":"Inativo"}</span></td><td><button className="small-action" onClick={()=>toggleEmployee(e.id)}>{e.active?"Desativar":"Ativar"}</button></td></tr>)}</tbody></table></div></section></>}
        {section==="Escalas e horários" && <><div className="page-heading"><div><div className="eyebrow">PROGRAMAÇÃO</div><h1>Escalas e horários</h1><p>Defina os horários que gerarão lembretes para a equipe.</p></div><span className="pill green">Escala padrão</span></div><div className="schedule-layout"><section className="panel"><div className="panel-heading"><div><h2>Horários de ponto</h2><p>Exemplo inicial • segunda a sexta</p></div></div><div className="schedule-fields"><TimeField icon={<Sun/>} label="Entrada no trabalho" value={schedule.entry} onChange={v=>setSchedule({...schedule,entry:v})}/><TimeField icon={<Coffee/>} label="Saída para almoço" value={schedule.lunchOut} onChange={v=>setSchedule({...schedule,lunchOut:v})}/><TimeField icon={<Clock3/>} label="Retorno do almoço" value={schedule.lunchIn} onChange={v=>setSchedule({...schedule,lunchIn:v})}/><TimeField icon={<LogOut/>} label="Saída do trabalho" value={schedule.exit} onChange={v=>setSchedule({...schedule,exit:v})}/></div><div className="panel-subheading"><h3>Dias de trabalho</h3><p>Selecione os dias em que esta escala se aplica.</p></div><div className="day-toggles">{week.map((d,i)=><label className="day-toggle" key={d}><input type="checkbox" checked={i<5 ? true : i===5 ? schedule.saturday : schedule.sunday} disabled={i<5} onChange={e=>setSchedule({...schedule,[i===5?"saturday":"sunday"]:e.target.checked})}/><span>{d.slice(0,3)}</span></label>)}</div><button className="primary save-button" onClick={()=>setNotice("Horários atualizados nesta demonstração. Para sincronizar todos os celulares, conecte o backend.")}><Check size={17}/> Salvar horários</button></section><section className="panel tips"><div className="tips-icon"><BellRing size={22}/></div><h2>Como os alertas funcionam</h2><p>Cada horário gera um lembrete no celular do funcionário. A escala é apenas um modelo visual nesta versão inicial.</p><ul><li>Use o horário local da empresa.</li><li>Férias e folgas devem ter prioridade sobre a escala.</li><li>O envio em segundo plano precisa de Web Push no servidor.</li></ul></section></div></>}
        {section==="Férias e folgas" && <><div className="page-heading"><div><div className="eyebrow">CALENDÁRIO DE EXCEÇÕES</div><h1>Férias e folgas</h1><p>Cadastre períodos em que os lembretes devem ser suspensos.</p></div></div><div className="exception-layout"><section className="panel"><div className="panel-heading"><div><h2>Adicionar exceção</h2><p>Escolha o tipo e o período.</p></div></div><form className="exception-form" onSubmit={addException}><label>Tipo de exceção<select value={exceptionType} onChange={e=>setExceptionType(e.target.value)}><option>Férias</option><option>Folga</option><option>Feriado</option><option>Afastamento</option></select></label><label>Funcionário<select value={exceptionEmployee} onChange={e=>setExceptionEmployee(e.target.value)}><option>Todos</option>{employees.map(e=><option key={e.id}>{e.name}</option>)}</select></label><div className="date-fields"><label>Data inicial<input required type="date" value={exceptionStart} onChange={e=>setExceptionStart(e.target.value)}/></label><label>Data final<input required type="date" min={exceptionStart} value={exceptionEnd} onChange={e=>setExceptionEnd(e.target.value)}/></label></div><label>Observação (opcional)<input value={exceptionNote} onChange={e=>setExceptionNote(e.target.value)} placeholder="Ex.: férias anuais"/></label><button className="primary" type="submit"><Plus size={17}/> Adicionar período</button></form></section><section className="panel"><div className="panel-heading"><div><h2>Períodos cadastrados</h2><p>{exceptions.length} exceção(ões)</p></div></div>{exceptions.length===0?<div className="empty"><Palmtree size={30}/><b>Nenhuma exceção cadastrada</b><span>Os períodos adicionados aparecerão aqui.</span></div>:<div className="exception-list">{exceptions.map(x=><div className="exception-item" key={x.id}><div className="exception-symbol"><Palmtree size={19}/></div><div className="exception-copy"><b>{x.type} · {x.employee}</b><span>{x.start} até {x.end}</span>{x.note&&<small>{x.note}</small>}</div><button className="icon-button danger" onClick={()=>setExceptions(prev=>prev.filter(y=>y.id!==x.id))} aria-label="Excluir período"><Trash2 size={16}/></button></div>)}</div>}</section></div></>}
        {section==="Notificações" && <><div className="page-heading"><div><div className="eyebrow">LEMBRETES</div><h1>Notificações</h1><p>Prepare o navegador para receber lembretes de horário.</p></div></div><div className="notice-layout"><section className="panel"><div className="panel-heading"><div><h2>Permissões do dispositivo</h2><p>Autorize notificações no celular ou navegador.</p></div></div><div className="permission-row"><div className="permission-icon"><BellRing/></div><div className="permission-copy"><b>Notificações do navegador</b><span>Permissão local deste dispositivo</span></div><button className="primary" onClick={enableNotifications}>Ativar permissão</button></div><div className="permission-row"><div className="permission-icon"><Download/></div><div className="permission-copy"><b>Instalar o aplicativo</b><span>Adicionar à tela inicial do celular</span></div><button className="secondary" onClick={installApp}>Instalar PWA</button></div><div className="warning"><b>Limite desta versão:</b> esta demonstração ainda não envia notificações programadas pelo servidor. Para alertas confiáveis com o aplicativo fechado, é necessário configurar chaves VAPID, assinaturas Push, um backend seguro e um agendador.</div></section><section className="panel tips"><h2>Prévia do lembrete</h2><div className="push-preview"><div className="push-app-icon"><BellRing size={18}/></div><div><b>Alerta de Ponto</b><small>Agora</small><p>Está na hora de registrar seu ponto: <strong>Entrada no trabalho</strong>.</p></div></div><p className="muted">Prévia ilustrativa. Não representa um envio real.</p></section></div></>}
        {section==="Configurações" && <><div className="page-heading"><div><div className="eyebrow">SISTEMA</div><h1>Configurações</h1><p>Informações gerais da instalação.</p></div></div><section className="panel settings-panel"><Setting label="Nome do sistema" value="Alerta de Ponto"/><Setting label="Plataforma" value="PWA instalável"/><Setting label="Tamanho previsto" value="20–50 funcionários"/><Setting label="Fuso horário sugerido" value="America/Sao_Paulo"/><Setting label="Modo atual" value="Demonstração local"/><div className="warning">Esta versão não tem login real nem banco de dados compartilhado. Os dados cadastrados ficam apenas na memória desta página e serão perdidos ao recarregar. Não utilize dados reais de funcionários até conectar e proteger o backend.</div></section></>}
      </div>
    </main>
    {showEmployee && <div className="modal-backdrop" onClick={()=>setShowEmployee(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-heading"><div><h2>Novo funcionário</h2><p>Adicionar pessoa à lista de demonstração</p></div><button className="icon-button" onClick={()=>setShowEmployee(false)}>×</button></div><form className="exception-form" onSubmit={addEmployee}><label>Nome completo<input required value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Nome do funcionário"/></label><label>E-mail<input required type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="nome@empresa.com"/></label><label>Equipe<select value={newTeam} onChange={e=>setNewTeam(e.target.value)}><option>Administrativo</option><option>Operações</option><option>Comercial</option><option>Financeiro</option><option>Recursos Humanos</option></select></label><button className="primary" type="submit"><Plus size={17}/> Cadastrar funcionário</button></form></div></div>}
  </div>;
}
function Stat({icon,label,value,note,tone}:{icon:React.ReactNode;label:string;value:string;note:string;tone:string}){return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>}
function QuickAction({icon,title,detail,onClick}:{icon:React.ReactNode;title:string;detail:string;onClick:()=>void}){return <button className="quick-action" onClick={onClick}><div className="quick-icon">{icon}</div><div><b>{title}</b><small>{detail}</small></div><span>→</span></button>}
function Step({n,title,text}:{n:string;title:string;text:string}){return <div className="step"><span>{n}</span><b>{title}</b><p>{text}</p></div>}
function TimeField({icon,label,value,onChange}:{icon:React.ReactNode;label:string;value:string;onChange:(v:string)=>void}){return <label className="time-field"><span className="field-icon">{icon}</span><span className="field-label">{label}</span><input type="time" value={value} onChange={e=>onChange(e.target.value)}/></label>}
function Setting({label,value}:{label:string;value:string}){return <div className="setting-row"><span>{label}</span><b>{value}</b></div>}