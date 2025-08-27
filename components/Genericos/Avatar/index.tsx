import {
    Box,
    Avatar as ChakraAvatar,
    AvatarGroup as ChakraAvatarGroup,
    defineStyle,
    Text
} from '@chakra-ui/react';
import React, { forwardRef, ReactNode } from 'react';

// Tipos para as props do Avatar
export interface AvatarProps {
  // Props básicas
  name?: string;
  src?: string;
  srcSet?: string;
  imageLoading?: 'eager' | 'lazy';
  
  // Props de tamanho
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  // Props de variante
  variant?: 'solid' | 'subtle' | 'outline';
  
  // Props de forma
  shape?: 'square' | 'rounded' | 'full';
  
  // Props de cor
  colorPalette?: 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';
  
  // Props de anel/outline
  outlineWidth?: string;
  outlineColor?: string;
  outlineOffset?: string;
  outlineStyle?: 'solid' | 'dashed' | 'dotted';
  
  // Props de estado
  disabled?: boolean;
  isLoading?: boolean;
  
  // Props de composição
  as?: React.ElementType;
  asChild?: boolean;
  unstyled?: boolean;
  borderless?: boolean;
  
  // Props de callback
  onStatusChange?: (details: { loaded: boolean; error: boolean }) => void;
  onLoad?: () => void;
  onError?: () => void;
  
  // Props de estilo customizado
  customFallback?: ReactNode;
  customIcon?: ReactNode;
  
  // Props de acessibilidade
  alt?: string;
  title?: string;
  
  // Props de grupo
  max?: number;
  spacing?: number;
  
  // Props de overflow
  overflow?: 'hidden' | 'visible';
  
  // Props de animação
  transition?: string;
  animation?: string;
  
  // Props de responsividade
  responsive?: boolean;
  
  // Props de tema
  theme?: 'light' | 'dark' | 'auto';
}

// Tipos para as props do AvatarGroup
export interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: AvatarProps['size'];
  spacing?: number;
  gap?: number;
  spaceX?: string;
  stacking?: 'first-on-top' | 'last-on-top';
  overflow?: 'hidden' | 'visible';
  variant?: AvatarProps['variant'];
  shape?: AvatarProps['shape'];
  colorPalette?: AvatarProps['colorPalette'];
}

// Componente Avatar principal
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      name,
      src,
      srcSet,
      imageLoading = 'eager',
      size = 'md',
      variant = 'subtle',
      shape = 'full',
      colorPalette = 'gray',
      outlineWidth,
      outlineColor,
      outlineOffset,
      outlineStyle = 'solid',
      disabled = false,
      onStatusChange,
      onLoad,
      onError,
      customFallback,
      customIcon,
      alt,
      title,
      transition,
      animation,
      responsive = false,
      theme = 'auto',
      ...rest
    },
    ref
  ) => {
    // Estilo customizado para anel/outline
    const ringStyle = outlineWidth || outlineColor || outlineOffset ? defineStyle({
      outlineWidth: outlineWidth || '2px',
      outlineColor: outlineColor || `${colorPalette}.500`,
      outlineOffset: outlineOffset || '2px',
      outlineStyle,
    }) : undefined;

    // Handler para mudança de status
    const handleStatusChange = (details: any) => {
      if (onStatusChange) {
        onStatusChange(details);
      }
    };

    // Handler para carregamento
    const handleLoad = () => {
      if (onLoad) onLoad();
      handleStatusChange({ loaded: true, error: false });
    };

    // Handler para erro
    const handleError = () => {
      if (onError) onError();
      handleStatusChange({ loaded: false, error: true });
    };

    // Determinar o fallback baseado nas props
    const getFallback = () => {
      if (customFallback) return customFallback;
      if (customIcon) return customIcon;
      if (name) return <AvatarFallback name={name} />;
      return <AvatarFallback />;
    };

    return (
      <ChakraAvatar.Root
        ref={ref}
        size={size}
        variant={variant}
        shape={shape}
        colorPalette={colorPalette}
        onStatusChange={handleStatusChange}
        css={ringStyle}
        {...rest}
      >
        {/* Fallback personalizado ou padrão */}
        {getFallback()}
        
        {/* Imagem do avatar */}
        {src && (
          <AvatarImage
            src={src}
            srcSet={srcSet}
            loading={imageLoading}
            onLoad={handleLoad}
            onError={handleError}
            alt={alt || `Avatar de ${name || 'usuário'}`}
            title={title || name}
          />
        )}
      </ChakraAvatar.Root>
    );
  }
);

