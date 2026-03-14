import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { MAX_LENGTH } from '../services/stockService';
import { colors, radius, spacing } from '../theme/colors';
import { Stock } from '../types';

type Props = {
  visible: boolean;
  stock: Stock | null;
  onClose: () => void;
  onSave: (text: string) => Promise<void>;
};

export const EditStockModal = ({ visible, stock, onClose, onSave }: Props) => {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible && stock) {
      setText(stock.text);
    }
  }, [visible, stock]);

  const handleSave = async () => {
    if (!stock) {
      return;
    }

    try {
      setSaving(true);
      await onSave(text);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            style={styles.avoidingView}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.content}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.title}>投稿を編集</Text>

                  <TextInput
                    value={text}
                    onChangeText={setText}
                    multiline
                    maxLength={MAX_LENGTH}
                    style={styles.input}
                    placeholder="できたことを入力"
                    placeholderTextColor={colors.textSecondary}
                    textAlignVertical="top"
                  />

                  <Text style={styles.count}>
                    {text.length} / {MAX_LENGTH}
                  </Text>

                  <View style={styles.actions}>
                    <Pressable style={styles.cancelButton} onPress={handleClose} disabled={saving}>
                      <Text style={styles.cancelText}>キャンセル</Text>
                    </Pressable>
                    <Pressable style={styles.saveButton} onPress={handleSave} disabled={saving}>
                      <Text style={styles.saveText}>{saving ? '決定中...' : '決定'}</Text>
                    </Pressable>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  avoidingView: {
    width: '100%',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxHeight: '94%',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  input: {
    minHeight: 140,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  cancelButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: colors.neutralSoft,
  },
  saveButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  cancelText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  saveText: {
    color: colors.primary,
    fontWeight: '700',
  },
});
