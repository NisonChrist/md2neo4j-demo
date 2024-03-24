import type { CreateDataTypes } from "./types"

export class CypherTemplate {

  private varNameCount: number

  constructor() {
    this.varNameCount = 0
  }

  CREATE = (data: CreateDataTypes) => {
    const template = `CREATE (n${this.varNameCount}:${data.label} {name:'${data.properties.name}',definition:'${data.properties.definition}',features:'${data.properties.features}',application:'${data.properties.application}',level:'${data.properties.level}',pre:'${data.properties.pre}'})`
    this.varNameCount += 1
    return template
  }
}