// Componente AvatarFallback
const AvatarFallback = forwardRef<HTMLDivElement, { name?: string; children?: ReactNode }>(
  ({ name, children, ...props }, ref) => {
    return (
      <ChakraAvatar.Fallback ref={ref} name={name} {...props}>
        {children}
      </ChakraAvatar.Fallback>
    );
  }
);
AvatarFallback.displayName = 'AvatarFallback';

// Componente AvatarImage
const AvatarImage = forwardRef<HTMLImageElement, { 
  src: string; 
  srcSet?: string; 
  loading?: 'eager' | 'lazy';
  onLoad?: () => void;
  onError?: () => void;
  alt?: string;
  title?: string;
}>(
  ({ src, srcSet, loading, onLoad, onError, alt, title, ...props }, ref) => {
    return (
      <ChakraAvatar.Image
        ref={ref}
        src={src}
        srcSet={srcSet}
        loading={loading}
        onLoad={onLoad}
        onError={onError}
        alt={alt}
        title={title}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = 'AvatarImage';

// Componente AvatarGroup
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      children,
      max,
      size = 'md',
      spacing = 0,
      gap = 0,
      spaceX = '0',
      stacking = 'last-on-top',
      overflow = 'hidden',
      variant = 'subtle',
      shape = 'full',
      colorPalette = 'gray',
      ...rest
    },
    ref
  ) => {
    return (
      <ChakraAvatarGroup
        ref={ref}
        size={size}
        gap={gap || spacing}
        spaceX={spaceX}
        stacking={stacking}
        {...rest}
      >
        {children}
      </ChakraAvatarGroup>
    );
  }
);

