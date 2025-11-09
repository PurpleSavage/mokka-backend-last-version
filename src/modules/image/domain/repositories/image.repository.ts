import { UpdateDownloadsResultDomainDto } from "../dtos/download-result.dto";
import { ImageEntity } from "../entities/image.entity";
import { SharedImageEntity } from "../entities/shared-image.entity";
import { SavedGenerateImageVO } from "../value-objects/saved-generate-image.vo";

export abstract class ImageRepository{
    abstract updateDownLoadsSharedImage(imageId:string):Promise<UpdateDownloadsResultDomainDto>
    abstract shareImage(imageId:string,sharedBy:string):Promise<SharedImageEntity>
    abstract savedGeneratedImage(savedGenerateImageVO:SavedGenerateImageVO):Promise<ImageEntity>
}