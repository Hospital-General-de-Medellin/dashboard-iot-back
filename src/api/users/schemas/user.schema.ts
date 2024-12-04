import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Project } from 'src/api/projects/schemas/projects.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: ['user'] })
  role?: string[];

  @Prop({ type: [Types.ObjectId], ref: 'Project' })
  projects?: Project[];
}

export const userSchema = SchemaFactory.createForClass(User);
