const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(
    import.meta.env.VITE_CONN_STRING
  )
  .then(() => console.log("Connected mongo db"))
  .catch((e) => console.log(e));
