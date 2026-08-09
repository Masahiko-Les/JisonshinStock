import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { Stock } from '../types';
import { formatDateJa } from '../utils/formatDate';

type Props = {
  stock: Stock;
  onEdit: (stock: Stock) => void;
  onDelete: (stock: Stock) => void;
};

export const StockCard = ({ stock, onEdit, onDelete }: Props) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuButtonRef = useRef<View>(null);

  const openMenu = () => {
    menuButtonRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPosition({
        top: y + height + spacing.xs,
        right: Dimensions.get('window').width - (x + width),
      });
      setMenuVisible(true);
    });
  };

  const closeMenu = () => setMenuVisible(false);

  const handleEdit = () => {
    closeMenu();
    onEdit(stock);
  };

  const handleDelete = () => {
    closeMenu();
    onDelete(stock);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.text}>{stock.text}</Text>

      <View style={styles.footer}>
        <Text style={styles.date}>{formatDateJa(stock.createdAt)}</Text>
        <Pressable
          ref={menuButtonRef}
          style={styles.menuButton}
          onPress={openMenu}
          hitSlop={8}
        >
          <Text style={styles.menuButtonText}>•••</Text>
        </Pressable>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.overlay}>
            <View style={[styles.menu, { top: menuPosition.top, right: menuPosition.right }]}>
              <Pressable style={styles.menuItem} onPress={handleEdit}>
                <Text style={styles.menuItemText}>編集</Text>
              </Pressable>
              <View style={styles.menuDivider} />
              <Pressable style={styles.menuItem} onPress={handleDelete}>
                <Text style={[styles.menuItemText, styles.menuItemDanger]}>削除</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  menuButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  menuButtonText: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    minWidth: 140,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  menuItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  menuItemDanger: {
    color: colors.danger,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
