// ===== MOTOR: matérias, banco, geradores =====
const SUBJ = {
  port:   {nome:"Língua Portuguesa", curto:"Português", bloco:1, cor:"#0ea5e9", ico:"✎"},
  penal:  {nome:"Direito Penal", curto:"Penal", bloco:2, cor:"#6366f1", ico:"⚖"},
  ppenal: {nome:"Direito Processual Penal", curto:"Proc. Penal", bloco:2, cor:"#8b5cf6", ico:"§"},
  pcivil: {nome:"Direito Processual Civil", curto:"Proc. Civil", bloco:2, cor:"#0891b2", ico:"§"},
  const:  {nome:"Direito Constitucional", curto:"Constitucional", bloco:2, cor:"#2563eb", ico:"★"},
  adm:    {nome:"Direito Administrativo", curto:"Administrativo", bloco:2, cor:"#0d9488", ico:"▣"},
  interna:{nome:"Legislação Interna (TJSP/NSCGJ)", curto:"Leg. Interna", bloco:2, cor:"#4f46e5", ico:"⌂"},
  atual:  {nome:"Atualidades e Est. Pessoa c/ Deficiência", curto:"Atualidades", bloco:3, cor:"#f59e0b", ico:"◎"},
  mat:    {nome:"Matemática", curto:"Matemática", bloco:3, cor:"#ec4899", ico:"∑"},
  rl:     {nome:"Raciocínio Lógico", curto:"Rac. Lógico", bloco:3, cor:"#14b8a6", ico:"⟐"},
  info:   {nome:"Informática", curto:"Informática", bloco:3, cor:"#3b82f6", ico:"⌘"}
};
// Distribuição do simulado (edital 2026: 16 + 30 + 24 = 70)
const SIM_DIST = {port:16, penal:5, ppenal:5, pcivil:6, const:5, adm:5, interna:4, atual:4, mat:4, rl:7, info:9};

function buildBank(){
  const out = [];
  const add = (arr, s) => arr.forEach((r,i)=>{
    let q = r[1], txt = null;
    const m = q.match(/^\[([tv]\d)\]\s*/); if(m){ txt = m[1]; q = q.slice(m[0].length); }
    out.push({id:s+"-"+i, s, t:r[0], q, o:r[2], a:r[3], e:r[4], txt, src:"banco"});
  });
  add(Q_PORT,"port"); add(Q_PENAL,"penal"); add(Q_PPENAL,"ppenal"); add(Q_PCIVIL,"pcivil");
  add(Q_CONST,"const"); add(Q_ADM,"adm"); add(Q_ATUAL,"atual"); add(Q_INFO,"info"); add(Q_MAT,"mat"); add(Q_RL,"rl");
  Object.assign(TEXTOS, TXT_V);
  QV.forEach((r,i)=>{ let q=r[2], txt=null; const m=q.match(/^\[([tv]\d)\]\s*/); if(m){ txt=m[1]; q=q.slice(m[0].length); }
    out.push({id:"v-"+i, s:r[0], t:r[1], q, o:r[3], a:r[4], e:r[5], ref:r[6], txt, src:"vunesp"}); });
  return out;
}

