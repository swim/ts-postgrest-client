import PostgrestQueryBuilder from './PostgrestQueryBuilder'

export default class PostgrestExpressionBuilder extends PostgrestQueryBuilder {

  handler(value: any, operator: string): PostgrestExpressionBuilder {
    const {column} = this.store

    this.store.query.push(
      this.buildQuery(column, operator, value)
    )

    return this
  }

  equals(value: string | number): PostgrestExpressionBuilder {
    return this.handler(value, 'eq')
  }

  greaterThan(value: string | number): PostgrestExpressionBuilder {
    return this.handler(value, 'gt')
  }

  greaterThanOrEqual(value: string | number): PostgrestExpressionBuilder {
    return this.handler(value, 'gte')
  }

  lessThan(value: string | number): PostgrestExpressionBuilder {
    return this.handler(value, 'lt')
  }

  lessThanOrEqual(value: string | number): PostgrestExpressionBuilder {
    return this.handler(value, 'lte')
  }

  notEqual(value: string | number): PostgrestExpressionBuilder {
    return this.handler(value, 'neq')
  }

  like(value: any): PostgrestExpressionBuilder {
    return this.handler(value, 'like')
  }

  iLike(value: any): PostgrestExpressionBuilder {
    return this.handler(value, 'ilike')
  }

  in(value: Array<string> | Array<number>): PostgrestExpressionBuilder {
    return this.handler(`(${value.join(',')})`, 'in')
  }

  is(value: any) {

  }

  contains(value: any) {

  }

  contained(value: any) {

  }

  overlap(value: any) {

  }

  strictlyLeft(value: any) {

  }

  strictlyRight(value: any) {

  }

  doesNotExtendRight(value: any) {

  }

  doesNotExtendLeft(value: any) {

  }

  adjacentTo(value: any) {

  }

}
