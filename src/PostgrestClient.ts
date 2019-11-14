import * as FETCH from 'node-fetch'
import fetch from 'node-fetch'
import PostgrestExpressionBuilder from './PostgrestExpressionBuilder'

interface PostgrestClientOptions {
  host: string
}

export default class PostgrestClient {
  options: PostgrestClientOptions

  constructor(options: PostgrestClientOptions) {
    this.options = options
  }

  query(endpoint: string): PostgrestExpressionBuilder {
    return new PostgrestExpressionBuilder({
      endpoint: endpoint
    })
  }

  async execute(query: PostgrestExpressionBuilder): Promise<FETCH.Response> {
    const {endpoint} = query.parameters
    const {host} = this.options

    return fetch(`${host}/${endpoint}?${query.execute()}`)
  }

}
