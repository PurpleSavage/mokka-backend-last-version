import { HttpStatus, Injectable } from '@nestjs/common';
import { InfluencerRepository } from '../../domain/repository/influencer.repository';
import { InjectModel } from '@nestjs/mongoose';
import { PinoLogger } from 'nestjs-pino';
import { InfluencerDocument } from '../schemas/influencer.schema';
import { Model } from 'mongoose';
import { MokkaError } from 'src/shared/errors/mokka.error';
import { ErrorPlatformMokka } from 'src/shared/infrastructure/enums/error-detail-types';
import { SaveInfluencerVo } from '../../domain/value-objects/save-influencer.vo';
import { InfluencerEntity } from '../../domain/entities/influecer.entity';
import { InfluencerSnapshotDocument } from '../schemas/influencer-snapshot.schema';
import { SaveSnapshotVo } from '../../domain/value-objects/save-snapshot.vo';
import { InfluencerSnapshotEntity } from '../../domain/entities/influencer-snapshot.entity';
import { normalizeId } from 'src/shared/application/helpers/normalized-obj';
import { InfluencerSceneEntity } from '../../domain/entities/influencer-scene.entity';
import { SaveSceneInfluencerVo } from '../../domain/value-objects/save-scene.vo';
import { InfluencerScenaDocument } from '../schemas/influencer-scena.schema';
import { SharedInfluencerDocument } from '../schemas/influencer-shared.schema';
import { SharedSnapshotDocument } from '../schemas/snapshot-shared.schema';
import { SharedSceneDocument } from '../schemas/scene-shared.schema';
import { SharedInfluencerEntity } from '../../domain/entities/shared-influencer.entity';
import { SharedSnapshotEntity } from '../../domain/entities/shared-snapshot.entity';
import { SharedSceneEntity } from '../../domain/entities/shared-scene.entity';

@Injectable()
export class InfluencerCommandService implements InfluencerRepository {
  constructor(
    @InjectModel('Influencer') private readonly influencerModel: Model<InfluencerDocument>,
    @InjectModel('InfluencerSnapshot') private readonly influencerSnapshotModel: Model<InfluencerSnapshotDocument>,
    @InjectModel('InfluencerScene') private readonly influencerScene:Model<InfluencerScenaDocument>,
    @InjectModel('SharedInfluencer') private readonly influencerSharedModel:Model<SharedInfluencerDocument>,
    @InjectModel('SharedSnapshot') private readonly snapshotSharedModel: Model<SharedSnapshotDocument>,
    @InjectModel('SharedScene') private readonly sceneSharedModel:Model<SharedSceneDocument>,
    private readonly logger: PinoLogger,
  ) {}

