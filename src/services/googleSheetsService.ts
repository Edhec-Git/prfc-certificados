
// Google Sheets configuration
const SHEET_ID = '1BpEAQy_qrEqbU60zs0LNMUD9Aa0A0XLBaMLNmA6p6tk';
const SHEET_NAME = 'Planilha1';
const API_KEY = ''; // Will be empty for now, using public sheet access

// Column mapping based on your sheet structure
const COLUMN_MAPPING = {
  nome: 'A',
  local: 'B', 
  dataConclusao: 'C',
  certificadoUrl: 'D',
  downloadUrl: 'E'
};

export interface Student {
  nome: string;
  local: string;
  dataConclusao: string;
  certificadoUrl: string;
  downloadUrl: string;
}

// Build the Google Sheets API URL
const buildSheetsUrl = (range: string) => {
  const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!${range}`;
  return API_KEY ? `${baseUrl}?key=${API_KEY}` : `${baseUrl}?alt=json`;
};

// Convert row data to Student object
const mapRowToStudent = (row: string[]): Student | null => {
  // Skip if essential data is missing
  if (!row[0] || !row[1] || !row[2]) {
    return null;
  }

  return {
    nome: row[0]?.trim() || '',
    local: row[1]?.trim() || '',
    dataConclusao: row[2]?.trim() || '',
    certificadoUrl: row[3]?.trim() || '',
    downloadUrl: row[4]?.trim() || ''
  };
};

// Fetch all students from Google Sheets
export const fetchAllStudents = async (): Promise<Student[]> => {
  try {
    // Fetch a reasonable range - adjust as needed
    const url = buildSheetsUrl('A2:E1000'); // Skip header row, get up to 1000 records
    
    console.log('Fetching data from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('Raw Google Sheets response:', data);
    
    // Handle both API key and public access response formats
    const values = data.values || data.feed?.entry || [];
    
    if (!values || values.length === 0) {
      console.log('No data found in sheet');
      return [];
    }
    
    // Map rows to Student objects and filter out invalid entries
    const students = values
      .map((row: string[]) => mapRowToStudent(row))
      .filter((student: Student | null): student is Student => student !== null);
    
    console.log(`Successfully loaded ${students.length} students`);
    return students;
    
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw new Error('Failed to load certificate data. Please try again later.');
  }
};

// Search students by name with fuzzy matching
export const searchStudents = async (searchTerm: string): Promise<Student[]> => {
  if (!searchTerm.trim()) {
    return [];
  }
  
  try {
    const allStudents = await fetchAllStudents();
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    // Implement fuzzy search
    const results = allStudents.filter(student => {
      const normalizedName = student.nome.toLowerCase();
      
      // Exact match gets highest priority
      if (normalizedName.includes(normalizedSearch)) {
        return true;
      }
      
      // Split search term and check if all parts are found
      const searchParts = normalizedSearch.split(' ').filter(part => part.length > 0);
      return searchParts.every(part => normalizedName.includes(part));
    });
    
    console.log(`Found ${results.length} matches for "${searchTerm}"`);
    return results;
    
  } catch (error) {
    console.error('Error searching students:', error);
    throw error;
  }
};
