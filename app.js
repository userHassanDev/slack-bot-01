const db = require("./models/index");
const { app } = require("./Controllers/slackController");
const receiver = require("./Controllers/customController");
require("dotenv").config();

db.mongoose
  .connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("DB Connected!"))
  .catch((err) => console.log("Error! connecting DB"));

app
  .start(process.env.PORT || 3500)
  .then((res) => console.log("Slack Chat Bot App Start!"));
