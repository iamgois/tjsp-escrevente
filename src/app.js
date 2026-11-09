// ===== APP =====
const PROVA = new Date("2027-03-14T13:00:00-03:00");
const BANK = buildBank();
const LS_KEY = "tjsp-escrevente-v1", LS_AI = "tjsp-escrevente-ai-v1", LS_PROV = "tjsp-escrevente-provas-v1";
let PROVAS = [], provRef = null;
let S = defaultState(), AI = [], dbRef = null, aiRef = null, sampleFn = null, syncStatus = "local";

function defaultState(){ return {v:1, upd:0, qs:{}, hist:{}, topics:{}, errs:{}, gen:{}, sims:[], edital:{}, lidos:{}, cfg:{subs:Object.keys(SUBJ).filter(k=>k!=="interna"), qtd:100, imediato:true, meta:100}, sess:null}; }
function today(d=new Date()){ const z=new Date(d.getTime()-d.getTimezoneOffset()*60000); return z.toISOString().slice(0,10); }
const $ = (s,el=document)=>el.querySelector(s), $$=(s,el=document)=>[...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pct = (c,n)=> n? Math.round(c/n*100) : 0;

// ---------- persistência ----------
function loadLocal(){ try{ const r=localStorage.getItem(LS_KEY); if(r) S=Object.assign(defaultState(), JSON.parse(r)); const a=localStorage.getItem(LS_AI); if(a) AI=JSON.parse(a)||[]; const pv=localStorage.getItem(LS_PROV); if(pv) PROVAS=JSON.parse(pv)||[]; }catch(e){} }
let saveT=null, writing=false, pendingWrite=false;
function save(){ S.upd=Date.now(); try{ localStorage.setItem(LS_KEY, JSON.stringify(S)); }catch(e){} clearTimeout(saveT); saveT=setTimeout(pushRemote, 1500); }
function saveAI(){ try{ localStorage.setItem(LS_AI, JSON.stringify(AI)); }catch(e){} if(aiRef) aiRef.set({items:AI.slice(-600), upd:Date.now()}).catch(()=>{}); }
function saveProvas(){ try{ localStorage.setItem(LS_PROV, JSON.stringify(PROVAS)); }catch(e){} if(provRef) provRef.set({items:PROVAS, upd:Date.now()}).catch(()=>{ toast("Não foi possível salvar as provas na nuvem (limite de tamanho). Elas ficam salvas neste navegador."); }); }
async function pushRemote(){
  if(!dbRef) return; if(writing){ pendingWrite=true; return; }
  writing=true; const {sess, ...rest} = S;
  try{ await dbRef.set(JSON.parse(JSON.stringify(rest))); setSync("nuvem"); }catch(e){ setSync("local"); }
  writing=false; if(pendingWrite){ pendingWrite=false; pushRemote(); }
}
function setSync(s){ syncStatus=s; const el=$("#sync"); if(el){ el.textContent = s==="nuvem" ? "☁ Progresso salvo na sua conta" : "● Salvo neste navegador"; el.className="sync "+s; } }
async function initCloud(){
  try{
    if(!window.claude || !window.claude.use) return;
    const [db, user] = await Promise.all([claude.use("db"), claude.use("user")]);
    if(db && user){
      const uid = await user.id();
      if(uid){
        dbRef = db.collection("data/users/"+uid).doc("estado");
        aiRef = db.collection("data/users/"+uid).doc("banco-ia");
        provRef = db.collection("data/users/"+uid).doc("provas");
        const timer = setTimeout(()=>{}, 10000);
        try{
          const snap = await dbRef.get(); clearTimeout(timer);
          const remote = snap && (snap.data ? snap.data() : snap);
          if(remote && remote.upd && remote.upd > (S.upd||0)){ const sess=S.sess; S=Object.assign(defaultState(), remote, {sess}); try{localStorage.setItem(LS_KEY, JSON.stringify(S));}catch(e){} render(); }
          else if(S.upd) pushRemote();
          const as = await aiRef.get(); const ar = as && (as.data ? as.data() : as);
          if(ar && Array.isArray(ar.items) && ar.items.length >= AI.length){ AI = ar.items; try{localStorage.setItem(LS_AI, JSON.stringify(AI));}catch(e){} }
          try{ const ps=await provRef.get(); const pr=ps&&(ps.data?ps.data():ps); if(pr&&Array.isArray(pr.items)&&pr.items.length>=PROVAS.length){ PROVAS=pr.items; try{localStorage.setItem(LS_PROV, JSON.stringify(PROVAS));}catch(e){} } }catch(e){}
          setSync("nuvem"); render();
        }catch(e){ clearTimeout(timer); }
      }
    }
    const sm = await claude.use("sample"); if(sm){ sampleFn = sm; $$(".ai-only").forEach(el=>el.classList.remove("hidden")); }
  }catch(e){}
}

// ---------- estatísticas ----------
function record(q, sel){
  const ok = sel===q.a; const d=today();
  const st = S.qs[q.id] || (S.qs[q.id]={n:0,c:0}); st.n++; if(ok) st.c++; st.last = ok?1:0; st.t=Date.now();
  const h = S.hist[d] || (S.hist[d]={n:0,c:0,s:{}}); h.n++; if(ok) h.c++; const hs = h.s[q.s] || (h.s[q.s]=[0,0]); hs[0]++; if(ok) hs[1]++;
  const tk = q.s+"|"+tkey(q); const tp = S.topics[tk] || (S.topics[tk]=[0,0]); tp[0]++; if(ok) tp[1]++;
  if(!ok){ S.errs[q.id] = {t:Date.now(), sel}; if(q.src!=="banco"){ S.gen[q.id]=q; } }
  else if(S.errs[q.id]){ delete S.errs[q.id]; S.rec=(S.rec||0)+1; if(S.gen[q.id]) delete S.gen[q.id]; }
  const ek = Object.keys(S.errs); if(ek.length>500){ ek.sort((a,b)=>S.errs[a].t-S.errs[b].t).slice(0,ek.length-500).forEach(k=>{delete S.errs[k]; delete S.gen[k];}); }
  return ok;
}
function subjStats(){
  const m={}; Object.keys(SUBJ).forEach(k=>m[k]=[0,0]);
  Object.values(S.hist).forEach(h=>Object.entries(h.s||{}).forEach(([k,v])=>{ if(m[k]){ m[k][0]+=v[0]; m[k][1]+=v[1]; } }));
  return m;
}
function totals(){ let n=0,c=0; Object.values(S.hist).forEach(h=>{n+=h.n;c+=h.c;}); return {n,c}; }
function streak(){ let s=0; const d=new Date(); if(!(S.hist[today(d)]||{}).n) d.setDate(d.getDate()-1); while((S.hist[today(d)]||{}).n){ s++; d.setDate(d.getDate()-1);} return s; }
function provaQs(){ return PROVAS.flatMap(p=>p.qs); }
function findQ(id){ return BANK.find(q=>q.id===id) || S.gen[id] || AI.find(q=>q.id===id) || provaQs().find(q=>q.id===id) || null; }
const ORIGENS = {
  todas:{l:"Todas", d:"Banco do app, padrão prova, provas importadas e geradas"},
  vunesp:{l:"Padrão prova Vunesp", d:"Questões novas no formato das provas do TJSP (caso concreto, literalidade, “correta/incorreta”)"},
  provas:{l:"Provas anteriores", d:"Questões reais das provas que você importou"},
  app:{l:"Banco do app + geradas", d:"Questões diretas e geradas sem limite (lei seca, cálculos, Excel, lógica)"}
};
function origem(){ return (S.cfg && S.cfg.origem) || "todas"; }
function srcOk(q, o=origem()){ if(o==="todas") return true; if(o==="vunesp") return q.src==="vunesp" || (q.src==="ia" && q.estilo==="vunesp"); if(o==="provas") return q.src==="prova"; return q.src==="banco" || q.src==="gerada" || (q.src==="ia" && q.estilo!=="vunesp"); }
function genAllowed(o=origem()){ return o==="todas" || o==="app"; }

// ---------- montagem de sessões ----------
function poolFor(s, o){ return BANK.concat(AI, provaQs()).filter(q=>q.s===s && srcOk(q,o)); }
function statusOk(q, st){ st=st||"todas"; if(st==="novas") return !S.qs[q.id]; if(st==="erradas") return !!S.errs[q.id]; return true; }
function filteredPool(s, f){ f=f||{}; return poolFor(s).filter(q=>statusOk(q,f.status) && (!f.tops || f.tops.includes(tkey(q)))); }
function genForFiltered(s, f){
  if(!genAllowed() || (f && f.status==="erradas") || !genFor(s)) return null;
  if(!f || !f.tops) return ()=>genFor(s);
  const tps=topicsOf(s).filter(t=>t.gen && f.tops.includes(t.t)); if(!tps.length) return null;
  return ()=>{ for(let i=0;i<40;i++){ const tp=pick(tps); const q=tp.law? genLei(null,tp.law) : genFor(s); if(q && f.tops.includes(tkey(q))) return q; } return null; };
}
function pickFrom(s, n, used, f){
  const pool = filteredPool(s, f).filter(q=>!used.has(q.id));
  const score = q => { const st=S.qs[q.id]; if(!st) return 0 + Math.random(); if(S.errs[q.id]) return 1 + Math.random(); return 2 + (st.c/st.n) + Math.random()*0.5 + (Date.now()-(st.t||0) < 864e5 ? 2 : 0); };
  const sorted = pool.sort((a,b)=>score(a)-score(b));
  const out=[];
  // mistura: até 60% do banco "fresco"; resto com geradores (variedade infinita), quando houver gerador
  const gen = genForFiltered(s, f); const hasGen = !!gen;
  const fromBank = hasGen ? Math.min(sorted.length, Math.ceil(n*(origem()==="todas"?0.7:0.6))) : Math.min(sorted.length, n);
  for(let i=0;i<fromBank;i++){ out.push(sorted[i]); used.add(sorted[i].id); }
  let guard=0;
  while(out.length<n && hasGen && guard++<n*5){ const g=gen(); if(g && !used.has(g.id)){ out.push(g); used.add(g.id);} }
  // sem gerador: repete o banco embaralhado
  let k=0; while(genAllowed() && !(f&&(f.status||f.tops)) && out.length<n && sorted.length && k<n*3){ const q=sorted[k%sorted.length]; out.push(Object.assign({},q)); k++; }
  return out;
}
function treinoFilter(s){ const t=(S.cfg.tops||{})[s]; return {status:S.cfg.status||"todas", tops: t&&t.length? t : null}; }
function buildTreino(subs, qtd, useFilters){
  const F = s => useFilters ? treinoFilter(s) : null;
  const avail = subs.filter(s=> filteredPool(s, F(s)).length || genForFiltered(s, F(s)));
  if(!avail.length) return [];
  const per = {}; let rest=qtd; avail.forEach((s,i)=>{ per[s]=Math.floor(qtd/avail.length); rest-=per[s]; });
  shuffle(avail).slice(0,rest).forEach(s=>per[s]++);
  const used=new Set(); let qs=[]; avail.forEach(s=>{ qs=qs.concat(pickFrom(s, per[s], used, F(s))); });
  return shuffle(qs);
}
function buildSimulado(){
  const used=new Set(); let qs=[];
  const dist = Object.assign({}, SIM_DIST);
  if(!poolFor("interna").length && !(genAllowed()&&genFor("interna"))){ dist.adm+=1; dist.const+=1; dist.pcivil+=1; dist.penal+=1; dist.interna=0; }
  for(const [s,n] of Object.entries(dist)){ if(n) qs = qs.concat(shuffle(pickFrom(s,n,used))); }
  // ordem da prova: bloco I, II, III
  return qs.sort((a,b)=>SUBJ[a.s].bloco-SUBJ[b.s].bloco);
}
function startSession(mode, qs, extra={}){
  if(!qs.length){ toast(origem()==="provas"&&!PROVAS.length ? "Você ainda não importou nenhuma prova. Vá em Provas anteriores." : "Não há questões disponíveis para essa seleção."); return; }
  S.sess = Object.assign({mode, qs, i:0, ans:Array(qs.length).fill(null), start:Date.now(), imediato: mode!=="sim" && S.cfg.imediato, strike:{}}, extra);
  save(); go("questao");
}

// ---------- roteamento ----------
const VIEWS = ["inicio","materias","provas","treino","simulado","erros","leiseca","edital","questao","resultado"];
function go(v){ if(location.hash!=="#"+v) location.hash=v; else render(); }
window.addEventListener("hashchange", render);
function curView(){ const h=location.hash.slice(1); if(/^materia-[a-z]+$/.test(h) && SUBJ[h.slice(8)]) return h; return VIEWS.includes(h)?h:"inicio"; }

let lastSig="";
function render(){
  const v = curView();
  $$(".nav a").forEach(a=>a.classList.toggle("on", a.dataset.v===v || (v.startsWith("materia-")&&a.dataset.v==="materias") || (v==="questao"||v==="resultado") && a.dataset.v===(((S.sess||S.last||{}).mode)==="sim"?"simulado":"treino")));
  const main = $("#main"); main.scrollTop=0; window.scrollTo(0,0);
  if(v.startsWith("materia-")){ vMateria(main, v.slice(8)); }
  else ({inicio:vInicio, provas:vProvas, materias:vMaterias, treino:vTreino, simulado:vSimulado, erros:vErros, leiseca:vLei, edital:vEdital, questao:vQuestao, resultado:vResultado})[v](main);
  const sig = v + (v==="questao"&&S.sess? ":"+S.sess.i : "");
  if(sig!==lastSig){ main.classList.remove("enter"); void main.offsetWidth; main.classList.add("enter"); lastSig=sig; }
  else main.classList.remove("enter");
}

// ---------- componentes ----------
function ring(val, max, size=150, stroke=12, label="", sub=""){
  const r=(size-stroke)/2, c=2*Math.PI*r, p=Math.min(1, max? val/max : 0);
  return `<svg class="ring" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${label}">
    <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d186e6"/><stop offset="1" stop-color="#87379e"/></linearGradient></defs>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#f6e7fa" stroke-width="${stroke}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="url(#rg)" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p)}" transform="rotate(-90 ${size/2} ${size/2})" class="ring-arc"/>
    <text x="50%" y="47%" text-anchor="middle" class="ring-v">${label}</text><text x="50%" y="63%" text-anchor="middle" class="ring-s">${sub}</text></svg>`;
}
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove("show"),2600); }
function modal(html){ const m=$("#modal"); $(".modal-body",m).innerHTML=html; m.classList.add("show"); }
function closeModal(){ $("#modal").classList.remove("show"); }

