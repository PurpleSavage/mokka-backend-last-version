import { HttpStatus, Injectable } from '@nestjs/common';
import { Mockups3DPort } from '../../application/ports/mockups-3d.port';
import { Model3DEntity } from '../../domain/entities/model-3d-mockup.entity';
import { PinoLogger } from 'nestjs-pino';
import { MokkaError } from 'src/shared/errors/mokka.error';
import { ErrorPlatformMokka } from 'src/shared/common/infrastructure/enums/error-detail-types';
import { Model } from 'mongoose';
import { Model3DDocument} from '../schemas/3d-model.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BackgroundMockupDocument } from '../schemas/background-mockup.schema';
import { BackgroundMockupEntity } from '../../domain/entities/background-mockup.entity';

@Injectable()
export class Mockups3DQueryService implements Mockups3DPort {
  constructor(
    @InjectModel('MODEL_3D_ENTITY') private readonly model3DModel: Model<Model3DDocument>,
    @InjectModel('background-mockup') private readonly backgroundMockupModel: Model<BackgroundMockupDocument>,
    private readonly logger: PinoLogger, 
  ) {}
  async list3DMoclups(page: number,limit:number): Promise<Model3DEntity[]> {
    try {
        const skip = (page - 1) * limit;
        const modelsDocs= await this.model3DModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec()
        return modelsDocs.map(doc => Model3DEntity.create({
        id: doc._id.toString(), 
        slug: doc.slug,
        name: doc.name,
        category: doc.category,
        status: doc.status,
        modelUrl: doc.model_url,
        thumbnailUrl: doc.thumbnail_url,
        cameraSettings: doc.camera_settings,
        createdAt: doc.createdAt,
        nodes: doc.nodes.map(node => ({
          id: node._id.toString(),
          name_mesh: node.name_mesh,
          label: node.label,
          isEditable: node.isEditable,
          materialDefault: node.materialDefault,
          transform: node.transform,
          decalConfig: node.decalConfig
        }))
      }));

    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Error to list shared images by userId',
        },
        'Error to list shared images by userId',
      );
      throw new MokkaError({
        message: 'Error to list shared 3d models',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Database operation failed',
      });
    }
  }

  async listBackgroundsMockups(page: number,limit:number): Promise<BackgroundMockupEntity[]> {
    try {
      const skip = (page - 1) * limit

      const backgrounds = await this.backgroundMockupModel.find().sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec()

      return  backgrounds.map((background)=>{
        return BackgroundMockupEntity.create({
          backgroundUrl:background.background_url,
          createdAt:background.createdAt,
          id:background._id.toString(),
          name:background.name
        })
      })
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Error to list shared images by userId',
        },
        'Error to list shared images by userId',
      );
      throw new MokkaError({
        message: 'Error to list shared 3d models',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Database operation failed',
      });
    }
  }
}
