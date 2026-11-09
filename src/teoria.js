// ===== TEORIA — resumos por matéria/assunto =====
// Formato: [titulo, chaveDoAssunto (para treinar), corpo em mini-markdown]
// Mini-markdown: "- " lista · "| a | b |" tabela (1ª linha = cabeçalho) · "! " dica/pegadinha · "> " texto legal · **negrito** · linha vazia = parágrafo
const TEORIA = {
port: [
["Interpretação de textos (30% a 35% da prova)","Interpretação de texto",`A Vunesp cobra principalmente **o que o texto diz** e **o que se pode concluir** a partir dele. Leia as alternativas desconfiando de exageros.
- **Informação explícita:** está escrita no texto; procure a frase que comprova.
- **Inferência:** conclusão lógica a partir do texto — não é opinião sua, nem conhecimento externo.
- **Ponto de vista do autor:** observe adjetivos, advérbios ("evidentemente", "infelizmente") e a conclusão do texto.
- **Tirinhas e charges:** humor costuma vir da quebra de expectativa ou da ironia entre o que é dito e o que é mostrado.
! Desconfie de alternativas com palavras absolutas: "sempre", "nunca", "totalmente", "apenas", "exclusivamente". Normalmente extrapolam o texto.
! Alternativa "verdadeira, mas que não está no texto" é ERRADA em questão de interpretação.`],
["Sinônimos, antônimos e sentido contextual (12% a 15%)","Sinônimos",`O sentido de uma palavra depende do **contexto**. A Vunesp pede para substituir um termo "sem alteração de sentido".
- Teste a troca na própria frase do texto: o sentido e a gramática continuam corretos?
- **Sentido próprio (denotativo):** literal, de dicionário. **Sentido figurado (conotativo):** simbólico ("as avenidas cortaram os bairros").
| Palavra | Sentido | Cuidado com |
| ratificar | confirmar | retificar = corrigir |
| iminente | prestes a acontecer | eminente = elevado, ilustre |
| infringir | violar (lei) | infligir = aplicar (pena) |
| mandado | ordem judicial | mandato = procuração, período |
| deferir | conceder | diferir = adiar, divergir |
! Figuras de linguagem que mais caem: metáfora (comparação implícita), antítese (ideias opostas), personificação (características humanas a seres inanimados), ironia.`],
["Conjunções e nexos (10% a 12%)","Conjunções",`A questão clássica: trocar o conectivo **mantendo a relação de sentido**.
| Relação | Conectivos |
| Adversativa (oposição) | mas, porém, contudo, todavia, entretanto, no entanto |
| Concessiva (oposição que não impede) | embora, ainda que, mesmo que, conquanto, apesar de |
| Conclusiva | logo, portanto, por isso, assim, pois (após o verbo) |
| Explicativa / causal | pois (antes do verbo), porque, porquanto, já que, visto que, uma vez que |
| Condicional | se, caso, desde que, contanto que |
| Final | para que, a fim de que |
| Proporcional | à medida que, à proporção que, quanto mais... mais |
| Temporal | quando, enquanto, assim que, logo que |
! "Embora" exige verbo no **subjuntivo** ("Embora enfrentem"). Ao trocar "mas" por "embora", a frase muda de estrutura.
! "À medida que" = proporção; "na medida em que" = causa. Não confunda.`],
["Crase (8% a 10%, junto com regência)","Crase",`Crase = fusão da preposição **a** com o artigo **a** (ou com "aquele/aquela/aquilo", "a qual").
**Teste prático:** troque a palavra feminina por uma masculina. Se aparecer **"ao"**, há crase. (Fui à secretaria → Fui ao cartório.)
- **Obrigatória:** locuções femininas (às vezes, à noite, à medida que), horas exatas (às 14h), "à moda de" (bife à milanesa).
- **Proibida:** antes de masculino, verbo, pronomes pessoais e de tratamento (a ela, a Vossa Excelência), artigo indefinido (a uma), palavras repetidas (frente a frente, cara a cara), "a" singular antes de plural (a pessoas).
- **Facultativa:** antes de pronome possessivo feminino singular (a/à minha sala), nomes próprios femininos (a/à Maria), depois de "até" (até a/à porta).
! "Casa" (lar) e "terra" (chão firme) sem determinante não levam crase: "Voltei a casa." Com determinante, levam: "Voltei à casa dos meus pais."
! Paralelismo: "das 9h **às** 17h", mas "de 9h **a** 17h".`],
["Regência verbal e nominal","Regência",`Regência é a relação entre um termo e seu complemento (com ou sem preposição).
| Verbo | Sentido | Regência |
| assistir | ver, presenciar | assistir **a** (assisti ao julgamento) |
| assistir | ajudar, dar assistência | assistir **o** (o médico assistiu o paciente) |
| visar | ter como objetivo | visar **a** (visa ao cargo) |
| visar | mirar / dar visto | visar **o** (visou o alvo; visou o cheque) |
| aspirar | desejar | aspirar **a** |
| aspirar | inalar | aspirar **o** |
| obedecer / desobedecer | — | **a** (obedecer às normas) |
| preferir | — | preferir **algo a algo** (nunca "mais... do que") |
| implicar | acarretar | implicar **algo** (sem "em") |
| chegar / ir | movimento | **a** (cheguei ao fórum — não "no fórum") |
| esquecer / lembrar | — | esquecer **algo** ou esquecer-**se de** algo |
- **Nominal:** favorável **a**, apto **a/para**, ansioso **por/para**, passível **de**, alheio **a**, aversão **a**, contrário **a**.
! Pronome relativo herda a preposição do verbo: "O cargo **a que** aspiro"; "o juiz **de cuja** decisão discordo". "Cujo" nunca leva artigo depois ("cujo o" é erro).`],
["Concordância verbal e nominal (8% a 10%)","Concordância",`**Verbal:** o verbo concorda com o sujeito — mesmo quando ele está distante ou depois do verbo.
- **Haver** no sentido de existir/acontecer/tempo decorrido é **impessoal** (sempre singular): "Havia muitos processos", "Deve haver soluções".
- **Fazer** indicando tempo é impessoal: "Faz dois anos".
- **Existir, ocorrer, faltar, bastar** concordam normalmente: "Existem vários processos", "Faltavam três documentos".
- **Voz passiva sintética (VTD + se):** o verbo concorda: "Vendem-se casas", "Consertam-se computadores".
- **Índice de indeterminação (VTI/VI + se):** singular: "Precisa-se de escreventes", "Trata-se de questões".
- "Mais de um" → singular; "um dos que" → plural (preferencial); "Fui **eu** que redigi" / "Fui eu quem redigiu".
**Nominal:**
- **Bastante:** adjetivo (= muitos) varia ("bastantes pessoas"); advérbio (= muito) não varia ("estão bastante cansados").
- **Meio:** advérbio (= um pouco) não varia ("meio cansada"); numeral varia ("meia hora").
- **Anexo, incluso, mesmo, obrigado, quite:** variam ("seguem anexas as cópias", "elas mesmas").
- **É proibido / é necessário / é bom:** invariáveis sem artigo ("É proibido entrada"); com artigo, variam ("É proibida a entrada").
! Pegadinha favorita: sujeito posposto ou longe do verbo. Encontre o sujeito perguntando "o que/quem + verbo?".`],
["Verbos: tempos, modos e vozes (6% a 8%)","Verbos",`- **Correlação verbal:** "Se eu **mudasse**, eu **faria**" (pretérito imperfeito do subjuntivo + futuro do pretérito). "Se eu **mudar**, eu **farei**" (futuro do subjuntivo + futuro do presente).
- **Futuro do subjuntivo de verbos irregulares (muito cobrado):** ver → **vir**; vir → **vier**; pôr → **puser**; propor → **propuser**; manter → **mantiver**; intervir → **intervier**; fazer → **fizer**; requerer → **requerer** (regular nessa forma: "se ele requerer").
- **Requerer:** eu requeiro, que eu requeira. **Intervir** segue vir: eu intervim, ele interveio.
- **Voz ativa → passiva analítica:** o objeto direto vira sujeito e o verbo vira "ser + particípio", **mantendo o tempo**: "O oficial cumpriu o mandado" → "O mandado **foi cumprido** pelo oficial".
! Para transpor a voz, o verbo precisa ser transitivo direto. Confira o tempo verbal do "ser": cumpriu → foi cumprido; cumpria → era cumprido; cumprirá → será cumprido.`],
["Pontuação (5% a 7%)","Pontuação",`**Nunca separe com vírgula:** sujeito do verbo, verbo do complemento, nome do seu complemento.
**Use vírgula para:**
- isolar **aposto** e **vocativo** ("São Paulo, a maior cidade do país, ..."; "Senhores, atenção");
- isolar **adjunto adverbial deslocado** (facultativa se curto, obrigatória se longo);
- isolar **orações adjetivas explicativas** ("Os autos, que estavam na mesa, foram arquivados" = todos os autos);
- separar orações coordenadas assindéticas e antes de "mas", "porém";
- isolar conjunções deslocadas ("O juiz decidiu, **pois**, que...").
- **Ponto e vírgula:** separa orações coordenadas extensas ou de estrutura paralela.
- **Dois-pontos:** anuncia explicação, enumeração, citação ou conclusão.
! Restritiva x explicativa: "Os servidores **que chegaram cedo** foram elogiados" (só alguns) ≠ "Os servidores, **que chegaram cedo**, foram elogiados" (todos).`],
["Colocação pronominal (4% a 5%)","Colocação pronominal",`**Próclise (pronome antes do verbo)** é obrigatória com palavras atrativas:
- palavras negativas: não, nunca, jamais, ninguém, nada;
- pronomes relativos, indefinidos e interrogativos: que, quem, tudo, alguém, qual;
- conjunções subordinativas: se, quando, embora, porque, que;
- advérbios sem vírgula depois: aqui, ontem, sempre, já.
**Ênclise (depois do verbo):** início de frase ("Disseram-me"), após vírgula, com imperativo afirmativo e com gerúndio.
**Mesóclise:** futuro do presente e do pretérito sem palavra atrativa ("Far-se-á", "Dir-lhe-ia").
! Nunca inicie frase com pronome oblíquo átono ("Me disseram" está errado na norma-padrão). Nunca use ênclise com futuro ("Farei-te" é erro).`],
["Classes de palavras (2% a 3%)","Classes de palavras",`A Vunesp pede a **função no contexto**, não a classificação de dicionário.
- **Substantivo** nomeia; **adjetivo** caracteriza o substantivo; **advérbio** modifica verbo, adjetivo ou outro advérbio (invariável).
- "Ele fala **alto**" (advérbio) × "Ele é **alto**" (adjetivo).
- Infinitivo pode virar substantivo: "**Esperar** não significa paralisar-se" (sujeito).
- **Que:** pronome relativo (= o qual), conjunção integrante (introduz oração substantiva), intensificador ("Que decisão justa!").
- **Cujo:** pronome relativo de posse, concorda com o possuído.`]
],
penal: [
["Conceito de funcionário público (art. 327)","Crimes de funcionário público (312 a 327)",`> Considera-se funcionário público, para os efeitos penais, quem, embora transitoriamente ou sem remuneração, exerce cargo, emprego ou função pública.
- **Equiparado (§ 1º):** quem trabalha em entidade paraestatal e em empresa prestadora de serviço **contratada ou conveniada** para executar **atividade típica** da Administração.
- **Aumento de 1/3 (§ 2º):** ocupantes de **cargo em comissão** ou **função de direção ou assessoramento**.
! Não precisa de remuneração nem de vínculo permanente. Jurado e mesário são funcionários públicos para fins penais.`],
["Crimes de funcionário público contra a Administração","Crimes de funcionário público (312 a 327)",`| Crime | Verbo-chave | Pena |
| Peculato (312) | apropriar-se / desviar bem que tem a posse em razão do cargo | reclusão 2 a 12 anos + multa |
| Peculato culposo (312, § 2º) | concorre culposamente para crime de outrem | detenção 3 meses a 1 ano |
| Peculato mediante erro de outrem (313) | apropriar-se do que recebeu por erro | reclusão 1 a 4 anos + multa |
| Inserção de dados falsos (313-A) | inserir dados falsos em sistema | reclusão 2 a 12 anos + multa |
| Concussão (316) | **exigir** vantagem indevida | reclusão 2 a 12 anos + multa |
| Excesso de exação (316, § 1º) | exigir tributo indevido / cobrança vexatória | reclusão 3 a 8 anos + multa |
| Corrupção passiva (317) | **solicitar, receber ou aceitar promessa** | reclusão 2 a 12 anos + multa |
| Corrupção passiva privilegiada (317, § 2º) | cede a **pedido ou influência** de outrem | detenção 3 meses a 1 ano ou multa |
| Prevaricação (319) | retardar/deixar de praticar ato **para satisfazer interesse ou sentimento pessoal** | detenção 3 meses a 1 ano + multa |
| Condescendência criminosa (320) | deixar, **por indulgência**, de responsabilizar subordinado | detenção 15 dias a 1 mês ou multa |
| Advocacia administrativa (321) | patrocinar interesse privado valendo-se da qualidade de funcionário | detenção 1 a 3 meses ou multa |
| Violência arbitrária (322) | praticar violência no exercício da função | detenção 6 meses a 3 anos |
| Abandono de função (323) | abandonar cargo | detenção 15 dias a 1 mês ou multa |
| Violação de sigilo funcional (325) | revelar fato que deva ficar em segredo | detenção 6 meses a 2 anos ou multa |
! **Peculato culposo:** reparação do dano **antes da sentença irrecorrível extingue a punibilidade**; depois, **reduz de metade** a pena.
! Concussão = EXIGIR (imposição). Corrupção passiva = SOLICITAR/RECEBER/ACEITAR. Corrupção ativa (particular) = OFERECER/PROMETER.
! Corrupção passiva tem aumento de **1/3** se o funcionário retarda, deixa de praticar ou pratica o ato infringindo dever.`],
["Crimes praticados por particular","Crimes de particular (328 a 337)",`| Crime | Conduta | Pena |
| Usurpação de função (328) | usurpar o exercício de função pública | detenção 3 meses a 2 anos + multa (com vantagem: reclusão 2 a 5) |
| Resistência (329) | opor-se a ato legal **com violência ou ameaça** | detenção 2 meses a 2 anos (se o ato não se executa: reclusão 1 a 3) |
| Desobediência (330) | desobedecer ordem legal | detenção 15 dias a 6 meses + multa |
| Desacato (331) | desacatar funcionário no exercício da função | detenção 6 meses a 2 anos ou multa |
| Tráfico de influência (332) | obter vantagem **a pretexto de influir** em ato de funcionário | reclusão 2 a 5 anos + multa |
| Corrupção ativa (333) | **oferecer ou prometer** vantagem a funcionário | reclusão 2 a 12 anos + multa |
| Subtração de livro ou documento (337) | subtrair/inutilizar livro oficial, processo ou documento | reclusão 2 a 5 anos |
! Tráfico de influência: pena aumenta da **metade** se o agente alega que a vantagem também vai para o funcionário.
! Resistência exige violência ou ameaça. Sem isso, é desobediência.`],
["Crimes contra a administração da justiça","Contra a administração da justiça (339 a 359)",`| Crime | Conduta | Pena |
| Denunciação caluniosa (339) | dar causa a investigação/processo imputando crime a quem sabe inocente | reclusão 2 a 8 anos + multa |
| Comunicação falsa de crime (340) | comunicar crime que sabe não ter ocorrido | detenção 1 a 6 meses ou multa |
| Autoacusação falsa (341) | acusar-se de crime inexistente ou de outrem | detenção 3 meses a 2 anos ou multa |
| Falso testemunho (342) | afirmação falsa, negar ou calar a verdade | reclusão 2 a 4 anos + multa |
| Coação no curso do processo (344) | violência ou grave ameaça contra quem atua no processo | reclusão 1 a 4 anos + multa |
| Exercício arbitrário (345) | fazer justiça pelas próprias mãos | detenção 15 dias a 1 mês ou multa |
| Fraude processual (347) | inovar artificiosamente estado de lugar, coisa ou pessoa | detenção 3 meses a 2 anos + multa |
| Exploração de prestígio (357) | solicitar/receber a pretexto de influir em juiz, jurado, MP, perito, testemunha | reclusão 1 a 5 anos + multa |
! **Falso testemunho:** deixa de ser punível se, **antes da sentença** no processo em que ocorreu, o agente se retrata ou declara a verdade.
! **Exercício arbitrário sem violência:** só se procede mediante **queixa**.
! **Fraude processual em processo penal:** pena **em dobro**, ainda que o processo não tenha começado.
! Tráfico de influência (332) = influir em **funcionário**. Exploração de prestígio (357) = influir em **juiz, jurado, MP, perito, testemunha**.`],
["Falsidades (arts. 293 a 311-A)","Falsidades (arts. 293 a 311-A)",`- **Falsificação de documento público (297):** reclusão 2 a 6 anos + multa. Se funcionário público se prevalece do cargo: aumento de 1/6.
- **Equiparam-se a documento público:** o emanado de entidade paraestatal, título ao portador ou transmissível por endosso, ações de sociedade comercial, livros mercantis e **testamento particular**.
- **Falsificação de documento particular (298):** reclusão 1 a 5 anos + multa. **Cartão de crédito ou débito** equipara-se a documento particular.
- **Falsidade ideológica (299):** documento verdadeiro na forma, mas com conteúdo falso. Reclusão 1 a 5 (público) ou 1 a 3 (particular).
- **Uso de documento falso (304):** mesma pena da falsificação.
- **Falsa identidade (307):** detenção 3 meses a 1 ano ou multa.
- **Fraudes em certames (311-A):** divulgar conteúdo sigiloso de concurso: reclusão 1 a 4 anos + multa.
! Material x ideológica: na **material** o documento é forjado/alterado; na **ideológica** a forma é verdadeira, o conteúdo é mentiroso.`]
],
ppenal: [
["Sujeitos processuais (arts. 251 a 274)","Sujeitos processuais",`- **Impedimento do juiz (252):** atuou no processo como defensor, MP, autoridade policial, perito ou **testemunha**; parente (até 3º grau) atuou; ele ou parente é parte ou interessado.
- **Suspeição (254):** amigo íntimo ou inimigo capital, aconselhou a parte, é credor/devedor, etc.
- **Defensor (261):** nenhum acusado, ainda que **ausente ou foragido**, será processado ou julgado sem defensor.
- **Defensor dativo (263):** nomeado pelo juiz; o acusado pode trocar a qualquer tempo; quem **não for pobre** paga honorários.
- **Abandono pelo defensor (265):** só por motivo imperioso comunicado previamente ao juiz, sob pena de multa de **10 a 100 salários mínimos**.
- Constituição de defensor independe de procuração se indicado no **interrogatório** (266).
- Regras de suspeição aplicam-se aos **serventuários e funcionários da justiça** (274).`],
["Citação e intimação (arts. 351 a 372)","Citação e intimação",`| Situação | Forma |
| Réu no território do juiz | mandado |
| Réu em outra comarca | carta precatória |
| Réu preso | pessoalmente |
| Réu não encontrado | edital, prazo de **15 dias** |
| Réu que se oculta | **hora certa** (forma do CPC) |
| Réu no estrangeiro em lugar sabido | carta rogatória (suspende a prescrição) |
- **Art. 366:** citado **por edital**, não comparece nem constitui advogado → **suspendem-se o processo e o prazo prescricional**.
- **Art. 367:** citado/intimado **pessoalmente** que não comparece → processo segue sem ele (revelia).
- **Intimação:** defensor **constituído** e advogado do querelante → publicação no órgão oficial. **MP e defensor nomeado → pessoal**.
! Na hora certa, se o réu não comparece, nomeia-se **defensor dativo** e o processo segue (não suspende).`],
["Procedimento comum (ordinário e sumário)","Procedimento ordinário",`| | Ordinário | Sumário |
| Cabimento | pena máxima **≥ 4 anos** | pena máxima **< 4 anos** |
| Resposta à acusação | 10 dias | 10 dias |
| Audiência | até **60 dias** | até **30 dias** |
| Testemunhas por parte | até **8** | até **5** |
| Alegações orais | 20 min + 10 | 20 min + 10 |
- **Sumaríssimo:** infrações de menor potencial ofensivo (JECrim).
- **Rejeição da denúncia (395):** inépcia, falta de pressuposto/condição, falta de justa causa.
- **Absolvição sumária (397):** excludente de ilicitude manifesta; excludente de culpabilidade (salvo inimputabilidade); fato evidentemente não é crime; extinção da punibilidade.
- **Ordem da audiência (400):** ofendido → testemunhas da acusação → da defesa → peritos → acareações → reconhecimento → **interrogatório por último**.
- Memoriais: 5 dias sucessivos; sentença em 10 dias.
! Inépcia é **rejeição**, não absolvição sumária. Inimputabilidade **não** gera absolvição sumária (precisa de instrução para medida de segurança).`],
["Tribunal do Júri (arts. 406 a 497)","Tribunal do Júri",`- **1ª fase (sumário da culpa):** resposta em 10 dias; procedimento concluído em até 90 dias.
- Decisões ao final: **pronúncia** (há indícios → vai a júri), **impronúncia** (não há indícios suficientes), **absolvição sumária**, **desclassificação**.
- **Composição:** 1 juiz presidente + **25 jurados** sorteados; **7** formam o Conselho de Sentença.
- Instalação da sessão: mínimo de **15 jurados** presentes.
- **Recusas imotivadas:** até **3** por parte.
- **Debates:** 1h30 para acusação e 1h30 para defesa; réplica 1h e tréplica 1h. Mais de um réu: +1h e réplica/tréplica em dobro.
- Rol de testemunhas para o plenário: até **5**.
! Da **pronúncia** cabe **RESE**. Da **impronúncia** e da absolvição sumária cabe **apelação**.`],
["Recursos no processo penal","Recursos e RESE",`| Recurso | Prazo |
| RESE (581) | **5 dias**; razões em 2 dias; juízo de retratação em 2 dias |
| Apelação (593) | **5 dias**; razões em 8 dias (3 em contravenção) |
| Apelação do ofendido não habilitado (598) | **15 dias** após terminar o prazo do MP |
| Embargos de declaração (619) | **2 dias** |
| Embargos infringentes e de nulidade (609) | **10 dias** (decisão não unânime e desfavorável ao réu) |
| Carta testemunhável (640) | **48 horas** |
| JECrim — apelação (82) | **10 dias**, com razões |
- **MP não pode desistir** de recurso interposto (576).
- **Fungibilidade (579):** salvo má-fé, um recurso pelo outro não prejudica.
- **Reformatio in pejus (617):** recurso só do réu não pode piorar a pena.
- **Apelação contra decisão do júri:** nulidade posterior à pronúncia; sentença contrária à lei ou aos jurados; erro na pena; decisão **manifestamente contrária à prova** (só uma vez pelo mesmo motivo).
- **Revisão criminal (621/622):** a qualquer tempo, antes ou depois de extinta a pena; nunca agrava a pena.
- **Habeas corpus (647/654):** violência ou coação ilegal à liberdade de locomoção; qualquer pessoa pode impetrar; não cabe em punição disciplinar.`],
["JECrim — Lei 9.099/95 (arts. 60 a 89)","JECrim (Lei 9.099/95)",`- **Menor potencial ofensivo (61):** contravenções e crimes com pena máxima **não superior a 2 anos**, cumulada ou não com multa.
- **Critérios (62):** oralidade, simplicidade, informalidade, economia processual e celeridade.
- **Competência (63):** lugar da infração.
- **Termo circunstanciado (69):** se o autor vai ao juizado ou se compromete a ir, **não há flagrante nem fiança**.
- **Composição civil (74):** homologada, vira título executivo; em ação privada ou condicionada, gera **renúncia** à queixa/representação.
- **Transação penal (76):** pena restritiva ou multa; **não gera reincidência**; impede novo benefício por **5 anos**; não consta de antecedentes.
- **Representação (88):** lesões corporais **leves** e **culposas**.
- **Suspensão condicional do processo (89):** pena **mínima ≤ 1 ano**; período de prova de **2 a 4 anos**; não corre prescrição.
- **Recursos:** apelação em 10 dias julgada por turma de 3 juízes de 1º grau; embargos de declaração em 5 dias.
! Transação penal olha a pena **máxima** (≤ 2 anos). Suspensão condicional olha a pena **mínima** (≤ 1 ano).`]
],
pcivil: [
["Impedimento, suspeição e auxiliares da justiça","Impedimento e suspeição",`- **Impedimento (144):** objetivo, gera nulidade absoluta. Ex.: parente até o **3º grau** atuando como advogado; o juiz atuou como advogado ou testemunha.
- **Suspeição (145):** subjetivo (amigo íntimo, inimigo, credor, interessado). O juiz pode se declarar suspeito por **foro íntimo sem declarar as razões**.
- Prazo para alegar: **15 dias** do conhecimento do fato, em petição específica.
- **Auxiliares da justiça (149):** escrivão, chefe de secretaria, oficial de justiça, perito, depositário, administrador, intérprete, tradutor, mediador, conciliador, partidor, distribuidor, contabilista, regulador de avarias. **MP não é auxiliar.**
- **Escrivão (152):** redige ofícios, mandados e cartas; faz citações/intimações; guarda os autos; **fornece certidão independentemente de despacho**; pratica **atos meramente ordinatórios**.
- Ordem cronológica **preferencial** para publicação (153).
- **Responsabilidade (155):** escrivão, chefe de secretaria e oficial respondem civil e regressivamente se recusarem sem justo motivo cumprir no prazo ou praticarem ato nulo com dolo ou culpa.`],
["Atos processuais, tempo e prazos","Tempo, lugar e prazos",`- **Instrumentalidade das formas (188):** ato válido se atingir a finalidade.
- **Segredo de justiça (189):** interesse público; família (casamento, divórcio, união estável, filiação, alimentos, guarda); intimidade; arbitragem confidencial.
- Atos **meramente ordinatórios** (juntada, vista) independem de despacho (203, § 4º).
| Regra | Prazo |
| Horário dos atos | dias úteis, **6h às 20h** |
| Peticionamento eletrônico | até **24h** do último dia |
| Prazo sem previsão legal ou judicial (parte) | **5 dias** |
| Comparecimento sem prazo fixado | após **48 horas** |
| Contagem | **somente dias úteis** (prazos processuais) |
| Recesso de prazos | **20/12 a 20/01**, inclusive |
| Prorrogação (difícil transporte) | até **2 meses** |
| Juiz | despacho 5 · interlocutória 10 · sentença 30 dias |
| Serventuário | conclusão em **1 dia** · atos em **5 dias** |
| Litisconsortes com advogados distintos | prazo em **dobro** (não vale em autos eletrônicos) |
- Prazo conta-se **excluindo o dia do começo e incluindo o do vencimento**.
- Citações, intimações e penhoras podem ocorrer em férias e feriados.
! Juiz não pode reduzir prazo peremptório sem anuência das partes.`],
["Citação, cartas e intimações","Citação",`- **Citação (238):** convoca réu, executado ou interessado para integrar a relação processual.
- **Comparecimento espontâneo** supre a falta de citação.
- **Efeitos da citação válida (240):** induz litispendência, torna litigiosa a coisa, constitui em mora — mesmo se ordenada por juízo incompetente.
- **Preferencialmente eletrônica (246):** em até **2 dias úteis** da decisão; sem confirmação em **3 dias úteis** → correio, oficial, escrivão ou edital.
- **Não se cita (244):** quem está em culto religioso; cônjuge/parente do morto no dia e nos **7 dias** seguintes; noivos nos **3 primeiros dias** após o casamento; doente em estado grave.
- **Hora certa (252):** **2 tentativas** + suspeita de ocultação → avisa familiar/vizinho que voltará no **dia útil imediato**. Depois, o escrivão envia carta em **10 dias**.
- **Edital (256/257):** réu desconhecido ou em local ignorado/inacessível; prazo de **20 a 60 dias**. Edital doloso: multa de **5 salários mínimos**.
- **Cartas (237):** de ordem (tribunal → juiz vinculado), rogatória (exterior), precatória (outra comarca), arbitral.
- **Recusa de precatória (267):** falta de requisitos, incompetência em razão da matéria ou hierarquia, dúvida sobre autenticidade.
- **Intimação (269):** dá ciência dos atos. Presume-se válida no endereço dos autos se a mudança não foi comunicada (274).`],
["Tutela provisória (arts. 294 a 311)","Tutela provisória",`| Espécie | Requisitos |
| Urgência (cautelar ou antecipada) | **probabilidade do direito + perigo de dano ou risco ao resultado útil** |
| Evidência | independe de perigo: abuso do direito de defesa; tese em repetitivo/súmula vinculante + prova documental; contrato de depósito; prova documental sem dúvida razoável |
- Pode ser **antecedente ou incidental**; a incidental não paga custas.
- Pode exigir **caução**, dispensada para hipossuficiente.
- Antecipada **não** é concedida se houver **perigo de irreversibilidade**.
- **Antecipada antecedente:** aditar a inicial em **15 dias**. Se não houver recurso, ela **estabiliza**; ação para rever em **2 anos**; não faz coisa julgada.
- **Cautelar antecedente:** réu contesta em **5 dias**; pedido principal em **30 dias** após efetivada.
! Liminar na tutela de evidência só nos incisos II e III (tese firmada e contrato de depósito).`],
["Procedimento comum: da inicial à sentença","Petição inicial e conciliação",`| Ato | Prazo |
| Emenda da inicial | **15 dias** |
| Retratação após apelação contra indeferimento | **5 dias** |
| Audiência de conciliação | antecedência mínima de **30 dias**; réu citado com **20 dias** |
| Desinteresse do réu na audiência | petição com **10 dias** de antecedência |
| Falta injustificada à audiência | multa de até **2%** (ato atentatório) |
| Contestação | **15 dias** |
| Réplica | 15 dias |
| Rol de testemunhas | até 15 dias; máximo **10** (3 por fato) |
| Debates orais | **20 min + 10** |
| Sentença após audiência | **30 dias** |
- **Revelia (344):** presumem-se verdadeiros os fatos. **Não** ocorre se: outro réu contestou; direito indisponível; falta documento indispensável; alegações inverossímeis.
- **Ônus da prova (373):** autor = fato constitutivo; réu = impeditivo, modificativo ou extintivo.
- **Sem mérito (485):** abandono pelo autor por mais de **30 dias**; paralisação por mais de **1 ano**; após contestação, desistência exige anuência do réu.
- **Sentença (489):** relatório, fundamentos e dispositivo.
- **Remessa necessária (496):** dispensada abaixo de 1.000 SM (União), **500 SM (Estados)**, 100 SM (Municípios).
- **Cumprimento (523):** pagar em 15 dias, senão multa de **10% + honorários de 10%**. Alimentos (528): 3 dias; prisão de **1 a 3 meses**.`],
["Recursos cíveis (arts. 994 a 1.026)","Recursos — disposições gerais",`- **Rol (994):** apelação, agravo de instrumento, agravo interno, embargos de declaração, recurso ordinário, especial, extraordinário, agravo em RE/REsp, embargos de divergência. **Não existem mais embargos infringentes.**
- **Prazo geral: 15 dias** (exceto embargos de declaração: **5 dias**).
- **Despachos não têm recurso.** Desistência do recurso independe de anuência do recorrido.
- **Recurso adesivo:** cabe na apelação, RE e REsp; cai se o principal for desistido ou inadmitido.
- **Preparo não comprovado:** recolher **em dobro**.
- **Apelação:** tem efeito suspensivo, **exceto** (1.012, § 1º): divisão/demarcação, **alimentos**, embargos do executado improcedentes, arbitragem, **tutela provisória**, interdição.
- **Agravo de instrumento (1.015):** tutela provisória, mérito, arbitragem, desconsideração da PJ, gratuidade, exibição de documento, exclusão de litisconsorte, intervenção de terceiros, efeito suspensivo a embargos, redistribuição do ônus da prova; e decisões em liquidação, cumprimento, execução e inventário. Juntada de cópia nos autos físicos em **3 dias**.
- **Agravo interno:** contra decisão do relator; inadmissível/improcedente por unanimidade → multa de **1% a 5%**.
- **Embargos de declaração:** obscuridade, contradição, omissão, erro material; **5 dias**, sem preparo; **interrompem** o prazo; protelatórios → multa até **2%**, reiteração até **10%**.`],
["Juizados Especiais Cíveis e da Fazenda Pública","Juizado Especial Cível (Lei 9.099/95)",`| | JEC (Lei 9.099) | JEFP (Lei 12.153) |
| Valor | até **40 SM** | até **60 SM** |
| Advogado obrigatório | acima de **20 SM** | — |
| Autores | pessoas físicas capazes, ME, EPP, OSCIP | pessoas físicas, ME, EPP |
| Réus | não podem: incapaz, preso, PJ de direito público, empresa pública da União, massa falida | Estados, DF, Municípios, autarquias, fundações e empresas públicas |
| Citação por edital | **não** | — |
| Reexame necessário | — | **não há** |
| Prazo diferenciado da Fazenda | — | **não há** |
- **JEC excluídas (3º, § 2º):** causas alimentares, falimentares, fiscais, de interesse da Fazenda, acidentes de trabalho, resíduos, estado e capacidade.
- Sem intervenção de terceiros nem assistência; **admite litisconsórcio**.
- Sessão de conciliação em **15 dias**; contagem em **dias úteis**.
- **JEFP excluídas:** mandado de segurança, desapropriação, improbidade, execução fiscal, demarcação, ações populares e coletivas, demissão de servidor.`]
],
const: [
["Direitos individuais e coletivos (art. 5º)","Direitos individuais e coletivos (art. 5º)",`- **Casa (XI):** sem consentimento, só em **flagrante, desastre, para prestar socorro** ou, **durante o dia**, por ordem judicial.
- **Reunião (XVI):** pacífica, sem armas, **sem autorização**, apenas **prévio aviso**.
- **Associações (XIX):** dissolução compulsória só por decisão judicial **transitada em julgado**; suspensão por decisão judicial.
- **Júri (XXXVIII):** plenitude de defesa, sigilo das votações, soberania dos veredictos, crimes dolosos contra a vida.
| Crime | Inafiançável | Imprescritível | Sem graça/anistia |
| Racismo | ✔ | ✔ (reclusão) | |
| Ação de grupos armados | ✔ | ✔ | |
| Tortura, tráfico, terrorismo, hediondos (3TH) | ✔ | | ✔ |
- **Penas proibidas (XLVII):** morte (salvo guerra declarada), perpétua, trabalhos forçados, banimento, cruéis.
- **Extradição (LI):** brasileiro nato nunca; naturalizado por crime comum **antes** da naturalização ou **tráfico** a qualquer tempo.
- **Prisão (LXI):** flagrante ou ordem escrita e fundamentada de **autoridade judiciária** (salvo militares).
- **Remédios:** HC (locomoção), HD (informações pessoais), MS (direito líquido e certo), MI (falta de norma), ação popular (qualquer cidadão, isento de custas salvo má-fé).
- **MS coletivo:** partido com representação no Congresso; sindicato, entidade de classe ou associação com **1 ano** de funcionamento.
- **Gratuitos:** HC e HD para todos; registro de nascimento e certidão de óbito para os pobres.
- **Tratados de direitos humanos** aprovados em 2 turnos por 3/5 em cada Casa = **emenda constitucional**.
! Memorize: **racismo e grupos armados são imprescritíveis**; **3TH não têm graça nem anistia**.`],
["Direitos sociais (arts. 6º a 11)","Direitos sociais (arts. 6º a 11)",`- **Art. 6º:** educação, saúde, alimentação, trabalho, moradia, transporte, lazer, segurança, previdência social, proteção à maternidade e à infância, assistência aos desamparados. (Propriedade **não** está aqui.)
- **Jornada:** até **8h diárias e 44h semanais**; turnos ininterruptos: **6h**.
- **Férias:** com pelo menos **1/3** a mais. **Licença-gestante:** 120 dias.
- **Prescrição trabalhista:** 5 anos, até 2 anos após o fim do contrato.
- **Trabalho do menor:** noturno, perigoso ou insalubre proibido abaixo de **18**; qualquer trabalho abaixo de **16**, salvo aprendiz a partir de **14**.
- **Sindicatos (8º):** unicidade sindical (base mínima de um Município); ninguém é obrigado a se filiar; estabilidade do dirigente desde a candidatura até **1 ano após o mandato**.
- Empresas com mais de **200 empregados**: representante eleito (11).`],
["Nacionalidade (arts. 12 e 13)","Nacionalidade (arts. 12 e 13)",`**Brasileiros natos:**
- nascidos no Brasil, ainda que de pais estrangeiros (desde que não a serviço de seu país);
- nascidos no exterior de pai ou mãe brasileiros **a serviço do Brasil**;
- nascidos no exterior de pai ou mãe brasileiros **registrados em repartição** competente ou que venham residir no Brasil e **optem** após a maioridade.
**Naturalizados:**
- de países de língua portuguesa: **1 ano** de residência ininterrupta + idoneidade moral;
- demais estrangeiros: **15 anos** ininterruptos + sem condenação penal.
**Cargos privativos de nato (MP3.COM):** Ministro do STF, Presidente e Vice, Presidente da Câmara, Presidente do Senado, Carreira diplomática, Oficial das Forças Armadas, Ministro da Defesa.
- **Língua oficial:** portuguesa. **Símbolos:** bandeira, hino, armas e selo.
! Senador, Deputado, Ministro do STJ e Governador **podem** ser naturalizados (só os **presidentes** das Casas precisam ser natos).`],
["Administração Pública (arts. 37 e 38)","Administração Pública (arts. 37 e 38)",`- **Princípios (LIMPE):** legalidade, impessoalidade, moralidade, publicidade, eficiência.
- **Concurso:** validade de **até 2 anos, prorrogável uma vez por igual período**; aprovado tem prioridade sobre novos concursados durante o prazo.
- **Funções de confiança:** só servidores **efetivos**. **Cargos em comissão:** percentual mínimo para servidores de carreira. Ambos: direção, chefia e assessoramento.
- **Acumulação permitida (com compatibilidade de horários):** 2 de professor; 1 professor + 1 técnico/científico; 2 de profissionais de saúde regulamentados.
- **Improbidade (§ 4º):** suspensão dos direitos políticos, perda da função, indisponibilidade dos bens, ressarcimento.
- **Responsabilidade objetiva (§ 6º):** PJ de direito público e privadas prestadoras de serviço público; regresso contra o agente em caso de **dolo ou culpa**.
- **Mandato eletivo (38):** federal/estadual/distrital → afastado; **Prefeito** → afastado, pode optar pela remuneração; **Vereador** → com compatibilidade, acumula; sem compatibilidade, regra do Prefeito.
! Improbidade gera **suspensão** (não perda nem cassação) dos direitos políticos.`],
["Servidores públicos (arts. 39 a 41)","Servidores públicos (arts. 39 a 41)",`- **Estabilidade:** após **3 anos** de efetivo exercício, nomeado por concurso para cargo efetivo; exige **avaliação especial de desempenho**.
- **Perda do cargo pelo estável:** sentença transitada em julgado; processo administrativo com ampla defesa; avaliação periódica de desempenho (lei complementar).
- **Reintegração:** demissão invalidada por sentença → volta ao cargo; o ocupante, se estável, é reconduzido, aproveitado ou posto em disponibilidade.
- **Extinção do cargo:** estável vai para **disponibilidade com remuneração proporcional** ao tempo de serviço.
! Estabilidade (3 anos, no serviço público) ≠ estágio probatório (avaliação no cargo).`],
["Poder Judiciário (art. 92)","Poder Judiciário (art. 92)",`**Órgãos:** STF; **CNJ**; STJ; **TST**; TRFs e juízes federais; tribunais e juízes do Trabalho; Eleitorais; Militares; tribunais e juízes dos Estados, DF e Territórios.
- STF, CNJ e Tribunais Superiores têm **sede na Capital Federal**.
- STF e Tribunais Superiores têm **jurisdição em todo o território nacional**.
! **CNMP, TCU e MP não integram o Poder Judiciário.** O CNJ integra, mas não tem função jurisdicional.`]
],
adm: [
["Estatuto dos Servidores de SP (Lei 10.261/68) — provimento e posse","Estatuto SP",`- **Funcionário público (art. 3º):** pessoa legalmente investida em cargo público.
- **Arts. 11 a 45** tratam do provimento: nomeação, concurso, substituição, transferência, reintegração, acesso, reversão, aproveitamento, readmissão, readaptação e remoção.
- **Posse:** prazo de **30 dias** da publicação do ato de provimento, prorrogável por mais 30 a pedido.
- Após a posse, segue-se o **exercício** no prazo fixado no Estatuto.
- Conceitos gerais: **reintegração** é o retorno após invalidação da demissão; **reversão**, o retorno do aposentado; **aproveitamento**, o retorno de quem está em disponibilidade. Confira as condições de cada um no texto do Estatuto.
! Leia os arts. 1º a 86 na lei seca: a Vunesp cobra a literalidade de prazos e definições.`],
["Estatuto SP — deveres, penalidades e processo","Estatuto SP",`**Penalidades (art. 251):** repreensão, suspensão, multa, demissão, demissão a bem do serviço público, cassação de aposentadoria ou disponibilidade.
- **Repreensão:** por escrito, em indisciplina ou falta de cumprimento dos deveres.
- **Suspensão:** **até 90 dias**.
- **Demissão:** abandono de cargo (mais de **30 dias consecutivos**), faltas interpoladas (mais de **45 dias em 1 ano**), procedimento irregular grave, ineficiência, aplicação indevida de dinheiro público.
- O Estatuto também trata de direito de petição (239-240), deveres e proibições (241-250), extinção da punibilidade, práticas autocompositivas/TAC e suspensão condicional da sindicância (267-A a 267-P) e do procedimento disciplinar (268-323).
! A parte de práticas autocompositivas e TAC é recente: vale ler na lei seca.`],
["Improbidade administrativa (Lei 8.429/92)","Improbidade",`Após a **Lei 14.230/2021**, só há improbidade **dolosa**. Dolo = vontade livre e consciente de alcançar o resultado ilícito, **não basta a voluntariedade**.
| Espécie | Exemplo | Suspensão dos direitos políticos | Multa | Proibição de contratar |
| Enriquecimento ilícito (art. 9º) | receber vantagem indevida | até **14 anos** | valor do acréscimo | até 14 anos |
| Prejuízo ao erário (art. 10) | causar perda patrimonial | até **12 anos** | valor do dano | até 12 anos |
| Violação de princípios (art. 11) | rol **taxativo** | **não há** | até **24x** a remuneração | até **4 anos** |
- **Prescrição:** **8 anos** a partir do fato (ou do fim da permanência).
- Existe **acordo de não persecução civil**.
! Art. 11 deixou de ser exemplificativo: só as condutas listadas configuram improbidade.`]
],
interna: [
["O que estudar na Legislação Interna","Normas da Corregedoria",`Esta parte é cobrada pela **literalidade** dos atos do próprio TJSP (em 2023 e 2025 caíram de 5 a 10 questões). Não há como deduzir: é leitura e revisão.
- **Normas da Corregedoria Geral da Justiça (NSCGJ), Tomo I:** rotinas do cartório.
- **Resolução TJSP nº 850/2021:** teletrabalho dos servidores (caiu em 2025, em caso concreto).
- **Resolução TJSP nº 963/2025:** sistema eproc no TJSP.
- **LC estadual nº 1.111/2010:** plano de cargos e carreiras (caiu em 2025: chefia de seção e carreira).
- **Regimento Interno do TJSP** (caiu em 2025: sessões, audiências e pauta).
! Os resumos abaixo foram feitos a partir de uma compilação das NSCGJ de 2025. **Confira sempre no texto oficial** (portal do TJSP > Corregedoria > Normas Judiciais), porque as Normas mudam com frequência.`],
["NSCGJ — Correições e disciplina (arts. 5º a 18)","Normas da Corregedoria",`- A função correcional é exercida pelo **Corregedor Geral** e, nos limites de suas atribuições, pelos **juízes de primeiro grau**; é **permanente**.
- Formas: **correições ordinárias, extraordinárias e visitas correcionais**. A correição virtual é implantada gradativamente.
- **Correição ordinária:** **uma vez por ano, de preferência em dezembro**, anunciada por **edital com antecedência mínima de 15 dias**.
- **Visita correcional:** em até **30 dias** depois que o juiz assume a corregedoria em caráter definitivo.
- O escrivão auxilia a correição; os livros obrigatórios recebem visto.
- Inspeções **mensais** nos estabelecimentos prisionais e visitas mensais às cadeias públicas.
- Apurações preliminares, sindicâncias e processos administrativos de servidores tramitam em **formato digital**.
- O Corregedor Geral pode aplicar sanções originariamente e reexaminar decisões absolutórias ou de arquivamento enquanto não prescrita a infração.`],
["NSCGJ — Escrituração, autuação e juntada (arts. 80 a 96)","Normas da Corregedoria",`- **Evitar:** rasuras, emendas, anotações a lápis. **Vedado:** corretivo, assinaturas em branco, chancela da assinatura do juiz.
- Escrivão assina **“por ordem do juiz”** (com exceções).
- **Autuação em 24 horas**, com etiqueta gerada pelo sistema; tarjas coloridas para situações especiais.
- **Volume:** até **200 folhas** (com exceções). A peça inaugural tem numeração própria com a letra **“i”** após o número da folha.
- Numeração repetida ou errada é corrigida **sem renumerar** o processo.
- Petições passam pelo protocolo; **juntada com termo próprio**, vedado lançá-lo na própria petição ou **no verso** de petições e documentos.
- **Vedadas cotas marginais e interlineares** e sublinhados.`],
["NSCGJ — Intimações, audiências e carga (arts. 132 a 169)","Normas da Corregedoria",`- Intimação **preferencialmente eletrônica**, com publicação no DJE; encaminhar à publicação em **3 dias**.
- Em segredo de justiça, a publicação traz apenas as **iniciais** das partes.
- **Designar audiências é atribuição exclusiva e indelegável do juiz**, salvo nos juizados especiais. Nova data é marcada no próprio termo.
- Verificação prévia dos processos **10 dias antes** das audiências; gravação audiovisual dos depoimentos.
- Autos acessíveis a advogados e ao público, **salvo segredo de justiça**.
- **Carga rápida de 1 hora** para advogado **sem procuração**, para cópia (não vale em segredo de justiça); carga comum só para advogados constituídos.
- **Vedado reter documento de identificação** do advogado.`],
["NSCGJ — Arquivo e processo eletrônico (arts. 179 a 1.301)","Normas da Corregedoria",`- **Arquivo provisório:** execução de título judicial há mais de **1 ano** sem bens localizados.
- Desarquivamento exige **taxa**; sem a guia, o advogado é intimado a recolher em **5 dias**. Nova requisição só após **10 dias úteis**. Após o desarquivamento, intimação para manifestação em **30 dias**.
- Assinatura digital com certificado **ICP-Brasil**; o original é a versão no servidor do TJSP.
- **Petição eletrônica tempestiva até as 24h** do último dia (hora de Brasília); vencimento em dia sem expediente → primeiro dia útil seguinte.
- A suspensão de prazos **não impede** o peticionamento.
- **Indisponibilidade superior a 60 minutos, entre 6h e 23h**, prorroga o prazo para o primeiro dia útil seguinte. Indisponibilidade **severa**: mais de 3 horas, entre 9h e 19h, em dias úteis.
- Documentos em papel ficam **45 dias** à disposição para retirada.
- **Intimação via portal:** considerada feita no dia da consulta; consulta em até **10 dias corridos**, senão é automática.
- É **vedado controlar prazos** pela fila “aguardando decurso de prazo – publicação”; as filas são verificadas ao menos **uma vez por mês**.
- Documentos que não podem ser digitalizados: apresentar em **10 dias** após a petição que comunica o fato.`]
],
atual: [
["Estatuto da Pessoa com Deficiência (Lei 13.146/2015)","Estatuto da Pessoa com Deficiência",`- **Pessoa com deficiência (art. 2º):** impedimento de **longo prazo** de natureza física, mental, intelectual ou sensorial que, em interação com barreiras, pode obstruir a participação plena.
- **Barreiras (art. 3º):** urbanísticas, arquitetônicas, nos transportes, nas comunicações e na informação, **atitudinais** e tecnológicas.
- **Discriminação (art. 4º):** inclui a **recusa de adaptações razoáveis** e de tecnologias assistivas.
- **Especialmente vulneráveis (art. 5º):** criança, adolescente, mulher e idoso com deficiência.
- **Capacidade civil (art. 6º):** a deficiência **não afeta** a capacidade para casar, ter filhos, exercer direitos sexuais e reprodutivos, guarda, tutela, curatela e adoção. Vedada esterilização compulsória.
- **Atendimento prioritário (art. 9º).**
- **Sem tratamento forçado (art. 11)**; **consentimento prévio, livre e esclarecido** é indispensável (art. 12).
- **Trabalho (arts. 34 a 38):** livre escolha, ambiente acessível e inclusivo; vedada discriminação em recrutamento, seleção, exames, permanência e ascensão, e **exigência de aptidão plena**; habilitação e reabilitação profissional; emprego apoiado.`],
["Atualidades","Atualidades",`O edital cobra fatos **políticos, econômicos, sociais e culturais, nacionais e internacionais, a partir do 1º semestre de 2026**.
- Acompanhe um portal de notícias diariamente e faça uma lista por tema: política nacional, economia, meio ambiente/clima, ciência e tecnologia, relações internacionais, esportes e cultura.
- A Vunesp costuma cobrar fatos de grande repercussão e **dados-chave** (quem, onde, quando).
! Use o botão “✦ Questões” em Atualidades para gerar questões com a IA, mas confira as informações em notícias, porque a IA pode se enganar sobre fatos recentes.`]
],
mat: [
["Porcentagem","Porcentagem",`- **x% de V** = V × x/100.
- **Aumento de x%:** multiplique por (1 + x/100). **Desconto de x%:** multiplique por (1 − x/100).
- **Aumentos/descontos sucessivos:** multiplique os fatores. Aumento de 20% seguido de desconto de 20% = 1,2 × 0,8 = **0,96** (perda de 4%).
! Percentuais sucessivos **nunca** se somam nem se anulam.`],
["Regra de três simples e composta","Regra de três (direta)",`- **Direta:** grandezas aumentam juntas (mais horas → mais petições). Multiplique cruzado.
- **Inversa:** uma aumenta e a outra diminui (mais escreventes → menos dias). Multiplique em linha: n₁ × d₁ = n₂ × d₂.
- **Composta:** monte a tabela, compare cada grandeza com a incógnita (direta ou inversa) e monte a proporção.
! Pergunte sempre: "se eu dobrar esta grandeza, a incógnita dobra ou cai pela metade?".`],
["Juros simples","Juros simples",`- **J = C × i × t** (taxa e tempo na **mesma unidade**).
- **Montante:** M = C + J.
- Ex.: R$ 2.000 a 2% a.m. por 5 meses → J = 2.000 × 0,02 × 5 = R$ 200; M = R$ 2.200.
! Taxa anual com tempo em meses: divida a taxa por 12 (ou converta o tempo).`],
["MMC e MDC","MMC",`- **MMC:** quando eventos que se repetem **voltam a coincidir** (backup a cada 6 dias, manutenção a cada 8 → MMC = 24).
- **MDC:** **dividir em partes iguais do maior tamanho possível** (cortar fitas de 24 m e 36 m em pedaços iguais → MDC = 12 m).
- Para dois números: MMC × MDC = produto dos números.`],
["Razão, proporção, divisão proporcional e médias","Razão e proporção",`- **Razão a/b** com total T: a parte "a" vale T × a/(a+b).
- **Divisão diretamente proporcional** a 2, 3 e 5: some (10), divida o total por 10 e multiplique por cada número.
- **Média aritmética:** soma ÷ quantidade. **Ponderada:** Σ(valor × peso) ÷ Σ pesos.`],
["Equações, sistemas e geometria","Geometria",`- **1º grau:** isole x. **2º grau:** Δ = b² − 4ac; x = (−b ± √Δ)/2a.
- **Sistemas:** substituição ou soma das equações.
- **Retângulo:** área = b × h; perímetro = 2(b + h). **Triângulo:** área = b × h / 2. **Círculo:** área = πr²; comprimento = 2πr.
- **Paralelepípedo:** V = c × l × a. **1 dm³ = 1 litro**; 1 m³ = 1.000 L.
- **Pitágoras:** a² = b² + c². Ternos comuns: 3-4-5, 5-12-13, 6-8-10, 8-15-17.
- Soma dos ângulos internos do triângulo: 180°.`]
],
rl: [
["Proposições, conectivos e tabela-verdade","Equivalência lógica",`| Conectivo | Símbolo | Só é falso quando… / só é verdadeiro quando… |
| E (conjunção) | p ∧ q | só é **verdadeiro** se ambas forem V |
| OU (disjunção) | p ∨ q | só é **falso** se ambas forem F |
| OU…OU (exclusiva) | p ⊻ q | V quando os valores são **diferentes** |
| SE…ENTÃO (condicional) | p → q | só é **falso** em V → F ("Vera Fischer") |
| SE E SOMENTE SE | p ↔ q | V quando os valores são **iguais** |
- **Linhas da tabela-verdade:** 2ⁿ (n = número de proposições simples).
- **Tautologia:** sempre V. **Contradição:** sempre F. **Contingência:** depende.
- **Condição:** em p → q, p é **suficiente** para q e q é **necessária** para p.`],
["Negações (De Morgan) e equivalências","Negação (De Morgan)",`| Proposição | Negação |
| p ∧ q | ~p ∨ ~q |
| p ∨ q | ~p ∧ ~q |
| p → q | **p ∧ ~q** (mantém a 1ª e nega a 2ª) |
| p ↔ q | p ⊻ q |
| Todo A é B | **Algum A não é B** |
| Nenhum A é B | **Algum A é B** |
| Algum A é B | Nenhum A é B |
**Equivalências da condicional p → q:**
- **~q → ~p** (contrapositiva: inverte e nega);
- **~p ∨ q** (nega a 1ª, troca por "ou", mantém a 2ª).
! Erro clássico: achar que a negação de "Se chove, então fecha" é "Se não chove, então não fecha". A negação correta é "Chove **e** não fecha".`],
["Argumentação e diagramas","Diagramas lógicos (conjuntos)",`- **Modus ponens:** p → q; p; logo q. **Modus tollens:** p → q; ~q; logo ~p.
- **Falácias:** afirmar o consequente (p → q; q; logo p) e negar o antecedente (p → q; ~p; logo ~q) **não são válidos**.
- **Diagramas:** "Todo A é B" = A dentro de B; "Algum A é B" = interseção; "Nenhum A é B" = conjuntos separados.
- **União de conjuntos:** n(A ∪ B) = n(A) + n(B) − n(A ∩ B). Comece preenchendo a interseção.`],
["Sequências, verdades e mentiras, calendários","Sequências numéricas",`- **Sequências:** teste diferença constante (PA), razão constante (PG), soma dos dois anteriores, quadrados, alternância de operações e padrões de letras/figuras.
- **Verdades e mentiras:** suponha que uma pessoa diz a verdade e verifique se gera contradição; procure afirmações contraditórias entre si (uma delas é verdadeira).
- **Calendários:** 7 dias por semana; divida o número de dias por 7 e use o **resto**. Ano bissexto tem 366 dias (fevereiro com 29).
- **Casa dos pombos:** com n caixas, n + 1 objetos garantem pelo menos 2 numa mesma caixa. Para "garantir", pense no **pior caso**.`]
],
info: [
["Windows 10/11","Windows",`| Atalho | Função |
| Win + E | Explorador de Arquivos |
| Win + D | mostrar área de trabalho |
| Win + L | bloquear |
| Win + V | histórico da área de transferência |
| Win + R | Executar |
| Ctrl + Shift + Esc | Gerenciador de Tarefas |
| Alt + Tab | alternar janelas |
| Alt + F4 | fechar janela |
| F2 | renomear |
| Shift + Delete | excluir sem passar pela Lixeira |
- Arrastar arquivo **na mesma unidade = mover**; **para outra unidade = copiar**. Ctrl ao arrastar força cópia; Shift força mover.`],
["Word (em português)","Word",`| Atalho | Função |
| Ctrl + N | negrito |
| Ctrl + I | itálico |
| Ctrl + S | sublinhado |
| Ctrl + B | salvar |
| Ctrl + E | centralizar |
| Ctrl + J | justificar |
| Ctrl + Q / Ctrl + G | alinhar à esquerda / à direita |
| Ctrl + T | selecionar tudo |
| Ctrl + Enter | quebra de página |
| Shift + Enter | quebra de linha |
| F7 | ortografia e gramática |
- **Sumário:** guia Referências (usa estilos de Título). **Controlar Alterações:** guia Revisão.
! Os atalhos mudam entre Word em português e em inglês (Ctrl+B é negrito em inglês e salvar em português).`],
["Excel","Excel",`- **Precedência:** parênteses → potência → multiplicação/divisão → soma/subtração.
- **Referências:** A1 relativa; **$A$1** absoluta; **$A1** fixa a coluna; **A$1** fixa a linha.
| Função | Faz |
| SOMA, MÉDIA, MÁXIMO, MÍNIMO | o óbvio |
| CONT.NÚM | conta números |
| CONT.VALORES | conta células não vazias |
| CONTAR.VAZIO | conta vazias |
| CONT.SE(intervalo; critério) | conta com critério |
| SOMASE(intervalo; critério; soma) | soma com critério |
| SE(teste; verdadeiro; falso) | condicional |
| PROCV(valor; tabela; coluna; [0]) | busca vertical |
| RESTO(n; d) | resto da divisão |
| ARRED(n; casas) | arredonda |
| Erro | Causa |
| #DIV/0! | divisão por zero |
| #N/D | valor não encontrado |
| #REF! | referência inválida |
| #NOME? | nome de função errado |
| #VALOR! | tipo de dado errado |
- Classificar e Filtrar: guia **Dados**. Em português, os argumentos são separados por **ponto e vírgula**.`],
["Internet, e-mail e Microsoft 365","Correio eletrônico",`- **E-mail:** Para (destinatário principal), **Cc** (cópia visível), **Cco** (cópia oculta: os demais não veem). Responder × Responder a todos × Encaminhar (encaminhar leva os anexos).
- **Navegadores:** Ctrl+T nova aba; Ctrl+W fecha aba; **Ctrl+Shift+T** reabre a última aba fechada; **Ctrl+Shift+N** janela anônima (Chrome/Edge) e Ctrl+Shift+P (Firefox); Ctrl+H histórico; Ctrl+J downloads.
- **URL:** protocolo (https) + domínio + caminho. HTTPS = conexão criptografada.
| App | Para que serve |
| OneDrive | armazenamento e compartilhamento em nuvem, sincronização, histórico de versões |
| Teams | equipes e canais, chat, reuniões e arquivos |
| SharePoint | sites de equipe, intranet, bibliotecas de documentos |
| OneNote | anotações em blocos > seções > páginas |`]
]
};

