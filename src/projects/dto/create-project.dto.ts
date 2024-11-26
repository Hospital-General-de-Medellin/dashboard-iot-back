import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumber,
  IsPositive,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsIn(['line', 'bar'], {
    message: 'El tipo de gráfica debe ser "line" o "bar".',
  })
  @IsNotEmpty()
  chartType: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  frequency: number;

  @IsArray()
  @IsMongoId({
    each: true,
  })
  devices: string[];
}
