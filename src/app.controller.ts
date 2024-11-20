import { Bind, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices';
import { DeviceService } from './devices/devices.service';

export class Worker {
  constructor(private deviceService: DeviceService) {}

  // get_device_location = (id) => {
  //   // Mock implementation, replace with your real DB query
  //   return { service: 'uci', area: 'none', cubicle: 'none', room: '1001' };
  // };

  keys = {
    maga_key: {
      sysId: 1,
      deviceId: 0,
      application: 'Maga',
      properties: [
        { name: 'Manos limpias', prop: 'clean_hands', value: 0 },
        { name: 'Manos sucias', prop: 'dirty_hands', value: 0 },
        { name: 'Consumo de guantes', prop: 'box_chanes', value: 0 },
      ],
      location: [{ service: '' }, { area: '' }, { cubicle: '' }, { room: '' }],
    },
    vumeter_key: {
      sysId: 2,
      deviceId: 0,
      application: 'vumeter',
      properties: [{ name: 'Decibeles', prop: 'decibels', value: 0 }],
      location: [{ service: '' }, { area: '' }, { cubicle: '' }, { room: '' }],
    },
  };

  _decoder(dataBytes: number[]) {
    const length = dataBytes.length / 2;
    const decodedData = [];

    for (let i = 0; i < length; i++) {
      decodedData.push((dataBytes[i * 2] << 8) | dataBytes[i * 2 + 1]);
    }
    console.log('DECODED PAYLOAD');
    console.log(decodedData);
    return decodedData;
  }

  async processData(data) {
    try {
      const decoderPayload = this._decoder(
        data.uplink_message.decoded_payload.data,
      );
      const applicationName =
        data.end_device_ids.application_ids.application_id;
      const deviceId = data.end_device_ids.device_id;
      const sysId = decoderPayload[0];
      console.log('sysId', sysId);
      const payload = decoderPayload.slice(1);
      console.log('payload', payload);

      const output = Object.values(this.keys).find((k) => k.sysId === sysId);
      if (output) {
        const propertiesData: { [key: string]: number } = {};
        output.properties.forEach((prop, index) => {
          propertiesData[prop.prop] = payload[index] || 0;
        });

        await this.deviceService.createDevice({
          sysId,
          deviceId,
          applicationName,
          data: {
            minute: new Date().getMinutes(),
            ...propertiesData,
          },
        });

        return output;
      }
    } catch (error) {
      console.error('Error in processData: ', error);
    }
  }
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly deviceService: DeviceService,
  ) {}
  worker = new Worker(this.deviceService);

  @Bind(Payload(), Ctx())
  @MessagePattern('v3/hgm-maga@ttn/devices/#')
  getDataBytes(data, context) {
    return this.worker.processData(data);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
