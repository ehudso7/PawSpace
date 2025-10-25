import React from 'react';
<<<<<<< HEAD
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';
=======
<<<<<<< HEAD
import { View, StyleSheet, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
=======
import { View, StyleSheet, ViewStyle } from 'react-native';
>>>>>>> origin/main

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
<<<<<<< HEAD
  margin?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 16,
  margin = 0,
}) => {
  return (
    <View
      style={[
        styles.card,
        { padding, margin },
        style,
      ]}
    >
=======
}

const Card: React.FC<CardProps> = ({ children, style, padding = 16 }) => {
  return (
    <View style={[styles.card, { padding }, style]}>
>>>>>>> origin/main
>>>>>>> origin/main
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
<<<<<<< HEAD
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    shadowColor: theme.colors.black,
=======
    backgroundColor: '#FFF',
    borderRadius: 12,
<<<<<<< HEAD
    padding: 16,
=======
>>>>>>> origin/main
    shadowColor: '#000',
>>>>>>> origin/main
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> origin/main
    shadowRadius: 4,
    elevation: 3,
  },
});

<<<<<<< HEAD
export default Card;
=======
export default Card;
=======
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Card;
>>>>>>> origin/main
>>>>>>> origin/main
