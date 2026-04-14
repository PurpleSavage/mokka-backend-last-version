import { BackgroundMockupEntity } from "../../domain/entities/background-mockup.entity";
import {  Model3DEntity } from "../../domain/entities/model-3d-mockup.entity";

export abstract class Mockups3DPort{
    abstract list3DMockups(page:number,limit:number):Promise<Model3DEntity[]>
    abstract listBackgroundsMockups(page:number,limit:number):Promise<BackgroundMockupEntity[]>
}
