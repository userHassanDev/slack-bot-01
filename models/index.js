const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require("dotenv").config();

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGO_URI;
db.responses = require("./responses.js")(mongoose);

module.exports = db;
