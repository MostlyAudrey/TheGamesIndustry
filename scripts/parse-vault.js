#!/usr/bin/env node
/**
 * parse-vault.js — Reads the games industry vault and produces graph.json
 * 
 * Parses all .md files from orgs/, events/, people/, sources/, labour/, capital/
 * Extracts YAML frontmatter, wikilinks, summaries.
 * Outputs: docs/data/graph.json + docs/data/index.json
 * 
 * Usage: node scripts/parse-vault.js [path-to-vault]
 */

const fs = require('fs');
const path = require('path');

// Built-in YAML-ish parser that handles duplicate keys (takes last value)
function parseYamlish(text) {
  const data = {};
  if (!text || !text.trim()) return data;
  
  // Current YAML key we're building (for multiline values)
  let currentKey = null;
  let currentValue = null;
  let inMultiline = false;
  
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip empty lines within multiline values
    if (inMultiline) {
      if (line.match(/^\s{2,}/) || line.trim() === '') {
        if (line.trim() === '') {
          currentValue += '\n';
          continue;
        }
        // Continuation of a list or multiline string
        currentValue += line.substring(line.search(/\S/)) + '\n';
        continue;
      } else {
        // End of multiline — finalize current key
        inMultiline = false;
        data[currentKey] = currentValue.trim();
        currentKey = null;
        currentValue = null;
      }
    }
    
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // List item (dash)
    if (trimmed.startsWith('- ')) {
      if (!currentKey) continue;  // orphan list item
      // Append to current array-like value
      currentValue = (currentValue || '') + trimmed + '\n';
      inMultiline = true;
      continue;
    }
    
    // Key-value pair
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    
    const key = line.substring(0, colonIdx).trim();
    const valuePart = line.substring(colonIdx + 1).trim();
    
    // Handle pipes and block scalars
    if (valuePart === '|' || valuePart === '>') {
      currentKey = key;
      currentValue = '';
      // Check next line for block content
      continue;
    }
    
    // Simple value
    let value = valuePart;
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // Handle arrays in bracket form: [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1);
      const items = inner.split(',').map(s => {
        let item = s.trim();
        if ((item.startsWith('"') && item.endsWith('"')) || 
            (item.startsWith("'") && item.endsWith("'"))) {
          item = item.slice(1, -1);
        }
        return item;
      }).filter(s => s);
      data[key] = items;
    } 
    // Handle null
    else if (value === 'null' || value === '~') {
      data[key] = null;
    }
    // Handle booleans
    else if (value === 'true') data[key] = true;
    else if (value === 'false') data[key] = false;
    // Handle numbers
    else if (/^\d+$/.test(value)) data[key] = parseInt(value, 10);
    else if (/^\d+\.\d+$/.test(value)) data[key] = parseFloat(value);
    // String
    else data[key] = value;
  }
  
  // Handle last multiline value
  if (inMultiline && currentKey && currentValue !== null) {
    data[currentKey] = currentValue.trim();
  }
  
  return data;
}

function extractFrontmatter(content) {
  // Extract the first YAML block between --- markers
  const lines = content.split('\n');
  if (lines.length === 0 || lines[0].trim() !== '---') {
    return { data: {}, body: content };
  }
  
  // Find closing ---
  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endIdx = i;
      break;
    }
  }
  
  if (endIdx === -1) {
    return { data: {}, body: content };
  }
  
  const yamlText = lines.slice(1, endIdx).join('\n');
  const body = lines.slice(endIdx + 1).join('\n');
  const data = parseYamlish(yamlText);
  
  return { data, body };
}

const VAULT_PATH = process.argv[2] || path.join(__dirname, '..', '..', 'gamecraft');
const OUTPUT_PATH = path.join(__dirname, '..', 'docs', 'data', 'graph.json');
const OUTPUT_INDEX_PATH = path.join(__dirname, '..', 'docs', 'data', 'index.json');

// Directories to scan and their node type mapping
const DIRS = {
  'orgs': 'org',
  'events': 'event',
  'people': 'person',
  'sources': 'source',
  'labour': 'event',
  'capital': 'org',
};

