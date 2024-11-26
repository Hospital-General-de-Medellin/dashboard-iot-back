import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Propertie extends Document {
  @Prop({ required: true })
  minute: number;

  @Prop({ type: Map, of: Number, default: {} }) // Almacena propiedades dinámicas
  properties: Map<string, number>;
}

export const PropertieSchema = SchemaFactory.createForClass(Propertie);
