import { Stack } from 'expo-router';
import React from 'react';

export default function PrivateLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="home" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
}
