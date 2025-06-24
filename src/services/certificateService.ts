
import { supabase } from '../integrations/supabase/client';

export interface Student {
  nome: string;
  local: string;
  dataConclusao: string;
  certificadoUrl: string;
  downloadUrl: string;
}

// Convert database row to Student object
const mapRowToStudent = (row: any): Student => {
  return {
    nome: row.nome_aluno || '',
    local: row.local_treinamento || '',
    dataConclusao: row.data_conclusao || '',
    certificadoUrl: row.certificado_url || '',
    downloadUrl: row.certificado_download_url || ''
  };
};

// Fetch all certificates from Supabase
export const fetchAllStudents = async (): Promise<Student[]> => {
  try {
    console.log('Fetching certificates from Supabase...');
    
    const { data, error } = await supabase
      .from('certificado_digital')
      .select('*');
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch certificates: ${error.message}`);
    }
    
    if (!data) {
      console.log('No data returned from Supabase');
      return [];
    }
    
    console.log(`Successfully loaded ${data.length} certificates`);
    
    // Map database rows to Student objects and filter out invalid entries
    const students = data
      .map(mapRowToStudent)
      .filter(student => student.nome && student.nome.trim().length > 0);
    
    console.log(`Mapped ${students.length} valid certificates`);
    return students;
    
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw new Error('Failed to load certificate data. Please try again later.');
  }
};

// Search certificates by name with fuzzy matching
export const searchStudents = async (searchTerm: string): Promise<Student[]> => {
  if (!searchTerm.trim()) {
    return [];
  }
  
  try {
    console.log(`Searching certificates for: "${searchTerm}"`);
    
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    // Use ilike for case-insensitive search in PostgreSQL
    const { data, error } = await supabase
      .from('certificado_digital')
      .select('*')
      .ilike('nome_aluno', `%${normalizedSearch}%`);
    
    if (error) {
      console.error('Supabase search error:', error);
      throw new Error(`Search failed: ${error.message}`);
    }
    
    if (!data) {
      console.log('No search results returned');
      return [];
    }
    
    // Map database rows to Student objects
    const results = data
      .map(mapRowToStudent)
      .filter(student => student.nome && student.nome.trim().length > 0);
    
    // Additional fuzzy search logic for better matching
    const searchParts = normalizedSearch.split(' ').filter(part => part.length > 0);
    const fuzzyResults = results.filter(student => {
      const normalizedName = student.nome.toLowerCase();
      
      // Exact match gets highest priority
      if (normalizedName.includes(normalizedSearch)) {
        return true;
      }
      
      // Split search term and check if all parts are found
      return searchParts.every(part => normalizedName.includes(part));
    });
    
    console.log(`Found ${fuzzyResults.length} matches for "${searchTerm}"`);
    return fuzzyResults;
    
  } catch (error) {
    console.error('Error searching certificates:', error);
    throw error;
  }
};
