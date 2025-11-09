import { ImageEntity } from "../../domain/entities/image.entity";
import { SharedImageEntity } from "../../domain/entities/shared-image.entity";

export abstract class ImagePort{
    abstract listImagesByUserId(userId:string):Promise<ImageEntity[]>
    abstract listSharedImage(page:number):Promise<SharedImageEntity[]>
}