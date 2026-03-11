import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class ListNotificationsDto {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsOptional()
  @Type(() => Number) // transforma el query string a número
  @IsInt()
  @Min(1)
  page: number = 1;
}
