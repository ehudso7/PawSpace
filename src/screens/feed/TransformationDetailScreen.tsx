import React, { useCallback, useMemo, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { Transformation } from '../../types/feed';
import { Comments } from '../../components/comments/Comments';
import { formatNumberShort } from '../../utils/time';

interface Props {
  route: { params: { item: Transformation } };
  navigation: any;
}

const { width } = Dimensions.get('window');

export const TransformationDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { item } = route.params;
  const [showVideo, setShowVideo] = useState(item.after.type === 'video');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Transformation</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.mediaContainer}>
        {item.after.type === 'image' ? (
          <FastImage source={{ uri: item.after.url }} style={styles.media} resizeMode={FastImage.resizeMode.cover} />
        ) : (
          <Video source={{ uri: item.after.url }} style={styles.media} controls resizeMode="cover" />
        )}
      </View>

      <View style={styles.actionBar}>
        <View style={styles.actionLeft}>
          <Icon name={item.is_liked ? 'heart' : 'heart-outline'} size={24} color={item.is_liked ? '#ef4444' : '#111827'} />
          <Text style={styles.actionCount}> {formatNumberShort(item.likes_count)}</Text>
        </View>
        <View style={styles.actionLeft}>
          <Icon name="chatbubble-ellipses-outline" size={24} color="#111827" />
          <Text style={styles.actionCount}> {formatNumberShort(item.comments_count)}</Text>
        </View>
      </View>

      <Comments transformationId={item.id} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontWeight: '700', fontSize: 16, color: '#111827' },

  mediaContainer: { width: '100%', aspectRatio: 1, backgroundColor: '#e2e8f0' },
  media: { width: '100%', height: '100%' },

  actionBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8, borderBottomColor: '#e5e7eb', borderBottomWidth: StyleSheet.hairlineWidth },
  actionLeft: { flexDirection: 'row', alignItems: 'center' },
  actionCount: { color: '#334155' },
});

export default TransformationDetailScreen;
