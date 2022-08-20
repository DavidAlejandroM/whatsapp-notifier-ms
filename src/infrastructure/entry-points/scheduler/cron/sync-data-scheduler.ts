import schedule from 'node-schedule';

export class SyncDataScheduler {
    constructor() {
        this.initScheduled();
    }

    private initScheduled() {
        schedule.scheduleJob("*/5 * * * *", function (fireDate) {
            console.log(`running scheduler ${new Date()}`);
        });
    }
}
