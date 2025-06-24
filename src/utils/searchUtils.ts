
/**
 * Utilitários para busca e manipulação de strings
 */

/**
 * Remove acentos e caracteres especiais de uma string
 * @param str - String original
 * @returns String sem acentos
 */
export const removeAccents = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

/**
 * Normaliza uma string para busca (remove acentos, espaços extras e converte para minúsculo)
 * @param str - String original
 * @returns String normalizada para busca
 */
export const normalizeForSearch = (str: string): string => {
  return removeAccents(str.trim());
};

/**
 * Verifica se um termo de busca corresponde a um texto, ignorando acentos
 * @param searchTerm - Termo de busca
 * @param targetText - Texto alvo
 * @returns true se houver correspondência
 */
export const matchesSearch = (searchTerm: string, targetText: string): boolean => {
  const normalizedSearch = normalizeForSearch(searchTerm);
  const normalizedTarget = normalizeForSearch(targetText);
  
  return normalizedTarget.includes(normalizedSearch);
};

/**
 * Busca por múltiplas palavras em um texto
 * @param searchTerm - Termo de busca (pode conter múltiplas palavras)
 * @param targetText - Texto alvo
 * @returns true se todas as palavras forem encontradas
 */
export const matchesMultiWordSearch = (searchTerm: string, targetText: string): boolean => {
  const searchWords = normalizeForSearch(searchTerm).split(' ').filter(word => word.length > 0);
  const normalizedTarget = normalizeForSearch(targetText);
  
  return searchWords.every(word => normalizedTarget.includes(word));
};
