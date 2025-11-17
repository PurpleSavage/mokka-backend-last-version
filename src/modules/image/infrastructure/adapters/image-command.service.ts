import { HttpStatus, Injectable } from "@nestjs/common";
import { ImageRepository } from "../../domain/repositories/image.repository";
import { ImageEntity } from "../../domain/entities/image.entity";
import { SavedGenerateImageVO } from "../../domain/value-objects/saved-generate-image.vo";
import {  UpdateDownloadsResultDomainModel } from "../../domain/models/download-result.model";
import { SharedImageEntity } from "../../domain/entities/shared-image.entity";
import { PinoLogger } from "nestjs-pino";
import { InjectModel } from "@nestjs/mongoose";
import { ImageDocument } from "../schemas/image.schema";
import { ImageSharedDocument } from "../schemas/image-shared.schema";
import { Model } from "mongoose";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ObjectId } from 'mongodb';
import { normalizeId } from "src/shared/application/helpers/normalized-obj";
import { RemixImageVo } from "../../domain/value-objects/remix-image.vo";
import { RemixImageEntity } from "../../domain/entities/remix-image.entity";
import { RemixImageDocument } from "../schemas/remix-image.schema";
import { ErrorPlatformMokka } from "src/shared/infrastructure/enums/error-detail-types";


@Injectable()
export class ImageCommandService implements ImageRepository{
    constructor(
        @InjectModel('Image') private readonly imageModel: Model<ImageDocument>,
        @InjectModel('ImageShared') private readonly sharedImageModel: Model<ImageSharedDocument>,
        @InjectModel('RemixImage') private readonly remixImageModel:Model<RemixImageDocument>,
        private readonly logger: PinoLogger
    ){}
    async savedGeneratedImage(savedGenerateImageVO: SavedGenerateImageVO): Promise<ImageEntity> {
        try {
            const image = new this.imageModel({
                idUser:savedGenerateImageVO.userId,
                prompt:savedGenerateImageVO.prompt,
                aspectRatio:savedGenerateImageVO.aspectRatio,
                height:savedGenerateImageVO.height,
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
            throw new MokkaError({
                message: 'Failed to save audio record',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed'
            })
        }
    }
    async updateDownLoadsSharedImage(imageId: string): Promise<UpdateDownloadsResultDomainModel> {
        try {
            const updatedImage = await this.sharedImageModel.findByIdAndUpdate(
                new ObjectId(imageId),                  // buscar por _id
                { $inc: { downloads: 1 } },                 // incrementar en 1
                { new: true }                           // devolver el doc actualizado
            )
            if (!updatedImage) {
                throw new MokkaError({
                    message: 'Image not found',
                    errorType: ErrorPlatformMokka.DATABASE_FAILED,
                    status: HttpStatus.NOT_FOUND,
                    details: 'Database operation failed to search image'
                })
            }

            return new UpdateDownloadsResultDomainModel()
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
            throw new MokkaError({
                message: 'Error updating the number of image downloads',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed to find image'
            })
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
                    message:'Error sharing imgae',
                    imageId
                },
                'Error creating the image shared'
            )
            throw new MokkaError({
                message: 'Error sharing imgae',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed'
            })
        }
    }
    async saveRemixImage(remixImageVo:RemixImageVo):Promise<RemixImageEntity>{
        try {
            const remixImage= new this.remixImageModel({
                user:remixImageVo.user,
                imageBase:remixImageVo.imageBase,
                prompt:remixImageVo.prompt,
                width:remixImageVo.width,
                height:remixImageVo.height,
                imageUrl:remixImageVo.imageUrl,
                prevImageUrl:remixImageVo.prevImageUrl,
                aspectRatio:remixImageVo.aspectRatio,
                size:remixImageVo.size
            })
            const remixImageSaved = await remixImage.save()
            return new RemixImageEntity()
            .setAspectRatio(remixImageSaved.aspectRatio)
            .setCreateDate(remixImageSaved.createdAt)
            .setHeight(remixImageSaved.height)
            .setWidth(remixImageSaved.width)
            .setId(remixImageSaved._id.toString())
            .setImageUrl(remixImageSaved.imageUrl)
            .setPrevImageUrl(remixImage.prevImageUrl)
            .setPrompt(remixImageSaved.prompt)
            .setSize(remixImageSaved.size)
            .setImageBase(normalizeId(remixImage.imageBase))
            
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:'Error creating new remix image',
                    user:remixImageVo.user
                },
                'Error creating new remix image'
            )
            throw new MokkaError({
                message: 'Error creating new remix image',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed'
            })
        }
    }
    async updateRemixes(imageShared: string): Promise<string> {
        try {
            const updatedImage = await this.sharedImageModel.findByIdAndUpdate(
                new ObjectId(imageShared),                  // buscar por _id
                { $inc: { remixes: 1 } },                 // incrementar en 1
                { new: true }                           // devolver el doc actualizado
            )
            if (!updatedImage) {
                throw new MokkaError({
                    message: 'Image not found',
                    errorType: ErrorPlatformMokka.DATABASE_FAILED,
                    status: HttpStatus.NOT_FOUND,
                    details: 'Database operation failed to search image'
                })
            }
            return updatedImage._id.toString()
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:'Error creating new remix image',
                    imageSharedId:imageShared
                },
                'Error creating new remix image'
            )
            throw new MokkaError({
                message: 'Error to update remixes',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed'
            })
        }
    }
}