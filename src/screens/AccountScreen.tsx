import { User } from 'firebase/auth';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { authService } from '../services/authService';
import { colors, radius, spacing } from '../theme/colors';

type Props = {
  user: User;
};

export const AccountScreen = ({ user }: Props) => {
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

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>アカウント</Text>
          <Text style={styles.description}>ログアウトやアカウント削除を行えます。</Text>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>ログアウト</Text>
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteText}>アカウント削除</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
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
