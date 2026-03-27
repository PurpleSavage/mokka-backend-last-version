import {  Model3DEntity } from "../../domain/entities/model-3d-mockup.entity";

export abstract class Mockups3DPort{
    abstract list3DMoclups(page:number):Promise<Model3DEntity[]>
}
