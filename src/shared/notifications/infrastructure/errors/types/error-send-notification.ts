import { ErrorNotification } from "./error-notification";


export interface ErrorSendNotification<T> extends ErrorNotification{
    notification?:T
}