function mdRender(src){
  const lines = src.split("\n"); let html="", inList=false, table=null;
  const inl = t => esc(t).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>");
  const flushList=()=>{ if(inList){ html+="</ul>"; inList=false; } };
  const flushTable=()=>{ if(table){ html+=`<div class="tw"><table class="tbl lt"><thead><tr>${table[0].map(c=>`<th>${inl(c)}</th>`).join("")}</tr></thead><tbody>${table.slice(1).map(r=>`<tr>${r.map(c=>`<td>${inl(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`; table=null; } };
  for(const raw of lines){ const l=raw.trim();
    if(l.startsWith("|")){ flushList(); const cells=l.replace(/^\||\|$/g,"").split("|").map(c=>c.trim()); (table||(table=[])).push(cells); continue; } else flushTable();
    if(l.startsWith("- ")){ if(!inList){ html+="<ul>"; inList=true; } html+=`<li>${inl(l.slice(2))}</li>`; continue; } else flushList();
    if(l.startsWith("! ")){ html+=`<div class="tip">${inl(l.slice(2))}</div>`; continue; }
    if(l.startsWith("> ")){ html+=`<blockquote>${inl(l.slice(2))}</blockquote>`; continue; }
    if(l) html+=`<p>${inl(l)}</p>`;
  }
  flushList(); flushTable(); return html;
}