// ---------- utilidades ----------
const rnd = (a,b)=> Math.floor(Math.random()*(b-a+1))+a;
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
function hash(str){ let h=0; for(let i=0;i<str.length;i++){h=((h<<5)-h)+str.charCodeAt(i); h|=0;} return Math.abs(h).toString(36); }
const fmtBR = (n,d=2)=> n.toLocaleString("pt-BR",{minimumFractionDigits:d, maximumFractionDigits:d});
const money = n => "R$ "+fmtBR(n);
// monta questão com alternativas numéricas embaralhadas
function mkQ(s,t,q,correct,wrongs,e){
  const set = [correct]; for(const w of wrongs){ if(set.length>=5) break; if(!set.includes(w)) set.push(w); }
  let k=1; while(set.length<5){ const v = correct+" ("+(k++)+")"; set.push(v); }
  const o = shuffle(set); const a = o.indexOf(correct);
  return {id:"g-"+hash(q+o.join("|")), s, t, q, o, a, e, src:"gerada"};
}
function numWrongs(v, fmt, opts={}){
  const c = new Set(); const ints = Number.isInteger(v);
  const deltas = opts.deltas || [0.9,1.1,0.8,1.2,0.75,1.25,0.5,1.5,2];
  for(const d of shuffle(deltas)){ let w = v*d; w = ints ? Math.round(w) : Math.round(w*100)/100; if(w!==v && w>0) c.add(fmt(w)); if(c.size>=6) break; }
  if(opts.extra) opts.extra.forEach(x=>{ if(x!==v && x>0) c.add(fmt(x)); });
  return shuffle([...c]).filter(x=>x!==fmt(v));
}

