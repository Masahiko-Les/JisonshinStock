import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { authService } from '../services/authService';
import { colors, radius, spacing } from '../theme/colors';

type AuthMode = 'login' | 'signup';

export const AuthScreen = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => (mode === 'login' ? 'ログイン' : '新規登録'), [mode]);

  const handleSubmit = async () => {
    const safeEmail = email.trim();
    const safePassword = password.trim();

    if (!safeEmail || !safePassword) {
      Alert.alert('入力エラー', 'メールアドレスとパスワードを入力してください。');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'login') {
        await authService.signIn(safeEmail, safePassword);
      } else {
        await authService.signUp(safeEmail, safePassword);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '認証に失敗しました。';
      Alert.alert('エラー', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>自尊心ストック</Text>
      <Text style={styles.catch}>小さな「できた」を、貯めていく</Text>

      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="メールアドレス"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="パスワード"
          secureTextEntry
          placeholderTextColor={colors.textSecondary}
        />

        <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitText}>{loading ? '処理中...' : title}</Text>
        </Pressable>

        <Pressable
          style={styles.switchButton}
          onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
          disabled={loading}
        >
          <Text style={styles.switchText}>
            {mode === 'login' ? '新規登録はこちら' : 'ログインはこちら'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
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
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    color: colors.textPrimary,
    padding: spacing.md,
    fontSize: 16,
  },
  submitButton: {
    marginTop: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  submitText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  switchButton: {
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  switchText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});