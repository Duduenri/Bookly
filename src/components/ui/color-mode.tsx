"use client"

import type { ThemeProviderProps } from "next-themes"
import { ThemeProvider, useTheme } from "next-themes"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"
import { Platform, Text, TouchableOpacity } from "react-native"

export function ColorModeProvider(props: ThemeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  )
}

export type ColorMode = "light" | "dark"

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: (colorMode: ColorMode) => void
  toggleColorMode: () => void
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme()
  const colorMode = (forcedTheme || resolvedTheme || 'light') as ColorMode
  const toggleColorMode = () => {
    setTheme(colorMode === "dark" ? "light" : "dark")
  }
  return {
    colorMode,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? dark : light
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? <LuMoon /> : <LuSun />
}

// Versão simplificada do ColorModeButton sem dependência do Chakra UI
export const ColorModeButton = React.forwardRef<any, any>(
  function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode()
    
    if (Platform.OS === 'web') {
      return (
        <button
          onClick={toggleColorMode}
          ref={ref}
          aria-label="Toggle color mode"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...props.style
          }}
          {...props}
        >
          <ColorModeIcon />
        </button>
      )
    }

    return (
      <TouchableOpacity
        onPress={toggleColorMode}
        ref={ref}
        style={{
          padding: 8,
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'center',
          ...props.style
        }}
        {...props}
      >
        <ColorModeIcon />
      </TouchableOpacity>
    )
  }
)

// Versões simplificadas dos componentes LightMode e DarkMode
export const LightMode = React.forwardRef<any, any>(
  function LightMode(props, ref) {
    const colorMode = useColorMode().colorMode
    if (colorMode !== "light") return null
    
    if (Platform.OS === 'web') {
      return <span ref={ref} {...props} />
    }
    return <Text ref={ref} {...props} />
  }
)

export const DarkMode = React.forwardRef<any, any>(
  function DarkMode(props, ref) {
    const colorMode = useColorMode().colorMode
    if (colorMode !== "dark") return null
    
    if (Platform.OS === 'web') {
      return <span ref={ref} {...props} />
    }
    return <Text ref={ref} {...props} />
  }
)