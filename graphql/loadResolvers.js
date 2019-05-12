const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas')

module.exports = () => {

  const { typeDefs, resolvers } = fileLoader(`${__dirname}/**/*.resolver.js`)
    .reduce(({ typeDefs, resolvers }, { typeDef, resolver }) => ({
      typeDefs: [ ...typeDefs, typeDef ],
      resolvers: [ ...resolvers, resolver ],
    }), {
      typeDefs: [],
      resolvers: [],
    })

  return {
    typeDefs: mergeTypes(typeDefs.concat(fileLoader(`${__dirname}/**/*.graphql`)), { all: true }),
    resolvers: mergeResolvers(resolvers),
  }

}
