/// <reference types="jest" />

import PostgrestClient from '../src/PostgrestClient'

test('test client query creation', () => {
  const client = new PostgrestClient({
    host: ''
  })

  const query = client.query('document')
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

  expect(query.execute()).toBe(
    'and=(documentId.neq.0)&select=schemaId(name,title,settings),documentId'
  )
})
