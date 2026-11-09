require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  if (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
  console.log(`Auth server on port ${PORT}`);
});
