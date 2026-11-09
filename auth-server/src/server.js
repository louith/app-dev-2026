require("dotenv").config();
const app = require("./app");

app.listen(process.env.PORT, () =>
  console.log(`Auth server on port ${process.env.PORT}`),
);
