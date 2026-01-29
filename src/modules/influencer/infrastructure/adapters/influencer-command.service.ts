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

@Injectable()
export class InfluencerCommandService implements InfluencerRepository {
  constructor(
    @InjectModel('Influencer')
    private readonly influencerModel: Model<InfluencerDocument>,
    private readonly influencerSnapshotModel: Model<InfluencerSnapshotDocument>,
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
            outfitStyle:vo.outfitStyle
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
}