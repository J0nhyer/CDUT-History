from pathlib import Path
path = Path(''BackWeb/pom.xml'')
text = path.read_text()
print(''LINES'', len(text.splitlines()))
