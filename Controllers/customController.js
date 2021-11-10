const { receiver } = require("./slackController");
const db = require("../models/index");
const Response = db.responses;
const bodyParser = require("body-parser");

receiver.router.use(bodyParser.urlencoded({ extended: false }));
receiver.router.use(bodyParser.json());

receiver.router.get("/responses", (req, res) => {
  let query = {};
  if (req.query) {
    if (req.query.username) {
      query = { "user.username": req.query.username };
    }
  }

  Response.find(query)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving responses.",
      });
    });
});

module.exports = receiver;
