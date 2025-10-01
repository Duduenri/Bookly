import { Stack } from 'expo-router';
import React from 'react';

export default function PublicLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Login',
          headerShown: false 
        }} 
      />
      
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Cadastro',
          headerShown: false 
        }} 
      />
      
      {/* Rota padrão da área pública */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
