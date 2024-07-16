const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://eligachago:MTccqnfA3ElBWrwK@cluster0.aupqylj.mongodb.net/"
  )
  .then(() => console.log("Connected mongo db"))
  .catch((e) => console.log(e));
