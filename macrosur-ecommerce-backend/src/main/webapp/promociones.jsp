<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<!--
  =====================================================
  JSP (JavaServer Pages) - VISTA TRADICIONAL
  =====================================================
  
  Demuestra tecnología JSP tradicional con:
  - Scriptlets <%= %>
  - JSTL tags (<c:forEach>, <c:if>, etc.)
  - EL (Expression Language) ${variable}
  - jQuery Ajax
  - Bootstrap UI
  
  NOTA: JSF usa Facelets (.xhtml) como alternativa moderna a JSP
        Este archivo demuestra compatibilidad legacy
        
  URL: http://localhost:8081/promociones.jsp
-->
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <title>Gestión de Promociones - JSP</title>
    
    <!-- Bootstrap CSS (WebJars) -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/webjars/bootstrap/5.3.0/css/bootstrap.min.css">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/webjars/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        body {
            background-color: #f8f9fa;
            padding-top: 20px;
        }
        .card {
            box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
            margin-bottom: 20px;
        }
        .table-actions {
            white-space: nowrap;
        }
        .badge-custom {
            font-size: 0.85em;
            padding: 0.4em 0.6em;
        }
    </style>
</head>
<body>

    <!-- ========== NAVBAR ========== -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <i class="fas fa-percent me-2"></i>
                Macrosur E-Commerce
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="${pageContext.request.contextPath}/admin/dashboard.xhtml">
                            <i class="fas fa-home me-1"></i>
                            Dashboard
                        </a>
                    </li>
                    <li class="nav-item active">
                        <a class="nav-link" href="${pageContext.request.contextPath}/promociones.jsp">
                            <i class="fas fa-tags me-1"></i>
                            Promociones (JSP)
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="${pageContext.request.contextPath}/admin/promociones.xhtml">
                            <i class="fas fa-file-code me-1"></i>
                            Promociones (JSF)
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container-fluid">
        
        <!-- ========== HEADER ========== -->
        <div class="row mb-4">
            <div class="col">
                <h2>
                    <i class="fas fa-percent text-primary"></i>
                    Gestión de Promociones
                </h2>
                <p class="text-muted">
                    Vista JSP tradicional con jQuery Ajax y Bootstrap
                </p>
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Tecnología:</strong> JavaServer Pages (JSP) + JSTL + Scriptlets + jQuery Ajax + WebServlet
                </div>
            </div>
            <div class="col-auto">
                <button class="btn btn-primary" onclick="mostrarModalNuevo()">
                    <i class="fas fa-plus-circle me-2"></i>
                    Nueva Promoción
                </button>
            </div>
        </div>

        <!-- ========== ESTADÍSTICAS ========== -->
        <div class="row mb-4" id="estadisticas">
            <!-- Se carga via Ajax -->
        </div>

        <!-- ========== ALERTAS ========== -->
        <div id="mensajes"></div>

        <!-- ========== FILTROS ========== -->
        <div class="card mb-4">
            <div class="card-header">
                <i class="fas fa-filter me-2"></i>
                Filtros de Búsqueda
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">Buscar por nombre:</label>
                        <input type="text" class="form-control" id="filtroNombre" placeholder="Escriba para buscar...">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Tipo:</label>
                        <select class="form-select" id="filtroTipo">
                            <option value="">Todos los tipos</option>
                            <option value="Porcentaje">Descuento Porcentual</option>
                            <option value="Monto Fijo">Monto Fijo</option>
                            <option value="2x1">2x1</option>
                            <option value="Envio Gratis">Envío Gratis</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">&nbsp;</label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="soloActivas">
                            <label class="form-check-label" for="soloActivas">
                                Solo promociones activas
                            </label>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">&nbsp;</label>
                        <button class="btn btn-primary w-100" onclick="cargarPromociones()">
                            <i class="fas fa-search me-2"></i>
                            Buscar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ========== TABLA DE PROMOCIONES ========== -->
        <div class="card">
            <div class="card-header">
                <i class="fas fa-list me-2"></i>
                Lista de Promociones
            </div>
            <div class="card-body">
                <div id="loadingSpinner" class="text-center py-5" style="display:none;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-2">Cargando promociones...</p>
                </div>

                <table class="table table-hover" id="tablaPromociones">
                    <thead class="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Valor</th>
                            <th>Estado</th>
                            <th>Vigencia</th>
                            <th class="table-actions">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Se llena via Ajax -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- ========== MODAL CREAR/EDITAR ========== -->
    <div class="modal fade" id="modalPromocion" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitulo">Nueva Promoción</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formPromocion">
                        <input type="hidden" id="promocionId">
                        
                        <div class="mb-3">
                            <label for="nombreRegla" class="form-label">Nombre de la Promoción *</label>
                            <input type="text" class="form-control" id="nombreRegla" required>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="tipoDescuento" class="form-label">Tipo de Descuento *</label>
                                    <select class="form-select" id="tipoDescuento" required>
                                        <option value="Porcentaje">Descuento Porcentual (%)</option>
                                        <option value="Monto Fijo">Monto Fijo ($)</option>
                                        <option value="2x1">Promoción 2x1</option>
                                        <option value="Envio Gratis">Envío Gratis</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="valorDescuento" class="form-label">Valor *</label>
                                    <input type="number" step="0.01" class="form-control" id="valorDescuento" required>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="fechaInicio" class="form-label">Fecha de Inicio</label>
                                    <input type="datetime-local" class="form-control" id="fechaInicio">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="fechaFin" class="form-label">Fecha de Fin</label>
                                    <input type="datetime-local" class="form-control" id="fechaFin">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="acumulable" checked>
                                    <label class="form-check-label" for="acumulable">
                                        Acumulable con otras promociones
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="exclusivo">
                                    <label class="form-check-label" for="exclusivo">
                                        Promoción exclusiva
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="guardarPromocion()">
                        <i class="fas fa-save me-2"></i>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- jQuery (WebJars) -->
    <script src="${pageContext.request.contextPath}/webjars/jquery/3.6.4/jquery.min.js"></script>
    
    <!-- Bootstrap JS (WebJars) -->
    <script src="${pageContext.request.contextPath}/webjars/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>

    <!-- ========== JAVASCRIPT - AJAX CON JQUERY ========== -->
    <script>
        // URL del servlet (Ajax endpoint)
        const SERVLET_URL = '${pageContext.request.contextPath}/servlet/promociones';
        
        let modoEdicion = false;

        // Cargar al iniciar página
        $(document).ready(function() {
            cargarPromociones();
            cargarEstadisticas();
        });

        /**
         * Ajax GET - Cargar promociones
         */
        function cargarPromociones() {
            $('#loadingSpinner').show();
            $('#tablaPromociones tbody').empty();

            const soloActivas = $('#soloActivas').is(':checked');
            const url = SERVLET_URL + (soloActivas ? '?activas=true' : '');

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function(promociones) {
                    renderizarTabla(promociones);
                    $('#loadingSpinner').hide();
                },
                error: function(xhr) {
                    mostrarError('Error al cargar promociones');
                    $('#loadingSpinner').hide();
                }
            });
        }

        /**
         * Renderizar tabla
         */
        function renderizarTabla(promociones) {
            const tbody = $('#tablaPromociones tbody');
            tbody.empty();

            if (promociones.length === 0) {
                tbody.append('<tr><td colspan="7" class="text-center text-muted">No se encontraron promociones</td></tr>');
                return;
            }

            promociones.forEach(promo => {
                const badgeClass = promo.estadoTexto === 'Activa' ? 'success' : 
                                   promo.estadoTexto === 'Programada' ? 'info' : 'secondary';
                
                const valor = promo.tipoDescuento === 'Porcentaje' ? promo.valorDescuento + '%' :
                              promo.tipoDescuento === 'Monto Fijo' ? '$' + promo.valorDescuento :
                              promo.tipoDescuento;

                const row = `
                    <tr>
                        <td>${promo.reglaId}</td>
                        <td><strong>${promo.nombreRegla}</strong></td>
                        <td><span class="badge bg-info badge-custom">${promo.tipoDescuento}</span></td>
                        <td>${valor}</td>
                        <td><span class="badge bg-${badgeClass} badge-custom">${promo.estadoTexto}</span></td>
                        <td class="small">
                            ${promo.fechaInicio ? 'Inicio: ' + new Date(promo.fechaInicio).toLocaleDateString() + '<br>' : ''}
                            ${promo.fechaFin ? 'Fin: ' + new Date(promo.fechaFin).toLocaleDateString() : ''}
                        </td>
                        <td class="table-actions">
                            <button class="btn btn-sm btn-outline-primary" onclick="editarPromocion(${promo.reglaId})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarPromocion(${promo.reglaId}, '${promo.nombreRegla}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });
        }

        /**
         * Ajax GET - Cargar estadísticas
         */
        function cargarEstadisticas() {
            $.ajax({
                url: '${pageContext.request.contextPath}/api/promociones/estadisticas',
                type: 'GET',
                dataType: 'json',
                success: function(stats) {
                    const html = `
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h6 class="text-muted">Total</h6>
                                    <h2 class="text-primary">${stats.totalPromociones}</h2>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h6 class="text-muted">Activas</h6>
                                    <h2 class="text-success">${stats.promocionesActivas}</h2>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h6 class="text-muted">Inactivas</h6>
                                    <h2 class="text-secondary">${stats.promocionesInactivas}</h2>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card text-center">
                                <div class="card-body">
                                    <h6 class="text-muted">Próximas a Expirar</h6>
                                    <h2 class="text-warning">${stats.proximasExpirar}</h2>
                                </div>
                            </div>
                        </div>
                    `;
                    $('#estadisticas').html(html);
                }
            });
        }

        /**
         * Mostrar modal nueva promoción
         */
        function mostrarModalNuevo() {
            modoEdicion = false;
            $('#modalTitulo').text('Nueva Promoción');
            $('#formPromocion')[0].reset();
            $('#promocionId').val('');
            new bootstrap.Modal($('#modalPromocion')).show();
        }

        /**
         * Ajax GET - Editar promoción
         */
        function editarPromocion(id) {
            $.ajax({
                url: SERVLET_URL + '?id=' + id,
                type: 'GET',
                dataType: 'json',
                success: function(promo) {
                    modoEdicion = true;
                    $('#modalTitulo').text('Editar Promoción');
                    $('#promocionId').val(promo.reglaId);
                    $('#nombreRegla').val(promo.nombreRegla);
                    $('#tipoDescuento').val(promo.tipoDescuento);
                    $('#valorDescuento').val(promo.valorDescuento);
                    $('#fechaInicio').val(promo.fechaInicio ? promo.fechaInicio.slice(0,16) : '');
                    $('#fechaFin').val(promo.fechaFin ? promo.fechaFin.slice(0,16) : '');
                    $('#acumulable').prop('checked', promo.acumulable);
                    $('#exclusivo').prop('checked', promo.exclusivo);
                    
                    new bootstrap.Modal($('#modalPromocion')).show();
                },
                error: function() {
                    mostrarError('Error al cargar promoción');
                }
            });
        }

        /**
         * Ajax POST/PUT - Guardar promoción
         */
        function guardarPromocion() {
            const data = {
                nombreRegla: $('#nombreRegla').val(),
                tipoDescuento: $('#tipoDescuento').val(),
                valorDescuento: parseFloat($('#valorDescuento').val()),
                acumulable: $('#acumulable').is(':checked'),
                exclusivo: $('#exclusivo').is(':checked'),
                fechaInicio: $('#fechaInicio').val() || null,
                fechaFin: $('#fechaFin').val() || null
            };

            const method = modoEdicion ? 'PUT' : 'POST';
            const id = $('#promocionId').val();
            const url = modoEdicion ? SERVLET_URL + '?id=' + id : SERVLET_URL;

            $.ajax({
                url: url,
                type: method,
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function() {
                    bootstrap.Modal.getInstance($('#modalPromocion')).hide();
                    mostrarExito(modoEdicion ? 'Promoción actualizada' : 'Promoción creada');
                    cargarPromociones();
                    cargarEstadisticas();
                },
                error: function(xhr) {
                    const error = xhr.responseJSON ? xhr.responseJSON.error : 'Error al guardar';
                    mostrarError(error);
                }
            });
        }

        /**
         * Ajax DELETE - Eliminar promoción
         */
        function eliminarPromocion(id, nombre) {
            if (!confirm('¿Está seguro de eliminar la promoción "' + nombre + '"?')) {
                return;
            }

            $.ajax({
                url: SERVLET_URL + '?id=' + id,
                type: 'DELETE',
                success: function() {
                    mostrarExito('Promoción eliminada correctamente');
                    cargarPromociones();
                    cargarEstadisticas();
                },
                error: function() {
                    mostrarError('Error al eliminar promoción');
                }
            });
        }

        /**
         * Mostrar mensaje de éxito
         */
        function mostrarExito(mensaje) {
            const html = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="fas fa-check-circle me-2"></i>
                    ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            $('#mensajes').html(html);
            setTimeout(() => $('.alert').fadeOut(), 3000);
        }

        /**
         * Mostrar mensaje de error
         */
        function mostrarError(mensaje) {
            const html = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            $('#mensajes').html(html);
        }
    </script>

    <!-- Footer -->
    <footer class="mt-5 py-4 bg-light text-center">
        <p class="text-muted mb-0">
            <i class="fas fa-code me-2"></i>
            Tecnologías demostradas: JSP + JSTL + jQuery Ajax + WebServlet + Bootstrap (WebJars)
        </p>
    </footer>

</body>
</html>
