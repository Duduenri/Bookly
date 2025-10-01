import React from 'react';
import { Platform, View, Text, Image, StyleSheet } from 'react-native';

// Tipos para as props do Avatar
export interface AvatarProps {
  name?: string;
  src?: string;
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  colorPalette?: 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';
}

const sizes = {
  '2xs': 16,
  'xs': 24,
  'sm': 32,
  'md': 40,
  'lg': 48,
  'xl': 56,
  '2xl': 64,
  'full': '100%' as any,
};

const colors = {
  gray: '#9CA3AF',
  red: '#EF4444',
  orange: '#F97316',
  yellow: '#EAB308',
  green: '#22C55E',
  teal: '#14B8A6',
  blue: '#3B82F6',
  cyan: '#06B6D4',
  purple: '#A855F7',
  pink: '#EC4899',
};

// Função para gerar iniciais do nome
const getInitials = (name?: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  colorPalette = 'gray',
}) => {
  const avatarSize = sizes[size];
  const backgroundColor = colors[colorPalette];
  const initials = getInitials(name);

  const containerStyle = [
    styles.container,
    {
      width: avatarSize,
      height: avatarSize,
      backgroundColor: backgroundColor + '20', // 20% opacity
      borderRadius: typeof avatarSize === 'number' ? avatarSize / 2 : 20,
    }
  ];

  const textStyle = [
    styles.text,
    {
      fontSize: typeof avatarSize === 'number' ? Math.max(avatarSize * 0.4, 12) : 16,
      color: backgroundColor,
    }
  ];

  if (src) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri: src }}
          style={[
            styles.image,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: typeof avatarSize === 'number' ? avatarSize / 2 : 20,
            }
          ]}
          onError={() => {
            // Se a imagem falhar, mostrar as iniciais
            console.log('Avatar image failed to load');
          }}
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>
        {initials || '?'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Avatar;