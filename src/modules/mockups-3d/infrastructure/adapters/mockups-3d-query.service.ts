import { HttpStatus, Injectable } from '@nestjs/common';
import { Mockups3DPort } from '../../application/ports/mockups-3d.port';
import { Model3DEntity } from '../../domain/entities/model-3d-mockup.entity';
import { PinoLogger } from 'nestjs-pino';
import { MokkaError } from 'src/shared/errors/mokka.error';
import { ErrorPlatformMokka } from 'src/shared/common/infrastructure/enums/error-detail-types';
import { Model } from 'mongoose';
import { ModelDocument } from '../schemas/3d-model.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class Mockups3DQueryService implements Mockups3DPort {
  constructor(
    @InjectModel('Model3D') private readonly model3DModel: Model<ModelDocument>,
    private readonly logger: PinoLogger, 
  ) {}
  async list3DMoclups(page: number): Promise<Model3DEntity[]> {
    try {
        const limit = 20;
        const skip = (page - 1) * limit;
        const modelsDocs= await this.model3DModel.find()
        .sort({ createAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec()
        return modelsDocs.map(doc => Model3DEntity.create({
        id: doc._id.toString(), 
        slug: doc.slug,
        name: doc.name,
        category: doc.category,
        status: doc.status,
        model_url: doc.model_url,
        thumbnail_url: doc.thumbnail_url,
        camera_settings: doc.camera_settings,
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
}
