import { Injectable } from "@nestjs/common";
import { ValidateRawstrategyPort } from "../ports/validate-raw-strategy.port";

@Injectable()
export class ValidateRawSignedContextUseCase{
    private strategy:ValidateRawstrategyPort
    
    public setStrategy(strategy:ValidateRawstrategyPort){
        this.strategy=strategy
    }

    public  validateRaw(rawBody: Buffer, headers: Record<string, unknown>, secret: string){
        if (!this.strategy) {
            throw new Error('Strategy not set');
        }
        return this.strategy.validateRaw(rawBody, headers, secret);
    }
}