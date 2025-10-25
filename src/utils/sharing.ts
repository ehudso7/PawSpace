import * as Sharing from 'expo-sharing';
import { Platform, Linking } from 'react-native';

export const shareTransformation = async (uri: string, caption: string, mimeType: string) => {
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) throw new Error('Sharing is not available on this device');
  await Sharing.shareAsync(uri, {
    mimeType,
    dialogTitle: caption,
    UTI: Platform.OS === 'ios' ? 'public.movie' : undefined,
  } as any);
};

export const shareToInstagram = async (uri?: string) => {
  const instagramUrl = 'instagram://story-camera';
  const supported = await Linking.canOpenURL(instagramUrl);
  if (supported) {
    await Linking.openURL(instagramUrl);
    return true;
  }
  return false;
};
