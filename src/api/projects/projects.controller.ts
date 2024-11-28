import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from 'src/api/projects/projects.service';
import { CreateProjectDto } from 'src/api/projects/dto/create-project.dto';
import { UpdateProjectDto } from 'src/api/projects/dto/update-project.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/enums/role.enum';

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
  @Roles(Role.Admin)
  async createProject(@Body() project: CreateProjectDto) {
    return await this.projectsService.createProject(project);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async updateProject(
    @Param('id') id: string,
    @Body() project: UpdateProjectDto,
  ) {
    return await this.projectsService.updateProject(id, project);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteProject(@Param('id') id: string) {
    return await this.projectsService.deleteProject(id);
  }
}
