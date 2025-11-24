import { InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Queue } from 'bullmq';
import { RequiresCredits } from 'src/decorators/requires-credits.decorator';
import { CreditsGuard } from 'src/guards/credits/verify-credits.guard';
import { AccesstokenGuard } from 'src/guards/tokens/access-token.guard';
import { GenerateTextDto } from './application/dtos/request/generate-text.dto';
import { StatusQueue } from 'src/shared/infrastructure/enums/status-queue';

@Controller({
    path:'text/write',
    version:"1"
})
export class TextCommandController {
    constructor(
        @InjectQueue('text-queue') private textQueue: Queue
    ) {}
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @UseGuards(CreditsGuard)
    @RequiresCredits(20)
    @Post('remix/:imageSharedId')
    @HttpCode(HttpStatus.OK)
    async createRemix(
        @Body() generateTextDto: GenerateTextDto, //falta ponerlo en la cola
    ) {
        const job = await this.textQueue.add(
            'remix-image',
           generateTextDto,
            {
                removeOnComplete: false, // o true si también quieres limpiar los completados
                removeOnFail: true, // 🔹 elimina el job de Redis si falla
            },
        )
        return {
            jobId: job.id,
            status: StatusQueue.PROCESSING,
            message: 'Image generation started',
        }
    }
}
