import * as MediaLibrary from 'expo-media-library';

export async function saveToDevice(videoUri: string): Promise<boolean> {
  const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
  let granted = status === 'granted';
  if (!granted && canAskAgain) {
    const req = await MediaLibrary.requestPermissionsAsync();
    granted = req.granted;
  }
  if (!granted) return false;

  await MediaLibrary.createAssetAsync(videoUri);
  return true;
}
