import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HashPort } from "../../application/ports/hash.port";
import * as argon2 from 'argon2';
@Injectable()
export class HashService implements HashPort{
    private readonly hashOptions = {
    type: argon2.argon2id, // Argon2id es el más recomendado
    memoryCost: 2 ** 14,   // 64 MB de memoria
    timeCost: 3,           // 3 iteraciones
    parallelism: 1,        // 1 hilo
  };

  async hash(password: string): Promise<string> {
    try {
      const hashedPassword = await argon2.hash(password, this.hashOptions);
      return hashedPassword;
    } catch (error) {
      throw new Error(`Error hashing password: ${error}`);
    }
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const isValid = await argon2.verify(hashedPassword, password);
      return isValid;
    } catch (error) {
      console.log(error)
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error:'failed server to generate token',
        errorType:'Mokka_ERROR'
      },HttpStatus.INTERNAL_SERVER_ERROR)
    } 
  }
}