// inspect-glb.mjs
// Zero-dependency GLB inspector. Run from the project root:
//   node inspect-glb.mjs public/models/iphone.glb
// It prints node tree, meshes, world-space bounding boxes and materials.

import fs from 'node:fs'

const file = process.argv[2] || 'public/models/iphone.glb'
const buf = fs.readFileSync(file)

if (buf.toString('utf8', 0, 4) !== 'glTF') {
  console.error('Not a binary .glb file')
  process.exit(1)
}

// GLB layout: 12-byte header, then chunks. First chunk is the JSON.
const jsonLength = buf.readUInt32LE(12)
const json = JSON.parse(buf.toString('utf8', 20, 20 + jsonLength))

const nodes = json.nodes || []
const meshes = json.meshes || []
const accessors = json.accessors || []
const materials = json.materials || []

// ---------- tiny 4x4 matrix helpers (column-major, like glTF) ----------
const identity = () => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]

const multiply = (a, b) => {
  const out = new Array(16).fill(0)
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      for (let k = 0; k < 4; k++)
        out[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]
  return out
}

const fromTRS = (t = [0,0,0], q = [0,0,0,1], s = [1,1,1]) => {
  const [x, y, z, w] = q
  const xx = x*x, yy = y*y, zz = z*z
  const xy = x*y, xz = x*z, yz = y*z, wx = w*x, wy = w*y, wz = w*z
  return [
    (1 - 2*(yy+zz)) * s[0], (2*(xy+wz)) * s[0],     (2*(xz-wy)) * s[0],     0,
    (2*(xy-wz)) * s[1],     (1 - 2*(xx+zz)) * s[1], (2*(yz+wx)) * s[1],     0,
    (2*(xz+wy)) * s[2],     (2*(yz-wx)) * s[2],     (1 - 2*(xx+yy)) * s[2], 0,
    t[0], t[1], t[2], 1,
  ]
}

const localMatrix = (n) => n.matrix ? n.matrix : fromTRS(n.translation, n.rotation, n.scale)

const transformPoint = (m, p) => [
  m[0]*p[0] + m[4]*p[1] + m[8]*p[2]  + m[12],
  m[1]*p[0] + m[5]*p[1] + m[9]*p[2]  + m[13],
  m[2]*p[0] + m[6]*p[1] + m[10]*p[2] + m[14],
]

// Transform the 8 corners of a local box and re-measure in world space.
const worldBox = (m, min, max) => {
  const lo = [Infinity, Infinity, Infinity]
  const hi = [-Infinity, -Infinity, -Infinity]
  for (const x of [min[0], max[0]])
    for (const y of [min[1], max[1]])
      for (const z of [min[2], max[2]]) {
        const p = transformPoint(m, [x, y, z])
        for (let i = 0; i < 3; i++) {
          lo[i] = Math.min(lo[i], p[i])
          hi[i] = Math.max(hi[i], p[i])
        }
      }
  return { min: lo, max: hi }
}

const f = (v) => v.map((n) => n.toFixed(4)).join(', ')

// ---------- walk the scene ----------
const total = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] }
const rows = []

const visit = (index, parentMatrix, depth) => {
  const node = nodes[index]
  const world = multiply(parentMatrix, localMatrix(node))
  const pad = '  '.repeat(depth)
  console.log(`${pad}- [${index}] ${node.name || '(no name)'}${node.mesh !== undefined ? `  (mesh ${node.mesh})` : ''}`)

  if (node.mesh !== undefined) {
    const mesh = meshes[node.mesh]
    mesh.primitives.forEach((prim, pi) => {
      const acc = accessors[prim.attributes.POSITION]
      if (!acc || !acc.min || !acc.max) return
      const box = worldBox(world, acc.min, acc.max)
      for (let i = 0; i < 3; i++) {
        total.min[i] = Math.min(total.min[i], box.min[i])
        total.max[i] = Math.max(total.max[i], box.max[i])
      }
      const size = box.max.map((v, i) => v - box.min[i])
      const mat = materials[prim.material]
      rows.push({
        node: node.name || `node${index}`,
        mesh: mesh.name || `mesh${node.mesh}`,
        prim: pi,
        material: mat?.name ?? `(material ${prim.material})`,
        vertices: acc.count,
        min: box.min, max: box.max, size,
      })
    })
  }
  ;(node.children || []).forEach((c) => visit(c, world, depth + 1))
}

console.log('\n=== NODE TREE ===')
const sceneIndex = json.scene ?? 0
const roots = json.scenes?.[sceneIndex]?.nodes || []
roots.forEach((r) => visit(r, identity(), 0))

console.log('\n=== MESH PRIMITIVES (world space, model units) ===')
rows.forEach((r) => {
  console.log(`\n${r.node}  /  mesh "${r.mesh}"  /  material "${r.material}"  /  ${r.vertices} verts`)
  console.log(`  min : ${f(r.min)}`)
  console.log(`  max : ${f(r.max)}`)
  console.log(`  size: ${f(r.size)}`)
})

const totalSize = total.max.map((v, i) => v - total.min[i])
console.log('\n=== WHOLE MODEL ===')
console.log(`min : ${f(total.min)}`)
console.log(`max : ${f(total.max)}`)
console.log(`size: ${f(totalSize)}   (x, y, z)`)

console.log('\n=== MATERIALS ===')
materials.forEach((m, i) => {
  const pbr = m.pbrMetallicRoughness || {}
  console.log(
    `[${i}] ${m.name || '(no name)'}  baseColor=${JSON.stringify(pbr.baseColorFactor || null)}  ` +
    `baseTex=${pbr.baseColorTexture ? 'yes' : 'no'}  metal=${pbr.metallicFactor ?? 'default'}  ` +
    `rough=${pbr.roughnessFactor ?? 'default'}  emissiveTex=${m.emissiveTexture ? 'yes' : 'no'}  ` +
    `alphaMode=${m.alphaMode || 'OPAQUE'}`
  )
})

console.log(`\nImages: ${(json.images || []).length}, Textures: ${(json.textures || []).length}`)
console.log(`File size: ${(buf.length / 1024 / 1024).toFixed(1)} MB`)
console.log(`Extensions used: ${(json.extensionsUsed || []).join(', ') || 'none'}`)
