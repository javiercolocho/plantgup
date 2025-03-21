import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { alpha, Autocomplete, Box, Button, Card, CardContent, CardActions, Menu, MenuItem, TextField, Typography, styled } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de instalar jwt-decode

// ICONOS
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// MODAL PARA ELIMINAR
import DeleteModal from '../components/DeleteModal';

const TemplateAproved = () => {
  //PARA MANEJAR EL STATUS DE LAS PLANTILLAS | VARIABLES
  const { templateId } = useParams();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [activeFilter, setActiveFilter] = useState('todas');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useNavigate(); // Inicializa useNavigate

  // Recupera el token del localStorage
  const token = localStorage.getItem('authToken');

  // Decodifica el token para obtener appId y authCode
  let appId, authCode;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      appId = decoded.app_id; // Extrae appId del token
      authCode = decoded.auth_code; // Extrae authCode del token
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

  //FETCH DE LAS PLANTILLAS
  const fetchTemplates = async (appId, authCode) => {
    try {
      const response = await fetch(`https://partner.gupshup.io/partner/app/${appId}/templates`, {
        method: 'GET',
        headers: {
          Authorization: authCode,
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        const failedTemplates = data.templates.filter(template => template.status === 'FAILED');
        setTemplates(failedTemplates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  // Llama a fetchTemplates cuando el componente se monta
  useEffect(() => {
    if (appId && authCode) {
      fetchTemplates(appId, authCode);
    } else {
      console.error('No se encontró appId o authCode en el token');
    }
  }, [appId, authCode]);

  //MODIFICAR EL COLOR DEPENDIENDO DEL STATUS DE LAS PLANTILLAS
  const getStatusColor = (status) => {
    switch (status) {
      case 'REJECTED':
        return '#ffebee';
      case 'FAILED':
        return '#fff3e0';
      default:
        return '#f5f5f5';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'REJECTED':
        return '#d32f2f'; // Rojo oscuro para texto
      case 'FAILED':
        return '#e65100'; // Naranja oscuro para texto
      default:
        return '#616161'; // Gris oscuro para texto
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case 'REJECTED':
        return '#EF4444'; // Rojo
      case 'FAILED':
        return '#FF9900'; // Naranja
      default:
        return '#34C759'; // Verde
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event, template) => {
    console.log("Template seleccionado:", template); // Verifica el template seleccionado
    setAnchorEl(event.currentTarget); // Abre el menú
    setSelectedTemplate(template); // Guarda el template seleccionado en el estado
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (template) => {
    navigate('/modify-template', { state: { template } });
  };

  // Función para manejar el clic en eliminar
  const handleDeleteClick = () => {
    console.log("Template a eliminar:", selectedTemplate); // Verifica el template en el estado
    setDeleteModalOpen(true); // Abre el modal
    handleClose(); // Cierra el menú
  };

  // Función para cancelar la eliminación
  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedTemplate(null);
  };

  // Función para confirmar la eliminación
  const handleDeleteConfirm = async () => {
    try {
      // Aquí iría tu lógica para eliminar la plantilla
      console.log('Eliminando plantilla:', selectedTemplate);

      // Cierra el modal y limpia el estado
      setDeleteModalOpen(false);
      setSelectedTemplate(null);

      // Opcional: Recargar la lista de plantillas
      await fetchTemplates();
    } catch (error) {
      console.error('Error al eliminar la plantilla:', error);
    }
  };

  // Estilo personalizado para el menú
  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color: 'rgb(55, 65, 81)',
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>

        <Box sx={{ flexGrow: 1, p: 3 }}>
          {/*TITULO*/}<Typography variant="h4" gutterBottom>
            Catálogo de Plantillas Fallidas
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3, justifyContent: "center" }}>
            {templates.map((template) => (
              <Card
                key={template.id}
                sx={{
                  maxWidth: 300,
                  height: 500, // Fija la altura a 480px
                  borderRadius: 3,
                  mt: 3, // Aumenta la separación superior
                  mx: 2, // Agrega margen a los lados
                  border: '1px solid #e0e0e0',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                  overflow: 'visible',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ p: 0 }}>


                  {/* Header Template Name */}
                  <Box sx={{ p: 2, pb: 0 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{
                        mb: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2, // muestra máximo 2 líneas
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {template.elementName}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {/* Status badge */}
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: getStatusColor(template.status),
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: getStatusDotColor(template.status),
                            mr: 0.5
                          }}
                        />
                        <Typography variant="caption" sx={{ color: getStatusTextColor(template.status), fontWeight: 500 }}>
                          {template.status}
                        </Typography>
                      </Box>

                      {/* Categoria badge */}
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: '#F3F4F6',
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#4B5563', fontWeight: 500 }}>
                          {template.category}
                        </Typography>
                      </Box>

                      {/* Tipo badge */}
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: '#F3F4F6',
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#4B5563', fontWeight: 500 }}>
                          {template.templateType}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Razón rechazo */}{template.reason && (
                    <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                      Razón: {template.reason}
                    </Typography>
                  )}

                  {/* Content */}<Box
                    sx={{
                      p: 0,
                      backgroundColor: '#FEF9F3', // Fondo amarillo
                      p: 2,
                      mx: 1,
                      my: 1,
                      borderRadius: 2,
                      height: 302, // Altura fija para el fondo amarillo
                      width: 286,
                      display: 'flex',
                      flexDirection: 'column', // Ajusta la dirección del contenido a columna
                      alignItems: 'center', // Centra horizontalmente
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: 'white', // Fondo blanco para el contenido
                        p: 2, // Padding para separar el contenido del borde
                        mt: 2,
                        borderRadius: 4, // Bordes redondeados
                        width: '100%', // Ajusta el ancho para que ocupe todo el contenedor
                        overflowY: 'auto', // Permite desplazamiento vertical si el contenido supera la altura
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {template.data}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                {/* Acciones */}<CardActions
                  sx={{
                    mt: 'auto',           // Empuja el CardActions hacia abajo
                    justifyContent: 'flex-start', // Alinea contenido a la izquierda
                    padding: 2,           // Añade padding consistente
                    position: 'relative', // Necesario para el posicionamiento
                  }}
                >
                  <Button
                    id="manage-button"
                    aria-controls={anchorEl ? 'manage-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={anchorEl ? 'true' : undefined}
                    variant="outlined"
                    disableElevation
                    onClick={(event) => { console.log("Template seleccionado:", template); handleClick(event, template) }}
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none',
                      color: '#00C3FF',
                      borderColor: '#E0E7FF',
                      '&:hover': {
                        borderColor: '#C7D2FE',
                        backgroundColor: '#F5F5FF'
                      }
                    }}
                  >
                    Administrar
                  </Button>

                  <StyledMenu
                    id="manage-menu"
                    MenuListProps={{
                      'aria-labelledby': 'manage-button',
                    }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={() => handleEdit(selectedTemplate)}
                      disableRipple
                    >
                      <EditIcon />
                      Editar
                    </MenuItem>
                    <MenuItem
                      onClick={handleDeleteClick}
                      disableRipple
                    >
                      <DeleteIcon />
                      Eliminar
                    </MenuItem>
                  </StyledMenu>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
      {/* Modal de Eliminación */}
      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        template={selectedTemplate}
      />
    </Box>
  );
};

export default TemplateAproved;