import React, { useMemo } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { CommentsList } from '../components/comments/CommentsList';
import { useRoute } from '../navigation/stubs';
import type { RootStackParamList } from '../types/navigation';
import feedService from '../services/feed';

const { width } = Dimensions.get('window');

export default function TransformationDetailScreen() {
  const { params } = useRoute<'TransformationDetail'>();
  const { id } = params;

  const transformation = useMemo(() => feedService.getById(id), [id]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl * 2 }}>
        {transformation ? (
          <View>
            <FastImage source={{ uri: transformation.after.url }} style={{ width, height: width * (transformation.after.aspect_ratio ?? 1) }} />
            <View style={{ padding: spacing.lg }}>
              <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: '700' }}>{transformation.provider.display_name}</Text>
              <Text style={{ color: colors.textSecondary, marginTop: spacing.sm }}>{transformation.caption}</Text>
            </View>
          </View>
        ) : (
          <Text style={{ color: colors.textSecondary, padding: spacing.lg }}>Loading...</Text>
        )}
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.md }} />
        <View style={{ flex: 1, minHeight: 360 }}>
          <CommentsList transformationId={id} />
        </View>
      </ScrollView>
    </View>
  );
}
