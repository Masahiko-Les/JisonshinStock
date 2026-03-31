import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { EditStockModal } from '../components/EditStockModal';
import { RandomStockModal } from '../components/RandomStockModal';
import { StockCard } from '../components/StockCard';
import { stockService } from '../services/stockService';
import { colors, radius, spacing } from '../theme/colors';
import { Stock } from '../types';

type Props = {
  user: User;
};

export const StockScreen = ({ user }: Props) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [randomStock, setRandomStock] = useState<Stock | null>(null);

  useEffect(() => {
    const unsubscribe = stockService.subscribeUserStocks(user.uid, (items) => {
      setStocks(items);
      setLoadingStocks(false);
    });
    return unsubscribe;
  }, [user.uid]);

  const handleOpenEditModal = (stock: Stock) => {
    setEditingStock(stock);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (text: string) => {
    if (!editingStock) return;
    try {
      await stockService.updateStock(user.uid, editingStock.id, text);
      setShowEditModal(false);
      setEditingStock(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新に失敗しました。';
      Alert.alert('エラー', message);
    }
  };

  const handleDeleteStock = (stock: Stock) => {
    Alert.alert('削除確認', 'この投稿を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: async () => {
          try {
            await stockService.deleteStock(user.uid, stock.id);
          } catch (error) {
            const message = error instanceof Error ? error.message : '削除に失敗しました。';
            Alert.alert('エラー', message);
          }
        },
      },
    ]);
  };

  const handleRandomPlay = () => {
    if (stocks.length === 0) {
      setRandomStock(null);
      setShowRandomModal(true);
      return;
    }
    const randomIndex = Math.floor(Math.random() * stocks.length);
    setRandomStock(stocks[randomIndex]);
    setShowRandomModal(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View pointerEvents="none" style={styles.topBackdrop} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerWrapper}>
          <AppHeader />
        </View>

        <View style={styles.randomCard}>
          <Text style={styles.randomMessage}>
            小さなできたことが、あなたの力になります。過去の自分を振り返って、今の自分を励ましてみましょう
          </Text>
          <Pressable style={styles.randomButton} onPress={handleRandomPlay}>
            <Text style={styles.randomButtonText}>できたことを思い出す</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>あなたのストック</Text>

        {loadingStocks ? (
          <Text style={styles.helperText}>読み込み中...</Text>
        ) : stocks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              まだストックがありません。今日できたことを一つ残してみましょう
            </Text>
          </View>
        ) : (
          stocks.map((stock) => (
            <StockCard
              key={stock.id}
              stock={stock}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteStock}
            />
          ))
        )}
      </ScrollView>

      <EditStockModal
        visible={showEditModal}
        stock={editingStock}
        onClose={() => {
          setShowEditModal(false);
          setEditingStock(null);
        }}
        onSave={handleSaveEdit}
      />

      <RandomStockModal
        visible={showRandomModal}
        stock={randomStock}
        onClose={() => setShowRandomModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
  },
  topBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 240,
    backgroundColor: colors.card,
  },
  scroll: {
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 60,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    marginHorizontal: -spacing.lg,
    marginBottom: spacing.md,
  },
  randomCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  randomMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  randomButton: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  randomButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  emptyCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.md,
  },
  emptyText: {
    color: colors.textSecondary,
    lineHeight: 24,
    fontSize: 15,
  },
});
