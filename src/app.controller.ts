import { Bind, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Bind(Payload(), Ctx())
  @MessagePattern('v3/hgm-maga@ttn/devices/#')
  getNotifications(data, context) {
    console.log(data);
    console.log(data.uplink_message.decoded_payload.data);
  }
}

export class Worker {
  get_device_location = (id) => {
    // Mock implementation, replace with your real DB query
    return { service: 'uci', area: 'none', cubicle: 'none', room: '1001' };
  };

  // Time zone handling
  colombiaTz = 'America/Bogota';

  // Example data structures
  keys = {
    maga_key: {
      sysId: 1,
      deviceId: 0,
      aplication: 'Maga',
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
      aplication: 'vumeter',
      properties: [{ name: 'Decibeles', prop: 'decibels', value: 0 }],
      location: [{ service: '' }, { area: '' }, { cubicle: '' }, { room: '' }],
    },
  };

  // constructor(mongodb) {
  //   this._mongodb = mongodb; // Store the MongoDB object
  // }

  _decoder(dataBytes) {
    const length = dataBytes.length / 2;
    const decodedData = [];

    for (let i = 0; i < length; i++) {
      decodedData.push((dataBytes[i * 2] << 8) | dataBytes[i * 2 + 1]);
    }
    console.log('DECODED PAYLOAD');
    console.log(decodedData);
    return decodedData;
  }

  _raw_data(data) {
    try {
      const endDeviceId = data.end_device_ids.device_id;
      const decoderPayload = data.uplink_message.decoded_payload.data;

      console.log('RAW DATA');
      console.log(endDeviceId);
      console.log(decoderPayload);

      return { devId: endDeviceId, payload: decoderPayload };
    } catch (error) {
      console.error('Error in raw_data: ', error);
    }
  }

  getWeekOfYear(date) {
    const jan1 = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(
      ((date.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7,
    );
  }

  getTimestamp() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDate();
    const weekday = now.getDay();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const week = this.getWeekOfYear(now);

    return { hour, day, week, weekday, month, year };
  }

  processData(data) {
    try {
      const rawData = this._raw_data(data);
      const { devId: deviceId, payload } = rawData;
      const sysId = payload[0];

      const output = Object.values(this.keys).find((k) => k.sysId === sysId);
      if (output) {
        output.deviceId = deviceId;
        output.properties.forEach((prop, index) => {
          prop.value = payload[index + 1];
        });

        const { hour, day, week, weekday, month, year } = this.getTimestamp();
        const location = this.get_device_location(deviceId);
      }
    } catch (error) {
      console.error('Error in processData: ', error);
    }
  }

  saveCurrentDatetime() {
    const { hour, day, week, weekday, month, year } = this.getTimestamp();
    const timestamp = { hour, day, week, weekday, month, year };

    const fs = require('fs');
    fs.writeFileSync('current_date.json', JSON.stringify(timestamp, null, 2));
  }

  updateDB2() {
    const fs = require('fs');
    const currentTime = this.getTimestamp();

    if (fs.existsSync('current_date.json')) {
      const prevTimestamp = JSON.parse(
        fs.readFileSync('current_date.json', 'utf-8'),
      );
      if (currentTime.hour !== prevTimestamp.hour) {
        this.saveCurrentDatetime();
      } else {
        console.log('Same hour, not updating DB');
      }
    } else {
      console.log('No previous timestamp found.');
      this.saveCurrentDatetime();
    }
  }
}
