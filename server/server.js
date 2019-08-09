const express = require('express');
const path = require('path');
var bodyParser=require('body-parser');
const router = require('./video_cropper');
const fileUpload = require('express-fileupload')
const session = require("express-session");
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(fileUpload())
app.use(cors())
app.use(
  session({
    secret: "dummy-value",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: 600000
    }
  })
);
app.use(bodyParser.urlencoded({
  extended : true
}))
router(app);
http.listen(port, () => console.log(`Listening on port ${port}`));