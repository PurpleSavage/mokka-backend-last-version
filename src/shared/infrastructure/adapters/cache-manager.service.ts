
import { Inject, Injectable } from "@nestjs/common";

import Redis from "ioredis";
import { CacheManagerPort } from "src/shared/application/ports/cache-manager.port";



@Injectable()
export class CacheManagerService implements CacheManagerPort{
    private readonly PAGE_SIZE = 20;
    constructor(
        @Inject('REDIS_CLIENT') private redis: Redis
    ){}

   
    async read<T>(name: string, page: number): Promise<T[]> {
        const start = (page - 1) * this.PAGE_SIZE
        const end = page * this.PAGE_SIZE - 1
        const list = await this.redis.lrange(name, start, end)
        return list.map(item => JSON.parse(item) as T)
    }

    async set<T>(name: string, value: T): Promise<void> {
        await this.redis.rpush(name, JSON.stringify(value))
    }

    async readAll<T>(name: string): Promise<T[]> {
        const list = await this.redis.lrange(name, 0, -1)
        return list.map(item => JSON.parse(item) as T)
    }

    async setMany<T>(name: string, values: T[]): Promise<void> {
        if (values.length === 0) return;
        await this.redis.rpush(name, ...values.map(v => JSON.stringify(v)))
    }

    async length(name: string): Promise<number> {
        return this.redis.llen(name)
    }
}