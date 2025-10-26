import React, { useState, useEffect } from 'react';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageModules = await Promise.all([
          import('../../assets/images/capa.jpeg'),
          import('../../assets/images/diagnosticos.jpeg'),
          import('../../assets/images/tratamentos.jpeg'),
          import('../../assets/images/evolucao.jpeg'),
          import('../../assets/images/mapa.jpeg')
        ]);
        setImages(imageModules.map(module => module.default));
      } catch (error) {
        console.error('Erro ao carregar imagens:', error);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Carregando imagens...
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
        Nenhuma imagem disponível
      </div>
    );
  }

  const handleImageClick = (index) => {
    if (index >= 0 && index < images.length) {
      setSelectedImage(index);
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleImageClick(index);
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleModalKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  const handleModalContentClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 20px'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '2rem'
      }}>
        Galeria de Imagens
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        justifyContent: 'center'
      }}>
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
              ':hover': {
                transform: 'scale(1.03)'
              }
            }}
            onClick={() => handleImageClick(index)}
            onKeyDown={(e) => handleKeyPress(e, index)}
            role="button"
            tabIndex={0}
            aria-label={`Expandir imagem ${index + 1}`}
          >
            <img
              src={image}
              alt={`Imagem ${index + 1}`}
              onError={(e) => {
                console.error(`Erro ao carregar imagem ${index + 1}`);
                setImageErrors(prev => ({ ...prev, [index]: true }));
                e.target.style.display = 'none';
              }}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                display: imageErrors[index] ? 'none' : 'block'
              }}
            />
            {imageErrors[index] && (
              <div style={{
                width: '100%',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
                color: '#999'
              }}>
                Imagem não disponível
              </div>
            )}
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              textAlign: 'center'
            }}>
              <span style={{
                color: '#3498db',
                fontWeight: '600'
              }}>
                {['Capa', 'Diagnósticos', 'Tratamentos', 'Evolução', 'Mapa'][index]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para imagem expandida */}
      {selectedImage !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
          onClick={closeModal}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Imagem expandida"
          tabIndex={-1}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%',
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '20px'
            }}
            onClick={handleModalContentClick}
          >
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                color: '#333',
                cursor: 'pointer',
                zIndex: 1001
              }}
              aria-label="Fechar imagem"
            >
              ×
            </button>
            {selectedImage >= 0 && selectedImage < images.length && (
              <>
                <img
                  src={images[selectedImage]}
                  alt={`Imagem expandida ${selectedImage + 1}`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    console.error('Erro ao carregar imagem');
                  }}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
                <div style={{
                  textAlign: 'center',
                  marginTop: '10px',
                  color: '#333'
                }}>
                  {['Capa', 'Diagnósticos', 'Tratamentos', 'Evolução', 'Mapa'][selectedImage]}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;