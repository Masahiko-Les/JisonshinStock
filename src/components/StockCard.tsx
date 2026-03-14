import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { Stock } from '../types';
import { formatDateJa } from '../utils/formatDate';

type Props = {
  stock: Stock;
  onEdit: (stock: Stock) => void;
  onDelete: (stock: Stock) => void;
};

export const StockCard = ({ stock, onEdit, onDelete }: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{stock.text}</Text>
      <Text style={styles.date}>{formatDateJa(stock.createdAt)}</Text>

      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.editButton]} onPress={() => onEdit(stock)}>
          <Text style={styles.editText}>編集</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.deleteButton]} onPress={() => onDelete(stock)}>
          <Text style={styles.deleteText}>削除</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  editButton: {
    backgroundColor: colors.primarySoft,
  },
  deleteButton: {
    backgroundColor: colors.dangerSoft,
  },
  editText: {
    color: colors.primary,
    fontWeight: '600',
  },
  deleteText: {
    color: colors.danger,
    fontWeight: '600',
  },
});