import { CypherTemplate } from './core/cypher'
import { MDReader, loadMarkdownFiles } from './core/md'
import { saveTextAsFile } from './core/utils'
import type { Entity } from './core/types'

const files = loadMarkdownFiles()
console.log(files)

const entityArr: Array<Entity & { substitute: string }> = []
let countEntity = 0
for (const pathKey in files) {
  // console.log(files[pathKey])
  const reader = new MDReader(pathKey, files[pathKey])
  // console.log('实体名：', reader.name);
  // console.log('属性：', JSON.stringify({ '难度等级': reader.property.level, '前置知识：': reader.property.pre }))
  // console.log('定义：', reader.definition);
  // console.log('特点：', reader.feature);
  // console.log('应用：', reader.application);
  entityArr.push({
    substitute: `n${countEntity}`,
    label: reader.label,
    property: reader.property,
    relations: reader.relation
  })
  countEntity += 1
}

console.log(entityArr)

// const cypher = new CypherTemplate()
// let template = ``
// entityArr.forEach((entity) => {
//   template += (cypher.CREATE({
//     label: entity.label,
//     properties: entity.property,
//     relationships: entity.relations
//   }) + '\n')
// })

// console.log(template)


const createGraph = () => {

  const createNode = () => {
    return `()`
  }
  const createRelation = () => {

  }
  let count = 0
  let query = `CREATE `
  entityArr.forEach((entity) => {
    query += `(n${count}:${entity.label} {知识点:'${entity.property.name}',定义:'${entity.property.definition}',特点:'${entity.property.features}',应用:'${entity.property.application}',难度:'${entity.property.level}',前置知识:'${entity.property.pre}'}),\n`
    count += 1
  })
  console.log(query)

  return `
  CREATE (pmr:Station {name: 'Peckham Rye'}),
  (dmk:Station {name: 'Denmark Hill'}),
  (clp:Station {name: 'Clapham High Street'}),
  (wwr:Station {name: 'Wandsworth Road'}),
  (clj:Station {name: 'Clapham Junction'}),
  (s1:Stop {arrives: time('17:19'), departs: time('17:20')}),
  (s2:Stop {arrives: time('17:12'), departs: time('17:13')}),
  (s3:Stop {arrives: time('17:10'), departs: time('17:11')}),
  (s4:Stop {arrives: time('17:06'), departs: time('17:07')}),
  (s5:Stop {arrives: time('16:58'), departs: time('17:01')}),
  (s6:Stop {arrives: time('17:17'), departs: time('17:20')}),
  (s7:Stop {arrives: time('17:08'), departs: time('17:10')}),
  (clj)<-[:CALLS_AT]-(s1), (wwr)<-[:CALLS_AT]-(s2),
  (clp)<-[:CALLS_AT]-(s3), (dmk)<-[:CALLS_AT]-(s4),
  (pmr)<-[:CALLS_AT]-(s5), (clj)<-[:CALLS_AT]-(s6),
  (dmk)<-[:CALLS_AT]-(s7),
  (s5)-[:NEXT {distance: 1.2}]->(s4),(s4)-[:NEXT {distance: 0.34}]->(s3),
  (s3)-[:NEXT {distance: 0.76}]->(s2), (s2)-[:NEXT {distance: 0.3}]->(s1),
  (s7)-[:NEXT {distance: 1.4}]->(s6)
  `
}

let count = 0
let query = `CREATE `
entityArr.forEach((entity) => {
  query += `(${entity.substitute}:${entity.label} {知识点: '${entity.property.name}',定义: '${entity.property.definition}',特点: '${entity.property.features}',应用: '${entity.property.application}',难度: '${entity.property.level}',前置知识: '${entity.property.pre}'}),\n`
  count += 1
})

entityArr.forEach((entity) => {
  const rs = entity.relations
  
  if (rs.length > 0) {
    rs.forEach((tuple) => {
      for (const [k,v] of Object.entries(tuple)) {
        let target = ''
        entityArr.forEach(el => {
          if (el.property.name.trim() === v.trim()) {
            console.log(el.property.name, v);
            target = el.substitute
          }
        })
        query += `(${entity.substitute})-[:${k.trim()}]->(${target}),\n`
      }
    })
  }
})

console.log(query)


const downloadBtn = document.createElement('button')
downloadBtn.innerText = 'download'
downloadBtn.onclick = () => {
  saveTextAsFile(query, 'md2cypher.txt', 'text/plain')
}

document.getElementById('app')?.appendChild(downloadBtn)
