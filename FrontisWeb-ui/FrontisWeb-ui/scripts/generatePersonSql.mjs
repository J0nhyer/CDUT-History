import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontisRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(frontisRoot, '..', '..');

function loadModule(relativePath, exportName) {
  const absPath = path.join(frontisRoot, relativePath);
  let raw = fs.readFileSync(absPath, 'utf8');
  raw = raw.replace(/\r\n/g, '\n');

  const importMap = {};
  raw = raw.replace(/^import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?\n/gm, (_, name, source) => {
    importMap[name] = source;
    return '';
  });

  raw = raw
    .replace(/^import[^\n]*\n/gm, '')
    .replace(/require\(['"](.*?)['"]\)/g, (_, p1) => `'${p1}'`)
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/export\s+function/g, 'function')
    .replace(/export\s+default\s+/g, '')
    .replace(/export\s+{[^}]*};?/g, '');

  Object.entries(importMap).forEach(([identifier, source]) => {
    const reg = new RegExp(`\\b${identifier}\\b`, 'g');
    raw = raw.replace(reg, `'${source}'`);
  });

  fs.writeFileSync(path.join(frontisRoot, `tmp_cleaned_${path.basename(relativePath)}`), raw);

  const context = {
    console,
    process: { env: { NODE_ENV: 'production' } },
  };

  vm.createContext(context);
  vm.runInContext(`${raw}\nthis.__export = ${exportName};`, context);
  return context.__export;
}

function nl2p(text) {
  if (!text) return '';
  return text
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => `<p>${line}</p>`)
    .join('\n');
}

function escapeSql(value) {
  if (value === null || value === undefined) return 'NULL';
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
}

function jsonSql(value) {
  if (!value) return 'NULL';
  return escapeSql(JSON.stringify(value));
}

function normalizeAssetPath(value) {
  if (!value || typeof value !== 'string') return null;
  let path = value.trim();
  if (!path) return null;
  if (path.startsWith('@/assets/')) {
    path = path.substring('@/assets/'.length);
  } else if (path.startsWith('./') || path.startsWith('/')) {
    path = path.replace(/^[/\\.]+/, '');
  }
  return path;
}

function normalizeMediaUrl(value) {
  const path = normalizeAssetPath(value);
  return path || null;
}

function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const allPersonsData = loadModule('src/data/allPersonsDataTemplate.js', 'allPersonsData');
const cdutPersonsDetailed = loadModule('src/data/cdutPersonsDetailed.js', 'cdutPersonsDetailed');
const personsDetailDataAdvanced = loadModule('src/data/personsDetailDataAdvanced.js', 'personsDetailDataAdvanced');

const persons = new Map();

function ensurePerson(id) {
  if (!persons.has(id)) {
    persons.set(id, {
      personId: id,
      name: id,
      subtitle: '成都理工大学重要人物',
      imageUrl: null,
      keyTags: ['待补充'],
      dataStatus: 'draft',
      lastVerified: null,
      biographies: [],
      relationships: new Map(),
    });
  }
  return persons.get(id);
}

