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
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findProjects() {
    return await this.projectsService.findProjects();
  }

  @Get(':id')
  async findProject(@Param('id') id: string) {
    return await this.projectsService.findProject(id);
  }

  @Post()
  async createProject(@Body() project: CreateProjectDto) {
    return await this.projectsService.createProject(project);
  }

  @Patch(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() project: UpdateProjectDto,
  ) {
    return await this.projectsService.updateProject(id, project);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    return await this.projectsService.deleteProject(id);
  }
}
