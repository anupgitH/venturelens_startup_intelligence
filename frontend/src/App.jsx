import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowRight, BarChart3, Bookmark, BriefcaseBusiness, Check,
  ChevronRight, CircleHelp, ClipboardList, Compass, FileText, FlaskConical,
  Gauge, Lightbulb, LogOut, Menu, Plus, Rocket, Search, ShieldCheck,
  Sparkles, Target, Trash2, TrendingUp, Users, X
} from 'lucide-react'

const API = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const emptyIdea = { idea_name: '', industry: 'Education', target_audience: '', budget: '₹50,000–₹2,00,000', geography: 'India', description: '' }

async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  })
  if (response.status === 204) return null
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.detail || 'Something went wrong. Please try again.')
  return data
}

function Brand() {
  return <div className="brand-mark"><span className="brand-icon"><Sparkles size={19} /></span><span>venture<span className="brand-light">lens</span><small>STARTUP INTELLIGENCE</small></span></div>
}
function ScoreRing({ score = 0, size = 124 }) {
  const radius = 42, circumference = 2 * Math.PI * radius
  return <div className="score-ring" style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" aria-label={`Score ${score} out of 100`}>
      <circle cx="50" cy="50" r={radius} className="ring-track" />
      <circle cx="50" cy="50" r={radius} className="ring-value" strokeDasharray={`${circumference * score / 100} ${circumference}`} />
    </svg>
    <div className="ring-center"><strong>{score}</strong><span>/ 100</span></div>
  </div>
}
function Auth({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const change = e => setForm({ ...form, [e.target.name]: e.target.value })
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true)
    try {
      const data = await request(`/api/auth/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', body: JSON.stringify(form) })
      onAuth(data)
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <div className="auth-screen">
    <div className="auth-art">
      <Brand />
      <div className="auth-art-copy"><span className="eyebrow"><Sparkles size={14} /> YOUR NEXT BIG THING STARTS HERE</span><h1>Good ideas deserve<br /><em>great validation.</em></h1><p>Turn your early-stage idea into a clearer business hypothesis with AI-powered analysis and a practical plan to test it.</p>
        <div className="floating-card"><div className="float-icon"><TrendingUp size={18}/></div><div><strong>From idea to insight</strong><span>One thoughtful decision at a time</span></div><span className="float-status"><span/> READY</span></div>
        <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-glow"/>
      </div>
      <div className="auth-footer">BUILT FOR THE NEXT GENERATION OF FOUNDERS <span>© 2026 VENTURELENS</span></div>
    </div>
    <div className="auth-form-wrap">
      <div className="auth-form">
        <div className="mobile-brand"><Brand /></div>
        <span className="eyebrow muted">{mode === 'login' ? 'WELCOME BACK' : 'START YOUR JOURNEY'}</span>
        <h2>{mode === 'login' ? 'Sign in to your workspace' : 'Create your workspace'}</h2>
        <p className="form-subtitle">{mode === 'login' ? 'Pick up where your next big idea left off.' : 'A clearer path from idea to first customer.'}</p>
        <form onSubmit={submit}>
          {mode === 'register' && <label>Full name<input name="name" value={form.name} onChange={change} placeholder="Your name" minLength="2" required /></label>}
          <label>Email address<input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={change} placeholder="At least 8 characters" minLength="8" required /></label>
          {error && <div className="error-box">{error}</div>}
          <button className="btn btn-primary auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={17}/></button>
        </form>
        <div className="auth-switch">{mode === 'login' ? 'New to VentureLens?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></div>
        <div className="auth-note"><ShieldCheck size={15}/> Your ideas are private to your account.</div>
      </div>
    </div>
  </div>
}
const navItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3, group: 'WORKSPACE' },
  { id: 'new', label: 'Validate an idea', icon: Sparkles, group: 'WORKSPACE' },
  { id: 'history', label: 'My analyses', icon: ClipboardList, group: 'WORKSPACE' }
]
function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vl_session') || 'null') } catch { return null }
  })
  const [page, setPage] = useState('overview')
  const [analyses, setAnalyses] = useState([])
  const [selected, setSelected] = useState(null)
  const [user, setUser] = useState(null)
  const [idea, setIdea] = useState(emptyIdea)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const token = session?.access_token
  const filtered = useMemo(() => analyses.filter(a => `${a.idea_name} ${a.industry}`.toLowerCase().includes(search.toLowerCase())), [analyses, search])

  function auth(data) {
    localStorage.setItem('vl_session', JSON.stringify(data))
    setSession(data); setUser(data.user); setPage('overview')
  }
  function logout() {
    localStorage.removeItem('vl_session'); setSession(null); setUser(null); setAnalyses([]); setSelected(null)
  }
  async function loadAnalyses() {
    if (!token) return
    setLoading(true)
    try {
      const data = await request('/api/analyses', { token })
      setAnalyses(data)
      if (selected) setSelected(data.find(a => a.id === selected.id) || null)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => {
    if (!token) return
    request('/api/auth/me', { token }).then(setUser).catch(logout)
    loadAnalyses()
  }, [token])
  async function submitIdea(e) {
    e.preventDefault(); setBusy(true); setError(''); setNotice('')
    try {
      const result = await request('/api/analyses', { token, method: 'POST', body: JSON.stringify(idea) })
      setAnalyses(prev => [result, ...prev]); setSelected(result); setPage('report')
      setNotice('Your analysis is ready.')
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  async function removeAnalysis(id) {
    if (!window.confirm('Delete this analysis? This cannot be undone.')) return
    try {
      await request(`/api/analyses/${id}`, { token, method: 'DELETE' })
      setAnalyses(prev => prev.filter(a => a.id !== id))
      if (selected?.id === id) setSelected(null)
      setNotice('Analysis deleted.')
    } catch (err) { setError(err.message) }
  }
  if (!session || !token) return <Auth onAuth={auth}/>
  const currentUser = user || session.user
  const firstName = (currentUser?.name || 'Founder').split(' ')[0]
  const startNew = () => { setIdea(emptyIdea); setSelected(null); setError(''); setPage('new') }
  const openReport = a => { setSelected(a); setPage('report') }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand"><Brand/><button className="icon-btn close-mobile" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace-switch"><div className="workspace-avatar">V</div><div><strong>Founder workspace</strong><span>Personal workspace</span></div><ChevronRight size={15}/></div>
      {['WORKSPACE'].map(group => <div className="nav-group" key={group}><span className="nav-label">{group}</span>{navItems.filter(n => n.group === group).map(item => <button key={item.id} className={`nav-item ${page === item.id || (page === 'report' && item.id === 'history') ? 'active' : ''}`} onClick={() => { setPage(item.id); setError(''); setMobileNav(false) }}><item.icon size={17}/>{item.label}{item.id === 'history' && analyses.length > 0 && <span className="nav-count">{analyses.length}</span>}</button>)}</div>)}
      <div className="sidebar-spacer"/>
      <div className="sidebar-tip"><div className="tip-icon"><Lightbulb size={17}/></div><strong>Founder tip</strong><p>Talk to five potential customers before writing your first line of product code.</p><button onClick={() => { setPage('new'); setMobileNav(false) }}>Validate an idea <ArrowRight size={14}/></button></div>
      <div className="sidebar-profile"><div className="profile-avatar">{firstName.charAt(0).toUpperCase()}</div><div className="profile-meta"><strong>{currentUser?.name || 'Founder'}</strong><span>{currentUser?.email || ''}</span></div><button className="icon-btn" title="Sign out" onClick={logout}><LogOut size={17}/></button></div>
    </aside>
    {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close menu"/>}
    <main className="main-panel">
      <header className="topbar"><div className="topbar-left"><button className="icon-btn menu-toggle" onClick={() => setMobileNav(true)}><Menu size={20}/></button><span className="breadcrumb">Workspace</span><ChevronRight size={14}/><strong>{page === 'new' ? 'New analysis' : page === 'history' ? 'My analyses' : page === 'report' ? 'Analysis report' : 'Overview'}</strong></div><div className="topbar-right"><span className="status-pill"><span/> SYSTEM OPERATIONAL</span><button className="top-avatar" title={currentUser?.name}>{firstName.charAt(0).toUpperCase()}</button></div></header>
      <div className="page-content">
        {error && <div className="alert alert-error"><CircleHelp size={17}/><span>{error}</span><button onClick={() => setError('')}><X size={16}/></button></div>}
        {notice && <div className="alert alert-success"><Check size={17}/><span>{notice}</span><button onClick={() => setNotice('')}><X size={16}/></button></div>}
        {page === 'overview' && <Overview firstName={firstName} analyses={analyses} loading={loading} onNew={startNew} onOpen={openReport} onHistory={() => setPage('history')}/>}
        {page === 'new' && <NewIdea idea={idea} setIdea={setIdea} busy={busy} onSubmit={submitIdea} onCancel={() => setPage('overview')}/>}
        {page === 'history' && <History analyses={filtered} search={search} setSearch={setSearch} loading={loading} onNew={startNew} onOpen={openReport} onDelete={removeAnalysis}/>}
        {page === 'report' && selected && <Report analysis={selected} onBack={() => setPage('history')} onNew={startNew}/>}
        {page === 'report' && !selected && <div className="empty-state"><FileText size={32}/><h3>No report selected</h3><button className="btn btn-primary" onClick={startNew}>Validate an idea</button></div>}
      </div>
      <footer className="app-footer"><span>VENTURELENS <span className="footer-dot">·</span> BUILT FOR BETTER DECISIONS</span><span>AI-assisted analysis <span className="footer-dot">·</span> Verify before investing</span></footer>
    </main>
  </div>
}
function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><span className="eyebrow muted">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>
}
function Overview({ firstName, analyses, loading, onNew, onOpen, onHistory }) {
  const avg = analyses.length ? Math.round(analyses.reduce((s, a) => s + a.score, 0) / analyses.length) : 0
  return <div className="fade-in">
    <PageHeading eyebrow="YOUR FOUNDER WORKSPACE" title={<>Good things start with a <em>question, {firstName}.</em></>} description="Turn uncertainty into a plan. Explore, test and refine your next business idea." action={<button className="btn btn-primary" onClick={onNew}><Plus size={17}/> New analysis</button>}/>
    <div className="hero-banner"><div className="hero-copy"><span className="hero-tag"><Sparkles size={13}/> YOUR NEXT MOVE</span><h2>Big idea? Let's put it<br/>to the <em>test.</em></h2><p>Get a structured view of the opportunity, risks and next steps — before you invest your time and money.</p><button className="btn btn-white" onClick={onNew}>Validate your idea <ArrowRight size={16}/></button></div><div className="hero-visual"><div className="hero-orbit orbit-a"/><div className="hero-orbit orbit-b"/><div className="hero-core"><Rocket size={34}/></div><div className="hero-float hero-float-top"><span className="mini-icon purple"><Target size={15}/></span><div><strong>Find your market</strong><small>Understand your customer</small></div></div><div className="hero-float hero-float-bottom"><span className="mini-icon mint"><Activity size={15}/></span><div><strong>Test assumptions</strong><small>Build with confidence</small></div></div></div></div>
    <div className="section-title-row"><div><h2>Your workspace at a glance</h2><p>A snapshot of your validation journey.</p></div><button className="text-button" onClick={onHistory}>View all analyses <ArrowRight size={15}/></button></div>
    <div className="stats-grid">
      <Stat icon={FlaskConical} label="Ideas explored" value={analyses.length} note="Saved analyses" tone="violet"/>
      <Stat icon={Gauge} label="Average score" value={analyses.length ? `${avg}/100` : '—'} note="Across your ideas" tone="blue"/>
      <Stat icon={TrendingUp} label="Highest score" value={analyses.length ? `${Math.max(...analyses.map(a => a.score))}/100` : '—'} note="Your top-rated idea" tone="green"/>
      <Stat icon={Target} label="Industries" value={new Set(analyses.map(a => a.industry)).size} note="Areas explored" tone="orange"/>
    </div>
    <div className="section-title-row recent-heading"><div><h2>Recently explored</h2><p>Your latest startup ideas and their initial scores.</p></div></div>
    {loading ? <div className="loading-card">Loading your workspace…</div> : analyses.length ? <div className="recent-grid">{analyses.slice(0, 3).map(a => <AnalysisCard key={a.id} analysis={a} onOpen={onOpen}/>)}</div> : <div className="empty-card"><div className="empty-illustration"><Lightbulb size={28}/></div><h3>Your first idea starts here</h3><p>Every great company begins with a problem worth solving. Start by describing yours.</p><button className="btn btn-primary" onClick={onNew}><Sparkles size={16}/> Validate your first idea</button></div>}
    <div className="disclaimer"><ShieldCheck size={17}/><span><strong>A note on AI analysis</strong> Reports help organize your thinking; they do not verify demand or guarantee success. Validate findings with real customers and independent research.</span></div>
  </div>
}
function Stat({ icon: Icon, label, value, note, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={18}/></div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-note">{note}</span></div>
}
function AnalysisCard({ analysis, onOpen }) {
  return <button className="analysis-card" onClick={() => onOpen(analysis)}><div className="analysis-card-top"><span className="industry-tag">{analysis.industry}</span><span className="card-date">{new Date(analysis.created_at).toLocaleDateString()}</span></div><div className="analysis-card-title"><div className="idea-icon"><BriefcaseBusiness size={18}/></div><div><h3>{analysis.idea_name}</h3><p>{analysis.target_audience}</p></div></div><div className="card-score-row"><div className="mini-progress"><span style={{width: `${analysis.score}%`}}/></div><strong>{analysis.score}<small>/100</small></strong></div><div className="card-bottom"><span>View analysis</span><ArrowRight size={15}/></div></button>
}
function NewIdea({ idea, setIdea, busy, onSubmit, onCancel }) {
  const update = e => setIdea({ ...idea, [e.target.name]: e.target.value })
  return <div className="fade-in">
    <PageHeading eyebrow="IDEA VALIDATION" title={<>Let's explore your <em>big idea.</em></>} description="A little context helps us generate a more useful, focused analysis." action={<button className="btn btn-quiet" onClick={onCancel}>Cancel</button>}/>
    <div className="form-layout"><form className="idea-form-card" onSubmit={onSubmit}>
      <div className="form-section-head"><div className="form-section-icon"><Lightbulb size={19}/></div><div><h2>Tell us about your idea</h2><p>Share the basics. You can refine your assumptions later.</p></div><span className="required-label">* REQUIRED</span></div>
      <div className="field-grid"><label className="field full">Idea or startup name <span>*</span><input name="idea_name" value={idea.idea_name} onChange={update} placeholder="e.g. CampusCart" minLength="2" maxLength="160" required/><small>A working name is perfectly fine.</small></label>
      <label className="field">Industry <span>*</span><select name="industry" value={idea.industry} onChange={update}>{['Education','Healthcare','FinTech','E-commerce','SaaS','Climate & Sustainability','Food & Agriculture','Logistics','Media & Entertainment','Travel','Real Estate','Other'].map(v=><option key={v}>{v}</option>)}</select></label>
      <label className="field">Target geography <span>*</span><select name="geography" value={idea.geography} onChange={update}>{['India','Bengaluru, India','South Asia','United States','Europe','Global','Other'].map(v=><option key={v}>{v}</option>)}</select></label>
      <label className="field full">Who is your target customer? <span>*</span><input name="target_audience" value={idea.target_audience} onChange={update} placeholder="e.g. College students in tier-2 Indian cities" minLength="2" maxLength="500" required/><small>Be as specific as you can about who has the problem.</small></label>
      <label className="field full">Estimated starting budget <span>*</span><select name="budget" value={idea.budget} onChange={update}>{['Under ₹25,000','₹25,000–₹50,000','₹50,000–₹2,00,000','₹2,00,000–₹10,00,000','Over ₹10,00,000','Not decided yet'].map(v=><option key={v}>{v}</option>)}</select></label>
      <label className="field full">Describe the idea <span>*</span><textarea name="description" value={idea.description} onChange={update} minLength="30" maxLength="5000" rows="6" placeholder="What problem are you solving? How do people handle it today? What would your solution do differently?" required/><div className="textarea-foot"><small>Include the problem, proposed solution and what makes it different.</small><span>{idea.description.length}/5000</span></div></label></div>
      <div className="form-bottom-note"><ShieldCheck size={17}/><span>Your analysis is saved to your account and is only visible to you.</span></div>
      <div className="form-actions"><button type="button" className="btn btn-quiet" onClick={onCancel}>Cancel</button><button className="btn btn-primary" disabled={busy}>{busy ? <><span className="spinner"/> Analyzing idea…</> : <><Sparkles size={17}/> Generate validation report <ArrowRight size={16}/></>}</button></div>
    </form>
    <aside className="form-aside"><div className="aside-card aside-purple"><div className="aside-spark"><Sparkles size={19}/></div><h3>What you'll get</h3><p>A structured first-pass assessment to help you decide what to test next.</p><ul><li><Check size={15}/> Feasibility score with caveats</li><li><Check size={15}/> Customer and market hypotheses</li><li><Check size={15}/> Risks and SWOT analysis</li><li><Check size={15}/> A practical 30-day MVP roadmap</li></ul></div><div className="aside-card"><div className="aside-small-icon"><Compass size={18}/></div><h3>Think like a researcher</h3><p>The strongest ideas start with a specific customer problem, not just a clever feature. Be honest about what you still need to learn.</p></div></aside></div>
  </div>
}
function History({ analyses, search, setSearch, loading, onNew, onOpen, onDelete }) {
  return <div className="fade-in"><PageHeading eyebrow="YOUR RESEARCH LIBRARY" title={<>Ideas in <em>progress.</em></>} description="Every analysis, in one place. Keep learning, comparing and improving." action={<button className="btn btn-primary" onClick={onNew}><Plus size={17}/> New analysis</button>}/>
    <div className="history-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search ideas or industries…"/></div><span>{analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'}</span></div>
    {loading ? <div className="loading-card">Loading analyses…</div> : analyses.length ? <div className="history-list">{analyses.map(a=><div className="history-row" key={a.id}><div className="history-idea-icon"><BriefcaseBusiness size={18}/></div><div className="history-main"><h3>{a.idea_name}</h3><p>{a.industry} <span>·</span> {a.target_audience}</p><small>{new Date(a.created_at).toLocaleString()}</small></div><div className="history-score"><ScoreRing score={a.score} size={64}/><span>INITIAL SCORE</span></div><button className="btn btn-quiet btn-small" onClick={()=>onOpen(a)}>View report <ArrowRight size={15}/></button><button className="icon-btn danger-hover" title="Delete analysis" onClick={()=>onDelete(a.id)}><Trash2 size={16}/></button></div>)}</div> : <div className="empty-card"><div className="empty-illustration"><Search size={26}/></div><h3>{search ? 'No matching ideas' : 'Your research library is empty'}</h3><p>{search ? 'Try another name or industry.' : 'Your saved validation reports will appear here.'}</p>{!search && <button className="btn btn-primary" onClick={onNew}><Plus size={16}/> Create your first analysis</button>}</div>}
  </div>
}
function Report({ analysis, onBack, onNew }) {
  const r = analysis.report || {}
  const swot = r.swot || {}
  return <div className="fade-in report-page">
    <div className="report-toolbar"><button className="back-link" onClick={onBack}>← Back to analyses</button><div><button className="btn btn-quiet" onClick={()=>window.print()}><FileText size={16}/> Export / Save PDF</button><button className="btn btn-primary" onClick={onNew}><Plus size={16}/> New idea</button></div></div>
    <div className="report-cover"><div className="report-cover-content"><span className="hero-tag"><Sparkles size={13}/> STARTUP VALIDATION REPORT</span><h1>{analysis.idea_name}</h1><p>{analysis.description}</p><div className="report-meta"><span><BriefcaseBusiness size={14}/>{analysis.industry}</span><span><Users size={14}/>{analysis.target_audience}</span><span><Compass size={14}/>{analysis.geography}</span></div></div><div className="report-score"><ScoreRing score={analysis.score} size={142}/><span>FEASIBILITY INDICATOR</span><strong>{r.verdict || 'Initial assessment'}</strong></div></div>
    <div className="report-disclaimer"><ShieldCheck size={17}/><span><strong>{r.mode === 'gemini' ? 'AI-generated assessment' : 'Demo-mode assessment'}.</strong> This is a preliminary decision-support report, not verified market research or a guarantee of success. Verify claims independently before spending or investing.</span></div>
    <div className="report-grid">
      <section className="report-card report-summary"><div className="report-card-title"><span className="report-icon violet"><Activity size={18}/></span><div><h2>Executive summary</h2><p>First-pass assessment</p></div></div><p className="summary-copy">{r.summary || 'No summary available.'}</p><div className="report-divider"/><h3>Problem to validate</h3><p>{r.problem_statement || 'Interview customers to validate the problem.'}</p></section>
      <section className="report-card"><div className="report-card-title"><span className="report-icon blue"><Target size={18}/></span><div><h2>Target customers</h2><p>Who this may serve</p></div></div><ul className="clean-list">{(r.target_customers || []).map((x,i)=><li key={i}><span className="list-bullet"/>{x}</li>)}</ul></section>
      <section className="report-card full-report-card"><div className="report-card-title"><span className="report-icon orange"><Search size={18}/></span><div><h2>Market hypotheses</h2><p>Questions to research — not verified market facts</p></div></div><ul className="clean-list">{(r.market_hypotheses || []).map((x,i)=><li key={i}><span className="list-bullet"/>{x}</li>)}</ul><div className="report-divider"/><h3>Competitors and alternatives to research</h3><div className="competitor-grid">{(r.competitors_to_research || []).map((c,i)=><div className="competitor-item" key={i}><strong>{c.name}</strong><p>{c.positioning}</p><small><b>Compare:</b> {c.differentiation}</small></div>)}</div></section>
      <section className="report-card full-report-card"><div className="report-card-title"><span className="report-icon violet"><BarChart3 size={18}/></span><div><h2>SWOT analysis</h2><p>Initial strategic considerations</p></div></div><div className="swot-grid">{[['Strengths',swot.strengths,'swot-strength'],['Weaknesses',swot.weaknesses,'swot-weak'],['Opportunities',swot.opportunities,'swot-opportunity'],['Threats',swot.threats,'swot-threat']].map(([title,items,cls])=><div className={`swot-box ${cls}`} key={title}><h3>{title}</h3><ul>{(items || []).map((x,i)=><li key={i}>{x}</li>)}</ul></div>)}</div></section>
      <section className="report-card full-report-card"><div className="report-card-title"><span className="report-icon red"><ShieldCheck size={18}/></span><div><h2>Risks and mitigations</h2><p>What could go wrong — and how to test it</p></div></div><div className="risk-list">{(r.risks || []).map((x,i)=><div className="risk-row" key={i}><span className={`risk-badge ${(x.severity || 'medium').toLowerCase()}`}>{x.severity || 'Medium'}</span><div><strong>{x.risk}</strong><p>{x.mitigation}</p></div></div>)}</div></section>
      <section className="report-card"><div className="report-card-title"><span className="report-icon green"><BriefcaseBusiness size={18}/></span><div><h2>Monetization</h2><p>Revenue models to test</p></div></div><ul className="clean-list">{(r.monetization || []).map((x,i)=><li key={i}><span className="list-bullet"/>{x}</li>)}</ul></section>
      <section className="report-card full-report-card"><div className="report-card-title"><span className="report-icon blue"><Rocket size={18}/></span><div><h2>30-day MVP roadmap</h2><p>Learn quickly before scaling</p></div></div><div className="roadmap">{(r.mvp_roadmap || []).map((x,i)=><div className="roadmap-item" key={i}><div className="roadmap-marker">{i+1}</div><div className="roadmap-content"><span>{x.week}</span><h3>{x.goal}</h3><ul>{(x.deliverables || []).map((d,j)=><li key={j}>{d}</li>)}</ul></div></div>)}</div></section>
      <section className="report-card full-report-card next-steps-card"><div className="report-card-title"><span className="report-icon green"><Check size={18}/></span><div><h2>Your next steps</h2><p>Turn the analysis into evidence</p></div></div><div className="next-steps">{(r.next_steps || []).map((x,i)=><div key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{x}</p></div>)}</div>{r.assumptions?.length > 0 && <><div className="report-divider"/><h3>Limitations and assumptions</h3><ul className="clean-list">{r.assumptions.map((x,i)=><li key={i}><span className="list-bullet"/>{x}</li>)}</ul></>}</section>
    </div>
    <div className="report-end"><div><Sparkles size={18}/><span><strong>Keep learning.</strong> The next best step is a conversation with a real potential customer.</span></div><button className="btn btn-primary" onClick={onNew}>Validate another idea <ArrowRight size={16}/></button></div>
  </div>
}
export default App
