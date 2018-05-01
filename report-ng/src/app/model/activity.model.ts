export class Activity {

  public id: string;

  public constructor(public date: string, public duration: string, public type: ActivityType = ActivityType.WORK) {}
}

export enum ActivityType {
  WORK = 'WORK',
  OFF = 'OFF'
}