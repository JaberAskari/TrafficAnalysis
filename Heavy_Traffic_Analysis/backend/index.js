//Part1: Express Web Server
var express = require("express");
var cors = require("cors");
var app = express();

app.use(cors());

//app.use("/", require("./routes/test.js"));

const urlPrefix = process.env.URL_PATH_PREFIX || "";

app.use(urlPrefix + "/api/vehicle/", require("./routes/api/vehicles/vehicle"));

var port = 3030;
app.listen(port, function () {
  console.log(`server running on http://localhost:${port}`);
});
