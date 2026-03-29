import { HttpStatus, Injectable } from '@nestjs/common';
import { MusicRepository } from '../../domain/repositories/music.repository';
import { GeneratedMusicVO } from '../../domain/value-objects/generated-music.vo';
import { MusicEntity } from '../../domain/entities/music.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PinoLogger } from 'nestjs-pino';
import { MokkaError } from 'src/shared/errors/mokka.error';
import { ErrorPlatformMokka } from 'src/shared/common/infrastructure/enums/error-detail-types';
import { MusicDocument } from '../schemas/music.schema';
import { Model } from 'mongoose';

@Injectable()
export class MusicCommandService implements MusicRepository {
  constructor(
    @InjectModel('Music') private readonly musicModel: Model<MusicDocument>,
    private readonly logger: PinoLogger
  ) {}
  async saveSong(vo: GeneratedMusicVO): Promise<MusicEntity> {
    try {
        const createdMusic = new this.musicModel({
            user: vo.user,
            prompt: vo.prompt,
            songUrl: vo.songUrl,
            bpm: vo.bpm,
            genre: vo.genre,
            durationMs: vo.durationMs
        })
        const savedMusic = await createdMusic.save();
        return MusicEntity.create({
            id: savedMusic._id.toString(),
            prompt: savedMusic.prompt,
            songUrl: savedMusic.songUrl,
            createDate: savedMusic.createdAt,
            bpm: savedMusic.bpm,
            genreMusic: savedMusic.genre,
            durationMs: savedMusic.durationMs
        })
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to generate audio record',
          userId: vo.user,
        },
        'Failed to generate audio record',
      );
      throw new MokkaError({
        message: 'Database operation failed',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to save music record',
      });
    }
  }
}
