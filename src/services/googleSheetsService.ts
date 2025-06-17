
// Google Sheets configuration
const SHEET_ID = '1BpEAQy_qrEqbU60zs0LNMUD9Aa0A0XLBaMLNmA6p6tk';
const SHEET_NAME = 'Planilha1';

export interface Student {
  nome: string;
  local: string;
  dataConclusao: string;
  certificadoUrl: string;
  downloadUrl: string;
}

// Build the Google Sheets CSV URL (public access)
const buildSheetsCSVUrl = () => {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
};

// Parse CSV data
const parseCSV = (csvText: string): string[][] => {
  const lines = csvText.split('\n');
  return lines.map(line => {
    // Simple CSV parsing - handles basic cases
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
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

// Fetch all students from Google Sheets via CSV
export const fetchAllStudents = async (): Promise<Student[]> => {
  try {
    const url = buildSheetsCSVUrl();
    
    console.log('Fetching CSV data from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('Raw CSV response received, length:', csvText.length);
    
    const rows = parseCSV(csvText);
    console.log('Parsed CSV rows:', rows.length);
    
    // Skip header row (first row) and filter empty rows
    const dataRows = rows.slice(1).filter(row => row.length > 0 && row[0]);
    
    // Map rows to Student objects and filter out invalid entries
    const students = dataRows
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
