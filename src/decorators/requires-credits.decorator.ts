import { SetMetadata } from '@nestjs/common';
export const RequiresCredits = (amount: number) => SetMetadata('credits', amount);