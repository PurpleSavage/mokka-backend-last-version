import { GoogleUserData } from "../types/google-response";

export abstract class GooglePort{
    abstract verifyToken(googleToken: string): Promise<GoogleUserData>
}