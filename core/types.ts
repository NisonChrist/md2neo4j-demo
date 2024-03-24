export type Property = {
  name: string
  definition: string
  features: string
  application: string
  level: string
  pre: string
}

export type Entity = {
  label: string
  property: Property
  relations: Record<string, string>[]
}

export type Variable = `n${number}`

export type CreateDataTypes = {
  label: Entity['label']
  properties: Entity['property']
  relationships: Entity['relations']
}
