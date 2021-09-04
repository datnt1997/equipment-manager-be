const { MongoClient } = require('mongodb');
const app = require('./server');
const usersDAO = require('./dao/usersDAO');
const equipmentsDAO = require('./dao/equipmentsDAO');

const port = process.env.PORT || 8000

MongoClient.connect(
  process.env.DB_URI,
  { useNewUrlParser: true },
)
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await usersDAO.injectDB(client)
    await equipmentsDAO.injectDB(client)
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  })
