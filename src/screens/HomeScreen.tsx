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
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { PlantGrowthCard, PlantGrowthCardRef } from '../components/PlantGrowthCard';

import { WaterDropAnimation, WaterDropAnimationRef } from '../components/WaterDropAnimation';

import { MAX_LENGTH, stockService } from '../services/stockService';
import { colors, radius, spacing } from '../theme/colors';
import { Stock } from '../types';
import { useNavigation } from '@react-navigation/native';

type Props = {
  user: User;
};

export const HomeScreen = ({ user }: Props) => {
  const navigation = useNavigation<any>();
  const waterDropRef = useRef<WaterDropAnimationRef>(null);
  const plantRef = useRef<PlantGrowthCardRef>(null);
  const [inputText, setInputText] = useState('');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const unsubscribe = stockService.subscribeUserStocks(user.uid, (items) => {
      setStocks(items);
    });
    return unsubscribe;
  }, [user.uid]);

  const countText = useMemo(() => `${inputText.length} / ${MAX_LENGTH}`, [inputText.length]);

  const handleCreateStock = async () => {
    try {
      setPosting(true);
      await stockService.createStock(user.uid, inputText);
      setInputText('');
      waterDropRef.current?.play();
      setTimeout(() => plantRef.current?.pulse(), 400);
      setTimeout(() => {
        Alert.alert(
          '投稿しました',
          'できたことを1つストックしました。頑張りましたね。',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Stock'),
            },
          ],
        );
      }, 900);
    } catch (error) {
      const message = error instanceof Error ? error.message : '投稿に失敗しました。';
      Alert.alert('エラー', message);
    } finally {
      setPosting(false);
    }
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

        <View style={styles.postCard}>
          <Text style={styles.sectionTitle}>今日できたこと</Text>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={MAX_LENGTH}
            placeholder={'できたこと・うれしかったことなどを\n書いてみましょう'}
            placeholderTextColor={colors.textSecondary}
            textAlignVertical="top"
          />
          <Text style={styles.count}>{countText}</Text>
          <Pressable
            style={[styles.postButton, (!inputText.trim() || posting) && styles.postButtonDisabled]}
            onPress={handleCreateStock}
            disabled={!inputText.trim() || posting}
          >
            <Text style={styles.postButtonText}>{posting ? '投稿中...' : 'ストックする'}</Text>
          </Pressable>
        </View>

        <View style={styles.growthSection}>
          <PlantGrowthCard ref={plantRef} count={stocks.length} plantType="default" />
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
  postCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
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
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  growthSection: {
    marginTop: spacing.md,
  },
});
