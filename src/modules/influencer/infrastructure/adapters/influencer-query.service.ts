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
import { SharedInfluencerEntity } from '../../domain/entities/shared-influencer.entity';
import { SharedSceneEntity } from '../../domain/entities/shared-scene.entity';
import { SharedSnapshotEntity } from '../../domain/entities/shared-snapshot.entity';
import { SharedInfluencerDocument } from '../schemas/influencer-shared.schema';
import { SharedSnapshotDocument } from '../schemas/snapshot-shared.schema';
import { SharedSceneDocument } from '../schemas/scene-shared.schema';
import { UserDocument } from 'src/shared/infrastructure/schemas/user.schema';
import { SharedByEntity } from 'src/shared/domain/entities/shared-by.entity';

@Injectable()
export class InfluencerQueryService implements InfluencerPort {
  constructor(
    @InjectModel('Influencer')
    private readonly influencerModel: Model<InfluencerDocument>,
    @InjectModel('InfluencerSnapshot')
    private readonly influencerSnapshotModel: Model<InfluencerSnapshotDocument>,
    @InjectModel('InfluencerScene')
    private readonly influencerSceneModel: Model<InfluencerScenaDocument>,
    @InjectModel('SharedInfluencer')
    private readonly influencerSharedModel: Model<SharedInfluencerDocument>,
    @InjectModel('SharedSnapshot')
    private readonly snapshotSharedModel: Model<SharedSnapshotDocument>,
    @InjectModel('SharedScene')
    private readonly sceneSharedModel: Model<SharedSceneDocument>,
    private readonly logger: PinoLogger,
  ) {}
  async listInfluencers(userId: string): Promise<InfluencerEntity[]> {
    try {
      const influencers = await this.influencerModel
        .find({
          userId,
        })
        .exec();

      return influencers.map((influencer) => {
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
          .build();
      });
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
      const influencer = await this.influencerModel.findById(userId).exec();
      if (!influencer) {
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
        .build();
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
      });
    }
  }

  async historyInfluencerSnapshot(
    userId: string,
    page:number = 1
  ): Promise<InfluencerSnapshotEntity[]> {
    try {
      const limit = 20;
      const skip = (page - 1) * limit
      const historyInfluencers = await this.influencerSnapshotModel
        .find({
          user: userId,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      return historyInfluencers.map((influencer) => {
        return new InfluencerSnapshotEntity()
          .setCreateDate(influencer.createdAt)
          .setEnviroment(influencer.enviroment)
          .setId(influencer._id.toString())
          .setInfluencer(normalizeId(influencer.influencer))
          .setOutfitStyle(influencer.outfitStyle)
          .setPrompt(influencer.prompt)
          .setsnapshotUrl(influencer.snapshotUrl)
          .build();
      });
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
      });
    }
  }
  async influencersSnapshotLastWeek(
    userId: string,
  ): Promise<InfluencerSnapshotEntity[]> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      const snashotsLAstWeek = await this.influencerSnapshotModel
        .find({
          user: userId,
          createdAt: {
            $gte: sevenDaysAgo,
          },
        })
        .sort({ createdAt: -1 })
        .exec();
      return snashotsLAstWeek.map((influencer) => {
        return new InfluencerSnapshotEntity()
          .setCreateDate(influencer.createdAt)
          .setEnviroment(influencer.enviroment)
          .setId(influencer._id.toString())
          .setInfluencer(normalizeId(influencer.influencer))
          .setOutfitStyle(influencer.outfitStyle)
          .setPrompt(influencer.prompt)
          .setsnapshotUrl(influencer.snapshotUrl)
          .build();
      });
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
      });
    }
  }
  async getSnapshotById(snapshotId: string): Promise<InfluencerSnapshotEntity> {
    try {
      const influencer = await this.influencerSnapshotModel
        .findById(snapshotId)
        .exec();
      if (!influencer) {
        throw new MokkaError({
          message: 'Database operation failed',
          errorType: ErrorPlatformMokka.DATABASE_FAILED,
          status: HttpStatus.NOT_FOUND,
          details: 'Failed to find Influencer snapshot by id, model not found',
        });
      }
      return new InfluencerSnapshotEntity()
        .setCreateDate(influencer.createdAt)
        .setEnviroment(influencer.enviroment)
        .setId(influencer._id.toString())
        .setInfluencer(normalizeId(influencer.influencer))
        .setOutfitStyle(influencer.outfitStyle)
        .setPrompt(influencer.prompt)
        .setsnapshotUrl(influencer.snapshotUrl)
        .build();
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
      });
    }
  }
  async historyInfluencerScenes(
    userId: string, 
    page:number = 1
  ): Promise<InfluencerSceneEntity[]> {
    try {
      const limit = 20;
      const skip = (page - 1) * limit
      const scenes = await this.influencerSceneModel
        .find({
          user: userId,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      return scenes.map((scene) => {
        return new InfluencerSceneEntity()
          .setAspectRatio(scene.aspectRatio)
          .setId(scene._id.toString())
          .setImageBaseUrls(scene.imageBaseUrls)
          .setUrlScene(scene.urlScene)
          .setVolume(scene.volume)
          .setInfluencer(normalizeId(scene.influencer))
          .setCreateDate(scene.createdAt)
          .build();
      });
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
      });
    }
  }
  async influencerScenesLastWeek(
    userId: string,
  ): Promise<InfluencerSceneEntity[]> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      const scenes = await this.influencerSceneModel
        .find({
          user: userId,
          createdAt: {
            $gte: sevenDaysAgo,
          },
        })
        .sort({ createdAt: -1 })
        .exec();

      return scenes.map((scene) => {
        return new InfluencerSceneEntity()
          .setAspectRatio(scene.aspectRatio)
          .setId(scene._id.toString())
          .setImageBaseUrls(scene.imageBaseUrls)
          .setUrlScene(scene.urlScene)
          .setVolume(scene.volume)
          .setInfluencer(normalizeId(scene.influencer))
          .setCreateDate(scene.createdAt)
          .build();
      });
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
      });
    }
  }

  async getInfluencerSceneById(
    sceneId: string,
  ): Promise<InfluencerSceneEntity> {
    try {
      const scene = await this.influencerSceneModel.findById(sceneId).exec();
      if (!scene) {
        throw new MokkaError({
          message: 'Database operation failed',
          errorType: ErrorPlatformMokka.DATABASE_FAILED,
          status: HttpStatus.NOT_FOUND,
          details: 'Failed to find Influencer scenet by id, model not found',
        });
      }
      return new InfluencerSceneEntity()
        .setAspectRatio(scene.aspectRatio)
        .setId(scene._id.toString())
        .setImageBaseUrls(scene.imageBaseUrls)
        .setUrlScene(scene.urlScene)
        .setVolume(scene.volume)
        .setInfluencer(normalizeId(scene.influencer))
        .setCreateDate(scene.createdAt)
        .build();
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
      });
    }
  }

  async listSharedInfluencer(page: number): Promise<SharedInfluencerEntity[]> {
    try {
      const limit = 20;
      const skip = (page - 1) * limit;
      const sharedInfluencers = await this.influencerSharedModel
        .find()
        .populate<{ influencer: InfluencerDocument }>('influencer')
        .populate<{ sharedBy: UserDocument }>('sharedBy')
        .skip(skip)
        .limit(limit)
        .exec();

      const listSharedInfluencers = sharedInfluencers.map((doc) => {
        const influencer = doc.influencer;
        const user = doc.sharedBy;
        const influencerEntity = new InfluencerEntity()
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
          .setLipsType(influencer.lipsType)
          .setName(influencer.name)
          .setSizeImage(influencer.sizeImage)
          .setSkinColor(influencer.skinColor)
          .build();

        const sharedBy = new SharedByEntity()
          .setId(user._id.toString())
          .setEmail(user.email)
          .build();
        return new SharedInfluencerEntity()
          .setSharedBy(normalizeId(sharedBy))
          .setDownloads(doc.downloads)
          .setId(doc._id.toString())
          .setRemixes(doc.remixes)
          .setInfluencer(influencerEntity)
          .build();
      });
      return listSharedInfluencers;
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to list shared influencers',
        },
        'Failed to list shared influencers',
      );
      throw new MokkaError({
        message: 'Database operation failed',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to list shared influencers, database failed',
      });
    }
  }
  async listSharedScene(page: number): Promise<SharedSceneEntity[]> {
    try {
      const limit = 20;
      const skip = (page - 1) * limit;
      const sharedScenes = await this.sceneSharedModel
        .find()
        .populate<{ scene: InfluencerScenaDocument }>('scene')
        .populate<{ sharedBy: UserDocument }>('sharedBy')
        .skip(skip)
        .limit(limit)
        .exec();
      const listSharedScenes = sharedScenes.map((doc) => {
        const scene = doc.scene;
        const user = doc.sharedBy;
        const sceneEntity = new InfluencerSceneEntity()
          .setAspectRatio(scene.aspectRatio)
          .setId(scene._id.toString())
          .setImageBaseUrls(scene.imageBaseUrls)
          .setUrlScene(scene.urlScene)
          .setVolume(scene.volume)
          .setInfluencer(normalizeId(scene.influencer))
          .setPrompt(scene.prompt)
          .setCreateDate(scene.createdAt)
          .build();

        const sharedBy = new SharedByEntity()
          .setId(user._id.toString())
          .setEmail(user.email)
          .build();
        return new SharedSceneEntity()
          .setSharedBy(normalizeId(sharedBy))
          .setDownloads(doc.downloads)
          .setId(doc._id.toString())
          .setRemixes(doc.remixes)
          .setScene(sceneEntity)
          .build();
      });
      return listSharedScenes;
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to list shared scenes',
        },
        'Failed to list shared scenes',
      );
      throw new MokkaError({
        message: 'Database operation failed',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to list shared scenes, database failed',
      });
    }
  }
  async listSharedSnapshot(page: number): Promise<SharedSnapshotEntity[]> {
    try {
      const limit = 20;
      const skip = (page - 1) * limit;
      const sharedSnapshots = await this.snapshotSharedModel
        .find()
        .populate<{ snapshot: InfluencerSnapshotDocument }>('snapshot')
        .populate<{ sharedBy: UserDocument }>('sharedBy')
        .skip(skip)
        .limit(limit)
        .exec();
      const listSharedSnapshots = sharedSnapshots.map((doc) => {
        const snapshot = doc.snapshot;
        const user = doc.sharedBy;
        const snapshotEntity = new InfluencerSnapshotEntity()
          .setCreateDate(snapshot.createdAt)
          .setEnviroment(snapshot.enviroment)
          .setInfluencer(normalizeId(snapshot.influencer))
          .setOutfitStyle(snapshot.outfitStyle)
          .setPrompt(snapshot.prompt)
          .setsnapshotUrl(snapshot.snapshotUrl)
          .build();

        const sharedBy = new SharedByEntity()
          .setId(user._id.toString())
          .setEmail(user.email)
          .build();
        return new SharedSnapshotEntity()
          .setSharedBy(normalizeId(sharedBy))
          .setDownloads(doc.downloads)
          .setId(doc._id.toString())
          .setRemixes(doc.remixes)
          .setSnapshot(snapshotEntity)
          .build();
      });

      return listSharedSnapshots;
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to list shared snaphsots',
        },
        'Failed to list shared snaphsots',
      );
      throw new MokkaError({
        message: 'Database operation failed',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to list shared snaphsots, database failed',
      });
    }
  }
}
