import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  IsMongoId,
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
  data?: CreatePropertieDto;

  @IsNotEmpty()
  @IsMongoId()
  locationId: string; // ID de la ubicación asociada (obligatorio)
}
