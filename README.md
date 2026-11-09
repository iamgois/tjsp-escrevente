# Escrevente TJ-SP · Estudos e Simulados

App de estudos para o concurso de **Escrevente Técnico Judiciário do TJ-SP** (Vunesp, prova em 14/03/2027).

Feito em **HTML, CSS e JavaScript puro**, sem framework e sem dependências. O site inteiro é o arquivo `index.html`.

## Funcionalidades
- Painel com contagem regressiva, meta diária, acerto por matéria, pontos fortes e fracos
- Matérias com resumos (Aprender), treino por assunto e conteúdo do edital
- Treino com filtros por tipo de questão, matéria, assunto e situação (inéditas / erradas)
- Questões no padrão Vunesp, banco do app e geradores (lei seca, matemática, lógica, Excel)
- Simulado de 70 questões com os critérios de aprovação do edital
- Caderno de erros, lei seca com destaques e edital verticalizado
- Progresso salvo no navegador (localStorage)

> Recursos que dependem do Claude (geração de questões e aulas com IA, importação de provas e sincronização na nuvem) só funcionam quando o app é aberto como artefato no claude.ai. Fora dele, o app funciona normalmente sem essas partes.

## Estrutura
```
index.html        # site final (gerado)
build.py          # junta os arquivos de src/ no index.html
src/
  shell.html      # layout e CSS
  q_port.js       # questões de Português
  q_dir.js        # questões de Direito
  q_gerais.js     # Informática, Matemática, Raciocínio Lógico
  q_vunesp.js     # questões no padrão das provas Vunesp
  leis.js         # lei seca
  engine.js       # matérias, banco e geradores de questões
  teoria.js       # resumos da aba Aprender
  app.js          # telas e lógica do app
```

## Editar e gerar o site
```bash
python3 build.py   # recria o index.html a partir de src/
```

## Publicar
É um site estático: GitHub Pages, Vercel ou Netlify servem o `index.html` direto, sem build.

**GitHub Pages:** Settings → Pages → Source: *Deploy from a branch* → branch `main`, pasta `/ (root)`.

---
Questões originais inspiradas no padrão da Vunesp. Confira sempre a lei e o edital oficiais.