// ---------- INÍCIO / DASHBOARD ----------
function vInicio(el){
  const d = today(), h = S.hist[d]||{n:0,c:0}, meta=S.cfg.meta||100;
  const ms = PROVA - Date.now(), dias = Math.max(0, Math.ceil(ms/864e5));
  const T = totals(), ss = subjStats(), st = streak();
  const ranked = Object.entries(ss).filter(([k,v])=>v[0]>=5).map(([k,v])=>({k, n:v[0], c:v[1], p:pct(v[1],v[0])})).sort((a,b)=>b.p-a.p);
  const best = ranked[0], worst = ranked.length>1 ? ranked[ranked.length-1] : null;
  const errs = Object.keys(S.errs).length;
  // últimos 21 dias
  const days=[]; for(let i=20;i>=0;i--){ const dd=new Date(); dd.setDate(dd.getDate()-i); const k=today(dd); days.push({k, d:dd, n:(S.hist[k]||{}).n||0, c:(S.hist[k]||{}).c||0}); }
  const maxN = Math.max(meta, ...days.map(x=>x.n));
  const W=640,H=170,bw=W/days.length;
  const bars = days.map((x,i)=>{ const bh = x.n/maxN*(H-30); const okh = x.c/maxN*(H-30);
    return `<g><title>${x.d.toLocaleDateString("pt-BR")}: ${x.n} questões, ${pct(x.c,x.n)}% de acerto</title>
      <rect x="${i*bw+bw*0.18}" y="${H-20-bh}" width="${bw*0.64}" height="${bh}" rx="4" fill="#eed0f5"/>
      <rect x="${i*bw+bw*0.18}" y="${H-20-okh}" width="${bw*0.64}" height="${okh}" rx="4" fill="#a548c0"/>
      ${i%3===0||i===days.length-1?`<text x="${i*bw+bw/2}" y="${H-4}" text-anchor="middle" class="ax">${x.d.getDate()}/${x.d.getMonth()+1}</text>`:""}</g>`; }).join("");
  const metaY = H-20-meta/maxN*(H-30);
  // tópicos fracos
  const weak = Object.entries(S.topics).filter(([k,v])=>v[0]>=3).map(([k,v])=>({k, s:k.split("|")[0], t:k.split("|")[1], n:v[0], p:pct(v[1],v[0])})).sort((a,b)=>a.p-b.p).slice(0,6);
  el.innerHTML = `
  <section class="hero">
    <div class="hero-txt">
      <span class="eyebrow">Escrevente Técnico Judiciário · TJ-SP · Vunesp</span>
      <h1>${greeting()}, faltam <span class="big">${dias}</span> dias para a prova.</h1>
      <p>Domingo, 14 de março de 2027, à tarde · 70 questões objetivas + redação · 5 horas.</p>
      <div class="hero-cta"><button class="btn primary" onclick="quickStart()">${h.n>=meta?"Meta batida! Continuar treinando":h.n?"Faltam "+(meta-h.n)+" para a meta de hoje":"Começar as "+meta+" de hoje"} →</button>
      ${S.sess && S.sess.ans.some(a=>a===null) ? `<button class="btn ghost" onclick="go('questao')">Retomar sessão (${S.sess.ans.filter(a=>a!==null).length}/${S.sess.qs.length})</button>`:""}</div>
      <div class="countdown" id="cd"></div>
    </div>
    <div class="hero-ring">${ring(h.n, meta, 170, 14, `${h.n}`, `de ${meta} hoje`)}</div>
  </section>
  <section class="kpis">
    <div class="kpi"><span>Questões resolvidas</span><b>${T.n.toLocaleString("pt-BR")}</b><small>${pct(T.c,T.n)}% de acerto geral</small></div>
    <div class="kpi"><span>Sequência</span><b>${st} ${st===1?"dia":"dias"}</b><small>estudando sem parar</small></div>
    <div class="kpi"><span>Acerto hoje</span><b>${h.n?pct(h.c,h.n)+"%":"—"}</b><small>${h.c} certas · ${h.n-h.c} erradas</small></div>
    <div class="kpi click" onclick="go('erros')"><span>Caderno de erros</span><b>${errs}</b><small>${errs?"questões para revisar →":"nenhum erro pendente"}</small></div>
  </section>
  <section class="grid2">
    <div class="card hl best"><div class="tag">Seu ponto forte</div>${best?`<h3>${SUBJ[best.k].nome}</h3><p class="mega">${best.p}%</p><small>${best.c} de ${best.n} questões certas</small>`:`<p class="muted">Resolva pelo menos 5 questões de uma matéria para descobrir.</p>`}</div>
    <div class="card hl worst"><div class="tag">Precisa de atenção</div>${worst?`<h3>${SUBJ[worst.k].nome}</h3><p class="mega">${worst.p}%</p><small>${worst.c} de ${worst.n} certas</small><button class="btn sm" onclick="treinarMateria('${worst.k}')">Treinar 20 agora</button>`:`<p class="muted">Ainda sem dados suficientes.</p>`}</div>
  </section>
  <section class="card">
    <div class="card-h"><h2>Últimos 21 dias</h2><div class="legend"><i style="background:#a548c0"></i>certas <i style="background:#eed0f5"></i>erradas <i class="dash"></i>meta ${meta}</div></div>
    <svg viewBox="0 0 ${W} ${H}" class="chart" preserveAspectRatio="none">${bars}<line x1="0" x2="${W}" y1="${metaY}" y2="${metaY}" stroke="#87379e" stroke-dasharray="5 5" stroke-width="1.5" opacity=".55"/></svg>
  </section>
  <section class="grid2">
    <div class="card"><div class="card-h"><h2>Desempenho por matéria</h2></div>
      <div class="subj-list">${Object.entries(ss).map(([k,v])=>{ const p=pct(v[1],v[0]);
        return `<div class="srow" onclick="go('materia-${k}')" title="Abrir ${SUBJ[k].nome}"><span class="sn"><i style="background:${SUBJ[k].cor}"></i>${SUBJ[k].curto}</span>
        <div class="bar"><div style="width:${v[0]?p:0}%;background:${p>=70?"#a548c0":p>=50?"#d186e6":"#f59e0b"}"></div></div><b>${v[0]?p+"%":"—"}</b><small>${v[0]}</small></div>`; }).join("")}</div></div>
    <div class="card"><div class="card-h"><h2>Assuntos mais fracos</h2></div>
      ${weak.length? `<ul class="weak">${weak.map(w=>`<li><span class="dot" style="background:${SUBJ[w.s].cor}"></span><div><b>${esc(w.t)}</b><small>${SUBJ[w.s].curto} · ${w.n} questões</small></div><em class="${w.p<50?"bad":"mid"}">${w.p}%</em></li>`).join("")}</ul>` : `<p class="muted">Os assuntos com menor taxa de acerto aparecerão aqui depois de algumas questões.</p>`}
      ${S.sims.length? `<div class="card-h mt"><h2>Simulados</h2></div><ul class="sims">${S.sims.slice(-4).reverse().map(s=>`<li><span>${new Date(s.d).toLocaleDateString("pt-BR")}</span><b>${s.c}/${s.n}</b><em class="${s.ok?"ok":"bad"}">nota ${fmtBR(s.nota,1)} ${s.ok?"· habilitado":"· eliminado"}</em></li>`).join("")}</ul>`:""}
    </div>
  </section>`;
  tickCountdown();
}
function greeting(){ const h=new Date().getHours(); return h<12?"Bom dia":h<18?"Boa tarde":"Boa noite"; }
function tickCountdown(){ const el=$("#cd"); if(!el) return; const ms=Math.max(0,PROVA-Date.now()); const d=Math.floor(ms/864e5), h=Math.floor(ms%864e5/36e5), m=Math.floor(ms%36e5/6e4), s=Math.floor(ms%6e4/1e3);
  el.innerHTML = [[d,"dias"],[h,"horas"],[m,"min"],[s,"seg"]].map(([v,l])=>`<div><b>${String(v).padStart(2,"0")}</b><span>${l}</span></div>`).join(""); }
setInterval(tickCountdown, 1000);
function quickStart(){ const h=S.hist[today()]||{n:0}; const meta=S.cfg.meta||100; const n = Math.max(10, meta-h.n>0? meta-h.n : 20); startSession("treino", buildTreino(S.cfg.subs, Math.min(n, 150))); }
function treinarMateria(k){ startSession("treino", buildTreino([k], 20)); }

function origemSel(){
  const np=provaQs().length;
  return `<div class="orig"><span class="lbl">Tipo de questão</span><div class="orig-opts">${Object.entries(ORIGENS).map(([k,v])=>`<button class="${origem()===k?"on":""}" onclick="S.cfg.origem='${k}';save();render()"><b>${v.l}</b><small>${k==="provas"?(np?np+" questões importadas":"importe uma prova primeiro"):v.d}</small></button>`).join("")}</div></div>`;
}
// ---------- MATÉRIAS ----------
const TOPIC_GROUPS = {
  pcivil:[["Impedimento e suspeição",144,148],["Auxiliares da justiça",149,155],["Atos processuais",188,211],["Tempo, lugar e prazos",212,235],["Citação",236,259],["Cartas",260,268],["Intimações",269,275],["Tutela provisória",294,311],["Petição inicial e conciliação",318,334],["Resposta do réu e revelia",335,346],["Saneamento e audiência",347,368],["Provas",369,484],["Sentença e coisa julgada",485,508],["Cumprimento de sentença",509,538],["Recursos — disposições gerais",994,1008],["Apelação",1009,1014],["Agravos",1015,1021],["Embargos de declaração",1022,1026]],
  ppenal:[["Sujeitos processuais",251,274],["Citação e intimação",351,372],["Procedimento ordinário",394,405],["Tribunal do Júri",406,497],["Procedimento sumário",531,538],["Recursos e RESE",574,592],["Apelação",593,603],["Julgamento de recursos e embargos",609,620],["Revisão criminal",621,631],["Carta testemunhável",639,646],["Habeas corpus",647,667]],
  penal:[["Falsidades (arts. 293 a 311-A)",293,311],["Crimes de funcionário público (312 a 327)",312,327],["Crimes de particular (328 a 337)",328,337],["Contra a administração da justiça (339 a 359)",339,359]],
  const:[["Direitos individuais e coletivos (art. 5º)",5,5],["Direitos sociais (arts. 6º a 11)",6,11],["Nacionalidade (arts. 12 e 13)",12,13],["Administração Pública (arts. 37 e 38)",37,38],["Servidores públicos (arts. 39 a 41)",39,41],["Poder Judiciário (art. 92)",92,92]]
};
function tkey(q){
  if(q.t.startsWith("Lei seca")) return q.t.replace(/,\s*art\..*$/,"");
  if(q.s==="ppenal" && /JECrim|Transação penal|Suspensão condicional|9\.099/.test(q.t)) return "JECrim (Lei 9.099/95)";
  if(q.s==="pcivil" && /Fazenda Pública|12\.153/.test(q.t)) return "Juizado da Fazenda Pública (Lei 12.153/09)";
  if(q.s==="pcivil" && /Juizado Especial Cível|9\.099/.test(q.t)) return "Juizado Especial Cível (Lei 9.099/95)";
  const G=TOPIC_GROUPS[q.s];
  if(G && G.some(x=>x[0]===q.t)) return q.t;
  if(G){ const m=q.t.match(/arts?\.\s*([\d.]+)/); if(m){ const n=parseInt(m[1].replace(/\./g,"")); const g=G.find(x=>n>=x[1]&&n<=x[2]); if(g) return g[0]; } }
  return q.t.replace(/\s*—.*$/,"").replace(/\s*\([^)]*\)\s*$/,"").trim();
}
const GEN_TOPICS = {
  mat:["Porcentagem","Regra de três (inversa)","Regra de três (direta)","Juros simples","MMC","Divisão proporcional","Média ponderada","Equação do 1º grau","Razão e proporção","Geometria"],
  rl:["Sequências numéricas","Negação (De Morgan)","Negação da condicional","Equivalência lógica","Negação de quantificadores","Argumentação (modus tollens)","Diagramas lógicos (conjuntos)"],
  info:["Excel"]
};
function topicsOf(s){
  const m={};
  poolFor(s).forEach(q=>{ const k=tkey(q); (m[k]||(m[k]={t:k,bank:0,gen:false})).bank++; });
  if(genAllowed()) (GEN_TOPICS[s]||[]).forEach(t=>{ (m[t]||(m[t]={t,bank:0})).gen=true; });
  if(genAllowed()) lawsFor(s).forEach(l=>{ if(findTokensAny(l)){ const t="Lei seca — "+l.sigla; (m[t]||(m[t]={t,bank:0})).gen=true; m[t].law=l.id; } });
  return Object.values(m).map(x=>{ const st=S.topics[s+"|"+x.t]||[0,0]; return Object.assign(x,{n:st[0],c:st[1]}); }).sort((a,b)=>(b.bank+(b.gen?50:0))-(a.bank+(a.gen?50:0)));
}
function treinarTopico(s, t, n=20){
  const used=new Set(); const out=shuffle(poolFor(s).filter(q=>tkey(q)===t)).slice(0, n); out.forEach(q=>used.add(q.id));
  const tp = topicsOf(s).find(x=>x.t===t);
  let g=0; while(out.length<n && tp && tp.gen && g++<n*40){ const q = tp.law ? genLei(null, tp.law) : genFor(s); if(q && tkey(q)===t && !used.has(q.id)){ out.push(q); used.add(q.id);} }
  startSession("treino", shuffle(out));
}
function vMaterias(el){
  const ss=subjStats();
  const blocos={1:"Bloco I · Língua Portuguesa",2:"Bloco II · Conhecimentos em Direito",3:"Bloco III · Conhecimentos Gerais"};
  el.innerHTML = `<header class="ph"><div><span class="eyebrow">Matérias</span><h1>Escolha o que estudar</h1><p>Cada matéria tem a sua página: treino por assunto, seus erros, conteúdo do edital e lei seca.</p></div></header>
  ${[1,2,3].map(b=>`<h3 class="bloco-t">${blocos[b]}</h3><div class="mgrid">${Object.entries(SUBJ).filter(([k,v])=>v.bloco===b).map(([k,v])=>{ const st=ss[k], p=pct(st[1],st[0]); const errs=Object.keys(S.errs).filter(id=>{const q=findQ(id);return q&&q.s===k;}).length;
    const ed=EDITAL.filter(g=>g.s===k); const tot=ed.reduce((n,g)=>n+g.itens.length,0); const done=ed.reduce((n,g)=>n+g.itens.filter((_,i)=>S.edital[EDITAL.indexOf(g)+"-"+i]).length,0);
    return `<a class="mcard" href="#materia-${k}" style="--c:${v.cor}"><div class="mico">${v.ico}</div><b>${v.nome}</b>
      <div class="mstats"><span>${st[0]} resolvidas</span><span>${st[0]?p+"% acerto":"—"}</span>${errs?`<span class="e">${errs} erros</span>`:""}</div>
      <div class="bar thin"><div style="width:${pct(done,tot)}%;background:var(--c)"></div></div><small>${done}/${tot} tópicos do edital</small></a>`; }).join("")}</div>`).join("")}`;
}
let matTab="aprender";
function treinarDaTeoria(k, key){ const t=topicsOf(k).find(x=>x.t===key || x.t.startsWith(key)); if(t) treinarTopico(k, t.t); else startSession("treino", buildTreino([k], 20)); }
async function aulaIA(k, tema){
  modal(`<div class="aula-h"><span class="eyebrow">✦ Aula com IA · ${esc(SUBJ[k].curto)}</span><h3>${esc(tema)}</h3></div><div id="aulaTxt" class="aula">Preparando a explicação…</div><div class="mrow"><button class="btn ghost" onclick="closeModal()">Fechar</button><button class="btn primary" id="aulaQ">Fazer 10 questões disto</button></div>`);
  $("#aulaQ").onclick=function(){ closeModal(); iaTopico(k, tema, this); };
  const p=`Você é professor de cursinho especializado no concurso de Escrevente Técnico Judiciário do TJ-SP (banca Vunesp, prova em 14/03/2027).
Explique para um aluno o tópico abaixo, de forma didática e objetiva (máx. 450 palavras), em português.
Matéria: ${SUBJ[k].nome}. Tópico do edital: ${tema}.
Base do edital: ${BASE_LEGAL[k]}
Estrutura: 1) o que é / o que a lei diz (com os números de artigo); 2) os pontos que a Vunesp mais cobra (prazos, números, exceções); 3) uma pegadinha comum; 4) uma dica de memorização.
Em Direito, siga a literalidade da lei e não invente dispositivos; se não tiver certeza de algum detalhe, diga para conferir no texto oficial.
Use texto simples, com títulos curtos e listas com "- ". Sem tabelas.`;
  try{ await sampleFn(p,{modelTier:"default", onText:({text})=>{ const el=$("#aulaTxt"); if(el) el.innerHTML=mdRender(text.replace(/^#+\s*/gm,"**").replace(/\*\*([^*\n]+)$/gm,"**$1**")); }}); }
  catch(e){ const el=$("#aulaTxt"); if(el) el.textContent=iaErr(e); }
}
function vMateria(el, k){
  const v=SUBJ[k], st=subjStats()[k], p=pct(st[1],st[0]);
  const errIds=Object.keys(S.errs).filter(id=>{const q=findQ(id);return q&&q.s===k;});
  const tops=topicsOf(k); const laws=lawsFor(k);
  const ed=EDITAL.map((g,gi)=>({g,gi})).filter(x=>x.g.s===k);
  const nProva = {port:"16 questões",atual:"4 questões",mat:"4 questões",rl:"7 questões",info:"9 questões"}[k] || "parte das 30 de Direito";
  const hoje=((S.hist[today()]||{}).s||{})[k]||[0,0];
  const teo=TEORIA[k]||[]; S.lidosT=S.lidosT||{}; const lidosT=teo.filter((_,i)=>S.lidosT[k+"-"+i]).length;
  const tabs=[["aprender","📖 Aprender"],["praticar","✎ Praticar"],["edital","☑ Edital"]];
  let body="";
  if(matTab==="aprender"){
    body = `<div class="card"><div class="card-h"><h2>Resumo da matéria</h2><span class="pill">${lidosT}/${teo.length} lidos</span></div>
      <p class="muted">Leia o resumo de cada assunto e, em seguida, faça as questões dele. Marque como lido para acompanhar seu progresso.</p>
      ${teo.map((t,i)=>{ const key=k+"-"+i; return `<details class="teo ${S.lidosT[key]?"lido":""}" ${i===0&&!S.lidosT[key]?"open":""}><summary><span class="tn">${i+1}</span><b>${esc(t[0])}</b>${S.lidosT[key]?'<span class="ok">✓ lido</span>':""}</summary>
        <div class="teo-b">${mdRender(t[2])}
        <div class="teo-f"><label class="ck"><input type="checkbox" ${S.lidosT[key]?"checked":""} onchange="S.lidosT['${key}']=this.checked;save();render()"> Marcar como lido</label>
        <button class="btn primary sm" onclick="treinarDaTeoria('${k}', ${JSON.stringify(t[1]).replace(/"/g,"&quot;")})">Fazer questões deste assunto →</button></div></div></details>`; }).join("")}
      ${sampleFn?`<p class="muted small">Quer aprofundar um tópico específico? Na aba <button class="link" onclick="matTab='edital';render()">Edital</button>, use “✦ Aula com IA” em qualquer item.</p>`:""}
    </div>`;
  } else if(matTab==="praticar"){
    body = `<div class="card">${origemSel()}</div>${k==="port"?`<div class="card"><div class="card-h"><h2>O que mais cai</h2></div><div class="inc">${INCID_PORT.map(r=>`<div><b>${r[0]}</b><em>${r[1]}</em><small>${r[2]}</small></div>`).join("")}</div></div>`:""}
    <div class="card"><div class="card-h"><h2>Treinar por assunto</h2><small class="muted">Clique para resolver 20 questões só daquele assunto</small></div>
    ${tops.length?`<div class="tgrid">${tops.map(t=>`<button class="tcard" onclick="treinarTopico('${k}', ${JSON.stringify(t.t).replace(/"/g,"&quot;")})"><b>${esc(t.t)}</b><small>${t.bank?t.bank+" questões":""}${t.bank&&t.gen?" + ":""}${t.gen?"geradas ∞":""}</small><div class="bar thin"><div style="width:${t.n?pct(t.c,t.n):0}%;background:${pct(t.c,t.n)>=70?"#a548c0":pct(t.c,t.n)>=50?"#d186e6":"#f59e0b"}"></div></div><span class="tp">${t.n?pct(t.c,t.n)+"% em "+t.n:"não estudado"}</span></button>`).join("")}</div>`
    :`<p class="muted">Ainda não há questões prontas desta matéria. ${sampleFn?"Use os botões “✦ Questões” na aba Edital para gerar com IA.":"Abra o app pelo Claude para gerar questões com IA."}</p>`}</div>`;
  } else {
    body = `<div class="card"><div class="card-h"><h2>Conteúdo do edital</h2>${sampleFn?`<small class="muted">✦ Aula: explicação do tópico · ✦ Questões: 10 questões novas</small>`:""}</div>
    ${ed.map(({g,gi})=>`<h3 class="sub">${esc(g.b.replace(/^Bloco [IV]+ — /,""))}</h3><ul class="clist">${g.itens.map((it,i)=>{ const key=gi+"-"+i; const arg=JSON.stringify(it).replace(/"/g,"&quot;"); return `<li><label><input type="checkbox" ${S.edital[key]?"checked":""} onchange="S.edital['${key}']=this.checked;save()"><span>${esc(it)}</span></label>${sampleFn?`<button class="btn sm ghost" onclick="aulaIA('${k}', ${arg})">✦ Aula</button><button class="btn sm ghost" onclick="iaTopico('${k}', ${arg}, this)">✦ Questões</button>`:""}</li>`; }).join("")}</ul>`).join("")}</div>`;
  }
  el.innerHTML = `
  <a class="back" href="#materias">← Todas as matérias</a>
  <section class="mhero" style="--c:${v.cor}"><div><span class="eyebrow">Bloco ${["","I","II","III"][v.bloco]} · ${nProva} na prova</span><h1>${v.nome}</h1>
    <div class="row-btns">${[10,20,50].map(n=>`<button class="btn ${n===20?"primary":""}" onclick="startSession('treino', buildTreino(['${k}'], ${n}))">Treinar ${n}</button>`).join("")}
    ${errIds.length?`<button class="btn" onclick="errFilter='${k}';refazerErros()">Refazer ${errIds.length} erros</button>`:""}
    ${laws.length?`<button class="btn ghost" onclick="abrirLei('${laws[0].id}')">Lei seca →</button>`:""}</div></div>
    <div class="mini-ring">${ring(st[1], st[0]||1, 120, 11, st[0]?p+"%":"—", "acerto")}</div></section>
  <section class="kpis">
    <div class="kpi"><span>Resolvidas</span><b>${st[0]}</b><small>${st[1]} certas</small></div>
    <div class="kpi"><span>Hoje</span><b>${hoje[0]}</b><small>${hoje[0]?pct(hoje[1],hoje[0])+"% de acerto":"nenhuma ainda"}</small></div>
    <div class="kpi"><span>Erros pendentes</span><b>${errIds.length}</b><small>no caderno de erros</small></div>
    <div class="kpi"><span>Padrão prova</span><b>${poolFor(k,"vunesp").length}</b><small>${poolFor(k,"provas").length} de provas importadas</small></div>
    <div class="kpi"><span>Resumos lidos</span><b>${lidosT}/${teo.length}</b><small>na aba Aprender</small></div>
  </section>
  <div class="mtabs">${tabs.map(([id,l])=>`<button class="${matTab===id?"on":""}" onclick="matTab='${id}';render()">${l}</button>`).join("")}</div>
  ${body}`;
}

// ---------- PROVAS ANTERIORES ----------
const RAIOX = [
 {p:"Escrevente · Capital · dez/2025 (TJSP2503)", n:"70 questões", t:[["Português","inferência em texto longo, crase/regência por lacuna, vocabulário em contexto, concordância (haver/fazer), pontuação, sentido figurado, numerais"],["Penal","papéis públicos (293), falsa identidade (307, subsidiária), inserção de dados falsos (313-A, crime formal), condescendência (320, 'por indulgência')"],["Proc. Penal","impedimento x suspeição (252/254), acusado e defensor (261-265), citação inclusive de militar (358-363), procedimento comum e prazos (394/396), recursos no JECrim"],["Constitucional","domicílio (5º, XI) em caso concreto, remédios, nacionalidade e cargos privativos, teto (37, XI), direitos sociais e prescrição trabalhista"],["Adm. e Interna","Estatuto SP (posse, servidor em caso concreto), teletrabalho, Regimento Interno"],["Gerais","Israel x Irã (jun/2025), isenção do IR, BRICS; EPD (arts. 2º, 6º, 9º, 12, 13); OneDrive sob demanda, Word, Excel (PROCV, SE, MAIOR/MENOR), Cc/Cco, busca no Google, Teams; conjuntos, negação de condicional composta, sequências, disposição circular"]]},
 {p:"Escrevente · Capital · mai/2023", n:"100 questões", t:[["Português","poema, editorial, ensaio; coesão, conectivos, classes de palavras, crase, 'onde/aonde', figuras de linguagem, colocação pronominal"],["Penal","falsidade documental, crimes contra a Administração e contra a administração da justiça, 311-A, arts. 336/337, caso prático do art. 359"],["Proc. Penal","impedimento/suspeição, defesa técnica, citações (362, 367, 368), ritos e JECrim, pronúncia/impronúncia, restauração de autos (541-548), revisão criminal"],["Proc. Civil","impedimento do escrivão (144/148), início do prazo (231), tutela provisória, produção antecipada de prova (381), recursos (997-1.000), JEC (3º, 8º), JEFP (RPV)"],["Constitucional","remédios, requisição administrativa (5º, XXV), penas (5º, XLVI-XLVII), estabilidade (41), previdência (40), art. 92, cargos privativos"],["Adm. e Interna","improbidade (dolo, prescrição, ANPC), Estatuto SP (penas, ofensa física, TAC, testemunhas, revisão), NSCGJ (petições intermediárias, carga, correições, escrituração)"]]},
 {p:"Escrevente · Interior · 2018", n:"100 questões", t:[["Proc. Civil","atribuições do escrivão (152), legitimados no JEC (OSCIP), tutela antecipada antecedente, atos durante as férias (215), direito de recorrer, JEFP"],["Interna","NSCGJ: sistema informatizado oficial, correição ordinária"]]},
 {p:"Oficial de Justiça · 2023 e 2024", n:"Vunesp", t:[["Estilo","mesmo padrão do Escrevente: literalidade da lei, caso concreto e alternativas com um detalhe alterado; bom para treinar CPC, CPP, CF e Penal"]]}
];
const LINKS_PROVAS = [
 ["Fundação Vunesp — TJSP Escrevente 2025 (TJSP2503)","https://www.vunesp.com.br/TJSP2503"],
 ["Fundação Vunesp — TJSP Oficial de Justiça 2023 (TJSP2302)","https://www.vunesp.com.br/TJSP2302"],
 ["Gran Questões — prova Oficial de Justiça 2023","https://questoes.grancursosonline.com.br/prova/tj-sp-sp-2023-vunesp-oficial-de-justica-3"]
];
function vProvas(el){
  el.innerHTML = `
  <header class="ph"><div><span class="eyebrow">Provas anteriores</span><h1>Treine com a prova de verdade</h1><p>Veja como a Vunesp cobra cada matéria e importe as provas oficiais (caderno + gabarito) para resolvê-las aqui, com correção, caderno de erros e estatísticas.</p></div></header>
  <div class="card"><div class="card-h"><h2>Raio-x das últimas provas</h2><span class="pill">o que caiu</span></div>
    <div class="raiox">${RAIOX.map((r,i)=>`<details ${i===0?"open":""}><summary><b>${r.p}</b><span class="pill">${r.n}</span></summary><table class="tbl lt"><tbody>${r.t.map(x=>`<tr><td><b>${x[0]}</b></td><td>${esc(x[1])}</td></tr>`).join("")}</tbody></table></details>`).join("")}</div>
    <div class="tip">A Vunesp repete temas e formatos: caso concreto com personagens, letra da lei com um detalhe trocado (prazo, número, “salvo”, impedimento × suspeição, apelação × RESE) e alternativas parecidas. As questões “padrão prova” do app seguem esse formato e mostram em que prova o tema caiu.</div>
    <div class="row-btns"><button class="btn primary" onclick="S.cfg.origem='vunesp';save();startSession('treino', buildTreino(Object.keys(SUBJ), 30))">Treinar 30 no padrão prova →</button></div>
  </div>
  <div class="card"><div class="card-h"><h2>Importar uma prova oficial</h2></div>
    <ol class="steps"><li>Baixe o <b>caderno de questões</b> e o <b>gabarito</b> no site da Vunesp (ou em sites de questões).${LINKS_PROVAS.map(l=>`<br><a href="${l[1]}" target="_blank" rel="noopener">${esc(l[0])} ↗</a>`).join("")}</li>
    <li>Envie o PDF do caderno ou cole o texto dele abaixo, e cole o gabarito (ex.: <code>1-A 2-C 3-E…</code> ou <code>ACEBD…</code>).</li>
    <li>O Claude organiza as questões, classifica por matéria e escreve um comentário curto para cada uma. A prova fica salva só para você.</li></ol>
    ${sampleFn?`<div class="imp">
      <input id="impNome" placeholder="Nome da prova — ex.: TJSP 2023 Escrevente Capital">
      <label class="file"><input type="file" id="impFile" accept=".pdf,.txt" onchange="lerArquivoProva(this)"><span>📄 Enviar PDF ou TXT do caderno</span></label>
      <textarea id="impTxt" rows="7" placeholder="…ou cole aqui o texto do caderno de questões"></textarea>
      <textarea id="impGab" rows="2" placeholder="Gabarito oficial — ex.: 1-A 2-C 3-E 4-B …"></textarea>
      <button class="btn primary" id="impBtn" onclick="importarProva()">Importar prova</button>
      <div id="impMsg" class="muted"></div></div>`
    :`<p class="muted">A importação usa o Claude para organizar as questões. Abra este app dentro do Claude para usar.</p>`}
  </div>
  <div class="card"><div class="card-h"><h2>Suas provas importadas</h2><span class="pill">${PROVAS.length}</span></div>
    ${PROVAS.length? PROVAS.map((p,i)=>{ const by={}; p.qs.forEach(q=>by[q.s]=(by[q.s]||0)+1); const st=p.qs.reduce((a,q)=>{const x=S.qs[q.id]; if(x){a[0]+=x.n;a[1]+=x.c;} return a;},[0,0]);
      return `<div class="prov"><div><b>${esc(p.nome)}</b><small>${p.qs.length} questões · ${Object.entries(by).map(([k,n])=>SUBJ[k].curto+" "+n).join(" · ")}</small><small>${st[0]?`Seu acerto: ${pct(st[1],st[0])}% em ${st[0]} respostas`:"Ainda não resolvida"}</small></div>
      <div class="row-btns"><button class="btn primary sm" onclick="fazerProva(${i})">Fazer a prova completa</button><button class="btn sm" onclick="startSession('treino', shuffle(PROVAS[${i}].qs))">Treinar embaralhado</button><button class="btn ghost sm" onclick="excluirProva(${i})">Excluir</button></div></div>`; }).join("")
    : `<p class="muted">Nenhuma prova importada ainda.</p>`}
  </div>`;
}
function fazerProva(i){ const p=PROVAS[i]; startSession("sim", p.qs.map(q=>Object.assign({},q)), {deadline: Date.now()+(p.qs.length>=90?300:240)*60000, imediato:false, prova:p.nome}); }
function excluirProva(i){ modal(`<h3>Excluir “${esc(PROVAS[i].nome)}”?</h3><p>As questões dessa prova saem do seu banco. Seu histórico de respostas continua no painel.</p><div class="mrow"><button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn primary" onclick="PROVAS.splice(${i},1);saveProvas();closeModal();render()">Excluir</button></div>`); }
let pdfReady=null;
function loadPdfJs(){
  if(pdfReady) return pdfReady;
  const add=src=>new Promise((res,rej)=>{ const sc=document.createElement("script"); sc.src=src; sc.onload=res; sc.onerror=rej; document.head.appendChild(sc); });
  const base="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
  pdfReady = add(base+"pdf.worker.min.js").then(()=>add(base+"pdf.min.js")).then(()=>{ window.pdfjsLib.GlobalWorkerOptions.workerSrc=base+"pdf.worker.min.js"; return window.pdfjsLib; });
  pdfReady.catch(()=>{ pdfReady=null; });
  return pdfReady;
}
async function lerArquivoProva(inp){
  const f=inp.files[0]; if(!f) return; const msg=$("#impMsg");
  if(!$("#impNome").value) $("#impNome").value=f.name.replace(/\.(pdf|txt)$/i,"");
  try{
    if(/\.txt$/i.test(f.name)){ $("#impTxt").value=await f.text(); msg.textContent="Texto carregado."; return; }
    msg.textContent="Lendo o PDF…"; const lib=await loadPdfJs();
    const doc=await lib.getDocument({data:new Uint8Array(await f.arrayBuffer())}).promise; let out="";
    for(let i=1;i<=doc.numPages;i++){ const pg=await doc.getPage(i); const tc=await pg.getTextContent(); let lastY=null, line="";
      for(const it of tc.items){ const y=it.transform[5]; if(lastY!==null && Math.abs(y-lastY)>2){ out+=line+"\n"; line=""; } line+=it.str; lastY=y; }
      out+=line+"\n\n"; msg.textContent=`Lendo o PDF… página ${i}/${doc.numPages}`; }
    $("#impTxt").value=out; msg.textContent=`✓ PDF lido (${doc.numPages} páginas). Cole o gabarito e clique em Importar.`;
  }catch(e){ msg.textContent="Não consegui ler esse PDF aqui. Abra o PDF, copie todo o texto (Ctrl+A, Ctrl+C) e cole no campo abaixo."; }
}
function parseGabarito(t){
  const g={}; t=(t||"").toUpperCase(); let m; const re=/(\d{1,3})\s*[-–.:)=]?\s*(ANULADA|[A-E]|X|\*)(?![A-Z])/g;
  while((m=re.exec(t))){ g[+m[1]] = /^[A-E]$/.test(m[2]) ? "ABCDE".indexOf(m[2]) : -1; }
  if(Object.keys(g).length<5){ const seq=t.replace(/[^A-EX*]/g,""); if(seq.length>=10) [...seq].forEach((c,i)=>{ g[i+1]="ABCDE".indexOf(c); }); }
  return g;
}
function chunkText(t, size=9000, overlap=1200){ const out=[]; let i=0; while(i<t.length){ let end=Math.min(t.length,i+size); if(end<t.length){ const nl=t.lastIndexOf("\n",end); if(nl>i+size*0.6) end=nl; } out.push(t.slice(i,end)); if(end>=t.length) break; i=end-overlap; } return out; }
async function importarProva(){
  const nome=($("#impNome").value||"").trim()||"Prova importada", txt=$("#impTxt").value.trim(), gab=parseGabarito($("#impGab").value), msg=$("#impMsg"), btn=$("#impBtn");
  if(txt.length<300){ msg.textContent="Cole o texto do caderno (ou envie o PDF) antes de importar."; return; }
  if(Object.keys(gab).length<5){ msg.textContent="Cole o gabarito oficial para que as questões possam ser corrigidas."; return; }
  btn.disabled=true; const chunks=chunkText(txt); const found={}; const textos={};
  const pid="p"+hash(nome+Date.now());
  try{
    for(let c=0;c<chunks.length;c++){
      msg.textContent=`Organizando as questões com o Claude… parte ${c+1} de ${chunks.length}`;
      const prompt=`Você recebe um trecho do caderno de questões de uma prova da Vunesp (concurso do TJ-SP). Extraia as questões objetivas COMPLETAS deste trecho, sem alterar o texto do enunciado nem das alternativas (apenas corrija quebras de linha e hifenização do PDF).
- Ignore capas, instruções e questões cortadas no início ou no fim do trecho.
- "disciplina" deve ser exatamente uma destas chaves: port (Língua Portuguesa), penal, ppenal (Processo Penal e JECrim), pcivil (Processo Civil, JEC e JEFP), const (Constitucional), adm (Administrativo, Estatuto SP 10.261, Improbidade), interna (Normas da Corregedoria, Regimento, resoluções do TJSP, organização judiciária), atual (Atualidades e Estatuto da Pessoa com Deficiência), mat (Matemática), rl (Raciocínio Lógico), info (Informática). Se for outra matéria de Direito, use a mais próxima.
- Se a questão depender de um texto-base presente no trecho, coloque o texto em "textos" (com um id) e referencie em "texto_id". Se o texto-base não estiver no trecho, use "texto_id": "".
- Gabarito oficial (número da questão → índice da alternativa correta, 0=A … 4=E; -1 = anulada): ${JSON.stringify(gab)}
- Para cada questão, escreva "comentario" (até 60 palavras) explicando por que a alternativa do gabarito está correta, citando o artigo da lei ou a regra quando houver.
Responda SOMENTE com JSON: {"textos":[{"id":"t1","titulo":"...","conteudo":"..."}],"questoes":[{"numero":1,"disciplina":"port","assunto":"assunto curto","texto_id":"t1","enunciado":"...","alternativas":["...","...","...","...","..."],"comentario":"..."}]}
TRECHO:
${chunks[c]}`;
      let r; try{ r=await sampleFn.json(prompt,{modelTier:"default"}); }
      catch(e){ if(e&&e.code==="rate_limited"){ msg.textContent="Muitas solicitações seguidas; aguardando 20 s…"; await new Promise(z=>setTimeout(z,20000)); c--; continue; } throw e; }
      (r&&r.textos||[]).forEach(t=>{ if(t&&t.id&&t.conteudo) textos[c+"-"+t.id]={titulo:String(t.titulo||"Texto"), corpo:String(t.conteudo)}; });
      (r&&r.questoes||[]).forEach(x=>{ const n=+x.numero; if(!n||found[n]||!Array.isArray(x.alternativas)||x.alternativas.length!==5||!SUBJ[x.disciplina]) return;
        const a=gab[n]; if(a===undefined||a<0) return;
        const tx = x.texto_id && textos[c+"-"+x.texto_id];
        found[n]={id:pid+"-"+n, s:x.disciplina, t:String(x.assunto||"Prova").slice(0,80), q:String(x.enunciado), o:x.alternativas.map(String), a, e:String(x.comentario||("Gabarito oficial: "+"ABCDE"[a]+".")), src:"prova", prova:nome, num:n, tb:tx?tx.corpo:undefined, tbt:tx?tx.titulo:undefined};
      });
    }
    const nums=Object.keys(found).map(Number).sort((a,b)=>a-b); let lastTb=null;
    nums.forEach(n=>{ const q=found[n]; if(q.s==="port"){ if(q.tb) lastTb={tb:q.tb,tbt:q.tbt}; else if(lastTb && /texto|tirinha|poema|charge|trecho/i.test(q.q)) Object.assign(q,lastTb); } });
    const qs=nums.map(n=>found[n]);
    if(!qs.length){ msg.textContent="Não encontrei questões nesse texto. Confira se colou o caderno completo."; btn.disabled=false; return; }
    PROVAS.push({id:pid, nome, data:Date.now(), qs}); saveProvas();
    const faltam=Object.values(gab).filter(v=>v>=0).length-qs.length;
    msg.innerHTML=`✓ ${qs.length} questões importadas de “${esc(nome)}”.${faltam>0?` ${faltam} não foram reconhecidas (questões cortadas no PDF); você pode colar o trecho delas e importar de novo com outro nome.`:""}`;
    setTimeout(render, 1500);
  }catch(e){ msg.textContent=iaErr(e); }
  btn.disabled=false;
}

