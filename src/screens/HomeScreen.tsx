import { User } from 'firebase/auth';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { EditStockModal } from '../components/EditStockModal';
import { RandomStockModal } from '../components/RandomStockModal';
import { StockCard } from '../components/StockCard';
import { WaterDropAnimation, WaterDropAnimationRef } from '../components/WaterDropAnimation';
import { authService } from '../services/authService';
import { MAX_LENGTH, stockService } from '../services/stockService';
import { colors, radius, spacing } from '../theme/colors';
import { Stock } from '../types';

type Props = {
  user: User;
};

export const HomeScreen = ({ user }: Props) => {
  const waterDropRef = useRef<WaterDropAnimationRef>(null);
  const [inputText, setInputText] = useState('');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [posting, setPosting] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [randomStock, setRandomStock] = useState<Stock | null>(null);
  const [hasShownRandom, setHasShownRandom] = useState(false);

  useEffect(() => {
    const unsubscribe = stockService.subscribeUserStocks(user.uid, (items) => {
      setStocks(items);
      setLoadingStocks(false);
    });

    return unsubscribe;
  }, [user.uid]);

  useEffect(() => {
    if (hasShownRandom || stocks.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * stocks.length);
    setRandomStock(stocks[randomIndex]);
    setShowRandomModal(true);
    setHasShownRandom(true);
  }, [stocks, hasShownRandom]);

  const countText = useMemo(() => `${inputText.length} / ${MAX_LENGTH}`, [inputText.length]);

  const handleCreateStock = async () => {
    try {
      setPosting(true);
      await stockService.createStock(user.uid, inputText);
      setInputText('');
      waterDropRef.current?.play();

      Alert.alert(
        '投稿しました',
        'おめでとうございます。できたことを一つストックしました。頑張りましたね',
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : '投稿に失敗しました。';
      Alert.alert('エラー', message);
    } finally {
      setPosting(false);
    }
  };

  const handleOpenEditModal = (stock: Stock) => {
    setEditingStock(stock);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (text: string) => {
    if (!editingStock) {
      return;
    }

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

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ログアウトに失敗しました。';
      Alert.alert('エラー', message);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert('アカウント削除', 'アカウントを削除しますか？この操作は取り消せません。', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除する',
        style: 'destructive',
        onPress: async () => {
          try {
            await authService.deleteCurrentUserAccount(user.uid);
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : 'アカウント削除に失敗しました。再ログイン後にお試しください。';
            Alert.alert('エラー', message);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.appName}>自尊心ストック</Text>
        <Text style={styles.catch}>小さな「できた」を、貯めていく</Text>

        <View style={styles.postCard}>
          <Text style={styles.sectionTitle}>今日できたこと</Text>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={MAX_LENGTH}
            placeholder={"できたこと・うれしかったことなどを\n書いてみましょう"}
            placeholderTextColor={colors.textSecondary}
            textAlignVertical="top"
          />
          <Text style={styles.count}>{countText}</Text>
          <Pressable style={styles.postButton} onPress={handleCreateStock} disabled={posting}>
            <Text style={styles.postButtonText}>{posting ? '投稿中...' : '投稿する'}</Text>
          </Pressable>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>あなたのストック</Text>
        </View>

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

        <View style={styles.footerActions}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>ログアウト</Text>
          </Pressable>
          <Pressable style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteAccountText}>アカウント削除</Text>
          </Pressable>
        </View>
      </ScrollView>

      <WaterDropAnimation ref={waterDropRef} />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 60,
  },
  appName: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  catch: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  postCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    padding: spacing.md,
  },
  count: {
    textAlign: 'right',
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  postButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  postButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  headerRow: {
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
  footerActions: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoutButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.neutralSoft,
  },
  logoutText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  deleteAccountButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
  },
  deleteAccountText: {
    color: colors.danger,
    fontWeight: '700',
  },
});