const SECTOR_GROUPS = {
  'publisher': 'Publisher',
  'studio': 'Studio',
  'pe-fund': 'PE Fund',
  'vc-fund': 'VC Fund',
  'swf': 'Sovereign Wealth Fund',
  'pension': 'Pension Fund',
  'union': 'Union',
  'trade-body': 'Trade Body',
  'aggregator': 'Aggregator',
  'indie-investor': 'Indie Investor',
  'publisher-division': 'Publisher Division',
  'publisher+engine': 'Publisher / Engine',
  'publisher+platform': 'Publisher / Platform',
  'platform': 'Platform',
  'engine': 'Engine',
  'esports': 'Esports',
  'service': 'Service Provider',
  'media-conglomerate': 'Media Conglomerate',
  'holding-company': 'Holding Company',
  'investor': 'Investor',
};

function extractWikilinks(body) {
  const links = new Set();
  const regex = /\[\[([^\]]+)\]\]/g;
  let match;
  while ((match = regex.exec(body)) !== null) {
    let target = match[1].trim();
    const pipeIdx = target.indexOf('|');
    if (pipeIdx !== -1) target = target.substring(0, pipeIdx).trim();
    const hashIdx = target.indexOf('#');
    if (hashIdx !== -1) target = target.substring(0, hashIdx).trim();
    if (target && !target.startsWith('http')) links.add(target);
  }
  return [...links];
}

function extractSummary(body) {
  let text = body
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/\[\[([^\]]+)\]\]/g, (_, t) => t.includes('|') ? t.split('|')[1] : t)
    .replace(/!?\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .replace(/>\s?/g, '')
    .replace(/---+/g, '')
    .trim();
  
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 20);
  if (paragraphs.length === 0) return '';
  
  let summary = paragraphs[0].replace(/\n/g, ' ').trim();
  if (summary.length > 350) summary = summary.substring(0, 347) + '...';
  return summary;
}

function normalizeNodeName(name, dir) {
  if (dir === 'events') {
    name = name.replace(/^\d{4}(-\d{2}(-\d{2})?)?\s*[—–-]\s*/, '');
  }
  if (dir === 'sources') {
    name = name.replace(/^\d{4}-\d{2}-\d{2}\s*[—–-]\s*/, '');
  }
  return name.replace(/\s*[—–-]+\s*/g, ' — ').trim();
}

function resolveWikilink(wikilink, nodeMap) {
  if (nodeMap[wikilink]) return wikilink;
  
  // Try with directory prefixes
  for (const dir of ['orgs', 'events', 'people', 'sources', 'labour', 'capital']) {
    const key = dir + '/' + wikilink;
    if (nodeMap[key]) return key;
  }
  
  // Try suffix match
  for (const [slug] of Object.entries(nodeMap)) {
    if (slug.endsWith('/' + wikilink) || slug.includes(wikilink)) return slug;
    // Also try matching just the filename part
    const slugFile = slug.split('/').pop();
    if (slugFile === wikilink || slugFile === wikilink + '.md') return slug;
  }
  
  return null;
}

