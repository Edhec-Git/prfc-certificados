
import { X, Download } from 'lucide-react';
import { Student } from '../pages/Index';
import { PDFViewer } from './PDFViewer';

interface CertificateModalProps {
  student: Student;
  onClose: () => void;
}

/**
 * Modal para visualização e download de certificados
 * Usa o PDFViewer para exibir certificados de forma responsiva
 */
export const CertificateModal = ({ student, onClose }: CertificateModalProps) => {
  const handleDownload = () => {
    window.open(student.downloadUrl, '_blank');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-gray-600 shadow-2xl animate-scale-in">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-600 p-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">
            Certificado - {student.nome}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            aria-label="Fechar modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <PDFViewer 
              pdfUrl={student.certificadoUrl}
              alt={`Certificado de ${student.nome}`}
              className="shadow-lg"
            />
          </div>
          
          <div className="text-center">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-green-400/20"
              aria-label={`Baixar certificado de ${student.nome}`}
            >
              <Download className="h-6 w-6" />
              CLIQUE AQUI PARA BAIXAR
            </button>
          </div>
          
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>Local: {student.local}</p>
            <p>Data de Conclusão: {student.dataConclusao}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
