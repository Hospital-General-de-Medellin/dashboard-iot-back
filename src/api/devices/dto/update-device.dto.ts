import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceDto } from 'src/api/devices/dto/create-device.dto';

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {}
