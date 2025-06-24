
import { X, Download } from 'lucide-react';
import { Student } from '../pages/Index';
import { urlViewer, getDownloadUrl, isGoogleDriveUrl } from '../utils/driveUtils';

interface CertificateModalProps {
  student: Student;
  onClose: () => void;
}

/**
 * Modal para visualização e download de certificados
 * Implementa as especificações do PRD para Google Drive
 */
export const CertificateModal = ({ student, onClose }: CertificateModalProps) => {
  // Usa url_pdf_completo se disponível, senão usa certificadoUrl
  const certificadoUrl = student.url_pdf_completo || student.certificadoUrl;
  
  const handleDownload = () => {
    // Gera URL de download conforme PRD
    const downloadUrl = getDownloadUrl(certificadoUrl);
    window.open(downloadUrl, '_blank');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Gera URL para visualização conforme PRD
  const viewerUrl = urlViewer(certificadoUrl);
  const isDriveUrl = isGoogleDriveUrl(certificadoUrl);

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-gray-600 shadow-2xl animate-scale-in">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-600 p-4 flex justify-between items-center z-10">
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
        
        <div className="flex flex-col h-full">
          {/* Visualizador de PDF conforme PRD */}
          <div className="flex-1 p-4">
            {viewerUrl ? (
              <div className="w-full h-full min-h-[60vh] bg-white rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={viewerUrl}
                  title={`Certificado de ${student.nome}`}
                  className="w-full h-full min-h-[60vh] border-0"
                  width="100%"
                  height="600px"
                  frameBorder="0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">PDF não disponível para visualização</p>
              </div>
            )}
          </div>
          
          {/* Botão de Download conforme PRD */}
          <div className="p-6 bg-gray-800 border-t border-gray-600">
            <div className="text-center mb-4">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-green-400/20"
                aria-label={`Baixar certificado de ${student.nome}`}
              >
                <Download className="h-6 w-6" />
                CLIQUE AQUI PARA BAIXAR
              </button>
            </div>
            
            <div className="text-center text-gray-400 text-sm">
              <p>Local: {student.local}</p>
              <p>Data de Conclusão: {student.dataConclusao}</p>
              {isDriveUrl && (
                <p className="text-xs mt-2 text-gray-500">
                  Certificado hospedado no Google Drive
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
