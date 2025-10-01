import React from 'react';
import { Platform, StyleSheet, Text, TextInput, TextInputProps } from 'react-native';

// Importação condicional do Chakra UI apenas para web
let ChakraInput: any = null;
let ChakraInputProps: any = {};

if (Platform.OS === 'web') {
  try {
    const chakraUI = require('@chakra-ui/react');
    ChakraInput = chakraUI.Input;
    ChakraInputProps = {};
  } catch (error) {
    console.log('Chakra UI não disponível para Input');
  }
}

export interface InputProps extends TextInputProps {
  as?: React.ElementType;
  asChild?: boolean;
  colorPalette?: 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'outline' | 'subtle' | 'flushed';
  label?: string;
  error?: string;
}

const sizes = {
  '2xs': { height: 24, fontSize: 12, paddingHorizontal: 8 },
  'xs': { height: 28, fontSize: 13, paddingHorizontal: 10 },
  'sm': { height: 32, fontSize: 14, paddingHorizontal: 12 },
  'md': { height: 40, fontSize: 16, paddingHorizontal: 16 },
  'lg': { height: 48, fontSize: 18, paddingHorizontal: 20 },
  'xl': { height: 56, fontSize: 20, paddingHorizontal: 24 },
  '2xl': { height: 64, fontSize: 22, paddingHorizontal: 28 },
};

export const Input: React.FC<InputProps> = ({
  as,
  asChild,
  colorPalette = 'gray',
  size = 'md',
  variant = 'outline',
  label,
  error,
  style,
  ...props
}) => {
  // Se estiver na web e Chakra UI disponível, usar ChakraInput
  if (Platform.OS === 'web' && ChakraInput) {
    return (
      <ChakraInput
        as={as}
        asChild={asChild}
        colorPalette={colorPalette}
        size={size}
        variant={variant}
        {...props}
      />
    );
  }

  // Fallback para React Native
  const sizeStyle = sizes[size];
  
  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          sizeStyle,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});

// Export PasswordInput components
export { PasswordInput, PasswordStrengthMeter } from './PasswordInput';
export type { PasswordInputProps, PasswordVisibilityProps } from './PasswordInput';

export default Input;