// ---------- MATEMÁTICA ----------
const NOMES = ["Ana","Bruno","Carla","Diego","Elisa","Fábio","Gabriela","Heitor","Isabel","João","Larissa","Marcos","Natália","Otávio","Paula","Renato","Sílvia","Tiago"];
function genMat(){
  const T = [
    ()=>{ const v=rnd(8,60)*10, p=pick([5,10,12,15,20,25,30,35,40]); const r=v*(1-p/100);
      return mkQ("mat","Porcentagem",`Uma impressora custava ${money(v)} e foi vendida com desconto de ${p}%. O valor pago foi`,money(r),numWrongs(r,money,{extra:[v*p/100, v*(1+p/100), v-p]}),`${money(v)} × (1 − ${p}/100) = ${money(r)}.`); },
    ()=>{ const a=rnd(2,6)*10, b=pick([10,20,25,50]); const r=Math.round(a*(1+b/100)*(1-b/100)*100)/100; const base=rnd(2,9)*100;
      const fin = base*(1+b/100)*(1-b/100);
      return mkQ("mat","Porcentagem",`O preço de um serviço, inicialmente ${money(base)}, sofreu aumento de ${b}% e, no mês seguinte, redução de ${b}%. O preço final ficou`,money(fin),numWrongs(fin,money,{extra:[base, base*(1+b/100)]}),`${money(base)} × ${1+b/100} × ${1-b/100} = ${money(fin)}. Aumento e desconto de mesmo percentual não se anulam.`); },
    ()=>{ const n=rnd(3,8), d=pick([12,15,18,20,24,30,36]); let m; do{ m=rnd(2,12);}while(m===n || (n*d)%m); const r=n*d/m;
      return mkQ("mat","Regra de três (inversa)",`${n} escreventes, trabalhando no mesmo ritmo, digitalizam um lote de processos em ${d} dias. Com ${m} escreventes, no mesmo ritmo, o mesmo lote seria digitalizado em`,r+" dias",numWrongs(r,x=>x+" dias",{extra:[Math.round(d*m/n), d+(n-m), d]}),`Grandezas inversamente proporcionais: ${n} × ${d} = ${m} × x → x = ${r}.`); },
    ()=>{ const p=rnd(2,6)*10, h=rnd(2,6); let h2; do{h2=rnd(3,10);}while(h2===h); const r=p*h2/h;
      if(!Number.isInteger(r)) return genMat();
      return mkQ("mat","Regra de três (direta)",`Um servidor analisa ${p} petições em ${h} horas. Mantendo o mesmo ritmo, em ${h2} horas ele analisará`,r+" petições",numWrongs(r,x=>x+" petições",{extra:[p+h2-h, p*h/h2]}),`Diretamente proporcionais: ${p}/${h} = x/${h2} → x = ${r}.`); },
    ()=>{ const C=rnd(4,40)*500, i=pick([1,1.5,2,2.5,3]), t=rnd(3,15); const J=C*i/100*t;
      return mkQ("mat","Juros simples",`Um capital de ${money(C)} foi aplicado a juros simples de ${fmtBR(i,1)}% ao mês, durante ${t} meses. O montante ao final do período é`,money(C+J),numWrongs(C+J,money,{extra:[J, C*Math.pow(1+i/100,t)]}),`J = C·i·t = ${money(C)} × ${i/100} × ${t} = ${money(J)}; M = C + J = ${money(C+J)}.`); },
    ()=>{ const a=pick([4,6,8,9,10,12,15]); let b; do{b=pick([6,8,9,10,12,14,15,18,20]);}while(b===a); const g=(x,y)=>y?g(y,x%y):x; const l=a*b/g(a,b);
      return mkQ("mat","MMC",`Um sistema faz backup a cada ${a} dias e outro faz manutenção a cada ${b} dias. Se ambos ocorreram hoje, voltarão a coincidir pela primeira vez daqui a`,l+" dias",numWrongs(l,x=>x+" dias",{extra:[a*b, a+b, g(a,b)]}),`MMC(${a}, ${b}) = ${l}.`); },
    ()=>{ const k=[2,3,5], tot=rnd(3,20)*1000; const s=10; const parts=k.map(x=>tot*x/s); const who=rnd(0,2);
      return mkQ("mat","Divisão proporcional",`Uma gratificação de ${money(tot)} será dividida entre três servidores em partes diretamente proporcionais a 2, 3 e 5. Quem tem a parte proporcional a ${k[who]} receberá`,money(parts[who]),numWrongs(parts[who],money,{extra:parts.filter((_,i)=>i!==who).concat([tot/3])}),`Soma das partes = 10. Cada unidade vale ${money(tot/10)}; ${k[who]} × ${money(tot/10)} = ${money(parts[who])}.`); },
    ()=>{ const notas=[rnd(4,9),rnd(5,10),rnd(3,9),rnd(6,10)]; const pesos=[1,2,3,4]; const sp=notas.reduce((s,n,i)=>s+n*pesos[i],0); const r=Math.round(sp/10*100)/100; const simples=notas.reduce((a,b)=>a+b,0)/4;
      return mkQ("mat","Média ponderada",`Em quatro provas com pesos 1, 2, 3 e 4, um candidato obteve as notas ${notas.join(", ")}, respectivamente. Sua média ponderada é`,fmtBR(r),numWrongs(r,x=>fmtBR(x),{extra:[Math.round(simples*100)/100]}),`(${notas.map((n,i)=>n+"×"+pesos[i]).join(" + ")}) ÷ 10 = ${fmtBR(r)}.`); },
    ()=>{ const x=rnd(8,40), a=pick([2,3,4]), b=rnd(5,30); const r=a*x+b;
      return mkQ("mat","Equação do 1º grau",`O ${a===2?"dobro":a===3?"triplo":"quádruplo"} da quantidade de processos de uma pilha, somado a ${b}, resulta em ${r}. A pilha tem`,x+" processos",numWrongs(x,v=>v+" processos",{extra:[Math.round((r+b)/a), r-b]}),`${a}x + ${b} = ${r} → x = ${x}.`); },
    ()=>{ const h=rnd(2,7), m=rnd(2,7); if(h===m) return genMat(); const k=rnd(3,9); const tot=(h+m)*k;
      return mkQ("mat","Razão e proporção",`Em um setor com ${tot} servidores, a razão entre o número de homens e o de mulheres é ${h}/${m}. O número de mulheres é`,String(m*k),numWrongs(m*k,String,{extra:[h*k, tot-h]}),`${h}k + ${m}k = ${tot} → k = ${k}; mulheres = ${m}×${k} = ${m*k}.`); },
    ()=>{ const tr=pick([[6,8,10],[5,12,13],[9,12,15],[8,15,17],[12,16,20]]); const k=pick([1,2]);
      return mkQ("mat","Geometria — Pitágoras",`Uma escada de ${tr[2]*k} m está apoiada em um muro, com o pé a ${tr[0]*k} m da base do muro. A altura do ponto em que a escada toca o muro é de`,(tr[1]*k)+" m",numWrongs(tr[1]*k,v=>v+" m",{extra:[tr[2]*k-tr[0]*k, tr[0]*k]}),`a² = ${tr[2]*k}² − ${tr[0]*k}² → a = ${tr[1]*k} m.`); },
    ()=>{ const c=rnd(3,12), l=rnd(2,8), a=rnd(2,5); const v=c*l*a;
      return mkQ("mat","Geometria — volume",`Uma caixa-arquivo tem formato de paralelepípedo com ${c} dm de comprimento, ${l} dm de largura e ${a} dm de altura. Seu volume, em litros, é`,v+" L",numWrongs(v,x=>x+" L",{extra:[2*(c*l+c*a+l*a), c+l+a]}),`V = ${c}×${l}×${a} = ${v} dm³ = ${v} L (1 dm³ = 1 L).`); }
  ];
  return pick(T)();
}

