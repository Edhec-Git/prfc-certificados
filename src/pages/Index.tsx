
import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { SearchInput } from '../components/SearchInput';
import { SearchResults } from '../components/SearchResults';
import { CertificateModal } from '../components/CertificateModal';

// Variáveis de configuração - facilmente editáveis
const ID_DA_PLANILHA_DE_PESQUISA = 'SEU_ID_DA_PLANILHA_AQUI';
const NOME_DO_TREINAMENTO_APP = 'ACADEMIA DE LIDERES - MODULO III';
const URL_IMAGEM_LOGO = '/lovable-uploads/505f06ed-1d4e-451d-80b7-b61dc05899dc.png';

export interface Student {
  nome: string;
  local: string;
  dataConclusao: string;
  certificadoUrl: string;
  downloadUrl: string;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Simular dados para demonstração - em produção, isso virá do Google Sheets
  const mockStudents: Student[] = [
    {
      nome: 'João Silva Santos',
      local: 'São Paulo - SP',
      dataConclusao: '15/12/2024',
      certificadoUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      downloadUrl: 'https://example.com/download/joao-silva.pdf'
    },
    {
      nome: 'Maria Oliveira Costa',
      local: 'Rio de Janeiro - RJ',
      dataConclusao: '14/12/2024',
      certificadoUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      downloadUrl: 'https://example.com/download/maria-oliveira.pdf'
    },
    {
      nome: 'Carlos Eduardo Lima',
      local: 'Brasília - DF',
      dataConclusao: '13/12/2024',
      certificadoUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      downloadUrl: 'https://example.com/download/carlos-eduardo.pdf'
    },
    {
      nome: 'Ana Paula Rodrigues',
      local: 'Belo Horizonte - MG',
      dataConclusao: '12/12/2024',
      certificadoUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
      downloadUrl: 'https://example.com/download/ana-paula.pdf'
    }
  ];

  // Função para buscar estudantes (simulação - em produção conectará com Google Sheets)
  const searchStudents = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    
    // Simular delay de API
    setTimeout(() => {
      const filteredResults = mockStudents.filter(student =>
        student.nome.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filteredResults);
      setLoading(false);
    }, 300);
  };

  // Busca dinâmica conforme o usuário digita
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchStudents(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header 
          logoUrl={URL_IMAGEM_LOGO}
          title={NOME_DO_TREINAMENTO_APP}
          subtitle="BAIXE SEU CERTIFICADO"
        />
        
        <div className="mt-12">
          <SearchInput 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Digite seu nome para buscar o certificado"
          />
        </div>

        {(searchTerm.trim() || searchResults.length > 0) && (
          <div className="mt-8">
            <SearchResults 
              results={searchResults}
              loading={loading}
              onStudentClick={handleStudentClick}
              searchTerm={searchTerm}
            />
          </div>
        )}

        {showModal && selectedStudent && (
          <CertificateModal 
            student={selectedStudent}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
