const db = require("../models");
const { HOUR, dayly_poll_open_time, dayly_poll_close_time, poll_open_hours } = require("../values");

const MAX_POINTS = 1000;

let leaderBoard = {all_time: [], latest_poll: []};

module.exports.leaderBoard = leaderBoard;

function get_leader_board(){
    return leaderBoard;
}

async function update_leader_board(){
    // token really shouldn't be included
    leaderBoard.all_time = await db.User.find({xp: {$exists: true}}, {xp: 1, token: 1}).sort({xp: "desc"}).lean(true);
    
    const latest_completed_poll = await db.Poll.findOne({/* close: true */}, {options: 1, close: 1}).populate("options.whoVoted", "xp token").sort({close_time: -1}).lean(true);

    console.log("latest_completed_poll", latest_completed_poll);
    if(latest_completed_poll){
        const popular_option = latest_completed_poll.options.reduce((prev, curr, i) => {
            if(prev && (prev.votes >= curr.votes)){
                return prev;
            }
            return curr;
        });

        const vote_count = popular_option.votes;

        console.log("popular_option", popular_option);
    
        // token really shouldn't be included
        leaderBoard.latest_poll = popular_option.whoVoted.map((v, i) => ({_id: v._id, token: v.token, xp: MAX_POINTS * ((vote_count/(vote_count-i))), option: popular_option.option,}));
    }
}

async function on_poll_close(poll){
    const popular_option = poll.options.reduce((prev, curr, i) => {
        if(prev && (prev.votes >= curr.votes)){
            return prev;
        }
        return curr;
    });

    const vote_count = popular_option.votes;

    Promise.all(popular_option.whoVoted.map(async (v, i) => {
        const user = await db.User.findById(v);

        const points = MAX_POINTS * ((vote_count/(vote_count-i)));
        // const xp = pointsToXp(points);
        user.xp = (user.xp || 0) + points;
        await user.save();
        return user;
    })).then(update_leader_board);
}

async function open_poll(){
    const current_poll = await db.Poll.findOne({open: true});

    // console.log("open_poll current_poll", current_poll);

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
    
    // console.log("close_poll current_poll", current_poll);

    if(current_poll){
        const poll_close_time = new Date();
        poll_close_time.setMilliseconds(0);
        poll_close_time.setSeconds(0);
        poll_close_time.setMinutes(0);
        poll_close_time.setHours(dayly_poll_close_time);

        const current_poll_close_time = (new Date(current_poll.open_time).getTime()) + (HOUR * poll_open_hours);

        const current_date = Date.now();
        console.log(current_date, current_poll_close_time, poll_open_hours, dayly_poll_open_time, dayly_poll_close_time);
        if((current_date >= poll_close_time.getTime()) || (current_date >= current_poll_close_time)){ // if daily poll closing time is gone or current poll has been open for longer than the hours between daily poll open & closing times
            current_poll.open = false;
            current_poll.close = true;
            current_poll.close_time = current_date;
            await current_poll.save();
            console.log("closed poll", current_poll);
            on_poll_close(current_poll);
            open_poll(); // if poll is closed because current poll has been open for too long then we should call this to ensure a new one is opened if the daily open time has already passed 
        }
    }
};

module.exports.update_leader_board = update_leader_board;

module.exports.get_leader_board = get_leader_board;

module.exports.open_poll = open_poll;

module.exports.close_poll = close_poll;