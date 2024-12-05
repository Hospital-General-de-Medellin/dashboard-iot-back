import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Device } from 'src/api/devices/schemas/devices.schema';

@Schema()
export class Project extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  chartType: string; // Tipo de gráfica, por ejemplo, "line" o "bar"

  @Prop({ type: [Types.ObjectId], ref: 'Device' })
  devices: Device[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
