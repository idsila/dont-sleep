require("dotenv").config();

const dataBase = require("./dataBase.js");
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const cors = require("cors");
const app = express();


app.use(express.json());
app.use(express.static("public"));
app.use(express.static("src"));
app.use(cors({ methods: ["POST", "GET"] }));



function timeNow() {
  return new Date().getTime();
}

app.post("/add-link", async (req, res) => {
  const { title, link } = req.body;
  dataBase.insertOne({ title, link: link, timeLog: Math.ceil(timeNow()/1000) }).then(data_1 => {
    dataBase.find().then(data_2 => {
      res.send({ all: data_2, currentTime: Math.ceil(timeNow()/1000) });
    });
  })
});
app.post("/delete-link", async (req, res) => {
  dataBase.deleteOne(req.body).then(data_1 => {
    dataBase.find().then(data_2 => {
      res.send({ all: data_2, currentTime: Math.ceil(timeNow()/1000) });
    });
  })
});


app.post("/update", async (req, res) => {
  dataBase.find().then(data => {
    res.send({ all: data, currentTime: Math.ceil(timeNow()/1000)  });
  });
});


app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});



app.get("/wake-up", async (req, res) => {
  res.send({ type: 200 });
});




setInterval(async () => {
  dataBase.find().then(async (data) => {
    for(let obj of data){
      try {
        const res = await axios.get(obj.link);
        console.log(obj.link)
      }
      catch (error){
        console.log(error)
      }
    }
  });
}, (1000*60)*3);


;

app.listen(3000, (err) => {
  err ? err : console.log("STRATED SERVER");
});
