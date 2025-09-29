import DeviceInfo from 'react-native-device-info';

type DeviceInfoType = {
  brand: string;
  model: string;
  systemName: string;
  systemVersion: string;
  uniqueId: string;
};

// export async function getDeviceInfo(): Promise<DeviceInfoType> {
//   const brand = DeviceInfo.getBrand();
//   const model = DeviceInfo.getModel();
//   const systemName = DeviceInfo.getSystemName();
//   const systemVersion = DeviceInfo.getSystemVersion();
//   const uniqueId = DeviceInfo.getUniqueIdSync();

//   return { brand, model, systemName, systemVersion, uniqueId };
// }

import * as Device from 'expo-device';

export function getDeviceInfo() {
  return {
    brand: Device.brand ?? '',
    model: Device.modelName ?? '',
    systemName: Device.osName ?? '',
    systemVersion: Device.osVersion ?? '',
    uniqueId: Device.osBuildId ?? '', // hoặc Device.deviceName
  };
}
