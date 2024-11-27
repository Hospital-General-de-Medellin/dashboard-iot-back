import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async createProject(@Body() project: CreateProjectDto) {
    return await this.projectsService.createProject(project);
  }

  @Get()
  findProjects() {
    return this.projectsService.findProjects();
  }

  @Get(':id')
  findProject(@Param('id') id: string) {
    return this.projectsService.findProject(id);
  }

  @Patch(':id')
  updateProject(@Param('id') id: string, @Body() project: any) {
    return this.projectsService.updateProject(id, project);
  }

  @Delete(':id')
  deleteProject(@Param('id') id: string) {
    return this.projectsService.deleteProject(id);
  }
}