Object.values(allPersonsData).forEach(item => {
  const person = ensurePerson(item.id);
  person.name = item.name || person.name;
  person.subtitle = item.subtitle || person.subtitle;
  const normalizedImage = normalizeAssetPath(item.image);
  if (normalizedImage) {
    person.imageUrl = normalizedImage;
  }
  person.keyTags = Array.isArray(item.keyTags) && item.keyTags.length > 0 ? item.keyTags : person.keyTags;
  person.dataStatus = item.dataStatus || person.dataStatus;
  person.lastVerified = item.lastVerified || person.lastVerified;

  (item.biography || []).forEach((bio, index) => {
    person.biographies.push({
      title: bio.title || `生平片段${index + 1}`,
      content: bio.content || '',
      tags: bio.tags || [],
      mediaType: bio.mediaType || null,
      mediaUrl: normalizeMediaUrl(bio.mediaUrl),
      needsVerification: Boolean(bio.needsVerification),
    });
  });

  if (Array.isArray(item.timeline) && item.timeline.length > 0) {
    const timelineHtml = item.timeline
      .map(event => `<li><strong>${event.year} · ${event.title}</strong>：${event.description || ''}${event.needsVerification ? '（待核实）' : ''}</li>`)
      .join('\n');
    person.biographies.push({
      title: '时间轴',
      content: `<ul>\n${timelineHtml}\n</ul>`,
      tags: ['时间轴'],
      mediaType: null,
      mediaUrl: null,
      needsVerification: item.timeline.some(event => event.needsVerification),
    });
  }

  if (Array.isArray(item.achievements) && item.achievements.length > 0) {
    const achievementsHtml = item.achievements
      .map(ach => `<li><strong>${ach.type || '成就'}：</strong>${ach.title}${ach.year ? `（${ach.year}）` : ''}${ach.summary ? ` - ${ach.summary}` : ''}${ach.needsVerification ? '（待核实）' : ''}</li>`)
      .join('\n');
    person.biographies.push({
      title: '学术成就',
      content: `<ul>\n${achievementsHtml}\n</ul>`,
      tags: ['成就'],
      mediaType: null,
      mediaUrl: null,
      needsVerification: item.achievements.some(ach => ach.needsVerification),
    });
  }

  (item.relationships || []).forEach((rel, index) => {
    const key = JSON.stringify([rel.id || `rel_${index}`, rel.name, rel.relation]);
    person.relationships.set(key, {
      personId: item.id,
      relatedPersonId: rel.id || null,
      relatedPersonName: rel.name || rel.id || '未知',
      relationType: rel.type || null,
      relation: rel.relation || null,
      description: rel.description || null,
      needsVerification: Boolean(rel.needsVerification),
      sortOrder: index,
    });
  });
});

Object.values(cdutPersonsDetailed).forEach(item => {
  const person = ensurePerson(item.id);
  person.name = item.name || person.name;
  if (!person.subtitle || person.subtitle === '成都理工大学重要人物') {
    person.subtitle = item.type === '人物' ? '成都理工大学重要人物' : item.type || person.subtitle;
  }
  const normalizedImage = normalizeAssetPath(item.image);
  if (normalizedImage && !person.imageUrl) {
    person.imageUrl = normalizedImage;
  }
  if ((!person.keyTags || person.keyTags.length === 0 || person.keyTags.includes('待补充'))) {
    person.keyTags = ['成都理工大学', '人物'];
  }

  const detailContent = nl2p(item.description);
  if (detailContent) {
    person.biographies.push({
      title: '详细介绍',
      content: detailContent,
      tags: ['详细介绍'],
      mediaType: null,
      mediaUrl: null,
      needsVerification: false,
    });
  }

  if (Array.isArray(item.achievements) && item.achievements.length > 0) {
    const achievementsHtml = item.achievements
      .map(text => `<li>${text}</li>`)
      .join('\n');
    person.biographies.push({
      title: '主要成就',
      content: `<ul>\n${achievementsHtml}\n</ul>`,
      tags: ['成就'],
      mediaType: null,
      mediaUrl: null,
      needsVerification: false,
    });
  }

  (item.relationships || []).forEach((rel, index) => {
    const key = JSON.stringify([rel.target || `detail_${index}`, rel.relation, rel.type]);
    if (!person.relationships.has(key)) {
      const relatedPerson = persons.get(rel.target || '') || persons.get(rel.relation || '') || null;
      person.relationships.set(key, {
        personId: item.id,
        relatedPersonId: rel.target || null,
        relatedPersonName: (relatedPerson && relatedPerson.name) || rel.target || rel.relation || '未知',
        relationType: rel.type || null,
        relation: rel.relation || null,
        description: null,
        needsVerification: false,
        sortOrder: person.relationships.size,
      });
    }
  });
});

const profileValues = [];
const normalizedProfiles = {};

