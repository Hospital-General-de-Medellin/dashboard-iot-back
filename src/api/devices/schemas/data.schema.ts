import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Propertie } from 'src/api/devices/schemas/properties.schema';

@Schema()
export class Data extends Document {
  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Propertie' })
  properties: Propertie[];
}

export const DataSchema = SchemaFactory.createForClass(Data);
