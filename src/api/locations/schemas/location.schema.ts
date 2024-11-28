import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Location extends Document {
  @Prop({ required: true })
  service: string;

  @Prop({ required: true })
  area: string;

  @Prop({ required: true })
  cubicle: string;

  @Prop({ required: true })
  room: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
