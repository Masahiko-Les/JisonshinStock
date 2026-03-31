import { User } from 'firebase/auth';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
      <View pointerEvents="none" style={styles.topBackdrop} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerWrapper}>
          <AppHeader />
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emailRow: {
    backgroundColor: colors.background,
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
