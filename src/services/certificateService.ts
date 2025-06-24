
import { supabase } from '../integrations/supabase/client';
import { formatToBrazilianDate } from '../utils/dateUtils';
import { matchesMultiWordSearch } from '../utils/searchUtils';

export interface Student {
  nome: string;
  local: string;
  dataConclusao: string;
  certificadoUrl: string;
  downloadUrl: string;
  url_pdf_completo: string; // Nova propriedade para o link completo do PDF
}

/**
 * Converte uma linha do banco de dados para um objeto Student
 * Aplica formatação brasileira nas datas
 */
const mapRowToStudent = (row: any): Student => {
  return {
    nome: row.nome_aluno || '',
    local: row.local_treinamento || '',
    dataConclusao: formatToBrazilianDate(row.data_conclusao || ''),
    certificadoUrl: row.certificado_url || '',
    downloadUrl: row.certificado_download_url || '',
    url_pdf_completo: row.url_pdf_completo || row.certificado_url || '' // Nova propriedade
  };
};

/**
 * Busca todos os certificados do Supabase
 * @returns Promise com array de estudantes
 */
export const fetchAllStudents = async (): Promise<Student[]> => {
  try {
    console.log('Buscando certificados no Supabase...');
    
    const { data, error } = await supabase
      .from('certificado_digital')
      .select('*');
    
    if (error) {
      console.error('Erro no Supabase:', error);
      throw new Error(`Falha ao buscar certificados: ${error.message}`);
    }
    
    if (!data) {
      console.log('Nenhum dado retornado do Supabase');
      return [];
    }
    
    console.log(`${data.length} certificados carregados com sucesso`);
    
    // Mapeia linhas do banco para objetos Student e filtra entradas inválidas
    const students = data
      .map(mapRowToStudent)
      .filter(student => student.nome && student.nome.trim().length > 0);
    
    console.log(`${students.length} certificados válidos mapeados`);
    return students;
    
  } catch (error) {
    console.error('Erro ao buscar certificados:', error);
    throw new Error('Falha ao carregar dados dos certificados. Tente novamente mais tarde.');
  }
};

/**
 * Busca certificados por nome com correspondência sem acentos e busca inteligente
 * @param searchTerm - Termo de busca
 * @returns Promise com array de estudantes encontrados
 */
export const searchStudents = async (searchTerm: string): Promise<Student[]> => {
  if (!searchTerm.trim()) {
    return [];
  }
  
  try {
    console.log(`Buscando certificados para: "${searchTerm}"`);
    
    // Busca usando ilike para busca case-insensitive no PostgreSQL
    const { data, error } = await supabase
      .from('certificado_digital')
      .select('*')
      .ilike('nome_aluno', `%${searchTerm}%`);
    
    if (error) {
      console.error('Erro na busca do Supabase:', error);
      throw new Error(`Busca falhou: ${error.message}`);
    }
    
    if (!data) {
      console.log('Nenhum resultado de busca retornado');
      return [];
    }
    
    // Mapeia linhas do banco para objetos Student
    const results = data
      .map(mapRowToStudent)
      .filter(student => student.nome && student.nome.trim().length > 0);
    
    // Aplica busca inteligente sem acentos localmente para melhor correspondência
    const intelligentResults = results.filter(student => 
      matchesMultiWordSearch(searchTerm, student.nome)
    );
    
    console.log(`${intelligentResults.length} correspondências encontradas para "${searchTerm}"`);
    return intelligentResults;
    
  } catch (error) {
    console.error('Erro ao buscar certificados:', error);
    throw error;
  }
};
