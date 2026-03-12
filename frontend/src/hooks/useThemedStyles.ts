import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Hook para criar estilos temáticos de forma otimizada
 * 
 * @param createStylesFn - Função que recebe colors e retorna StyleSheet
 * @returns Estilos calculados com as cores do tema atual
 */
export const useThemedStyles = <T,>(createStylesFn: (colors: any) => T): T => {
  const { colors } = useTheme();
  
  return useMemo(() => createStylesFn(colors), [colors, createStylesFn]);
};