import {  PathStorageType } from "../enums/path-storage";
import { SupabaseImageResponse, SupabaseResponse, SupabaseVideoResponse } from "../types/supabase-types";

export abstract class StorageRepository{
    abstract saveAudio(idUser:string,buffer:Buffer<ArrayBuffer>,path:PathStorageType):Promise<SupabaseResponse>
    abstract saveImage(bufferImage:Buffer<ArrayBufferLike>,idUser:string,path:PathStorageType):Promise<SupabaseImageResponse>
    abstract saveVideo(idUser:string,bufferVideo:Buffer<ArrayBufferLike>,path:PathStorageType):Promise<SupabaseVideoResponse>
}