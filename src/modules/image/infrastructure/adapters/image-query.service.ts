import { HttpStatus, Injectable } from "@nestjs/common";
import { ImagePort } from "../../application/ports/image.port";
import { ImageEntity } from "../../domain/entities/image.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ImageDocument } from "../schemas/image.schema";
import { MokkaError } from "src/shared/errors/mokka.error";
import { PinoLogger } from "nestjs-pino";
import { SharedImageEntity } from "../../domain/entities/shared-image.entity";

import { UserDocument } from "src/modules/auth/infrastructure/schemas/user.schema";
import { SharedByEntity } from "../../domain/entities/shared-by.entity";
import { ErrorPlatformMokka } from "src/shared/infrastructure/enums/error-detail-types";
import { SharedImageDocument } from "../schemas/image-shared.schema";

@Injectable()
export class ImageQueryService implements ImagePort{
    constructor(
        @InjectModel('Image') private readonly imageModel: Model<ImageDocument>,
        @InjectModel('ImageShared') private readonly sharedImageModel: Model<SharedImageDocument>,
        private readonly logger: PinoLogger 
    ){}
    async listImagesByUserId(userId: string): Promise<ImageEntity[]> {
        try {
            const images = await this.imageModel.find({user:userId}).sort({ createdAt: -1 }).exec()
            return images.map((image)=>{
                return new ImageEntity()
                .setId(image._id.toString())
                .setAspectRatio(image.aspectRatio)
                .setCreateDate(image.createdAt)
                .setHeight(image.height)
                .setImageUrl(image.imageUrl)
                .setPrompt(image.prompt)
                .setSize(image.size)
                .setStyle(image.style)
                .setSubStyle(image.subStyle)
                .setWidth(image.width)
                .build()
            })

        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"Error to list images by userId",
                },
                "Error to list images by userId"
            )
            throw new MokkaError({
                message: "Error to list images, please Ttry again later",
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed'
            })
        }
    }
    async listSharedImage(page:number): Promise<SharedImageEntity[]> {
        try {
            const limit = 20;
            const skip = (page - 1) * limit
            const sharedImages= await this.sharedImageModel.find()
            .populate<{ image: ImageDocument}>('image')
            .populate<{ sharedBy: UserDocument}>('sharedBy')
            .skip(skip)
            .limit(limit)
            .exec()

            const listSharedImage = sharedImages.map((doc)=>{
                const img = doc.image 
                const user = doc.sharedBy 
                const image = new ImageEntity()
                .setAspectRatio(img.aspectRatio)
                .setCreateDate(img.createdAt)
                .setHeight(img.height)
                .setImageUrl(img.imageUrl)
                .setPrompt(img.prompt)
                .setSize(img.size)
                .setStyle(img.style)
                .setSubStyle(img.subStyle)
                .setWidth(img.width)
                .build()

                const  sharedBy = new SharedByEntity()
                .setId(user._id.toString())
                .setEmail(user.email)
                .build()

                return new SharedImageEntity()
                .setId(doc._id.toString())
                .setImage(image)
                .setSharedBy(sharedBy)
                .setRemixes(doc.remixes)
                .setDownloads(doc.downloads)
                .build()
            })

            return listSharedImage
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"Error to list shared images by userId",
                },
                "Error to list shared images by userId"
            )
            throw new MokkaError({
                message: "Error to list shared images of community",
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed'
            })
        }
    }
}