//handles startup concerns like connecting to db, reading environment vars
require('dotenv').config();
const app = require('./app'); //imports app.js file to use the express app and routes defined in it

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}`);
});

