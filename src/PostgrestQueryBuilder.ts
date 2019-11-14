import querystring from 'querystring'

interface PostgrestQueryBuilderStore {
  column: string
  select: string
  query: Array<string>
  subQuery: Array<string>
}

interface PostgrestQueryBuilderParameters {
  endpoint?: string
  conjunction?: string
  order?: string
  limit?: number
  offset?: number
}

interface SelectColumnRelation {
  [index: string]: string
}
type SelectColumn = Array<string>

export default class PostgrestQueryBuilder {
  parameters: PostgrestQueryBuilderParameters
  store: PostgrestQueryBuilderStore

  constructor(parameters?: PostgrestQueryBuilderParameters, store?: PostgrestQueryBuilderStore) {
    this.parameters = parameters ? parameters : {
      endpoint: '',
      conjunction: 'and'
    }

    this.store = store ? store : {
      column: '',
      select: '',
      query: [],
      subQuery: []
    }
  }

  execute(): string {
    const {conjunction} = this.parameters

    return this.buildStore(conjunction ? conjunction : 'and')
  }

  protected buildStore(conjunction: string): string {
    const result: any = {}
    const {select, query, subQuery} = this.store

    if (query.length !== 0) {
      result[conjunction] = `(${query.join(',')}`

      if (subQuery.length !== 0) {
        result[conjunction] += `${subQuery})`
      }
      else {
        result[conjunction] += `)`
      }
    }

    if (select) {
      result['select'] = select
    }

    // @todo, expose encoding as an option.
    return querystring.stringify(result, '&', '=', {
      encodeURIComponent: (value) => {
        return value
      }
    })
  }

  query(column: string, operator?: string, value?: any): this {
    this.store.column = column

    if (operator && value) {
      this.store.query.push(
        this.buildQuery(column, operator, value)
      )
    }

    return this
  }

  addQuery(query: PostgrestQueryBuilder): this {
    const {conjunction} = query.parameters

    this.store.subQuery.push(
      `,${conjunction}(${query.store.query})`
    )

    return this
  }

  protected buildQuery(column: string, operator: string, value: any): string {
    return `${column}.${operator}.${value}`
  }

  select(value: any): this {
    this.buildSelect(value)

    return this
  }

  protected buildSelect(values: SelectColumn): SelectColumn {
    if (values instanceof Array) {
      values = values.filter((value: any) => {
        if (value instanceof Object) {
          this.store.select += this.buildSelectRelation(value)
          return false
        }

        return value
      })

      if (values.length !== 0) {
        this.store.select += ',' + values.join(',')
      }
    }

    return values
  }

  protected buildSelectRelation(values: SelectColumnRelation): string {
    for (const [key, value] of Object.entries(values) as any) {
      if (value instanceof Array) {
        return `${key}(${this.buildSelect(value)})`
      }
    }

    return ''
  }

  conjunction(value: string): this {
    this.parameters.conjunction = value

    return this
  }

  order(column: string, value: string): this {
    this.parameters.order = `${column}.${value}`

    return this
  }

  limit(value: number): this {
    this.parameters.limit = value

    return this
  }

  offset(value: number): this {
    this.parameters.offset = value

    return this
  }

  range(value: Array<number>) {
    // @todo, headers.
  }

}
