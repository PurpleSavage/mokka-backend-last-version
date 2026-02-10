
import { VideoEntity } from './video.entity';
import { BaseSharedEntity } from 'src/shared/domain/entities/base-shared.entity';

export class VideoSharedEntity extends BaseSharedEntity{
  private video: VideoEntity | string;
  getVideo():VideoEntity | string{
    return this.video
  }
 
  setVideo(video:  VideoEntity | string) {
    this.video = video;
    return this;
  }
  
  
}
