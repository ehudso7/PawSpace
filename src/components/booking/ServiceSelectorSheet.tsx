import React, { useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Service } from '../../types/booking';
import { colors } from '../../theme/colors';

interface ServiceSelectorSheetProps {
  services: Service[];
  onClose: () => void;
  onSelectService: (service: Service) => void;
}

export const ServiceSelectorSheet: React.FC<ServiceSelectorSheetProps> = ({ services, onClose, onSelectService }) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%', '85%'], []);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const renderItem = ({ item }: { item: Service }) => {
    const selected = selectedId === item.id;
    return (
      <Pressable
        onPress={() => setSelectedId(item.id)}
        style={[styles.item, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.surfaceAlt : colors.surface }]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          {!!item.description && <Text style={styles.desc}>{item.description}</Text>}
          <Text style={styles.meta}>{Math.round(item.durationMinutes)} min</Text>
        </View>
        <Text style={styles.price}>
          {new Intl.NumberFormat(undefined, { style: 'currency', currency: item.currency || 'USD' }).format((item.priceCents || 0) / 100)}
        </Text>
      </Pressable>
    );
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
      )}
      backgroundStyle={{ backgroundColor: colors.card }}
      handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          data={services}
          keyExtractor={(s) => s.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ padding: 16 }}
          ListFooterComponent={
            <View style={{ height: 16 }} />
          }
        />
        <View style={styles.footer}>
          <Pressable onPress={onClose} style={[styles.footerBtn, { backgroundColor: colors.surface }]}>
            <Text style={{ color: colors.text }}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              const service = services.find((s) => s.id === selectedId);
              if (service) onSelectService(service);
            }}
            style={[styles.footerBtn, { backgroundColor: colors.primary, opacity: selectedId ? 1 : 0.6 }]}
            disabled={!selectedId}
          >
            <Text style={{ color: '#fff' }}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  desc: {
    color: colors.textMuted,
    marginTop: 4,
  },
  meta: {
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 12,
  },
  price: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  footerBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
});

export default ServiceSelectorSheet;
