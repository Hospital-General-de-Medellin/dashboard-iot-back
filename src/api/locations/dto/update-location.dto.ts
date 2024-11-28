import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from 'src/api/locations/dto/create-location.dto';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
