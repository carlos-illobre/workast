exports.up = async ({ db, logger }) => {
  await db.User.create({
    name: 'Admin',
    avatar: 'http://admin',
  })
}
