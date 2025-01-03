import {
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsDate,
} from 'class-validator';
import { CreatePropertieDto } from './create-propertie.dto';

export class CreateDataDto {
  @IsNotEmpty()
  @IsDate()
  timestamp: Date;

  @IsOptional() // Opcional porque puede no haber propiedades iniciales
  @IsArray()
  properties?: CreatePropertieDto[];
}
