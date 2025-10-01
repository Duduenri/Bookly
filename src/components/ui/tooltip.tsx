import * as React from "react";
import { Platform } from "react-native";

// Importação condicional do Chakra UI apenas para web
let ChakraTooltip: any = null;
let Portal: any = null;

if (Platform.OS === 'web') {
  try {
    const chakraUI = require("@chakra-ui/react");
    ChakraTooltip = chakraUI.Tooltip;
    Portal = chakraUI.Portal;
  } catch (error) {
    console.log('Chakra UI não disponível para tooltip');
  }
}

export interface TooltipProps {
  children?: React.ReactNode
  showArrow?: boolean
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  content: React.ReactNode
  contentProps?: any
  disabled?: boolean
  // aceitar props arbitrárias do Chakra se necessário
  [key: string]: any
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow,
      children,
      disabled,
      portalled = true,
      content,
      contentProps,
      portalRef,
      ...rest
    } = props

    if (disabled) return children

    // Se não estiver na web ou Chakra UI não disponível, apenas retornar children
    if (Platform.OS !== 'web' || !ChakraTooltip) {
      return children;
    }

    return (
      <ChakraTooltip.Root {...rest}>
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content ref={ref} {...contentProps}>
              {showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}
              {content}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    )
  },
)
