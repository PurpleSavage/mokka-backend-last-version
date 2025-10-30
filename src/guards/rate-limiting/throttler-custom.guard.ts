import { Injectable, ExecutionContext } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";

@Injectable()
export class ThrottlerCustomGuard extends ThrottlerGuard {
  protected throwThrottlingException(
    context: ExecutionContext, 
    throttlerLimitDetail: ThrottlerLimitDetail
  ): Promise<void> {
    const { limit, ttl } = throttlerLimitDetail;
    throw new Error(`Too many requests. Limit: ${limit} requests per ${ttl}ms. Please try again later.`);
  }
}