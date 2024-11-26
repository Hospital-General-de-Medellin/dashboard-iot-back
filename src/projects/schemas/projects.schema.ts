import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Device } from 'src/devices/schemas/devices.schema';

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  chartType: string; // Tipo de gráfica, por ejemplo, "line" o "bar"

  @Prop({ required: true })
  frequency: number; // Frecuencia en minutos o segundos

  @Prop({ type: [Types.ObjectId], ref: 'Device' })
  devices: Device[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
