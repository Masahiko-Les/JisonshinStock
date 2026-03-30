import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { getGrowthStage, GrowthStage } from '../utils/getGrowthStage';

type PlantType = 'default';

type Props = {
  count: number;
  plantType?: PlantType;
};

type PlantStageImages = Record<GrowthStage, ImageSourcePropType>;

const PLANT_STAGE_IMAGES: Record<PlantType, PlantStageImages> = {
  default: {
    1: require('../../assets/images/Stage1.png'),
    2: require('../../assets/images/Stage2.png'),
    3: require('../../assets/images/Stage3.png'),
    4: require('../../assets/images/Stage4.png'),
    5: require('../../assets/images/Stage5.png'),
    6: require('../../assets/images/Stage6.png'),
    7: require('../../assets/images/Stage7.png'),
    8: require('../../assets/images/Stage8.png'),
    9: require('../../assets/images/Stage9.png'),
    10: require('../../assets/images/Stage10.png'),
  },
};

export const PlantGrowthCard = ({ count, plantType = 'default' }: Props) => {
  if (count === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.emptyMessage}>できたことを投稿して種を植えましょう</Text>
        </View>
      </View>
    );
  }

  const stage = getGrowthStage(count);
  const stageImage = PLANT_STAGE_IMAGES[plantType][stage];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.countText}>できたことの数：{count}</Text>
        <Image source={stageImage} style={styles.plantImage} resizeMode="contain" />
        <Text style={styles.helperText}>あなたの種が少しずつ育っています</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    padding: spacing.md,
  },
  plantImage: {
    width: '100%',
    height: 140,
    marginBottom: spacing.sm,
  },
  countText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  emptyMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
});
