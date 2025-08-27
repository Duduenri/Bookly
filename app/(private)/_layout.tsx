import { Stack } from 'expo-router';
import React from 'react';

export default function PrivateLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="home" 
        options={{ 
          title: 'Home',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#2D3748',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
    </Stack>
  );
}
