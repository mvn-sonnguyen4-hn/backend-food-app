const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require('multer')
const dotenv = require("dotenv");
// route
const user = require("./routes/user.route");
const food = require("./routes/food.route");
const category = require("./routes/category.route");
const order = require("./routes/order.route");
const message = require("./routes/message.route");

dotenv.config();

const db = require("./config/db");
db.connect();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

app.use('/api/auth', user);
app.use('/api/food', food);
app.use('/api/category', category);
app.use('/api/order', order);
app.use('/api/message', message);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App is running", PORT);
});
