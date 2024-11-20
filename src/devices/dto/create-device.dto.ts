import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreatePropertieDto } from './create-propertie.dto';
import { Type } from 'class-transformer';

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsNumber()
  sysId: number;

  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @IsNotEmpty()
  @IsString()
  applicationName: string;

  @ValidateNested()
  @Type(() => CreatePropertieDto)
  data: CreatePropertieDto;
}
