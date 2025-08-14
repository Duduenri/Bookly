import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colorPalettes } from '../../../utils/colors';

export interface ButtonProps {
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  spinnerPlacement?: 'start' | 'end';
  colorPalette?: keyof typeof colorPalettes;
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'solid' | 'subtle' | 'surface' | 'outline' | 'ghost' | 'plain';
  style?: any;
  textStyle?: any;
}

const sizes = {
  '2xs': { height: 20, paddingHorizontal: 8, fontSize: 10 },
  'xs': { height: 24, paddingHorizontal: 12, fontSize: 12 },
  'sm': { height: 32, paddingHorizontal: 16, fontSize: 14 },
  'md': { height: 40, paddingHorizontal: 20, fontSize: 16 },
  'lg': { height: 48, paddingHorizontal: 24, fontSize: 18 },
  'xl': { height: 56, paddingHorizontal: 28, fontSize: 20 },
  '2xl': { height: 64, paddingHorizontal: 32, fontSize: 24 },
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  loadingText,
  spinnerPlacement = 'start',
  colorPalette = 'cinza',
  size = 'md',
  variant = 'solid',
  style,
  textStyle,
}) => {
  const colorConfig = colorPalettes[colorPalette as keyof typeof colorPalettes];
  const sizeConfig = sizes[size];

  const getButtonStyle = () => {
    const baseStyle = {
      height: sizeConfig.height,
      paddingHorizontal: sizeConfig.paddingHorizontal,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row' as const,
    };

    switch (variant) {
      case 'solid':
        return {
          ...baseStyle,
          backgroundColor: disabled ? '#E2E8F0' : colorConfig.solido,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? '#E2E8F0' : colorConfig.contorno,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'subtle':
        return {
          ...baseStyle,
          backgroundColor: disabled ? '#F7FAFC' : `${colorConfig.solido}20`,
        };
      case 'surface':
        return {
          ...baseStyle,
          backgroundColor: disabled ? '#F7FAFC' : '#FFFFFF',
          borderWidth: 1,
          borderColor: '#E2E8F0',
        };
      case 'plain':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          paddingHorizontal: 0,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontSize: sizeConfig.fontSize,
      fontWeight: '500' as const,
    };

    switch (variant) {
      case 'solid':
        return {
          ...baseTextStyle,
          color: disabled ? '#A0AEC0' : colorConfig.texto,
        };
      case 'outline':
      case 'ghost':
      case 'subtle':
        return {
          ...baseTextStyle,
          color: disabled ? '#A0AEC0' : colorConfig.solido,
        };
      case 'surface':
        return {
          ...baseTextStyle,
          color: disabled ? '#A0AEC0' : '#2D3748',
        };
      case 'plain':
        return {
          ...baseTextStyle,
          color: disabled ? '#A0AEC0' : colorConfig.solido,
        };
      default:
        return baseTextStyle;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          {spinnerPlacement === 'start' && (
            <ActivityIndicator 
              size="small" 
              color={variant === 'solid' ? colorConfig.texto : colorConfig.solido}
              style={styles.spinner}
            />
          )}
          <Text style={[getTextStyle(), textStyle]}>
            {loadingText || children}
          </Text>
          {spinnerPlacement === 'end' && (
            <ActivityIndicator 
              size="small" 
              color={variant === 'solid' ? colorConfig.texto : colorConfig.solido}
              style={styles.spinner}
            />
          )}
        </View>
      );
    }

    return (
      <Text style={[getTextStyle(), textStyle]}>
        {children}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginHorizontal: 4,
  },
});

export default Button;