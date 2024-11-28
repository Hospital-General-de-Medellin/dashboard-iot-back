import { IsNotEmpty, IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreatePropertieDto {
  @IsNotEmpty()
  @IsNumber()
  minute: number;

  @IsOptional() // Opcional para permitir que las propiedades sean dinámicas
  @IsObject()
  properties?: Record<string, number>; // Permite cualquier par clave-valor
}
