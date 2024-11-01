const express = require("express");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const studentRoute = require("./routes/studentRoute");
const careTakerRoute = require("./routes/careTakerRoute");
const outingRoute = require("./routes/outingRoute");
const bodyParser = require("body-parser");
const cors = require("cors");


dotEnv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log(`error occured:${err}`);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("app statred listening");
});



app.use("/student",studentRoute);
app.use("/careTaker",careTakerRoute);
app.use("/outing",outingRoute);

