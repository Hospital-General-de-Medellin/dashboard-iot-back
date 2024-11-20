import { Injectable } from '@nestjs/common';
import { DeviceService } from './devices/devices.service';

@Injectable()
export class AppService {
  constructor(private deviceService: DeviceService) {}

  async worker(data) {
    const keys = {
      maga_key: {
        sysId: 1,
        deviceId: 0,
        application: 'Maga',
        properties: [
          { name: 'Manos limpias', prop: 'clean_hands', value: 0 },
          { name: 'Manos sucias', prop: 'dirty_hands', value: 0 },
          { name: 'Consumo de guantes', prop: 'box_chanes', value: 0 },
        ],
        location: [
          { service: '' },
          { area: '' },
          { cubicle: '' },
          { room: '' },
        ],
      },
      vumeter_key: {
        sysId: 2,
        deviceId: 0,
        application: 'vumeter',
        properties: [{ name: 'Decibeles', prop: 'decibels', value: 0 }],
        location: [
          { service: '' },
          { area: '' },
          { cubicle: '' },
          { room: '' },
        ],
      },
    };

    function decoder(dataBytes: number[]) {
      const length = dataBytes.length / 2;
      const decodedData = [];

      for (let i = 0; i < length; i++) {
        decodedData.push((dataBytes[i * 2] << 8) | dataBytes[i * 2 + 1]);
      }
      console.log('DECODED PAYLOAD');
      console.log(decodedData);
      return decodedData;
    }

    const decoderPayload = decoder(data.uplink_message.decoded_payload.data);
    const applicationName = data.end_device_ids.application_ids.application_id;
    const deviceId = data.end_device_ids.device_id;
    const sysId = decoderPayload[0];
    console.log('sysId', sysId);
    const payload = decoderPayload.slice(1);
    console.log('payload', payload);

    const output = Object.values(keys).find((k) => k.sysId === sysId);

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
  }
}
