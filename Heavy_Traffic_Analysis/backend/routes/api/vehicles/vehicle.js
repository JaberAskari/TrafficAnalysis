const express = require("express");
const router = express.Router();

const { query, validationResult } = require("express-validator");

const queryValidation = [
  query("year", "Wrong input for year!").isNumeric(),
  query("areaID", "Wrong input for area id!").isNumeric(),
  query("lamID", "Wrong input for lam id!").isNumeric(),
  query("startDayNumber").isNumeric(),
  query("endDayNumber").custom((endDayNumber) => {
    if (
      (endDayNumber == undefined) |
      (endDayNumber == "") |
      (endDayNumber == NaN) |
      !isNaN(endDayNumber)
    ) {
      return true;
    } else {
      throw new Error("Wrong input for start day number!");
    }
  }),
];

router.get(
  "/",
  queryValidation,
  (req, res, next) => {
    console.log(validationResult(req));

    if (validationResult(req).array().length > 0) {
      res.status(400).send(validationResult(req).array());
    } else next();
  },
  (req, res) => {
    var year = req.query.year;
    var areaID = req.query.areaID;
    var lamID = req.query.lamID;
    var startDayNumber = req.query.startDayNumber;
    var endDayNumber = req.query.endDayNumber;

    //var vehicleClass =req.query.vehicleClass;

    console.log(req.query);

    if (
      (endDayNumber == undefined) |
      (endDayNumber == "") |
      (endDayNumber == NaN)
    )
      endDayNumber = NaN;

    var spawn = require("child_process").spawn;
    var childProcess = spawn(
      "python",
      [
        "../python/cars/lamData.py",
        year,
        areaID,
        lamID,
        startDayNumber,
        endDayNumber,
        //,vehicleClass,
      ],
      { shell: false }
    );

    var uint8arrayToString = function (data) {
      return String.fromCharCode.apply(null, data);
    };

    var error;
    // Handle normal output
    childProcess.stdout.on("data", (data) => {
      //console.log('ind stdout',uint8arrayToString(data));

      //res.send(uint8arrayToString(data));
      res.write(data, () => {
        let finish = res.writableFinished;
        console.log("is finished: ", finish);
      });
    });

    // Handle error output
    childProcess.stderr.on("data", (data) => {
      //convert the Uint8Array to a readable string.
      //console.log("In stderr", uint8arrayToString(data));
      error = uint8arrayToString(data);
    });

    childProcess.on("exit", (code) => {
      if (code === 1) {
        res.status(404);
        res.end(error);
      } else {
        res.end();
      }

      console.log("Process quit with code : " + code);
    });
  }
);

module.exports = router;
