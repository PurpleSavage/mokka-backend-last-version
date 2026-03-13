import { PathStorage } from "../enums/path-storage";
import { SupabaseImageResponse, SupabaseResponse, SupabaseVideoResponse } from "../types/supabase-types";

export abstract class StorageRepository{
    abstract saveAudio(idUser:string,buffer:Buffer<ArrayBuffer>):Promise<SupabaseResponse>
    abstract saveImage(bufferImage:Buffer<ArrayBufferLike>,idUser:string,path:PathStorage):Promise<SupabaseImageResponse>
    abstract saveVideo(idUser:string,bufferVideo:Buffer<ArrayBufferLike>,path:PathStorage):Promise<SupabaseVideoResponse>
}