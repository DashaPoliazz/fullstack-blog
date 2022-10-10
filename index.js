const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, (error) => {
  if (error) {
    console.log(`Server has not been started. Erorr: ${error}`);
  }

  console.log(`Server has been started successfully on port ${PORT}`);
});

app.get("/helloWorld", (req, res) => {
  res.send("Hello Express!");
});
