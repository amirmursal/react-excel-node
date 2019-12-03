var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var multer = require("multer");
var xlsx2json = require("xlsx2json");
let data = [];

app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));

var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    var datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  }
});

var upload = multer({
  //multer settings
  storage: storage,
  fileFilter: function(req, file, callback) {
    //file filter
    if (
      ["xls", "xlsx"].indexOf(
        file.originalname.split(".")[file.originalname.split(".").length - 1]
      ) === -1
    ) {
      return callback(new Error("Wrong extension type"));
    }
    callback(null, true);
  }
}).single("file");

/** API path that will upload the files */
app.post("/upload", function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    /** Multer gives us file info in req.file object */
    if (!req.file) {
      res.json({ error_code: 1, err_desc: "No file passed" });
      return;
    }
    xlsx2json(req.file.path).then(jsonArray => {
      res.json(jsonArray[0]);
      //data = jsonArray[0];
    });
  });
});

app.get("/getData", function(req, res) {
  res.json(data);
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen("5000", function() {
  console.log("running on 5000...");
});
