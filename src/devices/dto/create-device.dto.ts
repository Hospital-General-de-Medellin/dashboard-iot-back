export class CreateDeviceDto {
  sysId: number;
  deviceId: string;
  aplication: string;
  data: [
    {
      timestamp: Date;
      readings: [
        {
          minute: number;
          cleanHands: number;
          dirtyHands: number;
          boxChanes: number;
        },
      ];
    },
  ];
}
