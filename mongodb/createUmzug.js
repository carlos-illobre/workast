const Umzug = require('umzug')

module.exports = ({ connection, logger, db }) => new Umzug({
    storage: 'mongodb',
    storageOptions: {
        connection,
    },
    logging: logger.info,
    migrations: {
        params: [{ connection, logger, db }],
        path: `${process.cwd()}/mongodb/migrations`,
        traverseDirectories: true,
    },
})

