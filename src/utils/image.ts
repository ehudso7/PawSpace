import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export type PickedImage = {
  uri: string;
  width: number;
  height: number;
};

const MIN_SIZE = 800;
const MAX_SIZE = 4096;

export async function requestPermissions() {
  const camera = await ImagePicker.requestCameraPermissionsAsync();
  const media = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return camera.status === 'granted' && media.status === 'granted';
}

export async function pickFromLibrary(): Promise<PickedImage | null> {
  const res = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    quality: 1,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });
  if (res.canceled) return null;
  const asset = res.assets[0];
  return validateAndProcess({ uri: asset.uri, width: asset.width!, height: asset.height! });
}

export async function takePhoto(): Promise<PickedImage | null> {
  const res = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    quality: 1,
  });
  if (res.canceled) return null;
  const asset = res.assets[0];
  return validateAndProcess({ uri: asset.uri, width: asset.width!, height: asset.height! });
}

export async function validateAndProcess(img: PickedImage): Promise<PickedImage | null> {
  if (!img.width || !img.height) return null;
  const minDim = Math.min(img.width, img.height);
  if (minDim < MIN_SIZE) {
    throw new Error(`Image too small. Minimum ${MIN_SIZE}x${MIN_SIZE}px`);
  }
  let { width, height } = img;
  let { uri } = img;
  const maxDim = Math.max(width, height);
  if (maxDim > MAX_SIZE) {
    const scale = MAX_SIZE / maxDim;
    const newW = Math.round(width * scale);
    const newH = Math.round(height * scale);
    const manipulated = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: newW, height: newH } }], { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG });
    uri = manipulated.uri;
    width = newW;
    height = newH;
  }
  return { uri, width, height };
}

export async function ensurePermissionsOrThrow() {
  const ok = await requestPermissions();
  if (!ok) throw new Error('Permissions denied. Enable camera and library access.');
}
