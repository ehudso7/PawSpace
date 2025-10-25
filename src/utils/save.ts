import * as MediaLibrary from 'expo-media-library';

export const saveToDevice = async (uri: string): Promise<boolean> => {
  const permission = await MediaLibrary.requestPermissionsAsync();
  if (!permission.granted) return false;
  await MediaLibrary.createAssetAsync(uri);
  return true;
};
