"use client"

import * as React from "react"
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

// Importação condicional do Chakra UI apenas para web
let ChakraComponents: any = {};

if (Platform.OS === 'web') {
  try {
    const chakraUI = require("@chakra-ui/react");
    const icons = require("react-icons/lu");
    ChakraComponents = {
      Box: chakraUI.Box,
      HStack: chakraUI.HStack,
      IconButton: chakraUI.IconButton,
      Input: chakraUI.Input,
      InputGroup: chakraUI.InputGroup,
      Stack: chakraUI.Stack,
      mergeRefs: chakraUI.mergeRefs,
      useControllableState: chakraUI.useControllableState,
      LuEye: icons.LuEye,
      LuEyeOff: icons.LuEyeOff,
    };
  } catch (error) {
    console.log('Chakra UI não disponível para PasswordInput');
  }
}

export interface PasswordVisibilityProps {
  /**
   * The default visibility state of the password input.
   */
  defaultVisible?: boolean
  /**
   * The controlled visibility state of the password input.
   */
  visible?: boolean
  /**
   * Callback invoked when the visibility state changes.
   */
  onVisibleChange?: (visible: boolean) => void
  /**
   * Custom icons for the visibility toggle button.
   */
  visibilityIcon?: { on: React.ReactNode; off: React.ReactNode }
}

export interface PasswordInputProps {
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  disabled?: boolean
  style?: any
  defaultVisible?: boolean
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  visibilityIcon?: { on: React.ReactNode; off: React.ReactNode }
  rootProps?: any
}

// Hook customizado para controlar estado
const useControllableState = (config: any) => {
  const { value, defaultValue, onChange } = config;
  const [state, setState] = React.useState(value ?? defaultValue);
  
  const isControlled = value !== undefined;
  const finalValue = isControlled ? value : state;
  
  const setValue = React.useCallback((nextValue: any) => {
    if (!isControlled) {
      setState(nextValue);
    }
    onChange?.(nextValue);
  }, [isControlled, onChange]);
  
  return [finalValue, setValue];
};

export const PasswordInput = React.forwardRef<any, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const {
      rootProps,
      defaultVisible,
      visible: visibleProp,
      onVisibleChange,
      visibilityIcon = { on: '👁️', off: '🙈' },
      placeholder,
      value,
      onChangeText,
      disabled,
      style,
      ...rest
    } = props

    const [visible, setVisible] = useControllableState({
      value: visibleProp,
      defaultValue: defaultVisible || false,
      onChange: onVisibleChange,
    });

    // Se estiver na web e tiver Chakra UI, usar componentes Chakra
    if (Platform.OS === 'web' && ChakraComponents.InputGroup && ChakraComponents.Input) {
      const { InputGroup, Input, IconButton, mergeRefs, LuEye, LuEyeOff } = ChakraComponents;
      
      const chakraVisibilityIcon = {
        on: LuEye ? React.createElement(LuEye) : visibilityIcon.on,
        off: LuEyeOff ? React.createElement(LuEyeOff) : visibilityIcon.off
      };

      return React.createElement(InputGroup, {
        endElement: React.createElement(IconButton, {
          tabIndex: -1,
          size: "sm",
          variant: "ghost",
          'aria-label': "Toggle password visibility",
          disabled,
          onClick: () => setVisible(!visible),
          children: visible ? chakraVisibilityIcon.off : chakraVisibilityIcon.on
        }),
        ...rootProps
      }, React.createElement(Input, {
        ...rest,
        ref,
        type: visible ? "text" : "password",
        placeholder,
        value,
        onChange: (e: any) => onChangeText?.(e.target.value)
      }));
    }

    // Fallback para React Native
    return (
      <View style={[styles.container, style, rootProps?.style]}>
        <TextInput
          ref={ref}
          style={[styles.input, disabled && styles.disabled]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          editable={!disabled}
          {...rest}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setVisible(!visible)}
          disabled={disabled}
        >
          <Text style={styles.eyeIcon}>
            {visible ? (typeof visibilityIcon.off === 'string' ? visibilityIcon.off : '🙈') : 
                     (typeof visibilityIcon.on === 'string' ? visibilityIcon.on : '👁️')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

// Componente simplificado para medidor de força da senha (apenas web)
export const PasswordStrengthMeter = React.forwardRef<any, any>(
  function PasswordStrengthMeter(props, ref) {
    const { max = 4, value, ...rest } = props;

    if (Platform.OS !== 'web' || !ChakraComponents.Stack) {
      return null; // Não exibir no mobile
    }

    const { Stack, HStack, Box } = ChakraComponents;
    const percent = (value / max) * 100;
    const { label, colorPalette } = getColorPalette(percent);

    return React.createElement(Stack, {
      align: "flex-end",
      gap: "1",
      ref,
      ...rest
    }, [
      React.createElement(HStack, {
        key: "bars",
        width: "full"
      }, Array.from({ length: max }).map((_, index) =>
        React.createElement(Box, {
          key: index,
          height: "1",
          flex: "1",
          rounded: "sm",
          'data-selected': index < value ? "" : undefined,
          layerStyle: "fill.subtle",
          colorPalette: "gray",
          _selected: {
            colorPalette,
            layerStyle: "fill.solid",
          }
        })
      )),
      label && React.createElement(HStack, {
        key: "label",
        textStyle: "xs"
      }, label)
    ]);
  }
);

function getColorPalette(percent: number) {
  switch (true) {
    case percent < 33:
      return { label: "Low", colorPalette: "red" }
    case percent < 66:
      return { label: "Medium", colorPalette: "orange" }
    default:
      return { label: "High", colorPalette: "green" }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
  },
  disabled: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
  },
  eyeIcon: {
    fontSize: 18,
  },
});
