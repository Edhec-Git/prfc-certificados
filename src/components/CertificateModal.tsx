
import { X, Download } from 'lucide-react';
import { Student } from '../pages/Index';
import { urlViewer, getDownloadUrl, isGoogleDriveUrl } from '../utils/driveUtils';

interface CertificateModalProps {
  student: Student;
  onClose: () => void;
}

/**
 * Modal responsivo e minimalista para visualização de certificados
 * Adapta-se automaticamente ao tamanho do certificado sem espaços desnecessários
 */
export const CertificateModal = ({ student, onClose }: CertificateModalProps) => {
  // Usa url_pdf_completo se disponível, senão usa certificadoUrl
  const certificadoUrl = student.url_pdf_completo || student.certificadoUrl;
  
  const handleDownload = () => {
    const downloadUrl = getDownloadUrl(certificadoUrl);
    window.open(downloadUrl, '_blank');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Gera URL para visualização conforme PRD - sem toolbar para interface limpa
  const viewerUrl = urlViewer(certificadoUrl);
  const isDriveUrl = isGoogleDriveUrl(certificadoUrl);

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in popup-overlay"
      onClick={handleBackdropClick}
    >
      <div className="popup-certificado relative animate-scale-in">
        {/* Header minimalista - fixo no topo */}
        <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-3 flex justify-between items-center z-20 rounded-t-lg">
          <h3 className="text-white font-medium text-sm md:text-base truncate pr-2">
            {student.nome}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white flex-shrink-0"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Visualizador de certificado - sem botões extras */}
        <div className="certificate-viewer">
          {viewerUrl ? (
            <iframe
              src={viewerUrl}
              title={`Certificado de ${student.nome}`}
              className="certificate-iframe"
              frameBorder="0"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-center p-4">
                Certificado não disponível para visualização
              </p>
            </div>
          )}
        </div>
        
        {/* Botão de Download minimalista - fixo na parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 rounded-b-lg">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              aria-label={`Baixar certificado de ${student.nome}`}
            >
              <Download className="h-4 w-4" />
              BAIXAR CERTIFICADO
            </button>
            
            <div className="text-center text-white/70 text-xs">
              <p>{student.local} • {student.dataConclusao}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