  async saveInfluencerCreated(vo:SaveInfluencerVo): Promise<InfluencerEntity> {
    try {
        const influencer = new this.influencerModel({
           user: vo.user,
           name: vo.name,
           ageRange: vo.ageRange,
           gender: vo.gender,
           bodyShape: vo.bodyShape,
           skinColor: vo.skinColor,
           eyeColor: vo.eyeColor,
           hairType: vo.hairType,
           faceType: vo.faceType,
           country: vo.country,
           lipsType: vo.lipsType,
           hairColor: vo.hairColor,
           height: vo.height,
           influencerUrlImage: vo.influencerUrlImage,
           sizeImage:vo.size
        });
        const influencerSaved=await influencer.save();

        return new InfluencerEntity()
        .setId(influencerSaved._id.toString())
        .setName(influencerSaved.name)
        .setAgeRange(influencerSaved.ageRange)
        .setGender(influencerSaved.gender)
        .setBodyShape(influencerSaved.bodyShape)
        .setSkinColor(influencerSaved.skinColor)
        .setEyeColor(influencerSaved.eyeColor)
        .setHairType(influencerSaved.hairType)
        .setFaceType(influencerSaved.faceType)
        .setCountry(influencerSaved.country)
        .setLipsType(influencerSaved.lipsType)
        .setHairColor(influencerSaved.hairColor)
        .setHeight(influencerSaved.height)
        .setInfluencerUrlImage(influencerSaved.influencerUrlImage) 
        .setCreateDate(influencerSaved.createdAt) 
        .setSizeImage(influencerSaved.sizeImage) 
        .build()
        
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Error to save influencer generated',
        },
        'Error saving influencer',
      );
      throw new MokkaError({
        message: 'Failed to save influencer generated',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Database operation failed',
      });
    }
  }

  async saveSnapshotInfluencer(vo:SaveSnapshotVo): Promise<InfluencerSnapshotEntity> {
      try {
        const influencerSnapshot = await this.influencerSnapshotModel.create({
            user:vo.user,
            influencer:vo.influencer,
            snapshotUrl:vo.snapshotUrl,
            prompt:vo.prompt,
            enviroment:vo.enviroment,
            outfitStyle:vo.outfitStyle,
            aspectRatio:vo.aspectRatio
        })
        const influencerSnapshotSaved = await influencerSnapshot.save()
      
        return new InfluencerSnapshotEntity()
        .setCreateDate(influencerSnapshotSaved.createdAt)
        .setEnviroment(influencerSnapshotSaved.enviroment)
        .setId(influencerSnapshotSaved._id.toString())
        .setInfluencer(normalizeId(influencerSnapshotSaved.influencer))
        .setOutfitStyle(influencerSnapshotSaved.outfitStyle)
        .setPrompt(influencerSnapshotSaved.prompt)
        .setsnapshotUrl(influencerSnapshotSaved.snapshotUrl)
        .build()

      } catch (error) {
        this.logger.error(
            {
            stack: error instanceof Error ? error.stack : undefined,
            message: 'Error to save snapshot influencer',
            },
            'Error saving snapshot influencer',
        );
        throw new MokkaError({
            message: 'Failed to save snapshot influencer generated',
            errorType: ErrorPlatformMokka.DATABASE_FAILED,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            details: 'Database operation failed',
        });
      }
  }
  async saveSceneInfluencer(vo:SaveSceneInfluencerVo): Promise<InfluencerSceneEntity> {
    try {
      const influencerScene = await this.influencerScene.create({
         urlScene:vo.urlScene,
         prompt:vo.prompt,
         user:vo.user,
         influencer:vo.influencer,
         volume:vo.volume,
         imageBaseUrls:vo.imageBaseUrls,
         aspectRatio:vo.aspectRatio
      })
      const influencerSceneSaved = await influencerScene.save()
      return new InfluencerSceneEntity()
      .setImageBaseUrls(influencerSceneSaved.imageBaseUrls)
      .setId(influencerSceneSaved._id.toString())
      .setInfluencer(normalizeId(influencerSceneSaved.influencer))
      .setPrompt(influencerSceneSaved.prompt)
      .setUrlScene(influencerScene.urlScene)
      .setVolume(influencerSceneSaved.volume)
      .setAspectRatio(influencerSceneSaved.aspectRatio)
      .setCreateDate(influencerScene.createdAt)
      .build()
    } catch (error) {
       this.logger.error(
            {
            stack: error instanceof Error ? error.stack : undefined,
            message: 'Error to save scene influencer',
            },
            'Error saving scene influencer',
        );
        throw new MokkaError({
            message: 'Failed to save scene influencer generated',
            errorType: ErrorPlatformMokka.DATABASE_FAILED,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            details: 'Database operation failed',
        });
    }
  }

  async sharedInfluencer(influencerId: string, sharedBy: string): Promise<SharedInfluencerEntity> {
    try {
      const response = new this.influencerSharedModel({
        sharedBy,
        downloads:0,
        remixes: 0,
        influencer:influencerId
      })
      const sharedImage = await response.save()
      return new SharedInfluencerEntity()
      .setId(sharedImage._id.toString())
      .setDownloads(sharedImage.downloads)
      .setRemixes(sharedImage.remixes)
      .setSharedBy(normalizeId(sharedImage.sharedBy))
      .setInfluencer(normalizeId(sharedImage.influencer))
      .build()
    } catch (error) {
      this.logger.error(
            {
            stack: error instanceof Error ? error.stack : undefined,
            message: 'Error to share influencer',
            },
            'Error to share influencer',
        );
        throw new MokkaError({
            message: 'Failed to share influencer generated',
            errorType: ErrorPlatformMokka.DATABASE_FAILED,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            details: 'Database operation failed',
        })
    }
  }
  async sharedScene(sceneId:string, sharedBy: string): Promise<SharedSceneEntity> {
    try {
      const response  = new this.sceneSharedModel({
        sharedBy,
        downloads:0,
        remixes: 0,
        scene:sceneId
      })
      const sharedScene = await response.save()
      return new SharedSceneEntity()
      .setSharedBy(normalizeId(sharedScene.sharedBy))
      .setDownloads(sharedScene.downloads)
      .setId(sharedScene._id.toString())
      .setRemixes(sharedScene.remixes)
      .setScene(normalizeId(sharedScene.scene))
      .build()
    } catch (error) {
      this.logger.error(
            {
            stack: error instanceof Error ? error.stack : undefined,
            message: 'Failed to shared scene',
            },
            'Failed to shared scene',
        );
        throw new MokkaError({
            message: 'Failed to shared scene',
            errorType: ErrorPlatformMokka.DATABASE_FAILED,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            details: 'Database operation failed',
        })
    }
  }
  async sharedSnapshot(snapshotId:string, sharedBy: string): Promise<SharedSnapshotEntity> {
    try {
      const response = new this.snapshotSharedModel({
        sharedBy,
        downloads:0,
        remixes: 0,
        snapshot:snapshotId
      })
      const sharedSnapshot = await response.save()
      return new SharedSnapshotEntity()
      .setSharedBy(normalizeId(sharedSnapshot.sharedBy))
      .setDownloads(sharedSnapshot.downloads)
      .setId(sharedSnapshot._id.toString())
      .setRemixes(sharedSnapshot.remixes)
      .setSnapshot(normalizeId(sharedSnapshot.snapshot))
      .build()

    } catch (error) {
      this.logger.error(
            {
            stack: error instanceof Error ? error.stack : undefined,
            message: 'Failed to shared snpashot',
            },
            'Failed to shared snpashot',
        );
        throw new MokkaError({
            message: 'Failed to shared snpashot',
            errorType: ErrorPlatformMokka.DATABASE_FAILED,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            details: 'Database operation failed',
        })
    }
  }
}