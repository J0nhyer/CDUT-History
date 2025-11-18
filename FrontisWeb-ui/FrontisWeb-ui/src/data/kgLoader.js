// Minimal CSV parser and KG CSV loader to feed UniversityHistoryGraph

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0)
  if (lines.length === 0) return []
  const headers = lines[0].split(',').map(h => h.trim())
  return lines.slice(1).map(line => {
    // simple CSV split (no quoted commas). Replace with a robust parser if needed
    const parts = line.split(',')
    const row = {}
    headers.forEach((h, i) => row[h] = (parts[i] || '').trim())
    return row
  })
}

export async function loadKgFromCsv(basePath = '/kg') {
  const [nodesRes, edgesRes] = await Promise.all([
    fetch(`${basePath}/nodes.csv`),
    fetch(`${basePath}/edges.csv`)
  ])
  const [nodesCsv, edgesCsv] = await Promise.all([nodesRes.text(), edgesRes.text()])
  const nodeRows = parseCsv(nodesCsv)
  const edgeRows = parseCsv(edgesCsv)

  // Map nodes to graph format expected by UniversityHistoryGraph
  const nodes = nodeRows.map(r => ({
    id: r.id,
    name: r.label,
    type: r.typeCN || r.type, // expected: 人物/组织机构/历史事件/学术成就/精神文化
    description: r.description || '',
    year: r.start_year ? Number(r.start_year) : undefined,
    isCenter: r.is_center === 'true'
  }))

  const links = edgeRows.map(r => ({
    source: r.subject_id,
    target: r.object_id,
    type: r.predicateCN || r.predicate,
    value: r.weight ? Number(r.weight) : 1
  }))

  return { nodes, links }
}



