import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export interface PickedImage {
  uri: string;
  width: number;
  height: number;
}

const MIN = 800;
const MAX = 4096;

function clampToBounds(width: number, height: number) {
  // keep aspect ratio within [MIN, MAX]
  const aspect = width / height;
  let w = width;
  let h = height;

  // upscale small images to MIN if possible (not ideal, but ensures consistent canvas)
  if (w < MIN || h < MIN) {
    if (w < h) {
      w = MIN;
      h = Math.round(MIN / aspect);
    } else {
      h = MIN;
      w = Math.round(MIN * aspect);
    }
  }

  // downscale large images to MAX
  if (w > MAX || h > MAX) {
    if (w > h) {
      w = MAX;
      h = Math.round(MAX / aspect);
    } else {
      h = MAX;
      w = Math.round(MAX * aspect);
    }
  }

  return { width: w, height: h };
}

export async function requestPermissions() {
  const cam = await ImagePicker.requestCameraPermissionsAsync();
  const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return cam.status === 'granted' && lib.status === 'granted';
}

export async function pickFromLibrary(): Promise<PickedImage | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    allowsEditing: false,
    exif: false,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  return await normalizeImage(asset.uri, asset.width ?? 0, asset.height ?? 0);
}

export async function takePhoto(): Promise<PickedImage | null> {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    allowsEditing: false,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  return await normalizeImage(asset.uri, asset.width ?? 0, asset.height ?? 0);
}

export async function normalizeImage(uri: string, width: number, height: number): Promise<PickedImage> {
  if (!width || !height) {
    // fallback: read dimensions via manipulator by doing a no-op
    const info = await ImageManipulator.manipulateAsync(uri, [], { compress: 1, format: ImageManipulator.SaveFormat.JPEG });
    width = info.width ?? width;
    height = info.height ?? height;
  }

  const target = clampToBounds(width, height);

  // If within bounds, still compress a bit to keep memory low
  if (target.width === width && target.height === height) {
    const out = await ImageManipulator.manipulateAsync(uri, [], { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG });
    return { uri: out.uri, width, height };
  }

  // Resize to target bounds
  const resized = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: target.width, height: target.height } }],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );

  return { uri: resized.uri, width: target.width, height: target.height };
}
