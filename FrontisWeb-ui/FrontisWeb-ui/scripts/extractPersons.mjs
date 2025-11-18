import fs from 'fs';
import vm from 'vm';

const SRC = new URL('../src/data/allPersonsDataTemplate.js', import.meta.url);
const RAW = fs.readFileSync(SRC, 'utf8');

const cleaned = RAW
  .replace(/^import[^\n]*\n/gm, '')
  .replace(/require\(['"](.*?)['"]\)/g, (_, p1) => `'${p1}'`)
  .replace(/export\s+const\s+allPersonsData\s*=\s*/, 'const allPersonsData = ')
  .replace(/export\s+function/g, 'function')
  .replace(/export\s+{[^}]*};?/g, '')
  .replace(/if \(process.env.NODE_ENV === 'development'\)[\s\S]*$/, '');

const sandbox = {
  console,
  process: { env: {} },
};

vm.runInNewContext(`${cleaned}\nthis.allPersonsData = allPersonsData;`, sandbox);

const data = sandbox.allPersonsData;
fs.writeFileSync(new URL('../tmp_allPersonsData.json', import.meta.url), JSON.stringify(data, null, 2));
console.log('Extracted', Object.keys(data).length, 'persons.');
