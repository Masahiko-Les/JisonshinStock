import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { Stock } from '../types';
import { formatDateJa } from '../utils/formatDate';

const daysAgo = (date: Date): string => {
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const postDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((todayDate.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return '今日できたこと';
  return `${diff}日前にできたこと`;
};

type Props = {
  visible: boolean;
  stock: Stock | null;
  onClose: () => void;
};

export const RandomStockModal = ({ visible, stock, onClose }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{stock ? daysAgo(stock.createdAt) : 'できたことを思い出す'}</Text>

          {stock ? (
            <>
              <Text style={styles.text}>{stock.text}</Text>
              <Text style={styles.date}>{formatDateJa(stock.createdAt)}</Text>
            </>
          ) : (
            <Text style={styles.emptyText}>まだストックがありません。投稿してから再生してください。</Text>
          )}

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
  emptyText: {
    fontSize: 15,
    lineHeight: 24,
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