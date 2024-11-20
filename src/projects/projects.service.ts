import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './schemas/projects.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}


  async createProject(
    name: string,
    chartType: string,
    frequency: number,
    devices: string[],
  ) {
    const newProject = new this.projectModel({
      name,
      chartType,
      frequency,
      devices,
    });
    return newProject.save();
  }

  async getProjects() {
    return this.projectModel.find().populate('devices').exec();
  }

  async getProjectById(id: string) {
    return this.projectModel.findById(id).populate('devices').exec();
  }
}