// ---------- TREINO ----------
let openTops = new Set();
function vTreino(el){
  const c=S.cfg; const meta=c.meta||100; const h=S.hist[today()]||{n:0}; c.tops=c.tops||{}; const st=c.status||"todas";
  const blocos = [1,2,3].map(b=>({b, items:Object.entries(SUBJ).filter(([k,v])=>v.bloco===b)}));
  const bn = {1:"Bloco I · Língua Portuguesa (16)",2:"Bloco II · Conhecimentos em Direito (30)",3:"Bloco III · Conhecimentos Gerais (24)"};
  const sel = c.subs.filter(k=>SUBJ[k]);
  let disp=0, inf=false; sel.forEach(k=>{ const f=treinoFilter(k); disp+=filteredPool(k,f).length; if(genForFiltered(k,f)) inf=true; });
  el.innerHTML = `
  <header class="ph"><div><span class="eyebrow">Treino</span><h1>Monte sua bateria de questões</h1><p>Filtre por tipo de questão, matéria, assunto e situação. Dentro do filtro, as questões que você ainda não viu e as que errou aparecem primeiro.</p></div>
  <div class="mini-ring">${ring(h.n, meta, 110, 10, h.n, "hoje")}</div></header>
  <div class="card">${origemSel()}</div>
  <div class="card">
    <div class="fstep"><span class="fn">1</span><h2>Matérias</h2><div class="fact"><button class="link" onclick="S.cfg.subs=Object.keys(SUBJ).filter(k=>poolFor(k).length||(genAllowed()&&genFor(k)));save();render()">todas</button> · <button class="link" onclick="S.cfg.subs=[];save();render()">nenhuma</button></div></div>
    ${blocos.map(B=>`<div class="bloco"><div class="bloco-h"><h3>${bn[B.b]}</h3><button class="link" onclick="toggleBloco(${B.b})">marcar/desmarcar bloco</button></div>
      <div class="chips">${B.items.map(([k,v])=>{ const n=poolFor(k).length; const g=genAllowed()&&!!genFor(k); const dis = !n && !g;
      return `<label class="chip ${c.subs.includes(k)?"on":""} ${dis?"dis":""}" title="${dis?"Sem questões desse tipo — gere com IA abaixo":""}"><input type="checkbox" value="${k}" ${c.subs.includes(k)?"checked":""} ${dis?"disabled":""} onchange="toggleSub(this)"><i style="background:${v.cor}"></i>${v.curto}<small>${n}${g?"+∞":""}</small></label>`; }).join("")}</div></div>`).join("")}

    <div class="fstep"><span class="fn">2</span><h2>Assuntos</h2><div class="fact muted small">${sel.length?"Abra uma matéria para escolher os assuntos. Sem escolha = todos.":""}</div></div>
    ${sel.length? `<div class="tfil">${sel.map(k=>{ const tops=topicsOf(k); const chosen=c.tops[k]||[]; const lab = chosen.length? `${chosen.length} de ${tops.length} assuntos` : `todos os ${tops.length} assuntos`;
      return `<details ${openTops.has(k)?"open":""} ontoggle="this.open?openTops.add('${k}'):openTops.delete('${k}')"><summary><i style="background:${SUBJ[k].cor}"></i><b>${SUBJ[k].curto}</b><span class="${chosen.length?"pill":"muted small"}">${lab}</span></summary>
        <div class="tfil-b"><div class="fact"><button class="link" onclick="S.cfg.tops['${k}']=[];save();render()">todos</button></div>
        <div class="chips">${tops.map(t=>{ const on=chosen.includes(t.t); const n=filteredPool(k,{status:st,tops:[t.t]}).length;
          return `<label class="chip sm ${on?"on":""}"><input type="checkbox" ${on?"checked":""} onchange="toggleTopico('${k}', ${JSON.stringify(t.t).replace(/"/g,"&quot;")}, this.checked)">${esc(t.t)}<small>${n}${t.gen&&st!=="erradas"?"+∞":""}</small></label>`; }).join("")}</div></div></details>`; }).join("")}</div>` : `<p class="muted">Escolha pelo menos uma matéria acima.</p>`}

    <div class="fstep"><span class="fn">3</span><h2>Situação da questão</h2></div>
    <div class="seg big-seg">${[["todas","Todas"],["novas","Só inéditas (nunca respondi)"],["erradas","Só as que errei"]].map(([v,l])=>`<button class="${st===v?"on":""}" onclick="S.cfg.status='${v}';save();render()">${l}</button>`).join("")}</div>

    <div class="cfg-row">
      <div><label class="lbl">Quantidade de questões: <b id="qv">${c.qtd}</b></label><input type="range" min="5" max="150" step="5" value="${c.qtd}" oninput="$('#qv').textContent=this.value; S.cfg.qtd=+this.value; save(); const b=$('#goBtn'); if(b) b.textContent='Começar '+this.value+' questões →'"></div>
      <div><label class="lbl">Correção</label><div class="seg"><button class="${c.imediato?"on":""}" onclick="S.cfg.imediato=true;save();render()">A cada questão</button><button class="${!c.imediato?"on":""}" onclick="S.cfg.imediato=false;save();render()">Só no final</button></div></div>
      <div><label class="lbl">Meta diária</label><div class="seg">${[50,100,150].map(m=>`<button class="${meta===m?"on":""}" onclick="S.cfg.meta=${m};save();render()">${m}</button>`).join("")}</div></div>
    </div>
    <div class="fsum"><span>Com esses filtros: <b>${disp}</b> questões disponíveis${inf?" <b>+ geradas sem limite</b>":""}${!inf&&disp<c.qtd&&disp>0?` — a bateria terá ${disp}`:""}</span>
    <button class="btn primary big" id="goBtn" ${!disp&&!inf?"disabled":""} onclick="startSession('treino', buildTreino(S.cfg.subs, S.cfg.qtd, true))">Começar ${c.qtd} questões →</button></div>
  </div>
  <div class="card ai-only ${sampleFn?"":"hidden"}">
    <div class="card-h"><h2>✦ Gerar questões inéditas com IA</h2><span class="pill">${AI.length} no seu banco</span></div>
    <p class="muted">O Claude cria questões novas no estilo Vunesp sobre o tema que você escolher e elas entram no seu banco pessoal. Revise sempre com a lei seca: questões geradas podem conter imprecisões.</p>
    <div class="ai-form">
      <select id="aiS">${Object.entries(SUBJ).map(([k,v])=>`<option value="${k}">${v.nome}</option>`).join("")}</select>
      <input id="aiT" placeholder="Tema (opcional) — ex.: crase, art. 5º CF, citação no CPC, Normas da Corregedoria…">
      <select id="aiN"><option>5</option><option selected>10</option><option>15</option></select>
      <button class="btn primary" id="aiBtn" onclick="gerarIA()">Gerar</button>
    </div>
    <div id="aiMsg" class="muted"></div>
  </div>`;
}
function toggleTopico(k, t, on){ const a=new Set(S.cfg.tops[k]||[]); on? a.add(t) : a.delete(t); S.cfg.tops[k]=[...a]; openTops.add(k); save(); render(); }
function toggleSub(cb){ const s=new Set(S.cfg.subs); cb.checked? s.add(cb.value) : s.delete(cb.value); S.cfg.subs=[...s]; save(); render(); }
function toggleBloco(b){ const ks=Object.entries(SUBJ).filter(([k,v])=>v.bloco===b && (poolFor(k).length||genFor(k))).map(([k])=>k); const all=ks.every(k=>S.cfg.subs.includes(k)); const s=new Set(S.cfg.subs); ks.forEach(k=> all? s.delete(k):s.add(k)); S.cfg.subs=[...s]; save(); render(); }

const BASE_LEGAL = {
  port:"Interpretação de texto, coesão, sentido de palavras, classes de palavras, concordância, regência, colocação pronominal, crase e pontuação.",
  penal:"Código Penal: arts. 293 a 305; 307; 308; 311-A; 312 a 317; 319 a 333; 336 e 337; 339 a 347; 357 e 359.",
  ppenal:"CPP: arts. 251 a 258; 261 a 267; 274; 351 a 372; 394 a 497; 531 a 538; 541 a 548; 574 a 667. Lei 9.099/95: arts. 60 a 83; 88 e 89.",
  pcivil:"CPC: arts. 144 a 155; 188 a 275; 294 a 311; 318 a 538; 994 a 1.026. Lei 9.099/95: arts. 3º a 19. Lei 12.153/2009.",
  const:"CF: Título II, Capítulos I, II e III (arts. 5º a 13); Título III, Capítulo VII, Seções I e II (arts. 37 a 41); art. 92.",
  adm:"Lei estadual 10.261/1968 (Estatuto dos Funcionários Públicos Civis de SP): arts. 1º a 86; 171 a 175; 239 a 323. Lei 8.429/1992 (Improbidade, com a Lei 14.230/2021).",
  interna:"Resolução TJSP 850/2021 (teletrabalho); Resolução TJSP 963/2025 (eproc); LC estadual 1.111/2010 (plano de cargos); Regimento Interno do TJSP; Normas Judiciais da Corregedoria Geral da Justiça (Tomo I, caps. II, III e XI, nas seções indicadas no edital).",
  atual:"Fatos políticos, econômicos, sociais e culturais, nacionais e internacionais, a partir do 1º semestre de 2026; Lei 13.146/2015 (Estatuto da Pessoa com Deficiência), arts. 1º a 13 e 34 a 38.",
  mat:"Operações com reais, MMC/MDC, razão e proporção, porcentagem, regra de três, médias, juros simples, equações do 1º e 2º graus, sistemas, tabelas e gráficos, medidas, geometria básica, problemas.",
  rl:"Estruturas lógicas, lógica de argumentação, diagramas lógicos, sequências numéricas e figurais.",
  info:"Windows 10+, Word, Excel (fórmulas, funções, gráficos, classificação), correio eletrônico, navegação, Microsoft 365 (Teams, SharePoint, OneNote, OneDrive)."
};
const GUIA_VUNESP = `GUIA DO PADRÃO VUNESP (provas TJSP Escrevente 2018–2025 e Oficial de Justiça 2023/2024):
- Sempre 5 alternativas (A–E), uma correta. Enunciados: "Assinale a alternativa correta", "É correto afirmar que", "Nos termos do...", "De acordo com a norma-padrão", "conclui-se corretamente que", às vezes "assinale a alternativa INCORRETA" ou itens I, II, III ("Está correto o que se afirma em").
- Direito: muitas questões com CASO CONCRETO e personagens (Tício, Mévio, Caio, Juliete, André, Mário, João, Isaías...), seguido de "Nos termos do CPP/CPC/CF, ...". As alternativas reproduzem a letra da lei com UMA alteração sutil (prazo, número, "salvo"/"somente"/"desde que", impedimento x suspeição, apelação x RESE, reclusão x detenção, caput x parágrafo, crime formal x material, próprio x comum).
- Alternativas longas e parecidas entre si; a diferença está no detalhe. Evite alternativas absurdas.
- Português: texto-base (editorial, crônica, poema, tirinha descrita, notícia), perguntas de inferência, sentido de palavras e conectivos, "respectivamente", reescrita que mantém o sentido, crase/regência por lacunas, concordância (haver/fazer/existir, "bastante"), colocação pronominal (próclise com palavras atrativas), pontuação.
- Informática: caminhos de menu e atalhos (Windows 10/11, Word, Excel 365 com PROCV, SE, MAIOR/MENOR, referências $), e-mail (Cc, Cco, responder a todos), busca no Google, Teams, OneDrive (arquivos sob demanda).
- Raciocínio lógico: negação de condicional composta, equivalências, conjuntos, associação, sequências, verdades e mentiras. Matemática: problemas contextualizados (escritório, cartório, compras).
- Atualidades: fatos de grande repercussão (quem fez o quê e por quê).`;

async function iaCore(s, tema, n){
  const prompt = `Você é um elaborador experiente da Fundação VUNESP. Crie ${n} questões INÉDITAS de múltipla escolha para o concurso de Escrevente Técnico Judiciário do TJ-SP (prova em 14/03/2027).
Matéria: ${SUBJ[s].nome}.${tema?` Tema específico: ${tema}.`:""}
Conteúdo do edital para esta matéria: ${BASE_LEGAL[s]}
${GUIA_VUNESP}
Regras:
- 5 alternativas (A a E), apenas UMA correta; distratores plausíveis (troca de prazos, números, termos, sujeitos, exceções).
- Faça as questões IGUAIS em formato às da prova real: pelo menos metade com caso concreto e personagens quando a matéria permitir.
- Em Direito, cobre a literalidade da lei ("Nos termos do...", "De acordo com...", "Assinale a alternativa correta"), sem inventar dispositivos; cite o artigo na explicação.
- Em Português, inclua no enunciado um trecho curto ORIGINAL quando a questão depender de texto.
- Não repita questões; varie os dispositivos/assuntos. Enunciados objetivos.
Responda SOMENTE com JSON válido, sem comentários, no formato:
{"questoes":[{"topico":"assunto curto","enunciado":"...","alternativas":["...","...","...","...","..."],"correta":0,"explicacao":"..."}]}`;
  const r = await sampleFn.json(prompt, {modelTier:"default"});
  const arr = (r && r.questoes) || []; const added=[];
  for(const x of arr){ if(!x || !Array.isArray(x.alternativas) || x.alternativas.length!==5 || typeof x.correta!=="number" || x.correta<0 || x.correta>4 || !x.enunciado) continue;
    const q={id:"ia-"+hash(x.enunciado+x.alternativas.join("|")), s, t:String(tema||x.topico||"Geral").slice(0,80), q:String(x.enunciado), o:x.alternativas.map(String), a:x.correta, e:String(x.explicacao||""), src:"ia", estilo:"vunesp"};
    if(!AI.some(a=>a.id===q.id)){ AI.push(q); added.push(q); } }
  if(AI.length>600) AI=AI.slice(-600);
  saveAI(); return added;
}
function iaErr(e){ return e && e.code==="rate_limited" ? "Muitas solicitações seguidas. Aguarde um pouco e tente novamente." : e && e.code==="not_granted" ? "A geração com IA não foi autorizada nesta página." : "Não foi possível gerar agora. Tente novamente em instantes."; }
async function gerarIA(){
  if(!sampleFn) return; const s=$("#aiS").value, tema=$("#aiT").value.trim(), n=+$("#aiN").value;
  const btn=$("#aiBtn"), msg=$("#aiMsg"); btn.disabled=true; btn.textContent="Gerando…"; msg.textContent="O Claude está elaborando as questões. Isso leva alguns segundos.";
  try{ const add=await iaCore(s,tema,n); window._lastAI=add;
    msg.innerHTML = add.length? `✓ ${add.length} questões adicionadas ao seu banco de ${SUBJ[s].curto}. <button class="link" onclick="startSession('treino', window._lastAI)">Resolver agora →</button>` : "Não consegui aproveitar as questões geradas. Tente de novo.";
  }catch(e){ msg.textContent = iaErr(e); }
  btn.disabled=false; btn.textContent="Gerar";
}
async function iaTopico(s, tema, btn){
  if(!sampleFn) return; const old=btn.textContent; btn.disabled=true; btn.textContent="Gerando…"; toast("O Claude está criando 10 questões sobre esse assunto…");
  try{ const add=await iaCore(s, tema, 10); if(add.length) startSession("treino", add); else toast("Não consegui gerar agora. Tente de novo."); }
  catch(e){ toast(iaErr(e)); }
  btn.disabled=false; btn.textContent=old;
}

// ---------- SIMULADO ----------
function vSimulado(el){
  el.innerHTML = `
  <header class="ph"><div><span class="eyebrow">Simulado completo</span><h1>Prova no formato oficial</h1><p>70 questões de cinco alternativas na proporção do edital, cronômetro e correção pelos critérios da Vunesp.</p></div></header>
  <div class="grid3">
    <div class="card stat"><b>16</b><span>Bloco I · Língua Portuguesa</span><small>eliminatório</small></div>
    <div class="card stat"><b>30</b><span>Bloco II · Conhecimentos em Direito</span><small>eliminatório</small></div>
    <div class="card stat"><b>24</b><span>Bloco III · Conhecimentos Gerais</span><small>4 Atualidades · 4 Matemática · 9 Informática · 7 Rac. Lógico — classificatório</small></div>
  </div>
  <div class="card">
    <h3>Critérios de habilitação (edital)</h3>
    <ul class="rules"><li>Nota da prova objetiva de 0 a 10; todas as questões têm o mesmo valor.</li><li>É preciso acertar <b>pelo menos 50% das questões dos Blocos I e II</b> (23 de 46).</li><li>A nota final da prova objetiva precisa ser <b>pelo menos 5</b> (35 acertos).</li><li>O Bloco III não elimina, mas conta para a classificação.</li></ul>
    <div class="cfg-row"><div><label class="lbl">Tempo</label><div class="seg" id="tsel">${[[180,"3h"],[210,"3h30"],[240,"4h"],[0,"Sem limite"]].map(([m,l],i)=>`<button class="${i===2?"on":""}" data-m="${m}" onclick="$$('#tsel button').forEach(b=>b.classList.remove('on'));this.classList.add('on')">${l}</button>`).join("")}</div><small class="muted">A prova real tem 5h para objetiva + redação. Reservar ~1h para a redação é uma boa referência.</small></div></div>
    ${origemSel()}
    <button class="btn primary big" onclick="iniciarSimulado()">Iniciar simulado →</button>
    ${PROVAS.length?`<p class="muted">Ou refaça uma prova real completa, na ordem original, em <a href="#provas">Provas</a>.</p>`:""}
  </div>
  ${S.sims.length? `<div class="card"><div class="card-h"><h2>Histórico</h2></div><table class="tbl"><thead><tr><th>Data</th><th>Acertos</th><th>Bloco I</th><th>Bloco II</th><th>Bloco III</th><th>Nota</th><th>Situação</th></tr></thead><tbody>${S.sims.slice().reverse().map(s=>`<tr><td>${new Date(s.d).toLocaleDateString("pt-BR")}</td><td>${s.c}/${s.n}</td><td>${s.b[1][1]}/${s.b[1][0]}</td><td>${s.b[2][1]}/${s.b[2][0]}</td><td>${s.b[3][1]}/${s.b[3][0]}</td><td><b>${fmtBR(s.nota,1)}</b></td><td><span class="pill ${s.ok?"ok":"bad"}">${s.ok?"Habilitado":"Eliminado"}</span></td></tr>`).join("")}</tbody></table></div>`:""}`;
}
function iniciarSimulado(){ const b=$("#tsel .on"); const m=b? +b.dataset.m : 240; startSession("sim", buildSimulado(), {deadline: m? Date.now()+m*60000 : null, imediato:false}); }

// ---------- QUESTÃO ----------
function getTxt(q){ if(q.txt && TEXTOS[q.txt]) return TEXTOS[q.txt]; if(q.tb) return {titulo:q.tbt||"Texto da prova", corpo:q.tb}; return null; }
function srcPill(q){ return q.src==="gerada"?`<span class="pill">gerada</span>`:q.src==="ia"?`<span class="pill">IA${q.estilo==="vunesp"?" · padrão prova":""}</span>`:q.src==="vunesp"?`<span class="pill vp">padrão prova Vunesp</span>`:q.src==="prova"?`<span class="pill pr">${esc(q.prova||"prova anterior")}</span>`:""; }
let timerI=null;
function vQuestao(el){
  const ss=S.sess; if(!ss){ go("treino"); return; }
  const q=ss.qs[ss.i], ans=ss.ans[ss.i], answered = ans!==null && ans!==undefined;
  const showFb = answered && ss.imediato;
  const done = ss.ans.filter(a=>a!==null).length;
  const txt = getTxt(q);
  const strike = ss.strike[ss.i]||[];
  const isSim = ss.mode==="sim";
  el.innerHTML = `
  <div class="qtop">
    <button class="btn ghost sm" onclick="sairSessao()">← Sair</button>
    <div class="qprog"><div class="qbar"><div style="width:${done/ss.qs.length*100}%"></div></div><span>${ss.i+1} / ${ss.qs.length}</span></div>
    <div class="qtime" id="qtime"></div>
  </div>
  ${isSim? `<div class="qgrid">${ss.qs.map((x,i)=>`<button class="${i===ss.i?"cur":""} ${ss.ans[i]!==null?"done":""}" onclick="irPara(${i})" title="${SUBJ[x.s].curto}">${i+1}</button>`).join("")}</div>`:""}
  <article class="qcard">
    <div class="qmeta"><span class="tagc" style="--c:${SUBJ[q.s].cor}">${SUBJ[q.s].nome}</span><span class="topic">${esc(q.t)}</span>${srcPill(q)}</div>
    ${q.ref?`<div class="qref">📌 Tema cobrado em: ${esc(q.ref)}</div>`:""}
    ${txt? `<details class="texto" ${ss.i===0||!ss.qs[ss.i-1]||(ss.qs[ss.i-1].txt||ss.qs[ss.i-1].tb)!==(q.txt||q.tb)?"open":""}><summary>Texto: ${esc(txt.titulo)}</summary><div>${txt.corpo.split("\n\n").map(p=>`<p>${esc(p)}</p>`).join("")}</div></details>`:""}
    <p class="enun">${esc(q.q).replace(/\n/g,"<br>")}</p>
    <ol class="opts">${q.o.map((o,i)=>{ let cls=""; if(showFb){ if(i===q.a) cls="right"; else if(i===ans) cls="wrong"; } else if(answered && i===ans) cls="sel";
      return `<li class="${cls} ${strike.includes(i)?"strike":""}"><button class="opt" ${showFb?"disabled":""} onclick="responder(${i})"><span class="L">${"ABCDE"[i]}</span><span class="ot">${esc(o)}</span></button><button class="x" title="Riscar alternativa" onclick="riscar(${i})" ${showFb?"disabled":""}>✕</button></li>`; }).join("")}</ol>
    ${showFb? `<div class="fb ${ans===q.a?"ok":"no"}"><b>${ans===q.a?"✓ Resposta correta!":"✗ Resposta incorreta — gabarito: "+"ABCDE"[q.a]}</b><p>${esc(q.e).replace(/\n/g,"<br>")}</p>
      <div class="fb-actions">${q.lei&&q.lei.law?`<button class="link" onclick="abrirLei('${q.lei.law}')">Ler na lei seca →</button>`:""}${sampleFn&&ans!==q.a?`<button class="link" onclick="explicarIA()">✦ Explicar meu erro com IA</button>`:""}</div><div id="iaExp"></div></div>`:""}
  </article>
  <div class="qnav">
    <button class="btn ghost" ${ss.i===0?"disabled":""} onclick="irPara(${ss.i-1})">← Anterior</button>
    ${ss.i<ss.qs.length-1? `<button class="btn primary" onclick="irPara(${ss.i+1})">${answered||isSim?"Próxima →":"Pular →"}</button>`:`<button class="btn primary" onclick="finalizar()">Finalizar e ver resultado</button>`}
  </div>
  <p class="hint">Atalhos: A–E para responder · → próxima · ← anterior</p>`;
  clearInterval(timerI); const tick=()=>{ const t=$("#qtime"); if(!t||!S.sess){clearInterval(timerI);return;} if(ss.deadline){ const r=Math.max(0,ss.deadline-Date.now()); t.textContent="⏱ "+fmtT(r); t.classList.toggle("warn", r<15*60000); if(r<=0){ clearInterval(timerI); toast("Tempo esgotado!"); finalizar(); } } else t.textContent="⏱ "+fmtT(Date.now()-ss.start); }; tick(); timerI=setInterval(tick,1000);
}
function fmtT(ms){ const s=Math.floor(ms/1000); return `${Math.floor(s/3600)}:${String(Math.floor(s%3600/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; }
function responder(i){
  const ss=S.sess; if(!ss) return; const prev=ss.ans[ss.i];
  if(ss.imediato && prev!==null) return;
  ss.ans[ss.i]=i;
  if(ss.imediato){ const ok=record(ss.qs[ss.i], i); save(); render(); if(ok) pulse(); }
  else { save(); render(); }
}
function pulse(){ const c=$(".fb.ok"); if(c){ c.animate([{transform:"scale(.98)"},{transform:"scale(1)"}],{duration:250}); } }
function riscar(i){ const ss=S.sess; const a=ss.strike[ss.i]||(ss.strike[ss.i]=[]); const k=a.indexOf(i); k>=0? a.splice(k,1):a.push(i); save(); render(); }
function irPara(i){ const ss=S.sess; if(i<0||i>=ss.qs.length) return; ss.i=i; save(); render(); }
function sairSessao(){ modal(`<h3>Sair da sessão?</h3><p>Seu progresso fica salvo e você pode retomar depois pela tela inicial.</p><div class="mrow"><button class="btn ghost" onclick="closeModal()">Continuar resolvendo</button><button class="btn" onclick="closeModal();finalizar()">Encerrar e corrigir</button><button class="btn primary" onclick="closeModal();go('inicio')">Sair e retomar depois</button></div>`); }
function finalizar(){
  const ss=S.sess; if(!ss) return; clearInterval(timerI);
  if(!ss.imediato){ ss.qs.forEach((q,i)=>{ if(ss.ans[i]!==null) record(q, ss.ans[i]); }); }
  const res = {mode:ss.mode, qs:ss.qs, ans:ss.ans, dur:Date.now()-ss.start};
  if(ss.mode==="sim"){
    const b={1:[0,0],2:[0,0],3:[0,0]}; ss.qs.forEach((q,i)=>{ const bl=SUBJ[q.s].bloco; b[bl][0]++; if(ss.ans[i]===q.a) b[bl][1]++; });
    const c=b[1][1]+b[2][1]+b[3][1], n=ss.qs.length; const nota=c/n*10; const ok = (b[1][1]+b[2][1]) >= Math.ceil((b[1][0]+b[2][0])/2) && nota>=5;
    S.sims.push({d:Date.now(), n, c, b, nota, ok, dur:res.dur}); res.sim={b,c,n,nota,ok};
  }
  S.last=res; S.sess=null; save(); go("resultado");
}

// ---------- RESULTADO ----------
function vResultado(el){
  const r=S.last; if(!r){ go("inicio"); return; }
  const resp = r.ans.filter(a=>a!==null).length, cert = r.qs.filter((q,i)=>r.ans[i]===q.a).length;
  const by={}; r.qs.forEach((q,i)=>{ const x=by[q.s]||(by[q.s]=[0,0]); if(r.ans[i]!==null){x[0]++; if(r.ans[i]===q.a)x[1]++;} });
  const wrong = r.qs.map((q,i)=>({q,a:r.ans[i]})).filter(x=>x.a!==null && x.a!==x.q.a);
  el.innerHTML = `
  <header class="ph"><div><span class="eyebrow">${r.mode==="sim"?"Resultado do simulado":"Sessão concluída"}</span><h1>${cert} acertos em ${resp} respondidas</h1><p>Tempo: ${fmtT(r.dur)} · ${resp? Math.round(r.dur/resp/1000):0}s por questão em média</p></div><div class="mini-ring">${ring(cert, resp||1, 120, 11, pct(cert,resp)+"%", "acerto")}</div></header>
  ${r.sim? `<div class="card verdict ${r.sim.ok?"ok":"bad"}"><h2>${r.sim.ok?"Você estaria habilitado(a) ✓":"Você estaria eliminado(a)"}</h2><p>Nota objetiva: <b>${fmtBR(r.sim.nota,1)}</b> · Blocos I + II: <b>${r.sim.b[1][1]+r.sim.b[2][1]}/${r.sim.b[1][0]+r.sim.b[2][0]}</b> (mínimo ${Math.ceil((r.sim.b[1][0]+r.sim.b[2][0])/2)}) · Bloco III: ${r.sim.b[3][1]}/${r.sim.b[3][0]}</p></div>`:""}
  <div class="card"><div class="card-h"><h2>Por matéria</h2></div><div class="subj-list">${Object.entries(by).map(([k,v])=>`<div class="srow"><span class="sn"><i style="background:${SUBJ[k].cor}"></i>${SUBJ[k].curto}</span><div class="bar"><div style="width:${pct(v[1],v[0])}%;background:${pct(v[1],v[0])>=70?"#a548c0":pct(v[1],v[0])>=50?"#d186e6":"#f59e0b"}"></div></div><b>${pct(v[1],v[0])}%</b><small>${v[1]}/${v[0]}</small></div>`).join("")}</div></div>
  <div class="row-btns"><button class="btn primary" onclick="go('treino')">Nova bateria</button>${wrong.length?`<button class="btn" onclick="refazer(S.last.qs.filter((q,i)=>S.last.ans[i]!==null&&S.last.ans[i]!==q.a))">Refazer as ${wrong.length} que errei</button>`:""}<button class="btn ghost" onclick="go('inicio')">Ver painel</button></div>
  ${wrong.length? `<div class="card"><div class="card-h"><h2>Onde você errou</h2></div>${wrong.map(x=>revItem(x.q, x.a)).join("")}</div>`:""}`;
}
function revItem(q, a){
  return `<details class="rev"><summary><span class="tagc" style="--c:${SUBJ[q.s].cor}">${SUBJ[q.s].curto}</span><span class="rq">${esc(q.q.replace(/\n+/g," ").slice(0,150))}${q.q.length>150?"…":""}</span></summary>
  <div class="rev-b">${getTxt(q)?`<details class="texto"><summary>Texto: ${esc(getTxt(q).titulo)}</summary><div>${getTxt(q).corpo.split("\n\n").map(p=>`<p>${esc(p)}</p>`).join("")}</div></details>`:""}<p class="enun">${esc(q.q).replace(/\n/g,"<br>")}</p><ol class="opts small">${q.o.map((o,i)=>`<li class="${i===q.a?"right":i===a?"wrong":""}"><div class="opt"><span class="L">${"ABCDE"[i]}</span><span class="ot">${esc(o)}</span></div></li>`).join("")}</ol><div class="fb no"><p>${esc(q.e).replace(/\n/g,"<br>")}</p></div></div></details>`;
}
function refazer(qs){ startSession("erros", shuffle(qs.map(q=>Object.assign({},q))), {imediato:true}); }
async function explicarIA(){
  const ss=S.sess; if(!ss||!sampleFn) return; const q=ss.qs[ss.i], a=ss.ans[ss.i]; const box=$("#iaExp"); box.innerHTML=`<p class="muted">✦ Pensando…</p>`;
  const p = `Sou candidato ao concurso de Escrevente do TJ-SP (Vunesp). Errei esta questão. Explique em português, de forma direta e didática (máx. 140 palavras), por que a alternativa que marquei está errada e por que o gabarito está certo, citando o dispositivo legal ou a regra gramatical/lógica. Dê uma dica de memorização ao final.
${getTxt(q)?"Texto de apoio: "+getTxt(q).corpo+"\n":""}Questão: ${q.q}
${q.o.map((o,i)=>"ABCDE"[i]+") "+o).join("\n")}
Marquei: ${"ABCDE"[a]}. Gabarito: ${"ABCDE"[q.a]}.`;
  try{ await sampleFn(p, {modelTier:"quick", onText:({text})=>{ box.innerHTML=`<div class="iabox">${esc(text).replace(/\n/g,"<br>")}</div>`; }}); }
  catch(e){ box.innerHTML=`<p class="muted">Não foi possível obter a explicação agora.</p>`; }
}

// ---------- CADERNO DE ERROS ----------
let errFilter="all";
function vErros(el){
  const items = Object.entries(S.errs).map(([id,v])=>({q:findQ(id), v})).filter(x=>x.q).sort((a,b)=>b.v.t-a.v.t);
  const by={}; items.forEach(x=>{ by[x.q.s]=(by[x.q.s]||0)+1; });
  const list = items.filter(x=>errFilter==="all"||x.q.s===errFilter);
  el.innerHTML = `
  <header class="ph"><div><span class="eyebrow">Caderno de erros</span><h1>Volte onde você errou</h1><p>Toda questão errada vem para cá. Quando você acerta na revisão, ela sai do caderno. ${S.rec?`<b>${S.rec}</b> já recuperadas.`:""}</p></div></header>
  ${items.length? `
  <div class="chips">${[["all","Todas",items.length]].concat(Object.entries(by).map(([k,n])=>[k,SUBJ[k].curto,n])).map(([k,l,n])=>`<button class="chip ${errFilter===k?"on":""}" onclick="errFilter='${k}';render()">${l}<small>${n}</small></button>`).join("")}</div>
  <div class="row-btns"><button class="btn primary" onclick="refazerErros()">Refazer ${list.length} ${list.length===1?"questão":"questões"} →</button></div>
  <div class="card">${list.slice(0,150).map(x=>revItem(x.q, x.v.sel)).join("")}${list.length>150?`<p class="muted">Mostrando 150 de ${list.length}.</p>`:""}</div>`
  : `<div class="card empty"><div class="emo">✓</div><h3>Nenhum erro pendente</h3><p class="muted">Resolva questões e os erros aparecerão aqui automaticamente.</p><button class="btn primary" onclick="go('treino')">Ir para o treino</button></div>`}`;
}

function refazerErros(){ const ids=Object.keys(S.errs); const qs=ids.map(findQ).filter(q=>q&&(errFilter==="all"||q.s===errFilter)); refazer(qs); }

// ---------- LEI SECA ----------
let leiSel="cp", leiQ="";
function vLei(el){
  const law = LEIS.find(l=>l.id===leiSel) || LEIS[0];
  const q = leiQ.trim().toLowerCase();
  const arts = law.arts.filter(a=>!q || (a[0]+" "+a[1]+" "+a[2]).toLowerCase().includes(q));
  const lidos = law.arts.filter(a=>S.lidos[law.id+"|"+a[0]]).length;
  el.innerHTML = `
  <header class="ph"><div><span class="eyebrow">Lei seca</span><h1>Literalidade é o que a Vunesp cobra</h1><p>Dispositivos do edital com números, prazos e penas em destaque. Marque como lido e treine questões de literalidade geradas a partir do próprio texto.</p></div></header>
  <div class="lei-wrap">
    <aside class="lei-side">${LEIS.map(l=>{ const lr=l.arts.filter(a=>S.lidos[l.id+"|"+a[0]]).length; return `<button class="${l.id===law.id?"on":""}" onclick="leiSel='${l.id}';leiQ='';render()"><b>${l.sigla}</b><span>${l.nome}</span><div class="bar thin"><div style="width:${pct(lr,l.arts.length)}%"></div></div></button>`; }).join("")}
      <p class="muted small">Seleção dos dispositivos mais cobrados. Para o texto integral e atualizado, consulte o <a href="https://www.planalto.gov.br/ccivil_03/" target="_blank" rel="noopener">Planalto</a> e o site do TJSP.</p></aside>
    <div class="lei-main">
      <div class="lei-h"><div><h2>${law.nome}</h2><small>${lidos}/${law.arts.length} lidos</small></div><input class="search" placeholder="Buscar no texto…" value="${esc(leiQ)}" oninput="leiQ=this.value;clearTimeout(this._t);this._t=setTimeout(()=>{render();const s=$('.search');s.focus();s.setSelectionRange(s.value.length,s.value.length)},250)">${findTokensAny(law)?`<button class="btn primary sm" onclick="treinarLei('${law.id}')">Treinar 15 questões</button>`:""}</div>
      ${arts.map(a=>{ const k=law.id+"|"+a[0]; return `<div class="art ${S.lidos[k]?"lido":""}"><div class="art-h"><span class="artn">Art. ${a[0]}</span><b>${esc(a[1])}</b><label class="ck"><input type="checkbox" ${S.lidos[k]?"checked":""} onchange="S.lidos['${k}']=this.checked;save();this.closest('.art').classList.toggle('lido',this.checked)">lido</label></div><p>${hl(a[2], q)}</p></div>`; }).join("") || `<p class="muted">Nada encontrado.</p>`}
    </div>
  </div>`;
}
function findTokensAny(law){ return law.arts.some(a=>findTokens(a[2]).length); }
function hl(t, q){
  let h = esc(t);
  h = h.replace(/(§ \d+º|Parágrafo único\.)/g,'<br><span class="par">$1</span>').replace(/^<br>/,"");
  h = h.replace(/(Pena - )/g,'<span class="pena">$1</span>');
  h = h.replace(/\b(reclusão|detenção|multa)\b/g,'<mark class="m1">$1</mark>');
  h = h.replace(new RegExp("\\b(\\d+ \\([a-zà-ú\\- ]+?\\)|"+WORDNUMS.join("|")+"|um terço|metade|terça parte|sexta parte)(\\s+(?:a\\s+[a-zà-ú]+\\s+)?(?:anos?|meses|mês|dias?(?: úteis)?|horas|vezes|salários?(?: mínimos)?|salário-mínimo))","g"),'<mark class="m2">$1$2</mark>');
  if(q){ try{ h = h.replace(new RegExp("("+q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","gi"),'<mark class="mq">$1</mark>'); }catch(e){} }
  return h;
}
function treinarLei(id){ const qs=[]; let g=0; while(qs.length<15 && g++<80){ const q=genLei(null,id); if(q && !qs.some(x=>x.id===q.id)) qs.push(q); } startSession("treino", qs); }
function abrirLei(id){ leiSel=id; leiQ=""; go("leiseca"); }

// ---------- EDITAL VERTICALIZADO ----------
const EDITAL = [{"b": "Bloco I — Língua Portuguesa (16)", "s": "port", "itens": ["Interpretação: textos verbais, não verbais, literários e não literários", "Informações literais e inferências possíveis", "Ponto de vista do autor", "Estruturação do texto: relações entre ideias, coesão e coerência", "Significação contextual: sinônimos e antônimos", "Sentido próprio e sentido figurado (figuras de linguagem)", "Classes de palavras: substantivo, adjetivo, artigo, numeral", "Pronome", "Verbo: modos, formas nominais e transitividade", "Verbos auxiliares e de ligação", "Verbos regulares, irregulares, defectivos, abundantes, unipessoais e pronominais", "Vozes verbais (ativa e passiva)", "Advérbio, preposição e conjunção", "Concordância verbal e nominal", "Regência verbal e nominal", "Colocação pronominal", "Crase", "Pontuação"]}, {"b": "Bloco II — Direito Penal", "s": "penal", "itens": ["Art. 293 a 295: Falsidade de títulos e outros papéis públicos", "Art. 299 a 305; 307: Falsidade documental", "Art. 308: Outras falsidades", "Art. 311-A: Fraudes em certames de Interesse Público", "Art. 312 a 317; 319 a 327: Crimes Contra a Adm Pública praticados por Func. Públicos", "Art. 328 a 333; 336 e 337: Crimes praticados por particular contra a Adm Pública", "Art. 339 a 347; 357; 359: Crimes contra Adm da Justiça"]}, {"b": "Bloco II — Direito Processual Penal", "s": "ppenal", "itens": ["Art. 251 a 258; 261 a 267; 274: Sujeitos Processuais", "Art. 351 a 372: Citação e Intimação", "Art. 394 a 405: Procedimento Comum Ordinário", "Art. 406 a 497:  Procedimento dos Crimes da Competência do Tribunal do Júri", "Art. 531 a 538: Procedimento Comum  Sumário", "Art. 541 a 548:  Procedimento de Restauração de Autos Extraviados ou Destruídos", "Art. 574 a 592: Recursos - Disposições Gerais e RESE", "Art. 593 a 603: Apelação", "Art. 609 a 618: Do Processo e Julgamento dos Recursos em Sentido Estrito e das Apelações", "Art. 619 e 620: Dos Embargos", "Art. 621 a 630: Da Revisão", "Art. 637 e 638: Do Recurso Extraordinário", "Art. 639 a 646: Da Carta Testemunhavel", "Art. 647 a 667: HC", "Lei n. 9.099/95: art. 60 a 62 - JECRIM Disposições gerais", "Lei n. 9.099/95: art. 63 a 68 - JECRIM Da Competência e dos Atos Processuais", "Lei n. 9.099/95: art. 69 a 76 - JECRIM Da Fase Preliminar", "Lei n. 9.099/95: art. 77 a 83 - JECRIM Do Procedimento Sumariíssimo", "Lei n. 9.099/95: art. 88 e 89 - JECRIM Disposições Finais"]}, {"b": "Bloco II — Direito Processual Civil", "s": "pcivil", "itens": ["Art. 144 a 148: Impedimento e Suspeição", "Art. 149 a 155: Auxiliares de Justiça", "Art 188 a 202:  Teoria dos Atos Processuais/Negócio Juridico Processual/ Forma dos Atos Processuais/Atos das Partes", "Art 203 a 211: Atos processuais dos Juizes e Servidores", "Art 212 a 217: Tempo e Lugar dos Atos Processuais", "Art 218 a 235: Prazo dos Atos Processuais", "Art 236 a 259: Comunicação dos Atos Processuais - Citação", "Art. 260 a 268: Comunicação dos Atos Processuais- Carta", "Art. 269 a 275: Comunicação dos Atos Processuais- Intimação", "294 a 311: Tutela Provisória", "Art. 318 a 321: Procedimento Comum e Início de Petição Inicial", "Art. 322 a 331 : Do Pedido e Indeferimento da Petição Inicial", "Art. 332:  Improcedência liminar do Pedido", "Art 334: Audiência de conciliação ou mediação", "Art. 335 a 346: Respostas do Réu", "Art. 347  a 354: Providências Preliminares e Saneamento", "Art. 355 e 356: Julgamento Antecipado Total e Parcial do Mérito", "Art. 358 a 368: AIJ Audiência de Instrução e Julgamento", "Art. 369 a 383: Teoria Geral da Prova", "Art. 384 a 404: Provas em espécie: Ata notorial,  Dep Pessoal, Confissão, Exibição de doc ou coisa.", "Art. 405 a 441: Prova Documental", "Art. 442 a 463: Prova Testemunhal", "Art. 464 a 480: Prova Pericial", "Art. 481 a 484: Inspeção Judicial", "Art. 485 a 495: Sentença", "Art. 496: Remessa Necessária", "Art. 497 a 501: Julgamento das Ações relativas às  Prestações de fazer, não fazer e entregar coisa", "Art. 502 a 508: Coisa Julgada", "Art. 509 a 512: Liquidação de Sentença", "Art. 513 a 538: Cumprimento de Sentença", "Art. 994 a 1008 - Recursos Disposições Gerais", "Art. 1009 a 1014 - Apelação", "Art. 1015 a 1020 - Agravo de Instrumento", "Art. 1021 - Agravo Interno", "Art. 1022 a 1026 - Embargos de Declaração", "Lei nº 9.099/95 - Art. 3 ao 11 - Competência, Juízes e Partes", "Lei nº 9.099/95 - Art. 12 ao 19 - Processual", "Lei nº 12.153 de 22.12.2009."]}, {"b": "Bloco II — Direito Constitucional", "s": "const", "itens": ["Direitos e deveres individuais e coletivos (art. 5º) — consta no edital 2026", "1. Direitos sociais (arts. 6º a 11, da CF)", "2. Nacionalidade (arts. 12 a 13, da CF)", "3. Administração pública (arts. 37, 38)", "4. Servidores públicos (arts. 39 a 41)", "5. Poder Judiciário (art. 92)"]}, {"b": "Bloco II — Direito Administrativo", "s": "adm", "itens": ["Lei 10.261/68 — Art. 1 ao 10 - Das disposições preliminares", "Lei 10.261/68 — Art. 11 Ao 12 - Do Provimento, Do Exercício E Da Vacância Dos Cargos Públicos", "Lei 10.261/68 — Art. 13 - Das formas de nomeação", "Lei 10.261/68 — Art. 14 - ao 20 - Da seleção de Pessoal - Subseção I - Do concurso", "Lei 10.261/68 — Art. 21 ao 22 - Das provas de Habilitação", "Lei 10.261/68 — Art. 23 ao 25 - Das substituições", "Lei 10.261/68 — Art. 26 ao 29 - Da Transferência", "Lei 10.261/68 — Art. 30 ao 32 - Da reintegração", "Lei 10.261/68 — Art. 33 ao 34 - Do Acesso", "Lei 10.261/68 — Art. 35 ao 36 - Da Reversão", "Lei 10.261/68 — Art. 37 ao 38 - Do Aproveitamento", "Lei 10.261/68 — Art. 39 ao 40 - Da Readmissão", "Lei 10.261/68 — Art. 41 ao 42 - Da Readaptação", "Lei 10.261/68 — Art. 43 ao 45 - Da Remoção", "Lei 10.261/68 — Art. 46 ao 55 - Da Posse", "Lei 10.261/68 — Art. 57 ao 75 - Do Exercício", "Lei 10.261/68 — Art. 76 ao 85 - Da Contagem de Tempo de serviço", "Lei 10.261/68 — Art. 86 - Da vacância", "Lei 10.261/68 — Art. 171 a 175 - Das Acumulações Remuneradas", "Lei 10.261/68 — Art. 239 e 240 - Direito de Petição", "Lei 10.261/68 — Art. 241 a 250 - Dos deveres, proibições e responsabilidades", "Lei 10.261/68 — Art. 251 a 263 - Das penalidades , extinção de punibilidade", "Lei 10.261/68 — Art. 264 a 267 - Preliminares", "Lei 10.261/68 — Art. 267 A a 267 P - Das Práticas Autocompositivas, do TAC e da Suspensão Condicional da Sindicância", "Lei 10.261/68 — Art. 268 a 311 - Do Procedimento Disciplinar", "Lei 10.261/68 — Art. 312 a 323 - Dos Recursos e das disposições finais", "Lei 8.429/92 — Art. 1 a 8-A - Disposições Iniciais", "Lei 8.429/92 — Art. 9º - Enriquecimento Ilícito", "Lei 8.429/92 — Art. 10 - Prejuízo ao erário", "Lei 8.429/92 — Art. 11 - Contra os Princípios da Adm Pública", "Lei 8.429/92 — Art. 12 - Das penas", "Lei 8.429/92 — Art. 13 - Da declaração de bens", "Lei 8.429/92 — Art. 14 a 22 - Do Procedimento Administrativo, do Processo Judicial e das disposições penais", "Lei 8.429/92 — Art. 23 a 23-C - Da prescrição"]}, {"b": "Bloco II — Normas da Corregedoria (NSCGJ)", "s": "interna", "itens": ["Art. 5° ao 14. Corregedoria Permanente E Das Correições Ordinárias, Extraordinárias E Visitas Correcionais", "Art. 15 ao 18. Apurações Preliminares, Sindicâncias E Processos Administrativos", "Art. 26 ao 27-a - Dos Ofícios De Justiça Em Geral. Seção I - Disposições Iniciais, Das Atribuições,", "Art. 46 ao 62 - Do Sistema Informatizado Oficial - Da Segurança Do Sistema, - Do Cadastramento, Movimentação E Controle Eletrônico De Processos E Incidentes Processuais", "Art. 63 ao 74 -Dos Livros E Classificadores Obrigatórios", "Art. 75 ao 79 - Dos Classificadores Obrigatórios", "Art. 80 ao 86 - Da Escrituração", "Art. 87 ao 91 - Da Autuação, Abertura De Volumes E Numeração De Feitos", "Art. 92 a 96 - Da Recepção E Juntada De Petições, Dos Atos E Termos Judiciais E Das Cotas Nos Autos", "Art. 97 a 99 - Da Movimentação Dos Autos", "Art. 103 a 111 - Dos Papéis Em Andamento Ou Findos, Das Certidões, Dos Mandados, Dos Ofícios", "Art. 112 ao 121 - Das Comunicações Oficiais, Transmissão De Informações Processuais E Prática De Atos Processuais Por Meio Eletrônico", "Art. 121-a ao 131 - Das Informações Eletrônicas Obtidas Por Meio Do Sistema Infojud", "Art. 132 ao 141 - Das Intimações", "Art. 143 ao 149-a Das Audiências Em Geral", "Art. 150 ao 156 - Da Gravação De Audiências", "Art. 156-a Das Estações Passivas", "Art. 157 ao 169 - Da Consulta E Da Carga Dos Autos", "Art. 170 ao 175 - Do Desentranhamento De Peças E Documentos Dos Autos", "Art. 176 a -185 - Disposições Gerais E Do Arquivamento", "Art. 186 ao 187 - Do Rearquivamento", "Art. 188 ao 189 - Do Desarquivamento", "Art. 189-a ao 189-g - Da Pesquisa Histórica", "Art. 1189 ao 1195 - Do Sistema De Processamento Eletrônico", "Art. 1196 ao 1201 - Do Peticionamento Eletrônico", "Art. 1202 a 1205 - Da Indisponibilidade Do Sistema", "Art. 1206 a 1207 - Das Exceções ao Peticionamento Eletrônico", "Art. 1209 a 1.219 - Da Distribuição", "Art. 1220 ao 1222 - Do Protocolo De Petições Intermediárias", "Art. 1224 ao 1227 - Da Consulta àS Movimentações Processuais E Decisões", "Art. 1228 ao 1236 - Da Tramitação Dos Processos Eletrônicos, Das Providências Gerais", "Art. 1237 ao 1239 - Da Elaboração De Expedientes Pelo Ofício De Justiça", "Art. 1243 ao 1244 - Do Cumprimento De Ordens Judiciais, Da Publicidade De Expedientes E Movimentações", "Art. 1245 ao 1249 - Das Citações, Intimações E Notificações", "Art. 1250 ao 1255 - Da Contagem E Do Controle De Prazos", "Art. 1256 ao 1257 - Da Juntada De Petições Intermediárias", "Art. 1258 ao 1260 - Da Digitalização E Da Guarda De Petições E Documentos", "Art. 1261 ao 1262 - Da Nomeação Dos Peritos E Demais Auxiliares Da Justiça Não Serventuários E Da Entrega Dos Laudos Técnicos", "Art. 1263 ao 1264 - Das Informações Obtidas Por Meio Do Infojud, Bacenjud, Renajud E Outros Similares", "Art. 1265 ao 1271 - Da Expedição De Mandados De Levantamento, Da Prática De Atos Processuais Mediante a Utilização De Sistema De Fac Símile, Das Audiências", "Art. 1273 ao 1273-a - Dos Formais De Partilha E Cartas De Sentença", "Art. 1274 ao 1276 Das Decisões Terminativas De Notificações Interpelações E Protestos, Do Envio E Recebimento De Recursos", "Art. 1277 ao 1278 - Das Providências Adotadas Após O Julgamento Dos Agravos De Instrumento E Conflitos De Competência, Do Cadastramento De Incidentes E Ações Dependentes", "Art. 1279 ao 1280-a - Da Redistribuição De Processos Eletrônicos Da Prática De Atos Processuais Mediante a Utilização De Sistema De Fac-símile", "Art. 1281 ao 1284 Do Desentranhamento, Das Cópias Pagas De Peças Processuais De Processos Eletrônicos, Do Arquivamento E Desarquivamento", "Art. 1285 ao 1289 - Do Cumprimento De Sentença", "Art. 1290 ao 1294 - Dos Precatórios E Das Requisições De Pequeno Valor/ Do Processamento Dos Ofícios Requisitórios", "Art. 1295 ao 1299 - Do Processamento Na Capital", "Art. 1300 ao 1301 - Das Comunicações Obrigatórias à Depre"]}, {"b": "Bloco II — Legislação Interna", "s": "interna", "itens": ["Resolução TJSP nº 850/2021", "Resolução TJSP nº 963/2025", "Lei Complementar n° 1.111/ 2010", "Regimento Interno do Tribunal de Justiça - completo"]}, {"b": "Bloco III — Informática (9)", "s": "info", "itens": ["MS-Windows 10", "MS-Office 365, MS-Word", "MS-Excel 365", "Correio Eletrônico: uso de correio eletrônico, preparo e envio de mensagens, anexação de arquivos", "Internet: navegação internet, conceitos de URL, links, sites, busca e impressão de páginas.", "OneDrive: armazenamento e compartilhamento de arquivos.", "MS TEAMS", "SharePoint e OneNote (Microsoft 365) — consta no edital 2026"]}, {"b": "Bloco III — Raciocínio Lógico (7)", "s": "rl", "itens": ["Estruturas Lógicas - Conectivos e Proposições", "Estruturas Lógicas -Tabelas Verdade", "Número de Linhas da Tabela Verdade", "Estruturas Lógicas - Negação", "Negação das Proposições Categóricas", "Equivalências Lógicas", "Tautologia Contradição e Contingência", "Lógica de Argumentação", "Argumentação e Diagramas Lógicos", "Condição Necessária e Suficiente", "Sequências Lógicas", "Associação Lógica", "Verdades e Mentiras", "Calendários", "Casa dos Pombos"]}, {"b": "Bloco III — Matemática (4)", "s": "mat", "itens": ["Operações com números reais", "Mínimo múltiplo comum", "Máximo Divisor Comum", "Razão e proporção.", "Porcentagem.", "Regra de três simples", "Regra de três composta", "Média aritmética simples", "Média aritmética ponderada", "Juros simples.", "Equação do 1.º e 2.º graus.", "Sistema de equações do 1.º grau.", "Relação entre grandezas: tabelas e gráficos", "Sistemas de medidas usuais.", "Noções de geometria: forma, perímetro, área, volume, ângulo, teorema de Pitágoras.", "Resolução de situações-problema."]}, {"b": "Bloco III — Atualidades e PcD (4)", "s": "atual", "itens": ["Fatos políticos, econômicos, sociais e culturais, nacionais e internacionais (edital 2026: a partir do 1º semestre de 2026)", "Estatuto da Pessoa com Deficiência — arts. 1º ao 13 e 34 ao 38"]}];
const INCID_PORT=[["Interpretação de textos","30% a 35%","Ideia central, inferências, ironia em tirinhas e charges"],["Sinônimos e antônimos","12% a 15%","Trocar palavras do texto sem alterar o sentido"],["Conjunções / nexos","10% a 12%","Troca de conectivos mantendo o sentido (adversativas e concessivas)"],["Crase e regência","8% a 10%","Lacunas; verbos clássicos (assistir, visar, aspirar)"],["Concordância","8% a 10%","Sujeito distante, haver e fazer, 'bastante'"],["Verbos","6% a 8%","Correlação verbal e voz ativa/passiva"],["Pontuação","5% a 7%","Vírgula com adjuntos adverbiais e explicações"],["Colocação pronominal","4% a 5%","Próclise com palavras atrativas"],["Classes de palavras","2% a 3%","Função conforme o contexto"],["Figuras de linguagem","1% a 2%","Metáfora, antítese, personificação"]];
function vEdital(el){
  const all = EDITAL.reduce((n,g)=>n+g.itens.length,0), done = Object.values(S.edital).filter(Boolean).length;
  el.innerHTML = `
  <header class="ph"><div><span class="eyebrow">Edital verticalizado · Edital nº 02/2026</span><h1>O que cai na prova</h1><p>Marque os tópicos que você já estudou. Detalhamento por artigos com base na sua planilha, ajustado ao edital de 2026. Prova objetiva e redação em 14/03/2027, à tarde, com 5 horas de duração.</p></div><div class="mini-ring">${ring(done, all, 110, 10, pct(done,all)+"%", "estudado")}</div></header>
  <div class="card warn-card"><b>Atenção:</b> esta lista resume o conteúdo programático do Anexo do edital publicado em outubro de 2026. Confira sempre o edital oficial e eventuais retificações no site da Vunesp e no DJE do TJSP.</div>
  <div class="card"><div class="card-h"><h2>Português: o que a Vunesp mais cobra</h2><span class="pill">estimativa da sua planilha</span></div>
    <table class="tbl"><thead><tr><th>#</th><th>Assunto</th><th>Peso aprox.</th><th>Como cai</th></tr></thead><tbody>${INCID_PORT.map((r,i)=>`<tr><td>${i+1}º</td><td><b>${r[0]}</b></td><td>${r[1]}</td><td class="muted">${r[2]}</td></tr>`).join("")}</tbody></table></div>
  <div class="edital">${EDITAL.map((g,gi)=>{ const d=g.itens.filter((_,i)=>S.edital[gi+"-"+i]).length;
    return `<div class="card eg"><div class="card-h"><h3><i style="background:${SUBJ[g.s].cor}"></i>${g.b}</h3><span class="pill">${d}/${g.itens.length}</span></div>
    <div class="bar thin"><div style="width:${pct(d,g.itens.length)}%"></div></div>
    <ul>${g.itens.map((it,i)=>{ const k=gi+"-"+i; return `<li><label><input type="checkbox" ${S.edital[k]?"checked":""} onchange="S.edital['${k}']=this.checked;save();render()"><span>${esc(it)}</span></label></li>`; }).join("")}</ul>
    <button class="link" onclick="treinarMateria('${g.s}')" ${!poolFor(g.s).length&&!genFor(g.s)?"disabled":""}>Treinar ${SUBJ[g.s].curto} →</button></div>`; }).join("")}</div>`;
}

// ---------- teclado ----------
document.addEventListener("keydown", e=>{
  if(curView()!=="questao" || !S.sess || e.target.matches("input,textarea,select")) return;
  const k=e.key.toUpperCase(); const idx="ABCDE".indexOf(k); const n=["1","2","3","4","5"].indexOf(e.key);
  if(idx>=0 && e.key.length===1){ responder(idx); } else if(n>=0){ responder(n); }
  else if(e.key==="ArrowRight"){ if(S.sess.i<S.sess.qs.length-1) irPara(S.sess.i+1); } else if(e.key==="ArrowLeft"){ irPara(S.sess.i-1); }
});

// ---------- init ----------
loadLocal(); render(); setSync("local"); initCloud();
