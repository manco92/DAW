//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require("express");
var cors = require("cors");
var corsOptions = { origin: "*", optionSucessStatus: 200 };

var app = express();
app.use(cors(corsOptions));

var utils = require("./mysql-connector");

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static("/home/node/app/static/"));

//=======[ Main module code ]==================================================
app.get("/otraCosa/:id/:algo", (req, res, next) => {
  console.log("id", req.params.id);
  console.log("algo", req.params.algo);
  utils.query(
    "select * from Devices where id=" + req.params.id,
    (err, rsp, fields) => {
      if (err == null) {
        console.log("rsp", rsp);
        res.status(200).send(JSON.stringify(rsp));
      } else {
        console.log("err", err);
        res.status(409).send(err);
      }
    }
  );
});
app.post("/device", (req, res, next) => {
  const { id, name, description, type, state } = req.body;
  let updateQuery = "";

  if (name && description && type) {
    updateQuery = `UPDATE Devices SET name = "${name}", description = "${description}", type = "${type}" WHERE id = "${id}"`;
  } else {
    updateQuery = `UPDATE Devices SET state = "${
      state ? 1 : 0
    }" WHERE id = "${id}"`;
  }

  utils.query(updateQuery, (err, rsp, fields) => {
    if (err == null) {
      console.log("rsp", rsp);
      res.status(200).send(JSON.stringify(rsp));
    } else {
      console.log("err", err);
      res.status(409).send(err);
    }
  });
});

app.delete("/device", (req, res, next) => {
  const { id } = req.body;
  const updateQuery = `DELETE from Devices WHERE id = "${id}"`;

  utils.query(updateQuery, (err, rsp, fields) => {
    if (err == null) {
      console.log("rsp", rsp);
      res.status(200).send(JSON.stringify(rsp));
    } else {
      console.log("err", err);
      res.status(409).send(err);
    }
  });
});

app.get("/devices/", function (req, res, next) {
  utils.query("select * from Devices", (err, rsp, fields) => {
    if (err == null) {
      console.log("rsp", rsp);
      res.status(200).send(JSON.stringify(rsp));
    } else {
      console.log("err", err);
      res.status(409).send(err);
    }
  });
});

app.post("/device/add", (req, res, next) => {
  const { name, description, type } = req.body;
  let updateQuery = `INSERT INTO Devices (name, description, type, state) VALUES ("${name}", "${description}", "${type}", 0)`;

  utils.query(updateQuery, (err, rsp, fields) => {
    if (err == null) {
      console.log("rsp", rsp);
      res.status(200).send(JSON.stringify(rsp));
    } else {
      console.log("err", err);
      res.status(409).send(err);
    }
  });
});

app.listen(PORT, function (req, res) {
  console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
