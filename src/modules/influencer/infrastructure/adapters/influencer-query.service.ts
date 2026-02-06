import { HttpStatus, Injectable } from '@nestjs/common';
import { InfluencerPort } from '../../application/ports/influencer.port';
import { InfluencerEntity } from '../../domain/entities/influecer.entity';
import { InfluencerSnapshotEntity } from '../../domain/entities/influencer-snapshot.entity';
import { InjectModel } from '@nestjs/mongoose';
import { MokkaError } from 'src/shared/errors/mokka.error';
import { ErrorPlatformMokka } from 'src/shared/infrastructure/enums/error-detail-types';
import { PinoLogger } from 'nestjs-pino';
import { InfluencerDocument } from '../schemas/influencer.schema';
import { Model } from 'mongoose';
import { InfluencerSnapshotDocument } from '../schemas/influencer-snapshot.schema';
import { normalizeId } from 'src/shared/application/helpers/normalized-obj';
import { InfluencerScenaDocument } from '../schemas/influencer-scena.schema';
import { InfluencerSceneEntity } from '../../domain/entities/influencer-scene.entity';

@Injectable()
export class InfluencerQueryService implements InfluencerPort {
  constructor(
    @InjectModel('Influencer') private readonly influencerModel: Model<InfluencerDocument>,
    @InjectModel('InfluencerSnapshot') private readonly influencerSnapshotModel: Model<InfluencerSnapshotDocument>,
    @InjectModel('InfluencerScene') private readonly influencerSceneModel: Model<InfluencerScenaDocument>,
    private readonly logger: PinoLogger,
  ) {}
  async listInfluencers(userId: string): Promise<InfluencerEntity[]> {
    try {
        const influencers = await this.influencerModel.find({
            userId
        }).exec()

        return influencers.map((influencer)=>{
          return new InfluencerEntity()
          .setAgeRange(influencer.ageRange)
          .setBodyShape(influencer.bodyShape)
          .setCountry(influencer.country)
          .setCreateDate(influencer.createdAt)
          .setEyeColor(influencer.eyeColor)
          .setFaceType(influencer.faceType)
          .setGender(influencer.gender)
          .setHairColor(influencer.hairColor)
          .setHairType(influencer.hairType)
          .setHeight(influencer.height)
          .setId(influencer._id.toString())
          .setInfluencerUrlImage(influencer.influencerUrlImage)
          .setName(influencer.name)
          .setLipsType(influencer.lipsType)
          .setSizeImage(influencer.sizeImage)
          .build()
        })
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to list influecers models',
          userId,
        },
        'Failed to list influecers models',
      );
      throw new MokkaError({
        message: 'Database operation failed',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to list influencers',
      });
    }
  }
  async getInfluencerById(userId: string): Promise<InfluencerEntity> {
    try {
      const influencer = await this.influencerModel.findById(userId).exec()
      if(!influencer){
        throw new MokkaError({
          message: 'Database operation failed',
          errorType: ErrorPlatformMokka.DATABASE_FAILED,
          status: HttpStatus.NOT_FOUND,
          details: 'Failed to find Influencer, model not found',
        });
      }
      return new InfluencerEntity()
          .setAgeRange(influencer.ageRange)
          .setBodyShape(influencer.bodyShape)
          .setCountry(influencer.country)
          .setCreateDate(influencer.createdAt)
          .setEyeColor(influencer.eyeColor)
          .setFaceType(influencer.faceType)
          .setGender(influencer.gender)
          .setHairColor(influencer.hairColor)
          .setHairType(influencer.hairType)
          .setHeight(influencer.height)
          .setId(influencer._id.toString())
          .setInfluencerUrlImage(influencer.influencerUrlImage)
          .setName(influencer.name)
          .setLipsType(influencer.lipsType)
          .setSizeImage(influencer.sizeImage)
          .build()
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to find influencer',
          userId,
        },
        'Failed to find influencer',
      );
      throw new MokkaError({
        message: 'Database operation failed',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to find Influencer Model',
      })
    }
  }

  async historyInfluencerSnapshot(userId:string): Promise<InfluencerSnapshotEntity[]> {
    try {
      const historyInfluencers = await this.influencerSnapshotModel.find({
        user:userId
      }).sort({ createdAt: -1 }).exec()
      return historyInfluencers.map((influencer)=>{
          return new InfluencerSnapshotEntity()
          .setCreateDate(influencer.createdAt)
          .setEnviroment(influencer.enviroment)
          .setId(influencer._id.toString())
          .setInfluencer(normalizeId(influencer.influencer))
          .setOutfitStyle(influencer.outfitStyle)
          .setPrompt(influencer.prompt)
          .setsnapshotUrl(influencer.snapshotUrl)
          .build()
        })
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to list history influencers snapshot',
          userId,
        },
        'Failed to list history influencers snapshot',
      );
      throw new MokkaError({
        message: 'Database operation failed',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to list history influencers snapshot',
      })
    }
  }
  async influencersSnapshotLastWeek(userId:string): Promise<InfluencerSnapshotEntity[]> {
    try {
      const  sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      sevenDaysAgo.setHours(0, 0, 0, 0)
      const snashotsLAstWeek = await this.influencerSnapshotModel.find(
        {
          user:userId,
          createdAt: { 
            $gte: sevenDaysAgo 
          }
        },
        
      ).sort({ createdAt: -1 }).exec()
      return snashotsLAstWeek.map((influencer)=>{
          return new InfluencerSnapshotEntity()
          .setCreateDate(influencer.createdAt)
          .setEnviroment(influencer.enviroment)
          .setId(influencer._id.toString())
          .setInfluencer(normalizeId(influencer.influencer))
          .setOutfitStyle(influencer.outfitStyle)
          .setPrompt(influencer.prompt)
          .setsnapshotUrl(influencer.snapshotUrl)
          .build()
        })
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to list history influencers snapshot last week',
          userId,
        },
        'Failed to list history influencers snapshot last week',
      );
      throw new MokkaError({
        message: 'Database operation failed',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to list history influencers snapshot last week',
      })
    }
  }
  async getSnapshotById(snapshotId: string): Promise<InfluencerSnapshotEntity> {
    try {
      const influencer = await this.influencerSnapshotModel.findById(snapshotId).exec()
      if(!influencer){
          throw new MokkaError({
            message: 'Database operation failed',
            errorType: ErrorPlatformMokka.DATABASE_FAILED,
            status: HttpStatus.NOT_FOUND,
            details: 'Failed to find Influencer snapshot by id, model not found',
          })
      }
      return new InfluencerSnapshotEntity()
          .setCreateDate(influencer.createdAt)
          .setEnviroment(influencer.enviroment)
          .setId(influencer._id.toString())
          .setInfluencer(normalizeId(influencer.influencer))
          .setOutfitStyle(influencer.outfitStyle)
          .setPrompt(influencer.prompt)
          .setsnapshotUrl(influencer.snapshotUrl)
          .build()
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to list history influencers snapshot last week',
          snapshotId,
        },
        'Failed to list history influencers snapshot last week',
      );
      throw new MokkaError({
        message: 'Database operation failed',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to list history influencers snapshot last week',
      })
    }
  }
  async historyInfluencerScenes(userId: string): Promise<InfluencerSceneEntity[]> {
    try {
      const scenes = await this.influencerSceneModel.find({
        user:userId
      }).sort({ createdAt: -1 }).exec()
      return scenes.map((scene)=>{
        return new InfluencerSceneEntity()
        .setAspectRatio(scene.aspectRatio)
        .setId(scene._id.toString())
        .setImageBaseUrls(scene.imageBaseUrls)
        .setUrlScene(scene.urlScene)
        .setVolume(scene.volume)
        .setInfluencer(normalizeId(scene.influencer))
        .build()
      })
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to list history influencers scenes ',
          userId,
        },
        'Failed to list history influencers scenes',
      );
      throw new MokkaError({
        message: 'Database operation failed',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to list history influencers scenes',
      })
    }
  }
  async influencerScenesLastWeek(userId: string): Promise<InfluencerSceneEntity[]> {
    try {
      const  sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      sevenDaysAgo.setHours(0, 0, 0, 0)
      const  scenes = await this.influencerSceneModel.find({
        user:userId,
        createdAt: { 
          $gte: sevenDaysAgo 
        }
      }).sort({ createdAt: -1 }).exec()

      return scenes.map((scene)=>{
        return new InfluencerSceneEntity()
        .setAspectRatio(scene.aspectRatio)
        .setId(scene._id.toString())
        .setImageBaseUrls(scene.imageBaseUrls)
        .setUrlScene(scene.urlScene)
        .setVolume(scene.volume)
        .setInfluencer(normalizeId(scene.influencer))
        .build()
      })

    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to list history influencers scenes last week',
          userId,
        },
        'Failed to list history influencers scenes last week',
      );
      throw new MokkaError({
        message: 'Database operation failed',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to list history influencers scenes last week',
      })
    }
  }

  async getInfluencerSceneById(sceneId: string): Promise<InfluencerSceneEntity> {
    try {
      const scene = await this.influencerSceneModel.findById(sceneId).exec()
      if(!scene){
        throw new MokkaError({
            message: 'Database operation failed',
            errorType: ErrorPlatformMokka.DATABASE_FAILED,
            status: HttpStatus.NOT_FOUND,
            details: 'Failed to find Influencer scenet by id, model not found',
          })
      }
      return new InfluencerSceneEntity()
        .setAspectRatio(scene.aspectRatio)
        .setId(scene._id.toString())
        .setImageBaseUrls(scene.imageBaseUrls)
        .setUrlScene(scene.urlScene)
        .setVolume(scene.volume)
        .setInfluencer(normalizeId(scene.influencer))
        .build()
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to get scene by id',
          sceneId,
        },
        'Failed to find scene by id',
      );
      throw new MokkaError({
        message: 'Database operation failed',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to find scene by id, database failed',
      })
    }
  }
}
