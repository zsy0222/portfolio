import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {entries,kindLabels} from '../src/data/world';
import {getAllPosts} from '../src/lib/blog';
test('every entry has unique, routable identifiers and both languages',()=>{
 const ids=new Set<string>();
 for(const entry of entries){assert.match(entry.id,/^[a-z0-9-]+$/);assert(!ids.has(entry.id));ids.add(entry.id);for(const value of [entry.title,entry.summary,entry.status,kindLabels[entry.kind],...entry.sections.flatMap(s=>[s.title,s.text])]){assert(value.zh.trim());assert(value.en.trim());}}
});
test('media points to real files and includes explicit provenance',()=>{
 for(const e of entries){if(e.cover){assert(e.provenance?.zh&&e.provenance.en);assert(fs.existsSync(path.join('public',e.cover)));}for(const m of e.media||[]){assert(fs.existsSync(path.join('public',m.src)));assert(m.caption.zh&&m.caption.en);}}
});
test('world content references resolve to known pages',()=>{
 const sections=new Set(['studio','lab','learning','memories','thoughts','about']);
 for(const e of entries)for(const link of e.links||[]){if(!link.href.startsWith('/world/'))continue;const parts=link.href.split('/');if(parts[2]==='entry')assert(entries.some(x=>x.id===parts[3]),link.href);else assert(sections.has(parts[2]),link.href);}
});
test('original article search index omits drafts',()=>{
 assert(getAllPosts().every(p=>!p.draft));assert(!getAllPosts().some(p=>p.slug==='my-summer'));
});