function main() {
  if (!fs.existsSync(VAULT_PATH)) {
    console.error(`Vault path not found: ${VAULT_PATH}`);
    process.exit(1);
  }

  console.log(`Scanning vault: ${VAULT_PATH}`);
  
  const nodes = [];
  const edges = [];
  const nodeMap = {};
  const seenEdges = new Set();

  // Phase 1: Read all files and build nodes
  for (const [dir, defaultType] of Object.entries(DIRS)) {
    const dirPath = path.join(VAULT_PATH, dir);
    if (!fs.existsSync(dirPath)) {
      console.log(`  Skipping ${dir}/ (not found)`);
      continue;
    }
    
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md') && !f.startsWith('.'));
    let skipped = 0;
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const slug = dir + '/' + file.replace(/\.md$/i, '');
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const { data, body } = extractFrontmatter(content);
      let name = data.name || '';
      let type = data.type || defaultType || 'org';
      let summary = extractSummary(body);
      
      // If frontmatter had duplicated type (e.g. "type: event" + "type: layoff"),
      // we end up with the last value which is the event subtype — ideal
      
      if (!name) {
        const headingMatch = body.match(/^#\s+(.+)$/m);
        if (headingMatch) {
          name = headingMatch[1]
            .replace(/^Organization:\s*/i, '')
            .replace(/^Event:\s*/i, '')
            .replace(/^Person:\s*/i, '')
            .trim();
        } else {
          name = normalizeNodeName(file, dir);
        }
      }
      
      const wikilinks = extractWikilinks(body);
      const displayType = data.sector ? (SECTOR_GROUPS[data.sector] || data.sector) : type;
      
      const node = {
        id: slug,
        dir: dir,
        type: type,
        displayType: displayType,
        name: name,
        slug: slug.split('/').pop(),
        priority: data.priority || 3,
        confidence: data.confidence || 'unrated',
        sector: data.sector || null,
        region: data.region || null,
        ownership: data.ownership || null,
        role: data.role || null,
        summary: summary,
        sourceCount: Array.isArray(data.sources) ? data.sources.length : 0,
        labour: data.labour || null,
        date: data.date || null,
        actors: data.actors || null,
        portfolio: data.portfolio || null,
        lp: data.lp || null,
        funding: data.funding || null,
        key_decisions: data.key_decisions || null,
        tenure: data.tenure || null,
        nationality: data.nationality || null,
        birth_year: data.birth_year || null,
        eventType: data.type || type,
        wikilinks: wikilinks,
      };
      
      nodeMap[slug] = nodes.length;
      nodes.push(node);
    }
    console.log(`  ${dir}/: ${files.length - skipped} nodes (+${skipped} skipped)`);
  }
  
  console.log(`\nBuilt ${nodes.length} nodes`);

  // Phase 2: Build edges from wikilinks
  function addEdge(source, target, relationType = 'links-to') {
    if (!source || !target) return;
    if (source === target) return;
    
    const edgeKey = [source, target].sort().join('::');
    if (seenEdges.has(edgeKey)) return;
    seenEdges.add(edgeKey);
    
    edges.push({
      source: source,
      target: target,
      type: relationType,
    });
  }

  // 2a: Wikilink edges (only between known nodes)
  for (const node of nodes) {
    for (const wikilink of node.wikilinks) {
      const targetSlug = resolveWikilink(wikilink, nodeMap);
      if (targetSlug) {
        addEdge(node.id, targetSlug, 'links-to');
      }
    }
  }

  // 2b: YAML relationship edges from frontmatter
  for (const node of nodes) {
    for (const field of ['portfolio', 'lp', 'actors']) {
      const items = node[field];
      if (!items || !Array.isArray(items)) continue;
      for (const item of items) {
        let cleanTarget = item.replace(/^\[\[|\]\]$/g, '').trim();
        const resolved = resolveWikilink(cleanTarget, nodeMap);
        if (resolved) {
          const type = field === 'portfolio' ? 'portfolio-of' : 
                       field === 'lp' ? 'lp-in' : 'involves';
          addEdge(node.id, resolved, type);
        }
      }
    }
  }

  console.log(`Built ${edges.length} edges`);

  // Phase 3: Build search index
  const searchIndex = nodes.map(n => ({
    id: n.id,
    name: n.name,
    type: n.displayType,
    dir: n.dir,
    priority: n.priority,
    sector: n.sector,
    region: n.region,
    role: n.role,
  }));

  // Phase 4: Compute edge counts per node
  for (const node of nodes) {
    node.edgeCount = edges.filter(e => e.source === node.id || e.target === node.id).length;
  }

  // Phase 5: Stats
  const nodesByType = {};
  for (const node of nodes) {
    const key = node.displayType;
    if (!nodesByType[key]) nodesByType[key] = 0;
    nodesByType[key]++;
  }

  const graphData = {
    meta: {
      generated: new Date().toISOString(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
      vaultPath: VAULT_PATH,
      nodeTypes: nodesByType,
    },
    nodes: nodes,
    edges: edges,
  };

  // Write output files
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(graphData));
  fs.writeFileSync(OUTPUT_INDEX_PATH, JSON.stringify({
    generated: graphData.meta.generated,
    entries: searchIndex,
    counts: nodesByType,
  }));

  const graphSize = (Buffer.byteLength(JSON.stringify(graphData)) / 1024).toFixed(0);
  const indexSize = (Buffer.byteLength(JSON.stringify(searchIndex)) / 1024).toFixed(0);
  
  console.log(`\nDone! Wrote:`);
  console.log(`  ${OUTPUT_PATH} (${graphSize} KB, ${nodes.length} nodes, ${edges.length} edges)`);
  console.log(`  ${OUTPUT_INDEX_PATH} (${indexSize} KB)`);
  console.log(`  Types: ${JSON.stringify(nodesByType)}`);
}

main();
