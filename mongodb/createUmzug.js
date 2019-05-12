const Umzug = require('umzug')

module.exports = ({ db, logger }) => new Umzug({
  storage: 'mongodb',
  storageOptions: {
    connection: db.mongoose.connection,
  },
  logging: logger.info,
  migrations: {
    params: [{ db, logger }],
    path: `${process.cwd()}/mongodb/migrations`,
    traverseDirectories: true,
  },
})

