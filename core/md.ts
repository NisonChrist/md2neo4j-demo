import { Property } from "./types"

export const loadMarkdownFiles = () => import.meta.glob(
  [
    '/实体/0-编译原理/*.md',
    '/实体/1-词法分析/*.md',
    '/实体/2-语法分析/*.md',
    '/实体/3-语义分析/*.md',
    '/实体/4-运行环境/*.md',
    '/实体/5-代码生成/*.md',
    '/实体/6-代码优化/*.md'
  ],
  { as: 'raw', eager: true }
)

export class MDReader {

  private path: string
  private text: string
  private splitText: string[]

  constructor(mdPath: string, mdText: string) {
    this.path = mdPath
    this.text = mdText
    this.splitText = this.text.split('\n')
  }

  get label() { return this.path.split('/')[2].split('-')[1] }

  private readName = (): string => this.path.split('/')[3].split('.')[0]
  get name() { return this.readName() }

  private readProperty = (): Property => ({
    name: this.readName(),
    definition: this.readDefinition(),
    features: this.readFeature(),
    application: this.readApplication(),
    level: this.splitText[3].split('/')[1].trim(),
    pre: this.splitText[4].split('::')[1].trim() === '' ? '' : this.splitText[4].split('::')[1].trim().split('/')[1].trim()
  })
  get property() { return this.readProperty() }

  private readDefinition = () => this.splitText[5].split('::')[1]
  get definition() { return this.readDefinition() }

  private readFeature = () => this.splitText[6].split('::')[1]
  get feature() { return this.readFeature() }

  private readApplication = () => this.splitText[7].split('::')[1]
  get application() { return this.readApplication() }

  private readRelation = () => {
    const CUT_LINE = 11
    if (this.splitText.length <= 8) {
      return []
    }
    const relationArr = []
    for (let i = CUT_LINE; i < this.splitText.length; i++) {
      const relationObj = {}
      const key = this.splitText[i].split('|')[1].split('/')[1]
      const value = this.splitText[i].split('|')[2].replace('[[', '').replace(']]', '')
      // console.log(key, value)
      Object.defineProperty(relationObj, key, { value,enumerable: true })
      relationArr.push(relationObj)
    }
    return relationArr
  }
  get relation() { return this.readRelation() }
}