Object.entries(personsDetailDataAdvanced).forEach(([personId, profile]) => {
  const normalized = cloneDeep(profile);
  if (normalized.image) {
    normalized.image = normalizeAssetPath(normalized.image);
  }
  if (Array.isArray(normalized.timeline)) {
    normalized.timeline = normalized.timeline.map(event => {
      const mapped = { ...event };
      if (mapped.media && typeof mapped.media === 'object') {
        mapped.media = { ...mapped.media };
        if (mapped.media.url) {
          mapped.media.url = normalizeAssetPath(mapped.media.url);
        }
      }
      return mapped;
    });
  }
  if (Array.isArray(normalized.biography)) {
    normalized.biography = normalized.biography.map(section => {
      const mapped = { ...section };
      if (mapped.mediaUrl) {
        mapped.mediaUrl = normalizeMediaUrl(mapped.mediaUrl);
      }
      return mapped;
    });
  }
  if (Array.isArray(normalized.achievements)) {
    normalized.achievements = normalized.achievements.map(item => {
      const mapped = { ...item };
      if (Array.isArray(mapped.resources)) {
        mapped.resources = mapped.resources.map(res => {
          const resource = { ...res };
          if (resource.url) {
            resource.url = normalizeMediaUrl(resource.url) || resource.url;
          }
          return resource;
        });
      }
      return mapped;
    });
  }
  if (Array.isArray(normalized.videos)) {
    normalized.videos = normalized.videos.map(video => {
      const mapped = { ...video };
      if (mapped.thumbnail) {
        mapped.thumbnail = normalizeMediaUrl(mapped.thumbnail);
      }
      if (mapped.url) {
        mapped.url = normalizeMediaUrl(mapped.url) || mapped.url;
      }
      return mapped;
    });
  }
  if (Array.isArray(normalized.audios)) {
    normalized.audios = normalized.audios.map(audio => {
      const mapped = { ...audio };
      if (mapped.cover) {
        mapped.cover = normalizeMediaUrl(mapped.cover);
      }
      if (mapped.url) {
        mapped.url = normalizeMediaUrl(mapped.url) || mapped.url;
      }
      return mapped;
    });
  }
  if (Array.isArray(normalized.vrScenes)) {
    normalized.vrScenes = normalized.vrScenes.map(scene => {
      const mapped = { ...scene };
      if (mapped.thumbnail) {
        mapped.thumbnail = normalizeMediaUrl(mapped.thumbnail);
      }
      if (mapped.url) {
        mapped.url = normalizeMediaUrl(mapped.url) || mapped.url;
      }
      return mapped;
    });
  }
  normalizedProfiles[personId] = normalized;
  profileValues.push('(' + [
    escapeSql(personId),
    escapeSql(JSON.stringify(normalized))
  ].join(', ') + ')');
});

Object.entries(normalizedProfiles).forEach(([personId, profile]) => {
  const person = ensurePerson(personId);
  if (profile.name && (!person.name || person.name === person.personId)) {
    person.name = profile.name;
  }
  if (profile.subtitle && (!person.subtitle || person.subtitle === '成都理工大学重要人物')) {
    person.subtitle = profile.subtitle;
  }
  if (profile.image && !person.imageUrl) {
    person.imageUrl = profile.image;
  }
  if (Array.isArray(profile.keyTags) && profile.keyTags.length > 0) {
    person.keyTags = profile.keyTags;
  }
});

const sortedPersons = Array.from(persons.values()).sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));

sortedPersons.forEach(person => {
  person.keyTags = Array.from(new Set((person.keyTags || []).filter(Boolean)));
});

const personValues = sortedPersons.map(p => (
  '('
  + [
    escapeSql(p.personId),
    escapeSql(p.name),
    escapeSql(p.subtitle),
    p.imageUrl ? escapeSql(p.imageUrl) : 'NULL',
    jsonSql(p.keyTags),
    escapeSql(p.dataStatus),
    p.lastVerified ? escapeSql(p.lastVerified) : 'NULL',
  ].join(', ')
  + ')'
));

const biographyValues = [];

sortedPersons.forEach(person => {
  person.biographies.forEach((bio, index) => {
    biographyValues.push('(' + [
      escapeSql(person.personId),
      escapeSql(bio.title || `资料${index + 1}`),
      escapeSql(bio.content || ''),
      jsonSql(bio.tags || []),
      bio.mediaType ? escapeSql(bio.mediaType) : 'NULL',
      bio.mediaUrl ? escapeSql(bio.mediaUrl) : 'NULL',
      bio.needsVerification ? '1' : '0',
      index,
    ].join(', ') + ')');
  });
});

