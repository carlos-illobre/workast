module.exports = {             
  typeDef: `          
    type Query {
      hello: String!
    }                      
  `,
  resolver: {
    Query: {
      hello: (root, args, context) => 'Hello world!',
    },
  },
} 
