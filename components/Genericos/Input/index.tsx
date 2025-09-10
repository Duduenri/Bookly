import { Input as ChakraInput, InputProps as ChakraInputProps } from '@chakra-ui/react';
import React from 'react';

export interface InputProps extends ChakraInputProps {
  as?: React.ElementType;
  asChild?: boolean;
  colorPalette?: 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'outline' | 'subtle' | 'flushed';
}

export const Input: React.FC<InputProps> = ({
  as,
  asChild,
  colorPalette = 'gray',
  size = 'md',
  variant = 'outline',
  ...props
}) => {
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
};

export default Input;
