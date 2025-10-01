# Toast Adapter para Chakra UI

## Descrição

Este adapter permite usar o sistema de toast do Chakra UI de forma simplificada em toda a aplicação Bookly.

## Localização

- Hook: `src/hooks/useToast.ts`
- Componente Toaster: `src/components/ui/toaster.tsx`
- Configuração no layout: `app/_layout.tsx`

## Como usar

### 1. Importar o hook

```tsx
import { useToast } from '@/src/hooks/useToast';
```

### 2. Usar no componente

```tsx
export default function MeuComponente() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Sucesso!', 'Operação realizada com sucesso');
  };

  const handleError = () => {
    toast.error('Erro!', 'Algo deu errado');
  };

  const handleWarning = () => {
    toast.warning('Atenção!', 'Verifique os dados');
  };

  const handleInfo = () => {
    toast.info('Informação', 'Dados atualizados');
  };

  const handleLoading = () => {
    toast.loading('Carregando...', 'Processando sua solicitação');
  };

  // ... resto do componente
}
```

## Métodos disponíveis

### `success(title, description?)`
Exibe um toast de sucesso com ícone verde.

### `error(title, description?)`
Exibe um toast de erro com ícone vermelho.

### `warning(title, description?)`
Exibe um toast de aviso com ícone amarelo.

### `info(title, description?)`
Exibe um toast informativo com ícone azul.

### `loading(title, description?)`
Exibe um toast de carregamento com spinner.

### `showToast(options)`
Método genérico para criar toasts customizados.

```tsx
toast.showToast({
  title: 'Título personalizado',
  description: 'Descrição opcional',
  type: 'success' | 'error' | 'warning' | 'info' | 'loading',
  duration: 5000 // em milissegundos
});
```

## Exemplo de uso no Register

O componente `register.tsx` foi atualizado para usar este adapter, substituindo o sistema de erro anterior por toasts. Agora:

- Erros de validação são exibidos como toasts de erro
- Sucesso no cadastro é exibido como toast de sucesso
- Erros do Supabase são tratados e exibidos como toasts específicos

## Configuração

O toaster é configurado para:
- Aparecer no canto inferior direito (`bottom-end`)
- Pausar quando a página está inativa
- Duração padrão de 5 segundos
- Toasts podem ser fechados manualmente
- Suporte a diferentes tipos visuais