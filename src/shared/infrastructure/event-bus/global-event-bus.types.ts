

export enum Eventsname{
    INCREASE_CREDITS='increase-credits',
    DECREASE_CREDITS='decrease-credits',
    UPDATE_CREDITS='update-credits'
}
export interface AppEvent{
    type: Eventsname;
    payload: {
        userId:string,
        credits:number
    };
}