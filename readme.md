Isomorphic Postgrest Client in Typescript which provides a fluent API.

```shell
npm i ts-postgrest-client
```

### Table of contents
1. [Usage](#usage)
  1. [Basic usage](#usage)
  2. [Advanced usage](#advanced)
2. [API](#api)
  1. [Operators](#operators)

<a name="usage"></a>
Basic usage:
```typescript
const client = new PostgrestClient({
  host: 'http://localhost:3000'
})

const query = client.query('document')
  .query('documentId').notEqual('test')
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

client.execute(query).then(async res => {
  console.log(await res.json())
})
```

<a name="advanced"></a>
Executing multiple queries in parallel:
```typescript
const client = new PostgrestClient({
  host: 'http://localhost:3000'
})

const documentQuery = client.query('document')
  .query('documentId').notEqual('test')

const schemaQuery = client.query('schema')
  .query('schemaId').notEqual('test')

Promise.all([client.execute(documentQuery), client.execute(schemaQuery)]).then(async res => {
  console.log(await res.json())
})
```

Executing complex queries:
```typescript
const client = new PostgrestClient({
  host: 'http://localhost:3000'
})

const schemaQuery = client.query('schema')
  .query('schemaId').notEqual(10)

const documentQuery = client.query('document')
  .query('documentId').notEqual('test')
  .addQuery(schemaQuery)

client.execute(documentQuery).then(async res => {
  console.log(await res.json())
})
```

<a name="api"></a>
#### API
This client aims to closely mirror the Postgrest API, http://postgrest.org/en/v6.0/api.html.

Using an operator on a query can be easily achieved via the QueryBuilders expressive methods:
```typescript
const documentQuery = client.query('document')
  .query('documentId').notEqual(0).lessThan(10)
```

Additionally an escape hatch is provided via directly passing the Postgrest abbreviation in:
```typescript
const documentQuery = client.query('document')
  .query('documentId', 'neq', 0).query('documentId', 'lt', 10)
```

##### Operators
|    Method            | in Postgrest  | Name                  |
| -------------------- | ------------- | --------------------- |
| .equals              | eq            | Equals                |
| .greaterThan         | gt            | Greater than          |
| .greaterThanOrEqual  | gte           | Greater than or equal |
| .lessThan            | lt            | Less than             |
| .lessThanOrEqual     | lte           | Less than or equal    |
| .notEqual            | neq           | Not equal             |
| .like                | like          | Like                  |
| .ilike               | ilike         | iLike                 |
| .in                  | in            | In                    |
| .is                  | is            | Is                    |
