const dotenv = require('dotenv');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: "*"
};
dotenv.config();

app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ 
  extended: true, 
  limit: '50mb',
  parameterLimit: 50000
}));

//
app.use(express.static("public"));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Onboarding microservices." });
});

//
require("./app/routes/routes")(app);

//
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});