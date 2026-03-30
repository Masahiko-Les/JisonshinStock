import { User } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { PlantGrowthCard, PlantGrowthCardRef } from '../components/PlantGrowthCard';
import { WaterDropAnimation, WaterDropAnimationRef } from '../components/WaterDropAnimation';
import { useWaterDrop } from '../contexts/WaterDropContext';
import { authService } from '../services/authService';
import { stockService } from '../services/stockService';
import { colors, radius, spacing } from '../theme/colors';

type Props = {
  user: User;
};

export const AccountScreen = ({ user }: Props) => {
  const waterDropRef = useRef<WaterDropAnimationRef>(null);
  const plantRef = useRef<PlantGrowthCardRef>(null);
  const { shouldPlay, resetWaterDrop } = useWaterDrop();
  const [stockCount, setStockCount] = useState(0);

  useEffect(() => {
    const unsubscribe = stockService.subscribeUserStocks(user.uid, (stocks) => {
      setStockCount(stocks.length);
    });

    return unsubscribe;
  }, [user.uid]);

  useEffect(() => {
    if (shouldPlay) {
      waterDropRef.current?.play();
      setTimeout(() => plantRef.current?.pulse(), 400);
      resetWaterDrop();
    }
  }, [shouldPlay, resetWaterDrop]);

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>アカウント</Text>
          <View style={styles.emailRow}>
            <Text style={styles.emailLabel}>メールアドレス</Text>
            <Text style={styles.emailValue}>{user.email}</Text>
          </View>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>ログアウト</Text>
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteText}>アカウント削除</Text>
          </Pressable>
        </View>

        <View style={styles.growthSection}>
          <PlantGrowthCard ref={plantRef} count={stockCount} plantType="default" />
          <WaterDropAnimation ref={waterDropRef} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: 50,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  growthSection: {
    marginTop: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emailRow: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  emailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  emailValue: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  logoutButton: {
    borderRadius: radius.md,
    backgroundColor: colors.neutralSoft,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  logoutText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  deleteText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '700',
  },
});
