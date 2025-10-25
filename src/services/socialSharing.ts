import * as Linking from 'expo-linking';
import { Platform as RNPlatform } from 'react-native';
import { Platform, PublishingOptions, ShareOptions } from '../types';
import { videoExportService } from './videoExport';

export class SocialSharingService {
  /**
   * Share to multiple platforms
   */
  async shareToMultiplePlatforms(
    videoUrl: string, 
    options: PublishingOptions
  ): Promise<{ [key in Platform]?: boolean }> {
    const results: { [key in Platform]?: boolean } = {};

    for (const platform of options.platforms) {
      try {
        switch (platform) {
          case 'pawspace':
            results[platform] = await this.shareToInternalPlatform(videoUrl, options);
            break;
          case 'instagram':
            results[platform] = await this.shareToInstagram(videoUrl, options);
            break;
          case 'tiktok':
            results[platform] = await this.shareToTikTok(videoUrl, options);
            break;
          case 'twitter':
            results[platform] = await this.shareToTwitter(videoUrl, options);
            break;
        }
      } catch (error) {
        console.error(`Error sharing to ${platform}:`, error);
        results[platform] = false;
      }
    }

    return results;
  }

  /**
   * Share to Instagram Stories/Reels
   */
  async shareToInstagram(videoUrl: string, options: PublishingOptions): Promise<boolean> {
    try {
      const content = videoExportService.createShareableContent(
        videoUrl, 
        options.caption, 
        options.hashtags
      );

      // Check if Instagram is installed
      const instagramUrl = 'instagram://story-camera';
      const canOpen = await Linking.canOpenURL(instagramUrl);

      if (!canOpen) {
        // Fallback to web sharing
        return this.shareViaWebIntent('instagram', videoUrl, content.instagramStory);
      }

      // For iOS, use Instagram's URL scheme
      if (RNPlatform.OS === 'ios') {
        await Linking.openURL(instagramUrl);
        return true;
      }

      // For Android, use sharing intent
      return this.shareViaSystemShare(videoUrl, content.instagramStory, 'com.instagram.android');
    } catch (error) {
      console.error('Error sharing to Instagram:', error);
      return false;
    }
  }

  /**
   * Share to TikTok
   */
  async shareToTikTok(videoUrl: string, options: PublishingOptions): Promise<boolean> {
    try {
      const content = videoExportService.createShareableContent(
        videoUrl, 
        options.caption, 
        options.hashtags
      );

      // Check if TikTok is installed
      const tiktokUrl = 'snssdk1233://';
      const canOpen = await Linking.canOpenURL(tiktokUrl);

      if (!canOpen) {
        return this.shareViaWebIntent('tiktok', videoUrl, content.tiktokCaption);
      }

      // TikTok doesn't have a direct sharing URL scheme for videos
      // We'll use system sharing with TikTok as preferred app
      return this.shareViaSystemShare(videoUrl, content.tiktokCaption, 'com.zhiliaoapp.musically');
    } catch (error) {
      console.error('Error sharing to TikTok:', error);
      return false;
    }
  }

  /**
   * Share to Twitter
   */
  async shareToTwitter(videoUrl: string, options: PublishingOptions): Promise<boolean> {
    try {
      const content = videoExportService.createShareableContent(
        videoUrl, 
        options.caption, 
        options.hashtags
      );

      const tweetText = encodeURIComponent(content.twitterPost);
      const twitterUrl = `twitter://post?message=${tweetText}`;
      const webTwitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

      // Try native app first
      const canOpen = await Linking.canOpenURL(twitterUrl);
      if (canOpen) {
        await Linking.openURL(twitterUrl);
        return true;
      }

      // Fallback to web
      await Linking.openURL(webTwitterUrl);
      return true;
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
      return false;
    }
  }

  /**
   * Share to internal PawSpace platform
   */
  async shareToInternalPlatform(videoUrl: string, options: PublishingOptions): Promise<boolean> {
    try {
      // This would integrate with your internal API
      const postData = {
        videoUrl,
        caption: options.caption,
        hashtags: options.hashtags,
        serviceTag: options.serviceTag,
        privacy: options.privacy,
        timestamp: new Date().toISOString()
      };

      // Simulate API call
      console.log('Posting to PawSpace:', postData);
      
      // In a real implementation, you'd make an API call here
      // const response = await fetch('/api/posts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(postData)
      // });
      
      return true;
    } catch (error) {
      console.error('Error sharing to PawSpace:', error);
      return false;
    }
  }

  /**
   * Share via system sharing dialog
   */
  private async shareViaSystemShare(
    videoUrl: string, 
    message: string, 
    packageName?: string
  ): Promise<boolean> {
    try {
      const shareOptions: ShareOptions = {
        title: 'Share Transformation Video',
        message,
        url: videoUrl,
        type: 'video/mp4'
      };

      await videoExportService.shareVideo(videoUrl, shareOptions);
      return true;
    } catch (error) {
      console.error('Error with system share:', error);
      return false;
    }
  }

  /**
   * Share via web intent (fallback)
   */
  private async shareViaWebIntent(
    platform: string, 
    videoUrl: string, 
    message: string
  ): Promise<boolean> {
    try {
      const webUrls = {
        instagram: 'https://www.instagram.com/',
        tiktok: 'https://www.tiktok.com/',
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
      };

      const url = webUrls[platform as keyof typeof webUrls];
      if (url) {
        await Linking.openURL(url);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error with web intent:', error);
      return false;
    }
  }

  /**
   * Get platform-specific hashtag suggestions
   */
  getPlatformHashtags(platform: Platform): string[] {
    const commonTags = ['petgrooming', 'doggrooming', 'petcare', 'transformation'];
    
    const platformSpecific = {
      pawspace: [...commonTags, 'pawspace', 'petcommunity'],
      instagram: [...commonTags, 'dogsofinstagram', 'petmakeover', 'groominglife'],
      tiktok: [...commonTags, 'pettok', 'dogmakeover', 'groomingmagic', 'petransformation'],
      twitter: [...commonTags, 'pets', 'dogs', 'grooming']
    };

    return platformSpecific[platform] || commonTags;
  }

  /**
   * Validate caption length for platform
   */
  validateCaptionLength(caption: string, platform: Platform): {
    isValid: boolean;
    maxLength: number;
    currentLength: number;
  } {
    const limits = {
      pawspace: 280,
      instagram: 2200,
      tiktok: 300,
      twitter: 280
    };

    const maxLength = limits[platform];
    const currentLength = caption.length;

    return {
      isValid: currentLength <= maxLength,
      maxLength,
      currentLength
    };
  }

  /**
   * Check if platform app is installed
   */
  async isPlatformAppInstalled(platform: Platform): Promise<boolean> {
    const urlSchemes = {
      pawspace: 'pawspace://',
      instagram: 'instagram://',
      tiktok: 'snssdk1233://',
      twitter: 'twitter://'
    };

    const scheme = urlSchemes[platform];
    if (!scheme) return false;

    try {
      return await Linking.canOpenURL(scheme);
    } catch {
      return false;
    }
  }
}

export const socialSharingService = new SocialSharingService();