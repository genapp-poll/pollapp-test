require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./models");
//can use db.Poll or db.User

const handle = require("./handlers/index");
const routes = require("./routes");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const dayly_poll_open_time = 7; // 7AM
const dayly_poll_close_time = 22; // 10PM

async function open_poll(){
    const current_poll = await db.Poll.findOne({open: true});

    console.log("current_poll", current_poll);

    if(!current_poll){
        const poll_open_time = new Date();
        poll_open_time.setMilliseconds(0);
        poll_open_time.setSeconds(0);
        poll_open_time.setMinutes(0);
        poll_open_time.setHours(dayly_poll_open_time);

        const poll_close_time = new Date();
        poll_close_time.setMilliseconds(0);
        poll_close_time.setSeconds(0);
        poll_close_time.setMinutes(0);
        poll_close_time.setHours(dayly_poll_close_time);

        const current_date = Date.now();
        if((current_date >= poll_open_time.getTime()) && (current_date < poll_close_time.getTime())){
            console.log(await db.Poll.updateOne({open: false, close: false}, {$set: {open: true, open_time: current_date}}, {upsert: false}));
        }
    }
};

async function close_poll(){
    const current_poll = await db.Poll.findOne({open: true});
    
    console.log("current_poll", current_poll);

    if(current_poll){
        const poll_close_time = new Date();
        poll_close_time.setMilliseconds(0);
        poll_close_time.setSeconds(0);
        poll_close_time.setMinutes(0);
        poll_close_time.setHours(dayly_poll_close_time);

        const current_date = Date.now();
        if(current_date >= poll_close_time.getTime()){
            current_poll.open = false;
            current_poll.close = true;
            current_poll.close_time = current_date;
            await current_poll.save();
            console.log("closed poll", current_poll);
        }
    }
};

let poll_open_time = new Date();
poll_open_time.setMilliseconds(0);
poll_open_time.setSeconds(0);
poll_open_time.setMinutes(0);
poll_open_time.setHours(dayly_poll_open_time);

let poll_close_time = new Date();
poll_close_time.setMilliseconds(0);
poll_close_time.setSeconds(0);
poll_close_time.setMinutes(0);
poll_close_time.setHours(dayly_poll_close_time);

if (poll_open_time.getTime() < Date.now()){ //if time is already gone in the day set it to next day
    poll_open_time = new Date(poll_open_time.getTime() + DAY);
}

if (poll_close_time.getTime() < Date.now()){ //if time is already gone in the day set it to next day
    poll_close_time = new Date(poll_close_time.getTime() + DAY);
}

open_poll();
setTimeout(async () => {
    await open_poll();
    setInterval(open_poll, DAY);
}, poll_open_time.getTime() - Date.now());

close_poll();
setTimeout(async () => {
    await close_poll();
    setInterval(close_poll, DAY);
}, poll_close_time.getTime() - Date.now());

app.get("/", (req, res) => res.json({ hello: "world" }));
//(req, res) => res.json({ hello: "world" }) <--- middleware function
app.use("/api/auth", routes.auth);
app.use("/api/polls", routes.poll);
app.use("/api/users", routes.user);
app.use("/api/schools", routes.school);

app.use(handle.notFound);
app.use(handle.errors);

app.listen(port, console.log(`Server started on port ${port}`));
