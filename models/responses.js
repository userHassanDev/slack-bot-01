const mongoose = require("mongoose");

module.exports = (mongoose) => {
  const Response = mongoose.model(
    "response",
    mongoose.Schema(
      {
        user: Object,
        response: Object,
      },
      { timestamps: true }
    )
  );

  return Response;
};