const relationshipValues = [];

sortedPersons.forEach(person => {
  Array.from(person.relationships.values())
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .forEach(rel => {
      relationshipValues.push('(' + [
        escapeSql(person.personId),
        rel.relatedPersonId ? escapeSql(rel.relatedPersonId) : 'NULL',
        escapeSql(rel.relatedPersonName || '未知'),
        rel.relationType ? escapeSql(rel.relationType) : 'NULL',
        rel.relation ? escapeSql(rel.relation) : 'NULL',
        rel.description ? escapeSql(rel.description) : 'NULL',
        rel.needsVerification ? '1' : '0',
        rel.sortOrder || 0,
      ].join(', ') + ')');
    });
});

const output = [];
output.push('-- 自动生成的人物数据插入脚本');
output.push('-- 执行前请确保 person_schema.sql 已创建表结构');
output.push('');

if (personValues.length > 0) {
  output.push('INSERT INTO `person` (`person_id`, `name`, `subtitle`, `image_url`, `key_tags`, `data_status`, `last_verified`) VALUES');
  output.push('  ' + personValues.join(',\n  ') + '\nON DUPLICATE KEY UPDATE');
  output.push('  `name` = VALUES(`name`),');
  output.push('  `subtitle` = VALUES(`subtitle`),');
  output.push('  `image_url` = VALUES(`image_url`),');
  output.push('  `key_tags` = VALUES(`key_tags`),');
  output.push('  `data_status` = VALUES(`data_status`),');
  output.push('  `last_verified` = VALUES(`last_verified`);');
  output.push('');
}

if (biographyValues.length > 0) {
  output.push('INSERT INTO `person_biography` (`person_id`, `title`, `content`, `tags`, `media_type`, `media_url`, `needs_verification`, `sort_order`) VALUES');
  output.push('  ' + biographyValues.join(',\n  ') + '\nON DUPLICATE KEY UPDATE');
  output.push('  `content` = VALUES(`content`),');
  output.push('  `tags` = VALUES(`tags`),');
  output.push('  `media_type` = VALUES(`media_type`),');
  output.push('  `media_url` = VALUES(`media_url`),');
  output.push('  `needs_verification` = VALUES(`needs_verification`),');
  output.push('  `sort_order` = VALUES(`sort_order`);');
  output.push('');
}

if (relationshipValues.length > 0) {
  output.push('INSERT INTO `person_relationship` (`person_id`, `related_person_id`, `related_person_name`, `relation_type`, `relation`, `description`, `needs_verification`, `sort_order`) VALUES');
  output.push('  ' + relationshipValues.join(',\n  ') + '\nON DUPLICATE KEY UPDATE');
  output.push('  `related_person_name` = VALUES(`related_person_name`),');
  output.push('  `relation_type` = VALUES(`relation_type`),');
  output.push('  `relation` = VALUES(`relation`),');
  output.push('  `description` = VALUES(`description`),');
  output.push('  `needs_verification` = VALUES(`needs_verification`),');
  output.push('  `sort_order` = VALUES(`sort_order`);');
  output.push('');
}

if (profileValues.length > 0) {
  output.push('INSERT INTO `person_profile` (`person_id`, `profile_json`) VALUES');
  output.push('  ' + profileValues.join(',\n  ') + '\nON DUPLICATE KEY UPDATE');
  output.push('  `profile_json` = VALUES(`profile_json`),');
  output.push('  `updated_at` = CURRENT_TIMESTAMP;');
  output.push('');
}

fs.writeFileSync(path.join(workspaceRoot, 'BackWeb', 'BackWeb', 'BackWeb', 'BackWeb', 'src', 'main', 'resources', 'sql', 'person_data_inserts.sql'), output.join('\n'));

console.log(`生成人物数据 SQL：${sortedPersons.length} 人，${biographyValues.length} 条生平，${relationshipValues.length} 条关系，${profileValues.length} 条完整资料。`);