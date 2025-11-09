import { HttpStatus, Injectable } from "@nestjs/common";
import { ImageRepository } from "../../domain/repositories/image.repository";
import { ImageEntity } from "../../domain/entities/image.entity";
import { SavedGenerateImageVO } from "../../domain/value-objects/saved-generate-image.vo";
import { UpdateDownloadsResultDomainDto } from "../../domain/dtos/download-result.dto";
import { SharedImageEntity } from "../../domain/entities/shared-image.entity";
import { PinoLogger } from "nestjs-pino";
import { InjectModel } from "@nestjs/mongoose";
import { ImageDocument } from "../schemas/image.schema";
import { ImageSharedDocument } from "../schemas/image-shared.schema";
import { Model } from "mongoose";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ObjectId } from 'mongodb';
import { normalizeId } from "src/shared/application/helpers/normalized-obj";
import { UserDocument } from "src/modules/auth/infrastructure/schemas/user.schema";
import { SharedByEntity } from "../../domain/entities/shared-by.entity";
@Injectable()
export class ImageCommandService implements ImageRepository{
    constructor(
        @InjectModel('Image') private readonly imageModel: Model<ImageDocument>,
        @InjectModel('ShredImage') private readonly sharedImageModel: Model<ImageSharedDocument>,
        private readonly logger: PinoLogger
    ){}
    async savedGeneratedImage(savedGenerateImageVO: SavedGenerateImageVO): Promise<ImageEntity> {
        try {
            const image = new this.imageModel({
                idUser:savedGenerateImageVO.userId,
                prompt:savedGenerateImageVO.prompt,
                aspectRatio:savedGenerateImageVO.aspectRatio,
                height:savedGenerateImageVO.width,
                width:savedGenerateImageVO.width,
                imageUrl:savedGenerateImageVO.imageUrl,
                size:savedGenerateImageVO.size,
                style:savedGenerateImageVO.style,
                subStyle:savedGenerateImageVO.subStyle
            })

            const savedImage = await image.save()
            return new ImageEntity()
            .setId(savedImage._id.toString())
            .setAspectRatio(savedImage.aspectRatio)
            .setCreateDate(savedImage.createdAt)
            .setHeight(savedImage.height)
            .setImageUrl(savedImage.imageUrl)
            .setPrompt(savedImage.prompt)
            .setSize(savedImage.size)
            .setStyle(savedImage.style)
            .setSubStyle(savedImage.subStyle)
            .setWidth(savedImage.width)
            .build()
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"Error to save generate image"
                },
                'Error saving image'
            )
            throw new MokkaError(
                'Failed to save audio record',
                'Database operation failed',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
    async updateDownLoadsSharedImage(imageId: string): Promise<UpdateDownloadsResultDomainDto> {
        try {
            const updatedImage = await this.sharedImageModel.findByIdAndUpdate(
                new ObjectId(imageId),                  // buscar por _id
                { $inc: { downloads: 1 } },                 // incrementar en 1
                { new: true }                           // devolver el doc actualizado
            )
            if (!updatedImage) {
                throw new MokkaError(
                    'Image not found',
                    'Database operation failed',
                    HttpStatus.NOT_FOUND
                )
            }

            return new UpdateDownloadsResultDomainDto()
            .setImageId(updatedImage._id.toString())
            .setDownloads(updatedImage.downloads)
            .build()
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"Error updating the number of image downloads"
                },
                'Error updating the number of image downloads'
            )
            throw new MokkaError(
                'Error updating the number of image downloads',
                'Database operation failed',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
    async shareImage(imageId: string, sharedBy: string): Promise<SharedImageEntity> {
        try {
            const sharedImage = new this.sharedImageModel({
                sharedBy,
                downloads:0,
                remixes: 0,
                image:imageId
            })
            const response = await sharedImage.save()

            return new SharedImageEntity()
            .setId(response._id.toString())
            .setImage(normalizeId(response.image))
            .setSharedBy(normalizeId(response.sharedBy))
            .setRemixes(response.remixes)
            .setDownloads(response.downloads)
            .build()
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"Error creating the image shared"
                },
                'Error creating the image shared'
            )
            throw new MokkaError(
                'Error creating the image shared',
                'Database operation failed',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
    async createRemixImage(imageSharedId:string):Promise<SharedImageEntity>{
        try {
            const updatedSharedImage = await this.sharedImageModel.findByIdAndUpdate(
                new ObjectId(imageSharedId),                  // buscar por _id
                { $inc: { remixes: 1 } },                 // incrementar en 1
                { new: true }
            )
            .populate<{ image: ImageDocument}>('image')
            .populate<{ sharedBy: UserDocument}>('sharedBy')
            .exec()

            if(!updatedSharedImage){
               throw new MokkaError(
                    'Error creating new shared image remix',
                    'Database operation failed',
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
            const image = new ImageEntity()
            .setAspectRatio(updatedSharedImage.image.aspectRatio)
            .setCreateDate(updatedSharedImage.image.createdAt)
            .setHeight(updatedSharedImage.image.height)
            .setImageUrl(updatedSharedImage.image.imageUrl)
            .setPrompt(updatedSharedImage.image.prompt)
            .setSize(updatedSharedImage.image.size)
            .setStyle(updatedSharedImage.image.style)
            .setSubStyle(updatedSharedImage.image.subStyle)
            .setWidth(updatedSharedImage.image.width)
            .build();

            const sharedBy = new SharedByEntity()
            .setId(updatedSharedImage.sharedBy._id.toString())
            .setEmail(updatedSharedImage.sharedBy.email)
            .build();


            const sharedImageEntity = new SharedImageEntity()
            .setId(updatedSharedImage._id.toString())
            .setImage(image)
            .setSharedBy(sharedBy)
            .setRemixes(updatedSharedImage.remixes)
            .setDownloads(updatedSharedImage.downloads)
            .build()

            return sharedImageEntity
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:'Error creating new shared image remix'
                },
                'Error creating new shared image remix'
            )
            throw new MokkaError(
                'Error creating new shared image remix',
                'Database operation failed',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}