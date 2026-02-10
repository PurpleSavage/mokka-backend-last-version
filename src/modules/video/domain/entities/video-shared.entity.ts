import { SharedByEntity } from 'src/shared/domain/entities/shared-by.entity';
import { VideoEntity } from './video.entity';

export class VideoSharedEntity {
  private id: string;
  private remixes: number;
  private downloads: number;
  private video: VideoEntity | string;
  private sharedBy: SharedByEntity | string;

  getId(){
    return this.id
  }
  getRemixes(){
    return this.remixes
  }
  getDownloads(){
    return this.downloads
  }
  getVideo(){
    return this.video
  }
  getSharedBy(){
    return this.sharedBy
  }
  setId(id: string) {
    this.id = id;
    return this;
  }
  setRemixes(remixes: number) {
    this.remixes = remixes;
    return this;
  }
  setDownloads(downloads: number) {
    this.downloads = downloads;
    return this;
  }
  setImage(video:  VideoEntity | string) {
    this.video = video;
    return this;
  }
  setSharedBy(sharedBy: SharedByEntity | string) {
    this.sharedBy = sharedBy;
    return this;
  }
  build() {
    return this;
  }
}
