import * as Schedule from 'node-schedule';

const date = new Date(2024, 7, 8, 18, 1, 0);

const job = Schedule.scheduleJob(date, function(){
    console.log('scheduled job');
});

console.log("other stuff")
