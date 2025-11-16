import {  UpdateDownloadsResultDomainModel } from "../models/download-result.model";
import { ImageEntity } from "../entities/image.entity";
import { SharedImageEntity } from "../entities/shared-image.entity";
import { SavedGenerateImageVO } from "../value-objects/saved-generate-image.vo";
import { RemixImageVo } from "../value-objects/remix-image.vo";
import { RemixImageEntity } from "../entities/remix-image.entity";

export abstract class ImageRepository{
    abstract updateDownLoadsSharedImage(imageId:string):Promise<UpdateDownloadsResultDomainModel>
    abstract shareImage(imageId:string,sharedBy:string):Promise<SharedImageEntity>
    abstract savedGeneratedImage(savedGenerateImageVO:SavedGenerateImageVO):Promise<ImageEntity>
    abstract saveRemixImage(remixImageVo:RemixImageVo):Promise<RemixImageEntity>
}