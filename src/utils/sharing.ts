import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';

export async function shareTransformation(videoUri: string, caption: string): Promise<void> {
  const available = await Sharing.isAvailableAsync();
  if (!available) {
    // Fallback: open system share sheet is not available; try opening the file URI
    await Linking.openURL(videoUri);
    return;
  }
  await Sharing.shareAsync(videoUri, {
    mimeType: 'video/mp4',
    dialogTitle: caption,
  });
}

export async function shareToInstagramStories(): Promise<void> {
  const instagramUrl = 'instagram://story-camera';
  const canOpen = await Linking.canOpenURL(instagramUrl);
  if (canOpen) {
    await Linking.openURL(instagramUrl);
  } else {
    await Linking.openURL('https://www.instagram.com');
  }
}

export async function shareToTikTok(): Promise<void> {
  const tiktokUrl = 'snssdk1233://'; // TikTok URL scheme varies by region/version
  const canOpen = await Linking.canOpenURL(tiktokUrl);
  if (canOpen) {
    await Linking.openURL(tiktokUrl);
  } else {
    await Linking.openURL('https://www.tiktok.com');
  }
}
