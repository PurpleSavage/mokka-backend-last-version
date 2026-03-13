export abstract class CacheManagerPort{
    abstract read<T>(name:string,page:number):Promise<T[]>
    abstract set<T>(name:string,value:T):Promise<void>
    abstract readAll<T>(name: string): Promise<T[]>
    abstract length(name: string): Promise<number>
    abstract setMany<T>(name: string, values: T[]): Promise<void>
}