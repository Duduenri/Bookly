"use client"

import type { ThemeProviderProps } from "next-themes"
import React from "react"
import { Platform } from "react-native"
import {
    ColorModeProvider,
} from "./color-mode"

// Importação condicional do Chakra UI apenas para web
let ChakraProvider: any = null;
let defaultSystem: any = null;

if (Platform.OS === 'web') {
  try {
    const chakraUI = require("@chakra-ui/react");
    ChakraProvider = chakraUI.ChakraProvider;
    defaultSystem = chakraUI.defaultSystem;
  } catch (error) {
    console.log('Chakra UI não disponível, usando fallback');
  }
}

export function Provider(props: ThemeProviderProps) {
  // No mobile, apenas usar o ColorModeProvider
  if (Platform.OS !== 'web' || !ChakraProvider) {
    return <ColorModeProvider {...props} />;
  }

  // Na web, usar ChakraProvider + ColorModeProvider
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
