import { SupabaseImageResponse, SupabaseResponse, SupabaseVideoResponse } from "../types/supabase-types";

export abstract class StorageRepository{
    abstract saveAudio(idUser:string,buffer:Buffer<ArrayBuffer>):Promise<SupabaseResponse>
    abstract saveImage(bufferImage:Buffer<ArrayBufferLike>,idUser:string):Promise<SupabaseImageResponse>
    abstract saveVideo(idUser:string,bufferVideo:Buffer<ArrayBufferLike>):Promise<SupabaseVideoResponse>
}