// ---------- RACIOCÍNIO LÓGICO ----------
const PROPS = [
  ["o processo foi arquivado","o processo não foi arquivado"],["o juiz despachou","o juiz não despachou"],
  ["Carla é escrevente","Carla não é escrevente"],["o prazo venceu","o prazo não venceu"],
  ["a audiência foi adiada","a audiência não foi adiada"],["Pedro estuda","Pedro não estuda"],
  ["o sistema está fora do ar","o sistema não está fora do ar"],["chove","não chove"],
  ["Lúcia passa no concurso","Lúcia não passa no concurso"],["o réu comparece","o réu não comparece"]
];
const CATS = [["servidores","pontuais"],["escreventes","bacharéis em Direito"],["candidatos","aprovados"],["processos","digitais"],["advogados","especialistas"]];
const cap = s => s.charAt(0).toUpperCase()+s.slice(1);
function genRL(){
  const T = [
    ()=>{ // sequências
      const tipo=rnd(0,4); let seq, nxt, e;
      if(tipo===0){ const a=rnd(1,20), r=rnd(2,9); seq=[0,1,2,3,4].map(i=>a+i*r); nxt=a+5*r; e=`Progressão aritmética de razão ${r}.`; }
      else if(tipo===1){ const a=rnd(1,5), q=pick([2,3]); seq=[0,1,2,3,4].map(i=>a*Math.pow(q,i)); nxt=a*Math.pow(q,5); e=`Cada termo é o anterior × ${q}.`; }
      else if(tipo===2){ const a=rnd(1,6), b=rnd(1,6); seq=[a,b]; for(let i=2;i<6;i++) seq.push(seq[i-1]+seq[i-2]); nxt=seq.pop(); e="Cada termo é a soma dos dois anteriores."; }
      else if(tipo===3){ const s=rnd(1,4); seq=[0,1,2,3,4].map(i=>(s+i)*(s+i)); nxt=(s+5)*(s+5); e="Sequência de quadrados perfeitos consecutivos."; }
      else { const a=rnd(2,10), p=rnd(2,6), m=rnd(1,4); seq=[a]; for(let i=1;i<6;i++) seq.push(i%2? seq[i-1]+p : seq[i-1]-m); nxt=seq.pop(); e=`Alterna +${p} e −${m}.`; }
      return mkQ("rl","Sequências numéricas",`Considere a sequência: ${seq.join(", ")}, ... Mantida a lógica, o próximo termo é`,String(nxt),numWrongs(nxt,String,{deltas:[0.9,1.1,0.95,1.05,0.8,1.2],extra:[nxt+1,nxt-1,nxt+2]}),e); },
    ()=>{ const [p,np]=pick(PROPS); let q,nq; do{[q,nq]=pick(PROPS);}while(q===p);
      return mkQ("rl","Negação (De Morgan)",`A negação da afirmação “${cap(p)} e ${q}” é:`,`${cap(np)} ou ${nq}.`,[`${cap(np)} e ${nq}.`,`${cap(p)} ou ${q}.`,`Se ${p}, então ${nq}.`,`${cap(np)} e ${q}.`],"~(p ∧ q) ≡ ~p ∨ ~q."); },
    ()=>{ const [p,np]=pick(PROPS); let q,nq; do{[q,nq]=pick(PROPS);}while(q===p);
      return mkQ("rl","Negação (De Morgan)",`A negação da afirmação “${cap(p)} ou ${q}” é:`,`${cap(np)} e ${nq}.`,[`${cap(np)} ou ${nq}.`,`${cap(p)} e ${nq}.`,`Se ${np}, então ${q}.`,`${cap(p)} e ${q}.`],"~(p ∨ q) ≡ ~p ∧ ~q."); },
    ()=>{ const [p,np]=pick(PROPS); let q,nq; do{[q,nq]=pick(PROPS);}while(q===p);
      return mkQ("rl","Negação da condicional",`A negação de “Se ${p}, então ${q}” é:`,`${cap(p)} e ${nq}.`,[`Se ${np}, então ${nq}.`,`${cap(np)} e ${q}.`,`Se ${q}, então ${p}.`,`${cap(np)} ou ${q}.`],"~(p → q) ≡ p ∧ ~q."); },
    ()=>{ const [p,np]=pick(PROPS); let q,nq; do{[q,nq]=pick(PROPS);}while(q===p);
      return mkQ("rl","Equivalência lógica",`Uma afirmação equivalente a “Se ${p}, então ${q}” é:`,pick([`Se ${nq}, então ${np}.`,`${cap(np)} ou ${q}.`]),[`Se ${q}, então ${p}.`,`Se ${np}, então ${nq}.`,`${cap(p)} e ${nq}.`,`${cap(p)} ou ${nq}.`],"p → q ≡ ~q → ~p (contrapositiva) ≡ ~p ∨ q."); },
    ()=>{ const [A,B]=pick(CATS);
      return mkQ("rl","Negação de quantificadores",`A negação de “Todos os ${A} são ${B}” é:`,`Algum dos ${A} não é ${B}.`,[`Nenhum dos ${A} é ${B}.`,`Todos os ${A} não são ${B}.`,`Algum dos ${A} é ${B}.`,`Nenhum dos ${A} deixa de ser ${B}.`],"~(Todo A é B) ≡ Algum A não é B."); },
    ()=>{ const [A,B]=pick(CATS);
      return mkQ("rl","Negação de quantificadores",`A negação de “Nenhum dos ${A} é ${B}” é:`,`Algum dos ${A} é ${B}.`,[`Todos os ${A} são ${B}.`,`Algum dos ${A} não é ${B}.`,`Nenhum dos ${A} deixa de ser ${B}.`,`Todos os ${A} não são ${B}.`],"~(Nenhum A é B) ≡ Algum A é B."); },
    ()=>{ const n=pick(NOMES); const [p]=pick(PROPS);
      return mkQ("rl","Argumentação (modus tollens)",`Considere verdadeiras as afirmações: “Se ${n} se dedica, então é aprovado(a)” e “${n} não foi aprovado(a)”. Conclui-se corretamente que`,`${n} não se dedicou.`,[`${n} se dedicou.`,`${n} foi aprovado(a).`,`${n} se dedicou e não foi aprovado(a).`,`nada se pode concluir sobre a dedicação.`],"Modus tollens: p → q; ~q; logo ~p."); },
    ()=>{ const tot=rnd(40,90), a=rnd(15,35), b=rnd(15,35), ab=rnd(3,12); const nenhum=tot-(a+b-ab); if(nenhum<0) return genRL();
      return mkQ("rl","Diagramas lógicos (conjuntos)",`Em um grupo de ${tot} servidores, ${a} falam inglês, ${b} falam espanhol e ${ab} falam os dois idiomas. O número de servidores que não falam nenhum desses idiomas é`,String(nenhum),numWrongs(nenhum,String,{extra:[tot-a-b, tot-(a+b)+2*ab, ab]}),`União = ${a} + ${b} − ${ab} = ${a+b-ab}; nenhum = ${tot} − ${a+b-ab} = ${nenhum}.`); }
  ];
  return pick(T)();
}

