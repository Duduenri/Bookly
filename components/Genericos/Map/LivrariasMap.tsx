import React from 'react';
import { Platform } from 'react-native';

// Delegador por plataforma: carrega a implementação correta em tempo de execução
// Isso evita que o Web importe módulos nativos do react-native-maps

type Props = Record<string, any>;

export default function LivrariasMap(props: Props) {
  const Impl = Platform.OS === 'web'
    ? require('./LivrariasMap.web').default
    : require('./LivrariasMap.native').default;
  return <Impl {...props} />;
}
