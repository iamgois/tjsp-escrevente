import pathlib
s=pathlib.Path('src')
js="\n".join((s/f).read_text() for f in ['q_port.js','q_dir.js','q_gerais.js','q_vunesp.js','leis.js','engine.js','teoria.js','app.js'])
html=(s/'shell.html').read_text().replace('/*__JS__*/',js)
pathlib.Path('index.html').write_text(html)
print(len(html))
