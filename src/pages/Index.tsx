
import { useState } from 'react';
import { Header } from '../components/Header';
import { SearchInput } from '../components/SearchInput';
import { SearchResults } from '../components/SearchResults';
import { CertificateModal } from '../components/CertificateModal';
import { useStudentSearch } from '../hooks/useStudentSearch';

// Variáveis de configuração - facilmente editáveis
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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const {
    searchTerm,
    searchResults,
    loading,
    error,
    updateSearchTerm
  } = useStudentSearch();

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
            onChange={updateSearchTerm}
            placeholder="Digite seu nome para buscar o certificado"
          />
        </div>

        {(searchTerm.trim() || searchResults.length > 0) && (
          <div className="mt-8">
            <SearchResults 
              results={searchResults}
              loading={loading}
              error={error}
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
