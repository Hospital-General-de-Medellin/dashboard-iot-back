import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async createProject(
    @Body('name') name: string,
    @Body('chartType') chartType: string,
    @Body('frequency') frequency: number,
    @Body('devices') devices: string[], // Array de IDs de dispositivos
  ) {
    return this.projectsService.createProject(
      name,
      chartType,
      frequency,
      devices,
    );
  }

  @Get()
  async getAllProjects() {
    return this.projectsService.getProjects();
  }

  @Get(':id')
  async getProject(@Param('id') id: string) {
    return this.projectsService.getProjectById(id);
  }
}
