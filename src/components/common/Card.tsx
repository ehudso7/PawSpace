import React from 'react';
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

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

const Card: React.FC<CardProps> = ({ children, style, padding = 16 }) => {
  return (
    <View style={[styles.card, { padding }, style]}>
>>>>>>> origin/main
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
<<<<<<< HEAD
    padding: 16,
=======
>>>>>>> origin/main
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
<<<<<<< HEAD
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Card;
=======
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Card;
>>>>>>> origin/main
