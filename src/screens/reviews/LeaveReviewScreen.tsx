import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, Alert } from 'react-native';
import { theme } from '@/constants/theme';
import Button from '@/components/common/Button';
import { RatingStars } from '@/components/common/RatingStars';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function LeaveReviewScreen(): JSX.Element {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please provide a rating before submitting your review.');
      return;
    }

    setLoading(true);
    // TODO: Submit review to API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    Alert.alert('Thank You!', 'Your review has been submitted.', [
      {
        text: 'OK',
        onPress: () => {
          setRating(0);
          setComment('');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Leave a Review</Text>
        <Text style={styles.subtitle}>Share your experience</Text>

        <View style={styles.ratingSection}>
          <Text style={styles.ratingLabel}>Rating</Text>
          <RatingStars
            rating={rating}
            onRatingChange={setRating}
            size={40}
            editable
          />
          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 5 && 'Excellent!'}
              {rating === 4 && 'Good'}
              {rating === 3 && 'Average'}
              {rating === 2 && 'Poor'}
              {rating === 1 && 'Very Poor'}
            </Text>
          )}
        </View>

        <View style={styles.commentSection}>
          <Text style={styles.commentLabel}>Your Review</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Tell others about your experience..."
            placeholderTextColor={theme.colors.placeholder}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={6}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{comment.length}/500</Text>
        </View>

        <Button
          title={loading ? 'Submitting...' : 'Submit Review'}
          onPress={handleSubmit}
          disabled={loading || rating === 0}
          style={styles.submitButton}
        />
      </ScrollView>
      {loading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 32,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 20,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary,
    marginTop: 12,
  },
  commentSection: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.white,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginTop: 8,
  },
  submitButton: {
    marginTop: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});