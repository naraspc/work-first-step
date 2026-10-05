const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function app(storageError = false) {
  const elements = {}, saved = {}, downloads = [];
  class Element {
    constructor() { this.value = ''; this.checked = false; this.files = []; }
    set id(v) { this._id = v; elements[v] = this; }
    get id() { return this._id; }
    append() {} setAttribute() {} addEventListener() {} click() {} remove() {}
  }
  const document = { getElementById: id => elements[id] ||= new Element(), createElement: () => new Element(), createTextNode: s => s, body: new Element() };
  const context = vm.createContext({document, localStorage: {getItem: k => {if(storageError)throw Error();return saved[k];},setItem: (k,v) => {if(storageError)throw Error();saved[k]=v;}}, window: {addEventListener(){}}, Blob, URL: {createObjectURL: b => (downloads.push(b), 'blob:test'),revokeObjectURL(){}},setTimeout: fn=>fn(),confirm:()=>true});
  vm.runInContext(script, context);
  return {run: code => vm.runInContext(code, context), elements, saved, downloads};
}
test('six examples match every form heading in order', () => {
  const a=app(), labels=Array.from(a.run('fields.map(x=>x[1])'));
  const examples=[...html.matchAll(/<details class="example">([\s\S]*?)<\/details>/g)];
  assert.equal(examples.length,6);
  for(const [,block] of examples) assert.deepEqual([...block.matchAll(/<h3>(.*?)<\/h3>/g)].map(x=>x[1]),labels);
});
test('text and JSON exports preserve Korean content and checks', async () => {
  const a=app();a.run("$('title').value='업무 예시';$('purpose').value='회의 내용 확인';$('check0').checked=true;cache();$('exportTxt').onclick();$('exportJson').onclick()");
  assert.match(await a.downloads[0].text(),/회의 내용 확인/);
  const d=JSON.parse(await a.downloads[1].text());assert.equal(d.version,2);assert.equal(d.checks[0],true);assert.equal(d.values.title,'업무 예시');
});
test('old field meaning is preserved under questions without rewriting the source', () => {
  const a=app();a.run("const old=collect();old.version=1;old.values.flex='카운터 이동 가능';old.values.unknown='제출 시간은?';old.checks[0]=true;fill(old)");
  assert.equal(a.elements.flex.value,'');assert.match(a.elements.unknown.value,/제출 시간은\?[\s\S]*카운터 이동 가능/);assert.equal(a.elements.check0.checked,false);assert.equal(a.run('old.values.flex'),'카운터 이동 가능');
});
test('current backups retain task list and reject malformed shapes', () => {
  const a=app();a.run("const current=collect();current.values.flex='자료 정리';fill(current)");assert.equal(a.elements.flex.value,'자료 정리');
  for(const v of ['null','{}',"{format:'work-first-step',version:99}"])assert.ok(!a.run('valid('+v+')'));
});
test('corrupted imports keep the current draft', async () => {
  const a=app();a.elements.title.value='보존할 업무';
  a.run("globalThis.importEvent={target:{files:[{size:12,text:async()=>'{invalid'}],value:'file'}}");
  await a.run("$('importFile').onchange(importEvent)");assert.equal(a.elements.title.value,'보존할 업무');assert.match(a.elements.status.textContent,/불러오지 못했습니다/);
});
test('blocked storage leaves file export usable', () => {
  const a=app(true);a.run("$('title').value='저장';cache();$('exportJson').onclick()");assert.equal(a.downloads.length,1);
});
