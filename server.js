const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPtiON !!');
  console.log(err.name);

  process.exit(1);
});

const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB)
  .then(() => console.log('DB Connected Succefully'))
  .catch((err) => console.log(err));

const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection !! => ', err.name);

  server.close(() => {
    process.exit(1);
  });
});

//"express": "^5.2.1"
//"mongoose": "^9.1.5"
