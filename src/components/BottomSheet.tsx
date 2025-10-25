import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanGestureHandler,
  State,
} from 'react-native';
import { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const { height: screenHeight } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  height: number;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  height,
  children,
}) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, height]);

  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { translationY, state } = event.nativeEvent;
    
    if (state === State.ACTIVE) {
      translateY.setValue(Math.max(0, translationY));
    } else if (state === State.END) {
      if (translationY > height * 0.3) {
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.overlay, { opacity }]}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>
        
        <PanGestureHandler onGestureEvent={handleGestureEvent}>
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                height,
                transform: [{ translateY }],
              },
            ]}
          >
            <View style={styles.handle} />
            {children}
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default BottomSheet;