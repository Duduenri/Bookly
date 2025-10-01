"use client"

import React from "react";
import { Platform } from "react-native";

// Importação condicional do Chakra UI apenas para web
let ChakraToaster: any = null;
let Portal: any = null;
let Spinner: any = null;
let Stack: any = null;
let Toast: any = null;
let createToaster: any = null;

if (Platform.OS === 'web') {
  try {
    const chakraUI = require("@chakra-ui/react");
    ChakraToaster = chakraUI.Toaster;
    Portal = chakraUI.Portal;
    Spinner = chakraUI.Spinner;
    Stack = chakraUI.Stack;
    Toast = chakraUI.Toast;
    createToaster = chakraUI.createToaster;
  } catch (error) {
    console.log('Chakra UI não disponível para toaster');
  }
}

export const toaster = Platform.OS === 'web' && createToaster ? createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
}) : {
  create: () => {},
  dismiss: () => {},
  dismissAll: () => {},
}

export const Toaster = () => {
  // Se não estiver na web ou não tiver Chakra UI, não renderizar nada
  if (Platform.OS !== 'web' || !ChakraToaster || !Portal || !Toast) {
    return null;
  }

  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast: any) => (
          <Toast.Root width={{ md: "sm" }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