// ---------- INFORMÁTICA (Excel) ----------
function genInfo(){
  const v=[rnd(1,20),rnd(1,20),rnd(1,20),rnd(1,20)]; const cells=["A1","A2","A3","A4"];
  const desc = `Em uma planilha do Excel (configuração padrão, em português), as células A1, A2, A3 e A4 contêm, respectivamente, os valores ${v.join(", ")}.`;
  const T=[
    ()=>{ const r=Math.max(...v)-Math.min(...v); return mkQ("info","Excel — funções",`${desc} A fórmula =MÁXIMO(A1:A4)-MÍNIMO(A1:A4) resultará em`,String(r),numWrongs(r,String,{extra:[Math.max(...v),Math.min(...v),r+1]}),`Máximo ${Math.max(...v)} − mínimo ${Math.min(...v)} = ${r}.`); },
    ()=>{ const r=v[0]+v[1]*v[2]; return mkQ("info","Excel — precedência",`${desc} A fórmula =A1+A2*A3 resultará em`,String(r),numWrongs(r,String,{extra:[(v[0]+v[1])*v[2]]}),`A multiplicação tem precedência: ${v[0]} + ${v[1]}×${v[2]} = ${r}.`); },
    ()=>{ const r=(v[0]+v[1])*v[2]; return mkQ("info","Excel — precedência",`${desc} A fórmula =(A1+A2)*A3 resultará em`,String(r),numWrongs(r,String,{extra:[v[0]+v[1]*v[2]]}),`Parênteses primeiro: (${v[0]}+${v[1]})×${v[2]} = ${r}.`); },
    ()=>{ const lim=rnd(5,15); const r=v.filter(x=>x>lim).length; return mkQ("info","Excel — CONT.SE",`${desc} A fórmula =CONT.SE(A1:A4;">${lim}") resultará em`,String(r),[String((r+1)%5),String((r+2)%5),String((r+3)%5),String((r+4)%5)],`Conta valores maiores que ${lim}: ${v.filter(x=>x>lim).join(", ")||"nenhum"} → ${r}.`); },
    ()=>{ const s=v.reduce((a,b)=>a+b,0); const r = s>40 ? "ALTO" : "BAIXO"; return mkQ("info","Excel — SE",`${desc} A fórmula =SE(SOMA(A1:A4)>40;"ALTO";"BAIXO") retornará`,r,[r==="ALTO"?"BAIXO":"ALTO","VERDADEIRO","FALSO","#VALOR!"],`SOMA = ${s}; ${s}>40 é ${s>40?"verdadeiro":"falso"} → "${r}".`); },
    ()=>{ const r=Math.round(v.reduce((a,b)=>a+b,0)/4*100)/100; return mkQ("info","Excel — MÉDIA",`${desc} A fórmula =MÉDIA(A1:A4) resultará em`,fmtBR(r).replace(/,00$/,""),numWrongs(r,x=>fmtBR(x).replace(/,00$/,""),{extra:[v.reduce((a,b)=>a+b,0)]}),`(${v.join("+")})/4 = ${fmtBR(r)}.`); },
    ()=>{ const r = v[0]%v[3]===0? 0 : v[0]%v[3]; return mkQ("info","Excel — RESTO",`${desc} A fórmula =RESTO(A1;A4) resultará em`,String(r),numWrongs(r||1,String,{extra:[Math.floor(v[0]/v[3]), r+1, 0]}).filter(x=>x!==String(r)),`RESTO(${v[0]};${v[3]}) = ${r}.`); }
  ];
  return pick(T)();
}

