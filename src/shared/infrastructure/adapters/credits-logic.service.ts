import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "../enums/error-detail-types";
import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreditLogicRepository } from "src/shared/domain/repositories/credits-logic.repository";
import { UserDocument } from "../schemas/user.schema";
import { PinoLogger } from "nestjs-pino";
import { Model } from "mongoose";

@Injectable()
export class CreditLogicCommandService implements CreditLogicRepository{
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly logger: PinoLogger,
  ) {}
  async updateCredits(credits: number, userId: string): Promise<number> {
    try {
      const credistUpdated = await this.userModel.findByIdAndUpdate(
        userId,
        {
            credits
        },
        {
          new: true,
          runValidators: true,
        },
      )
      if(!credistUpdated){
         throw new MokkaError({
            message:'The user could not be found',
            errorType: ErrorPlatformMokka.DATABASE_FAILED,
            status: HttpStatus.NOT_FOUND,
            details: 'Database operation failed',
         })
      }
      return credistUpdated.credits
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message:
            'An error occurred while updating the credits, please try again later.',
        },
        'An error occurred while updating the credits',
      );
      throw new MokkaError({
        message:
          'An error occurred while updating the credits, please try again later.',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Database operation failed',
      })
    }
  }
  async decreaseCredits(credits: number, userId: string): Promise<number> {
    try {
        const credistUpdated= await this.userModel.findByIdAndUpdate(
            userId,
            { $inc: { credits: -credits } }, 
            { new: true } 
        )
        if(!credistUpdated){
            throw new MokkaError({
                message:'The user could not be found',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.NOT_FOUND,
                details: 'Database operation failed',
            })
        }
        return credistUpdated.credits
    } catch (error) {
        this.logger.error(
            {
            stack: error instanceof Error ? error.stack : undefined,
            message:
                'An error occurred while updating the credits, please try again later.',
            },
            'An error occurred while updating the credits, please try again later.',
        );
        throw new MokkaError({
        message:
          'An error occurred while updating the credits, please try again later.',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Database operation failed',
      })
    }
  }
  async increaseCredits(credits: number, userId: string): Promise<number> {
    try {
        const credistUpdated= await this.userModel.findByIdAndUpdate(
            userId,
            { $inc: { credits: +credits } }, 
            { new: true } 
        )
        if(!credistUpdated){
            throw new MokkaError({
                message:'The user could not be found',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.NOT_FOUND,
                details: 'Database operation failed',
            })
        }
        return credistUpdated.credits
    } catch (error) {
        this.logger.error(
            {
            stack: error instanceof Error ? error.stack : undefined,
            message:
                'An error occurred while updating the credits, please try again later.',
            },
            'An error occurred while updating the credits, please try again later.',
        );
        throw new MokkaError({
        message:
          'An error occurred while updating the credits, please try again later.',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Database operation failed',
      })
    }
  }
}
