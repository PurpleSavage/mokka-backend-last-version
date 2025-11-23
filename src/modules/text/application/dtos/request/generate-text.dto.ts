import { IsEnum, IsNotEmpty, IsString} from "class-validator"
import { Format } from "src/modules/text/domain/enums/format-options";
import { Length } from "src/modules/text/domain/enums/length-options";
import { Tone } from "src/modules/text/domain/enums/tone-options";




export class GenerateTextDto {
  @IsString()
  @IsNotEmpty()
  user:string

  @IsString()
  @IsNotEmpty()
  context: string;

  @IsString()
  promotionType: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(Tone)
  toneType: Tone;

  @IsEnum(Length)
  textLength: Length;

  @IsEnum(Format)
  textFormat: Format;
}