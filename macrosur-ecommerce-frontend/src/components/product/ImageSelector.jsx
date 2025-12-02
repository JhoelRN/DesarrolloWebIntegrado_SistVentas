/**
 * ImageSelector Component
 * 
 * Componente optimizado para seleccionar imágenes de productos con 3 opciones:
 * 1. URL Manual: Ingresar URL externa
 * 2. Upload Local: Subir archivo desde computadora
 * 3. Biblioteca Online: Buscar imágenes en Unsplash por categoría
 */

import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

/**
 * Biblioteca de imágenes predefinidas
 * URLs optimizadas de Unsplash con parámetros de tamaño y calidad
 * - w=200: ancho optimizado para thumbnails
 * - q=80: calidad 80% (balance entre calidad y tamaño)
 * - fit=crop: recorte centrado
 */
const IMAGE_LIBRARY = [
  // Decoración y hogar - imágenes específicas de Unsplash
  { id: 1, url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=200&q=80&fit=crop', name: 'Alfombra decorativa' },
  { id: 2, url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80&fit=crop', name: 'Cojines elegantes' },
  { id: 3, url: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=200&q=80&fit=crop', name: 'Vajilla moderna' },
  { id: 4, url: 'https://images.unsplash.com/photo-1590873875583-4ea90bbbb1d9?w=200&q=80&fit=crop', name: 'Cortinas blackout' },
  { id: 5, url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=200&q=80&fit=crop', name: 'Cuadro abstracto' },
  { id: 6, url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=200&q=80&fit=crop', name: 'Espejo decorativo' },
  { id: 7, url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=200&q=80&fit=crop', name: 'Cocina y bar' },
  { id: 8, url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&q=80&fit=crop', name: 'Almohadas' },
  { id: 9, url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=200&q=80&fit=crop', name: 'Tapete moderno' },
  { id: 10, url: 'https://images.unsplash.com/photo-1604599455556-3b5a035b5ea7?w=200&q=80&fit=crop', name: 'Visillo elegante' },
  { id: 11, url: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=200&q=80&fit=crop', name: 'Cuadros paisaje' },
  { id: 12, url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&q=80&fit=crop', name: 'Espejo de pie' },
  { id: 13, url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&q=80&fit=crop', name: 'Copas cristal' },
  { id: 14, url: 'https://images.unsplash.com/photo-1565789877953-ee94a71c2b1c?w=200&q=80&fit=crop', name: 'Cubiertos' },
  { id: 15, url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&q=80&fit=crop', name: 'Almohada premium' },
  { id: 16, url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=200&q=80&fit=crop', name: 'Set cojines' },
];

/**
 * Componente de imagen con lazy loading
 */
const LazyImage = ({ src, alt, style, className, onClick, isSelected }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div style={{ position: 'relative', ...style }}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Spinner animation="border" size="sm" variant="primary" />
        </div>
      )}
      <img
        ref={imgRef}
        data-src={src}
        alt={alt}
        className={className}
        style={{
          ...style,
          opacity: isLoading ? 0.3 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
      />
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            color: '#6c757d',
          }}
        >
          Error
        </div>
      )}
    </div>
  );
};

const ImageSelector = ({ currentImageUrl, onSelectImage, showModal, onCloseModal, codigoProducto }) => {
  const [selectedUrl, setSelectedUrl] = useState(currentImageUrl || '');
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState('url'); // 'url', 'upload', 'search'
  const [previewLoading, setPreviewLoading] = useState(false);
  
  // Upload de archivos
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  
  // Búsqueda online
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Sincronizar selectedUrl cuando cambie currentImageUrl desde fuera
  useEffect(() => {
    setSelectedUrl(currentImageUrl || '');
    if (currentImageUrl) {
      setCustomUrl(currentImageUrl);
    }
  }, [currentImageUrl, showModal]); // Re-sincronizar al abrir modal

  const handleSelectFromLibrary = (url) => {
    setSelectedUrl(url);
  };

  const handleCustomUrlChange = (e) => {
    const url = e.target.value;
    setCustomUrl(url);
    setSelectedUrl(url);
  };

  // Manejo de upload de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Tipo de archivo no válido. Solo se aceptan: JPG, PNG, WEBP, GIF');
        return;
      }
      
      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('El archivo excede el tamaño máximo de 5MB');
        return;
      }
      
      setSelectedFile(file);
      setUploadError('');
      
      // Preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setUploadError('');
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('codigoProducto', codigoProducto || 'PROD');
      
      const token = localStorage.getItem('token');
      console.log('📤 Subiendo imagen para:', codigoProducto);
      
      const response = await axios.post(`${API_URL}/productos/upload-imagen`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Respuesta del servidor:', response.data);
      
      // Usar la ruta devuelta por el backend
      const filePath = response.data.filePath;
      console.log('📁 Ruta de la imagen guardada:', filePath);
      
      setSelectedUrl(filePath);
      setCustomUrl(filePath); // También actualizar customUrl
      setSelectedFile(null);
      
      // Limpiar el input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Actualizar inmediatamente el producto con la nueva ruta
      onSelectImage(filePath);
      
      alert('✅ Imagen subida exitosamente y aplicada\nRuta: ' + filePath);
      
    } catch (error) {
      console.error('❌ Error al subir imagen:', error);
      console.error('Detalles:', error.response?.data);
      setUploadError(error.response?.data?.error || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  // Búsqueda de imágenes online
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Ingresa un término de búsqueda');
      return;
    }
    
    setSearching(true);
    setSearchError('');
    setSearchResults([]);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/productos/buscar-imagenes`, {
        params: { query: searchQuery, perPage: 12 },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setSearchResults(response.data);
      
      if (response.data.length === 0) {
        setSearchError('No se encontraron imágenes para "' + searchQuery + '"');
      }
      
    } catch (error) {
      console.error('Error al buscar imágenes:', error);
      setSearchError('Error al buscar imágenes. Intenta de nuevo.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectFromSearch = (imageUrl) => {
    setSelectedUrl(imageUrl);
  };

  const handleConfirm = () => {
    console.log('✅ Imagen seleccionada:', selectedUrl);
    onSelectImage(selectedUrl);
    
    // Limpiar estado de upload si había uno pendiente
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    onCloseModal();
  };

  const handleRemoveImage = () => {
    console.log('🗑️ Imagen removida');
    setSelectedUrl('');
    setCustomUrl('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onSelectImage('');
    onCloseModal();
  };

  return (
    <Modal show={showModal} onHide={onCloseModal} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Imagen del Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Tabs para las 3 opciones */}
        <div className="mb-3 d-flex gap-2">
          <Button
            variant={activeTab === 'url' ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => setActiveTab('url')}
          >
            📎 URL Manual
          </Button>
          <Button
            variant={activeTab === 'upload' ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => setActiveTab('upload')}
          >
            📁 Subir Archivo
          </Button>
          <Button
            variant={activeTab === 'search' ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => setActiveTab('search')}
          >
            🔍 Biblioteca Online
          </Button>
        </div>

        {/* Tab 1: URL Manual */}
        {activeTab === 'url' && (
          <div>
            <p className="text-muted mb-3">
              Ingresa la URL de una imagen externa:
            </p>
            <Form.Group className="mb-3">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={customUrl}
                onChange={handleCustomUrlChange}
              />
              <Form.Text className="text-muted">
                Asegúrate de que la URL sea accesible públicamente.
              </Form.Text>
            </Form.Group>
          </div>
        )}

        {/* Tab 2: Upload de Archivo */}
        {activeTab === 'upload' && (
          <div>
            <p className="text-muted mb-3">
              Sube una imagen desde tu computadora (máximo 5MB):
            </p>
            
            {uploadError && (
              <Alert variant="danger" dismissible onClose={() => setUploadError('')}>
                {uploadError}
              </Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar Archivo</Form.Label>
              <Form.Control
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              <Form.Text className="text-muted">
                Formatos permitidos: JPG, PNG, WEBP, GIF
              </Form.Text>
            </Form.Group>
            
            {selectedFile && (
              <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                <div>
                  <Badge bg="info">{selectedFile.type.split('/')[1].toUpperCase()}</Badge>
                  <span className="ms-2">{selectedFile.name}</span>
                  <small className="ms-2 text-muted">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </small>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-1" />
                      Subiendo...
                    </>
                  ) : (
                    'Subir Imagen'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Búsqueda Online */}
        {activeTab === 'search' && (
          <div>
            <p className="text-muted mb-3">
              Busca imágenes profesionales por categoría o palabra clave:
            </p>
            
            {searchError && (
              <Alert variant="warning" dismissible onClose={() => setSearchError('')}>
                {searchError}
              </Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Término de Búsqueda</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Ej: alfombras persas, cojines decorativos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={searching}
                />
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  disabled={searching || !searchQuery.trim()}
                >
                  {searching ? (
                    <Spinner as="span" animation="border" size="sm" />
                  ) : (
                    'Buscar'
                  )}
                </Button>
              </div>
              <Form.Text className="text-muted">
                Busca por categoría o descripción del producto
              </Form.Text>
            </Form.Group>
            
            {/* Resultados de búsqueda */}
            {searchResults.length > 0 && (
              <Row className="g-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {searchResults.map((image, index) => (
                  <Col xs={6} md={4} key={index}>
                    <Card
                      className={`cursor-pointer ${selectedUrl === image.url ? 'border-primary border-3' : ''}`}
                      onClick={() => handleSelectFromSearch(image.url)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card.Img
                        variant="top"
                        src={image.thumbnail}
                        style={{ height: '120px', objectFit: 'cover' }}
                      />
                      <Card.Body className="p-2">
                        <small className="text-truncate d-block" title={image.description}>
                          {image.description || 'Sin descripción'}
                        </small>
                        <small className="text-muted">por {image.author}</small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        )}

        {/* Vista Previa */}
        {selectedUrl && (
          <div className="mt-4">
            <h6>Vista Previa:</h6>
            <div className="text-center p-3 border rounded bg-light" style={{ position: 'relative' }}>
              {previewLoading && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <Spinner animation="border" variant="primary" />
                </div>
              )}
              <img
                src={selectedUrl}
                alt="Vista previa"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  opacity: previewLoading ? 0.3 : 1,
                  transition: 'opacity 0.3s',
                }}
                onLoadStart={() => setPreviewLoading(true)}
                onLoad={() => setPreviewLoading(false)}
                onError={(e) => {
                  setPreviewLoading(false);
                  e.target.src = 'https://placehold.co/400x300/FF6B6B/FFFFFF?text=Error';
                }}
              />
              <div className="mt-2">
                <small className="text-muted d-block" style={{ wordBreak: 'break-all' }}>
                  {selectedUrl}
                </small>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCloseModal}>
          Cancelar
        </Button>
        {selectedUrl && (
          <Button variant="danger" onClick={handleRemoveImage}>
            Quitar Imagen
          </Button>
        )}
        <Button 
          variant="primary" 
          onClick={handleConfirm}
          disabled={!selectedUrl}
        >
          Confirmar Selección
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageSelector;
