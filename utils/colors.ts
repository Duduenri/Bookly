export const paletasCores = {
  cinza: { solido: '#4A5568', texto: '#FFFFFF', contorno: '#4A5568' },
  vermelho: { solido: '#E53E3E', texto: '#FFFFFF', contorno: '#E53E3E' },
  laranja: { solido: '#DD6B20', texto: '#FFFFFF', contorno: '#DD6B20' },
  amarelo: { solido: '#D69E2E', texto: '#000000', contorno: '#D69E2E' },
  verde: { solido: '#38A169', texto: '#FFFFFF', contorno: '#38A169' },
  azulVerde: { solido: '#319795', texto: '#FFFFFF', contorno: '#319795' },
  azul: { solido: '#3182CE', texto: '#FFFFFF', contorno: '#3182CE' },
  ciano: { solido: '#00B5D8', texto: '#FFFFFF', contorno: '#00B5D8' },
  roxo: { solido: '#805AD5', texto: '#FFFFFF', contorno: '#805AD5' },
  rosa: { solido: '#D53F8C', texto: '#FFFFFF', contorno: '#D53F8C' },
};

export type PaletaCor = keyof typeof paletasCores;

// Padrão de cores específico do Bookly
export const PadraoBookly = {
  corPrincipal: '#0d2f2c',
  corSecundaria: '#eeecda',
};

// Mantém a exportação em inglês para compatibilidade
export const colorPalettes = paletasCores;
export type ColorPalette = PaletaCor;
