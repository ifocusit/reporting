export class Activity {

  public constructor(public date: string, public duration: string, public type: ActivityType) {}
}

export enum ActivityType {
  WORK = 'WORK',
  OFF = 'OFF'
}