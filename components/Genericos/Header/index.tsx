/* eslint-disable import/no-named-as-default */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../Avatar';

export interface HeaderProps {
  // Props do Avatar
  avatarSrc?: string;
  avatarName?: string;
  avatarSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  avatarColorPalette?: 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';
  
  // Props do conteúdo
  title?: string;
  subtitle?: string;
  
  // Props de ação
  onAvatarPress?: () => void;
  onTitlePress?: () => void;
  
  // Props de estilo
  showBorder?: boolean;
  showShadow?: boolean;
  
  // Props de layout
  rightContent?: React.ReactNode;
  
  // Props de acessibilidade
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Header: React.FC<HeaderProps> = ({
  // Avatar props
  avatarSrc,
  avatarName,
  avatarSize = 'md',
  avatarColorPalette = 'blue',
  
  // Content props
  title,
  subtitle,
  
  // Action props
  onAvatarPress,
  onTitlePress,
  
  // Style props
  showBorder = true,
  showShadow = false,
  
  // Layout props
  rightContent,
  
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
}) => {
  const getContainerStyle = () => {
    const baseStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      minHeight: 70,
      backgroundColor: '#0d2f2c', // Cor principal do Bookly
      paddingHorizontal: 20,
      paddingVertical: 15,
    };

    if (showBorder) {
      return {
        ...baseStyle,
        borderBottomWidth: 1,
        borderBottomColor: '#0d2f2c', // Cor principal para a borda
      };
    }

    if (showShadow) {
      return {
        ...baseStyle,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      };
    }

    return baseStyle;
  };

  return (
    <View style={getContainerStyle()}>
      {/* Avatar na esquerda */}
      <TouchableOpacity
        onPress={onAvatarPress}
        disabled={!onAvatarPress}
        accessible={true}
        accessibilityLabel={accessibilityLabel || `Avatar de ${avatarName || 'usuário'}`}
        accessibilityHint={accessibilityHint || 'Toque para abrir perfil'}
        accessibilityRole="button"
      >
        <Avatar
          name={avatarName}
          src={avatarSrc}
          size={avatarSize}
          colorPalette={avatarColorPalette}
        />
      </TouchableOpacity>
      
      {/* Conteúdo central */}
      <View style={styles.contentContainer}>
        {title && (
          <TouchableOpacity
            onPress={onTitlePress}
            disabled={!onTitlePress}
            accessible={true}
            accessibilityLabel={accessibilityLabel || title}
            accessibilityHint={accessibilityHint || 'Toque para navegar'}
            accessibilityRole="button"
          >
            <Text style={styles.title}>{title}</Text>
          </TouchableOpacity>
        )}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      {/* Conteúdo da direita */}
      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF', // Texto branco para contrastar com o fundo escuro
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF', // Texto branco para contrastar com o fundo escuro
    opacity: 0.9, // Leve transparência para diferenciar do título
  },
  rightContent: {
    marginLeft: 'auto',
  },
});

export default Header;