// ---------- LEI SECA (literalidade) ----------
const NUMW = {1:"um",2:"dois",3:"três",4:"quatro",5:"cinco",6:"seis",7:"sete",8:"oito",10:"dez",12:"doze",15:"quinze",20:"vinte",24:"vinte e quatro",25:"vinte e cinco",30:"trinta",40:"quarenta",45:"quarenta e cinco",60:"sessenta",90:"noventa",100:"cem"};
const WORDNUMS = ["um","dois","três","quatro","cinco","seis","sete","oito","dez","doze","quinze","vinte","trinta","quarenta","sessenta","cem"];
const FRAC = ["um terço","metade","terça parte","sexta parte","dois terços","dobro"];
const SWAP = [["reclusão","detenção"],["detenção","reclusão"],["e multa","ou multa"],["ou multa","e multa"],["inafiançável e imprescritível","afiançável e imprescritível"],["durante o dia","a qualquer hora"],["dias úteis","dias corridos"],["interrompem","suspendem"],["não possuem efeito suspensivo","possuem efeito suspensivo"],["não poderá desistir","poderá desistir"]];
function findTokens(txt){
  const toks=[];
  let m; const re1=/(\d+) \(([a-zà-ú\- ]+?)\)/g;
  while((m=re1.exec(txt))){ toks.push({i:m.index, s:m[0], kind:"numpar", n:+m[1]}); }
  const re2=new RegExp("\\b("+WORDNUMS.join("|")+")\\b(?=\\s+(?:a\\s+[a-zà-ú]+\\s+)?(?:anos?|meses|mês|dias?|horas|vezes|salários?|quintos|por cento|turnos))","g");
  while((m=re2.exec(txt))){ if(!toks.some(t=>m.index>=t.i && m.index<t.i+t.s.length)) toks.push({i:m.index, s:m[0], kind:"word"}); }
  const re3=new RegExp("\\b("+FRAC.join("|")+")\\b","g");
  while((m=re3.exec(txt))){ toks.push({i:m.index, s:m[0], kind:"frac"}); }
  for(const [a] of SWAP){ const k=txt.indexOf(a); if(k>=0) toks.push({i:k, s:a, kind:"swap"}); }
  return toks.sort((a,b)=>a.i-b.i);
}
function altToken(t){
  if(t.kind==="numpar"){ const keys=Object.keys(NUMW).map(Number).filter(n=>n!==t.n); const out=shuffle(keys).slice(0,6).map(n=>`${n} (${NUMW[n]})`); return out; }
  if(t.kind==="word"){ const small=["um","dois","três","quatro","cinco","seis","oito","dez","doze","quinze","vinte"]; const pool = small.includes(t.s) ? small : WORDNUMS; return shuffle(pool.filter(w=>w!==t.s)).slice(0,6); }
  if(t.kind==="frac") return shuffle(FRAC.filter(w=>w!==t.s)).slice(0,5);
  if(t.kind==="swap") return SWAP.filter(p=>p[0]===t.s).map(p=>p[1]);
  return [];
}
function snippet(txt, tok){
  // trecho: do início da frase/parágrafo que contém o token até o fim dela
  let start = 0; const cut = /(§ \d+º|Parágrafo único\.|Pena -|[IVX]+ - )/g; let m;
  while((m=cut.exec(txt))){ if(m.index<=tok.i) start=m.index; else break; }
  // se o trecho começa em "Pena -", incluir caput para contexto
  if(txt.slice(start,start+6)==="Pena -"){ const prev = txt.lastIndexOf("§", start); start = prev>=0 && prev<start ? prev : 0; }
  let end = txt.indexOf(". ", tok.i+tok.s.length); if(end<0) end = txt.length; else end+=1;
  let sn = txt.slice(start,end).trim();
  if(sn.length>420){ const s2 = Math.max(0, tok.i-200); sn = (s2>0?"(...) ":"")+txt.slice(s2, Math.min(txt.length, tok.i+220)).trim()+" (...)"; return {sn, off: (s2>0?6:0) + tok.i - s2}; }
  return {sn, off: tok.i-start - (txt.slice(start,end).length - txt.slice(start,end).trimStart().length)};
}
const doLaw = l => (/^(Lei|Constituição)/.test(l.nome)?"da ":"do ")+l.nome;
function lawsFor(subj){ return LEIS.filter(l=>l.materia===subj); }
function genLei(subj, lawId, depth=0){
  if(depth>8) return null;
  const laws = lawId ? LEIS.filter(l=>l.id===lawId) : lawsFor(subj);
  if(!laws.length) return null;
  const law = pick(laws);
  const cand = law.arts.map(a=>({a, toks:findTokens(a[2])})).filter(x=>x.toks.length);
  if(!cand.length) return null;
  const tipo = Math.random()<0.55 ? "lacuna" : "correta";
  if(tipo==="lacuna" || cand.length<5){
    const c = pick(cand); const tok = pick(c.toks); const alts = altToken(tok); if(alts.length<1) return genLei(subj, lawId, depth+1);
    const {sn, off} = snippet(c.a[2], tok);
    const pos = sn.indexOf(tok.s, Math.max(0,off-3)); if(pos<0) return genLei(subj, lawId, depth+1);
    const lac = sn.slice(0,pos)+"_____"+sn.slice(pos+tok.s.length);
    const opts = [tok.s, ...alts.slice(0,4)];
    while(opts.length<5){ const f = pick(["três","sete","quinze","vinte","sessenta","cem"]); if(!opts.includes(f)) opts.push(f); }
    const q = mkQ(law.materia, `Lei seca — ${law.sigla}, art. ${c.a[0]}`, `Nos termos ${doLaw(law)}, art. ${c.a[0]} (${c.a[1]}), assinale a alternativa que preenche corretamente a lacuna:\n\n“${lac}”`, tok.s, opts.slice(1), `Texto legal: “${sn}”`);
    q.lei = {law:law.id, art:c.a[0]}; return q;
  }
  // "Assinale a correta": 1 trecho verdadeiro + 4 adulterados
  const picks = shuffle(cand).slice(0,5);
  const opts = picks.map((c,i)=>{ const tok=pick(c.toks); const {sn,off}=snippet(c.a[2],tok); const pos=sn.indexOf(tok.s, Math.max(0,off-3));
    if(i===0 || pos<0) return {t:`Art. ${c.a[0]}: ${sn}`, ok:i===0 && pos>=0, src:sn};
    const alt = pick(altToken(tok)) || tok.s; return {t:`Art. ${c.a[0]}: ${sn.slice(0,pos)+alt+sn.slice(pos+tok.s.length)}`, ok:false, src:sn, wrong:`“${alt}” no lugar de “${tok.s}”`}; });
  if(!opts[0].ok || opts.slice(1).some(o=>o.t.endsWith(o.src))) return genLei(subj, lawId, depth+1);
  const correct = opts[0].t;
  const exp = "Correta: "+correct+"\n\nErros nas demais: "+opts.slice(1).map(o=>o.t.split(":")[0]+" — "+o.wrong).join("; ")+".";
  const q = mkQ(law.materia, `Lei seca — ${law.sigla}`, `De acordo com a literalidade ${doLaw(law)}, assinale a alternativa correta.`, correct, opts.slice(1).map(o=>o.t), exp);
  q.lei = {law:law.id}; return q;
}

function genFor(subj){
  if(subj==="mat") return genMat();
  if(subj==="rl") return genRL();
  if(subj==="info") return genInfo();
  if(["penal","ppenal","pcivil","const","adm","atual"].includes(subj)) return genLei(subj);
  return null;
}
