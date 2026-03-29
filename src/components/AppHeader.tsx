import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';

export const AppHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>自尊心ストック</Text>
      <Text style={styles.catch}>小さな「できた」を、貯めていく</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
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
  },
});