// Componente AvatarIcon para fallback personalizado
const AvatarIcon = forwardRef<HTMLDivElement, { children: ReactNode; colorPalette?: string }>(
  ({ children, colorPalette = 'gray', ...props }, ref) => {
    return (
      <Box
        ref={ref}
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        color={`${colorPalette}.600`}
        _dark={{ color: `${colorPalette}.400` }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);
AvatarIcon.displayName = 'AvatarIcon';

// Componente AvatarBadge para indicadores
const AvatarBadge = forwardRef<HTMLDivElement, {
  children: ReactNode;
  colorPalette?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}>(
  ({ children, colorPalette = 'red', size = 'sm', position = 'top-right', ...props }, ref) => {
    const positionStyles = {
      'top-right': { top: 0, right: 0 },
      'top-left': { top: 0, left: 0 },
      'bottom-right': { bottom: 0, right: 0 },
      'bottom-left': { bottom: 0, left: 0 },
    };

    const sizeStyles = {
      sm: { width: '8px', height: '8px' },
      md: { width: '12px', height: '12px' },
      lg: { width: '16px', height: '16px' },
    };

    return (
      <Box
        ref={ref}
        position="absolute"
        borderRadius="full"
        backgroundColor={`${colorPalette}.500`}
        border="2px solid white"
        _dark={{ borderColor: 'gray.800' }}
        {...positionStyles[position]}
        {...sizeStyles[size]}
        {...props}
      >
        {children}
      </Box>
    );
  }
);
AvatarBadge.displayName = 'AvatarBadge';

// Componente AvatarStatus para indicadores de status
const AvatarStatus = forwardRef<HTMLDivElement, {
  children?: ReactNode;
  status: 'online' | 'offline' | 'away' | 'busy';
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}>(
  ({ children, status, size = 'md', position = 'bottom-right', ...props }, ref) => {
    const statusColors = {
      online: 'green',
      offline: 'gray',
      away: 'yellow',
      busy: 'red',
    };

    return (
      <AvatarBadge
        ref={ref}
        colorPalette={statusColors[status]}
        size={size}
        position={position}
        {...props}
      >
        {children}
      </AvatarBadge>
    );
  }
);
AvatarStatus.displayName = 'AvatarStatus';

// Variantes pré-definidas para facilitar o uso
export const AvatarVariants = {
  // Avatar padrão
  Default: (props: Omit<AvatarProps, 'variant' | 'shape'>) => (
    <Avatar variant="subtle" shape="full" {...props} />
  ),
  
  // Avatar quadrado
  Square: (props: Omit<AvatarProps, 'shape'>) => (
    <Avatar shape="square" {...props} />
  ),
  
  // Avatar arredondado
  Rounded: (props: Omit<AvatarProps, 'shape'>) => (
    <Avatar shape="rounded" {...props} />
  ),
  
  // Avatar circular
  Circular: (props: Omit<AvatarProps, 'shape'>) => (
    <Avatar shape="full" {...props} />
  ),
  
  // Avatar com anel
  Ringed: (props: Omit<AvatarProps, 'outlineWidth' | 'outlineColor' | 'outlineOffset'>) => (
    <Avatar
      outlineWidth="2px"
      outlineColor={`${props.colorPalette || 'gray'}.500`}
      outlineOffset="2px"
      {...props}
    />
  ),
  
  // Avatar com borda
  Bordered: (props: Omit<AvatarProps, 'outlineWidth' | 'outlineColor'>) => (
    <Avatar
      outlineWidth="1px"
      outlineColor={`${props.colorPalette || 'gray'}.300`}
      {...props}
    />
  ),
  
  // Avatar de usuário
  User: (props: Omit<AvatarProps, 'variant' | 'shape' | 'colorPalette'>) => (
    <Avatar
      variant="subtle"
      shape="full"
      colorPalette="blue"
      {...props}
    />
  ),
  
  // Avatar de admin
  Admin: (props: Omit<AvatarProps, 'variant' | 'shape' | 'colorPalette'>) => (
    <Avatar
      variant="solid"
      shape="full"
      colorPalette="purple"
      {...props}
    />
  ),
  
  // Avatar de moderador
  Moderator: (props: Omit<AvatarProps, 'variant' | 'shape' | 'colorPalette'>) => (
    <Avatar
      variant="outline"
      shape="full"
      colorPalette="green"
      {...props}
    />
  ),
};

// Função utilitária para gerar cores baseadas no nome
export const generateAvatarColor = (name: string): AvatarProps['colorPalette'] => {
  const colors: AvatarProps['colorPalette'][] = [
    'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink'
  ];
  
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Função utilitária para gerar iniciais
export const generateInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Função utilitária para criar avatar com cor automática
export const createAutoColorAvatar = (name: string, props?: Omit<AvatarProps, 'name' | 'colorPalette'>) => {
  return (
    <Avatar
      name={name}
      colorPalette={generateAvatarColor(name)}
      {...props}
    />
  );
};

// Função utilitária para criar avatar com iniciais
export const createInitialsAvatar = (name: string, props?: Omit<AvatarProps, 'name'>) => {
  return (
    <Avatar
      name={name}
      customFallback={
        <Text fontSize="sm" fontWeight="bold">
          {generateInitials(name)}
        </Text>
      }
      {...props}
    />
  );
};

// Configurar display names
Avatar.displayName = 'Avatar';
AvatarGroup.displayName = 'AvatarGroup';

// Exportar tudo
export default Avatar;
