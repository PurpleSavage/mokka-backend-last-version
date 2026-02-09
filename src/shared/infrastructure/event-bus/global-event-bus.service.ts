import { Injectable } from "@nestjs/common";
import { filter, map, Subject } from "rxjs";
import { AppEvent, Eventsname } from "./global-event-bus.types";




@Injectable()
export class GlobalEventBusService{
    private eventSubject = new Subject<AppEvent>()
    emit(event: AppEvent) {
        this.eventSubject.next(event);
    }

    on(eventType: Eventsname) {
        return this.eventSubject.asObservable().pipe(
            filter(event => event.type === eventType),
            map(event => event.payload)
        );
    }

    onAll() {
        return this.eventSubject.asObservable();
    }
}