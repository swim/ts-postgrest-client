/// <reference types="jest" />

import PostgrestExpressionBuilder from '../src/PostgrestExpressionBuilder'

test('test manual query with select expression', () => {
  const query = new PostgrestExpressionBuilder()

  query.query('id', 'gt', 4).query('title', 'lt', '10').select([
    'id',
    'title',
    {
      'directors': [
        'id',
        'last_name'
      ]
    }
  ])

  expect(query.execute()).toBe(
    'and=(id.gt.4,title.lt.10)&select=directors(id,last_name),id,title'
  )
})

test('test method query with select expression', () => {
  const queryOr = new PostgrestExpressionBuilder({
    conjunction: 'or'
  })

  expect(queryOr.query('age').greaterThan(30).lessThan(100).execute()).toBe(
    'or=(age.gt.30,age.lt.100)'
  )
})

test('test method and manual query combination', () => {
  const query = new PostgrestExpressionBuilder()

  query.query('id', 'gt', 4).query('title', 'lt', '10').select([
    'id',
    'title',
    {
      'directors': [
        'id',
        'last_name'
      ]
    }
  ])
  query.query('id').equals(4)

  expect(query.execute()).toBe(
    'and=(id.gt.4,title.lt.10,id.eq.4)&select=directors(id,last_name),id,title'
  )
})

test('test add query method', () => {
  const query = new PostgrestExpressionBuilder()
    .query('documentId').notEqual(0)
    .select([
      'documentId',
      {
        'schemaId': [
          'name',
          'title',
          'settings'
        ]
      }
    ])

  const queryOr = new PostgrestExpressionBuilder({
    conjunction: 'or'
  })
  queryOr.query('age').greaterThan(30).lessThan(100)
  query.addQuery(queryOr)

  expect(query.execute()).toBe(
    'and=(documentId.neq.0,or(age.gt.30,age.lt.100))&select=schemaId(name,title,settings),documentId'
  )
})
