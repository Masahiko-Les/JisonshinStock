import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { Stock } from '../types';
import { formatDateJa } from '../utils/formatDate';

type Props = {
  visible: boolean;
  stock: Stock | null;
  onClose: () => void;
};

export const RandomStockModal = ({ visible, stock, onClose }: Props) => {
  if (!stock) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>過去のストック</Text>
          <Text style={styles.text}>{stock.text}</Text>
          <Text style={styles.date}>{formatDateJa(stock.createdAt)}</Text>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>閉じる</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  content: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  closeText: {
    color: colors.primary,
    fontWeight: '600',
  },
});