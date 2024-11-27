import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Data } from './data.schema';
import { Location } from 'src/locations/schemas/location.schema';

@Schema()
export class Device extends Document {
  @Prop({ required: true })
  sysId: number;

  @Prop({ required: true, unique: true })
  deviceId: string;

  @Prop({ required: true })
  applicationName: string;

  @Prop({ type: [Types.ObjectId], ref: 'Data' })
  data: Data[];

  @Prop({ type: Types.ObjectId, ref: 'Location' })
  location: Location;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
