module.exports.SECOND = 1000;
module.exports.MINUTE = this.SECOND * 60;
module.exports.HOUR = this.MINUTE * 60;
module.exports.DAY = this.HOUR * 24;

module.exports.dayly_poll_open_time = 7; // 7AM
module.exports.dayly_poll_close_time = 22; // 10PM
module.exports.poll_open_hours = this.dayly_poll_close_time - this.dayly_poll_open_time;