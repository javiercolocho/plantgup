import React, { useState } from 'react';
import { Alert, Box, Button, Container, FormControl, FormControlLabel, FormLabel, FormHelperText, Grid, Grid2, IconButton, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Snackbar, Stack, TextField, Tooltip, Typography, alpha } from '@mui/material';

import CustomHeader from './CustomHeader';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Delete from '@mui/icons-material/Delete';
import ArrowForward from "@mui/icons-material/ArrowForward";
import Link from "@mui/icons-material/Link";
import Phone from "@mui/icons-material/Phone";


import FileUploadComponent from './FileUploadComponent';


const TemplateForm = () => {

  //CAMPOS DEL FORMULARIO PARA EL REQUEST
  const [templateName, setTemplateName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [templateType, setTemplateType] = useState("text");
  const [templateNameHelperText, setTemplateNameHelperText] = useState("El nombre debe hacer referencia al texto de su plantilla.");
  const [templateNameError, setTemplateNameError] = useState(false);
  const [languageCode, setLanguageCode] = useState("");
  const [vertical, setVertical] = useState("");
  const [message, setMessage] = useState("");
  const [header, setHeader] = useState("");
  const [footer, setFooter] = useState("");
  const [buttons, setButtons] = useState([]);
  const [example, setExample] = useState("");
  const [exampleMedia, setExampleMedia] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  //ESTE ES PARA EL EXAMPLE MEDIA
  const [mediaId, setMediaId] = useState('');

  // Función para mostrar Snackbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Función para cerrar Snackbar
  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  // CONSTRUYO EL cURL REQUEST
  const buildCurlCommand = () => {
    const url = "https://partner.gupshup.io/partner/app/f63360ab-87b0-44da-9790-63a0d524f9dd/templates";
    const headers = {
      Authorization: "sk_2662b472ec0f4eeebd664238d72b61da",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const data = {
      elementName: templateName,
      category: selectedCategory.toUpperCase(),
      languageCode: languageCode, // Usamos directamente languageCode (ya está en el formato correcto)
      templateType: templateType.toUpperCase(),
      vertical: vertical,
      content: message,
      buttons: JSON.stringify(
        buttons.map((button) => {
          const buttonData = {
            type: button.type,
            text: button.title,
          };

          if (button.type === "URL") {
            buttonData.url = button.url;
          } else if (button.type === "PHONE_NUMBER") {
            buttonData.phone_number = button.phoneNumber;
          }

          return buttonData;
        })
      ),
      example: example,
      exampleMedia: mediaId,
      enableSample: true,
      allowTemplateCategoryChange: false,
    };

    // Solo agregar mediaId si existe
    if (mediaId) {
      data.exampleMedia = mediaId;
    }

    const curlCommand = `curl --location '${url}' \\
  --header 'Authorization: ${headers.Authorization}' \\
  --header 'Content-Type: ${headers["Content-Type"]}' \\
  ${Object.entries(data)
        .filter(([_, value]) => value !== undefined && value !== '') // Filtrar valores vacíos
        .map(([key, value]) => `--data-urlencode '${key}=${value}'`)
        .join(" \\\n")}`;

    return curlCommand;
  };

  // FUNCION PARA ENVIAR LA SOLICITUD
  const sendRequest = async () => {
    const url = "https://partner.gupshup.io/partner/app/f63360ab-87b0-44da-9790-63a0d524f9dd/templates";
    const headers = {
      Authorization: "sk_2662b472ec0f4eeebd664238d72b61da",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const data = new URLSearchParams();
    data.append("elementName", templateName);
    data.append("category", selectedCategory.toUpperCase());
    data.append("languageCode", languageCode); // Usamos directamente languageCode (ya está en el formato correcto)
    data.append("templateType", templateType.toUpperCase());
    data.append("vertical", vertical);
    data.append("content", message);

    // Agregar mediaId si existe
    if (mediaId) {
      data.append("exampleMedia", mediaId);
    }

    // Construir el objeto buttons
    const formattedButtons = buttons.map((button) => {
      const buttonData = {
        type: button.type,
        text: button.title,
      };

      if (button.type === "URL") {
        buttonData.url = button.url;
      } else if (button.type === "PHONE_NUMBER") {
        buttonData.phone_number = button.phoneNumber;
      }

      return buttonData;
    });

    data.append("buttons", JSON.stringify(formattedButtons));
    data.append("example", example);
    data.append("enableSample", true);
    data.append("allowTemplateCategoryChange", false);

    console.log("Request enviado:", JSON.stringify(Object.fromEntries(data.entries()), null, 2));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: data,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
        showSnackbar(`❌ Error al crear la plantilla: ${errorResponse.message || "Solicitud inválida"}`, "error");
        return;
      }

      const result = await response.json();
      showSnackbar("✅ Plantilla creada exitosamente", "success");
      console.log("Response: ", result);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      showSnackbar("❌ Error al crear la plantilla", "error");
    }
  };

  const [variables, setVariables] = useState([{ key: '{{1}}', value: '' }, { key: '{{2}}', value: '' }]);

  //MEDIA
  const handleUploadSuccess = (uploadedMediaId) => {
    console.log('Media subida exitosamente, ID:', uploadedMediaId);
    setMediaId(uploadedMediaId);
    // Mostrar mensaje de éxito
    showSnackbar("✅ Archivo subido exitosamente", "success");
  };

  // CATEGORIAS
  const categories = [
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Envía ofertas promocionales, ofertas de productos y más para aumentar la conciencia y el compromiso.',
      icon: <EmailOutlinedIcon />,
    },
    {
      id: 'utility',
      title: 'Utilidad',
      description: 'Envía actualizaciones de cuenta, actualizaciones de pedidos, alertas y más para compartir información importante.',
      icon: <NotificationsNoneOutlinedIcon />,
    },
    {
      id: 'authentication',
      title: 'Autenticación',
      description: 'Envía códigos que permiten a tus clientes acceder a su cuenta.',
      icon: <VpnKeyOutlinedIcon />,
      disabled: true
    }
  ];
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  //NOMBRE PLANTILLA
  const handleTemplateNameChange = (event) => {
    setTemplateName(event.target.value);
  };

  //IDIOMA PLANTILLA
  const handleLanguageCodeChange = (event) => {
    const selectedLanguage = event.target.value; // "español", "inglés" o "frances"
    const newLanguageCode = languageMap[selectedLanguage]; // Convierte a "es", "en" o "fr"
    setLanguageCode(newLanguageCode);
  };

  const languageMap = {
    español: "es",
    inglés: "en",
    frances: "fr",
  };

  const reverseLanguageMap = {
    es: "español",
    en: "inglés",
    fr: "frances",
  };

  //VERTICAL PLANTILLA
  const handleVerticalChange = (event) => {
    setVertical(event.target.value)
  }

  //TIPO PLANTILLA
  const handleTemplateTypeChange = (event) => {
    setTemplateType(event.target.value);
    setHeader(""); // Resetear el header al cambiar de tipo
    setMediaType("");
    setMediaURL("");
  };

  const handleHeaderTemplateTypeChange = (event) => {
    setTemplateType(event.target.value);
    setHeader(''); // Resetear el header al cambiar el tipo
  };

  const handleHeaderTypeChange = (event) => {
    const value = event.target.value;
    if (value.length <= charLimit) {
      setHeader(value);
    }
  };

  //HEADER PLANTILLA
  const [mediaType, setMediaType] = useState(""); // Tipo de media (image, video, etc.)
  const [mediaURL, setMediaURL] = useState(""); // URL del media
  const [selectedFile, setSelectedFile] = useState(null);
  const MAX_IMG_SIZE = 5 * 1024 * 1024; // 5 MB en bytes
  const [error, setError] = useState(''); // Estado para manejar errores

  const handleHeaderChange = (event) => {
    setHeader(event.target.value);
  };

  const handleMediaTypeChange = (event) => {
    setMediaType(event.target.value);
  };

  const handleCloseError = () => {
    setError(''); // Cerrar el mensaje de error
  };

  const handleMediaURLChange = (event) => {
    setMediaURL(event.target.value);
  };

  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size > MAX_IMG_SIZE) {
      setError('El archivo es demasiado grande. El tamaño máximo permitido es 5 MB.');
      setSelectedFile(null);//Limpiar el archivo seleccionado
    } else {
      setError(''); //Limpio el mensaje de error
      setSelectedFile(selectedFile);
      console.log('Archivo seleccionado:', selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Content = event.target.result.split(',')[1]; // Obtener solo el contenido en Base64

      const payload = {
        idEmpresa: 2,
        idBot: 257,
        idBotRedes: 721,
        idUsuario: 48,
        tipoCarga: 3,
        nombreArchivo: file.name,
        contenidoArchivo: base64Content,
      };

      try {
        const response = await fetch('https://dev.talkme.pro/WsFTP/api/ftp/upload', {
          method: 'POST',
          headers: {
            'x-api-token': 'TFneZr222V896T9756578476n9J52mK9d95434K573jaKx29jq',
            'Origin': 'https://dev.talkme.pro/',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Error al subir el archivo');
        }

        const data = await response.json();
        setUploadedUrl(data.url); // Asumiendo que la API devuelve un objeto con una propiedad 'url'
        alert('Archivo subido con éxito: ' + data.url);
      } catch (error) {
        console.error('Error:', error);
        alert('Error al subir el archivo');
      }
    };

    reader.readAsDataURL(file); // Leer el archivo como Data URL (Base64)
  };


  //FOOTER PLANTILLA
  const handleFooterChange = (e) => {
    if (e.target.value.length <= charLimit) {
      setFooter(e.target.value);
    }
  };
  const charLimit = 60;
  const maxButtons = 10;

  //BOTONES PLANTILLA
  const addButton = () => {
    if (buttons.length < maxButtons) {
      setButtons([
        ...buttons,
        { id: Date.now(), type: "QUICK_REPLY", title: "", url: "", phoneNumber: "" }
      ]);
    }
  };
  const updateButton = (id, key, value) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, [key]: value } : button
      )
    );
  };
  const removeButton = (id) => {
    setButtons(buttons.filter((button) => button.id !== id));
  };


  return (
    <Grid container spacing={2} sx={{ height: '100vh' }}>

      {/* Notificaciones */}<Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Formulario (70%) */}<Grid item xs={8}>
        <Box sx={{ height: '100%', overflowY: 'auto', pr: 2 }}>
          {/*Template Name --data-urlenconde-elementName*/}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <FormControl fullWidth> {/* Usamos FormControl */}
              <FormLabel htmlFor="template-name-input"> {/* FormLabel para accesibilidad */}
                *Nombre de la plantilla
              </FormLabel>
              <TextField
                id="template-name-input" // Conecta FormLabel con TextField
                aria-required="true" // Accesibilidad
                helperText={templateNameHelperText}
                error={templateNameError} // Para mostrar errores
                value={templateName}
                onChange={handleTemplateNameChange}
              />
            </FormControl>
          </Box>

          {/*Categoría --data-urlencode 'category*/}<Box sx={{ maxWidth: '100%', border: "1px solid #ddd", borderRadius: 2, marginTop: 2, p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControl fullWidth>
                <FormLabel>
                  *Categoría
                </FormLabel>
              </FormControl>
              <Tooltip title="Tu plantilla debe pertencer a una de estas categorías">
                <IconButton size="small">
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
              <Stack spacing={2}>
                {categories.map((category) => (
                  <Paper key={category.id} sx={{ p: 2, cursor: category.disabled ? 'default' : 'pointer', opacity: category.disabled ? 0.5 : 1, '&:hover': { bgcolor: category.disabled ? 'transparent' : (theme) => alpha(theme.palette.primary.main, 0.04) } }}>
                    <FormControlLabel
                      value={category.id}
                      disabled={category.disabled}
                      control={<Radio />}
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            {category.icon}
                            <Typography variant="subtitle1" component="span">
                              {category.title}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {category.description}
                          </Typography>
                        </Box>
                      }
                      sx={{ margin: 0, width: '100%' }}
                    />
                  </Paper>
                ))}
              </Stack>
            </RadioGroup>
          </Box>

          {/* Tipo de plantilla --data-urlencode templateType*/}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <FormControl fullWidth>
              <FormLabel>
                *Tipo de plantilla
              </FormLabel>
            </FormControl>

            <FormControl fullWidth>
              <Select labelId="template-type-label" id="template-type" value={templateType} onChange={handleTemplateTypeChange} label="Select">
                <MenuItem value="text">TEXT</MenuItem>
                <MenuItem value="image">IMAGE</MenuItem>
                <MenuItem value="document">DOCUMENT</MenuItem>
              </Select>
              <FormHelperText>
                Escoge el tipo de plantilla que se va a crear
              </FormHelperText>
            </FormControl>
          </Box>

          {/*Idioma --data-urlencode languageCode */}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <FormControl fullWidth>
              <FormLabel>
                *Idioma de plantilla
              </FormLabel>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="languageCode">Selección</InputLabel>
              <Select
                labelId="languageCode"
                id="languageCode"
                label="Escoge el idioma"
                value={reverseLanguageMap[languageCode] || ""} // Convierte "es" a "español", etc.
                onChange={handleLanguageCodeChange}
              >
                {Object.keys(languageMap).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Escoge el idioma de plantilla que se va a crear</FormHelperText>
            </FormControl>
          </Box>

          {/*Etiquetas de plantilla --data-urlencode vertical*/}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <FormControl fullWidth>
              <FormLabel>
                *Etiquetas de plantilla
              </FormLabel>
            </FormControl>
            <TextField
              fullWidth
              helperText="Defina para qué caso de uso, por ejemplo, actualización de cuenta, OTP, etc, en 2 o 3 palabras"
              onChange={handleVerticalChange}
            />
          </Box>

          {/* BodyMessage --data-urlencode content */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <FormControl fullWidth>
              <FormLabel>
                *Contenido
              </FormLabel>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Escribe"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mb: 3 }}
            />
          </Box>

          {/* Header*/} {templateType === 'TEXT' ? (
            <Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
              <FormControl fullWidth>
                <FormLabel>
                  Encabezado
                </FormLabel>
              </FormControl>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Agregue un encabezado de página de 60 caracteres a su mensaje. Las variables no se admiten en el pie de página.
              </Typography>
              <TextField
                fullWidth
                label="Header text"
                value={header}
                onChange={handleHeaderChange}
                helperText={`${header.length} / ${charLimit} caracteres`}
                sx={{ mb: 3 }}
                error={header.length === charLimit}
              />
            </Box>
          ) : (
            <Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
              <FormControl fullWidth>
                <FormLabel>
                  Encabezado
                </FormLabel>
              </FormControl>
              <FileUploadComponent templateType={templateType} />
            </Box>
          )}




          <FileUploadComponent onUploadSuccess={handleUploadSuccess} />

          {/* Header */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <FormControl fullWidth>
              <FormLabel>
                Encabezado
              </FormLabel>
            </FormControl>
            <TextField
              fullWidth
              value={header}
              onChange={handleHeaderChange}
              helperText={`${header.length} / ${charLimit} characters`}
              sx={{ mb: 3 }}
            />
            <FormHelperText>
              Agregue un encabezado de página de 60 caracteres a su mensaje. Las variables no se admiten en el encabezado.
            </FormHelperText>
          </Box>

          {/* Footer */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <FormControl fullWidth>
              <FormLabel>
                Pie de página
              </FormLabel>
            </FormControl>
            <TextField
              fullWidth
              value={footer}
              onChange={handleFooterChange}
              helperText={`${footer.length} / ${charLimit} characters`}
              sx={{ mb: 3 }}
            />
            <FormHelperText>
              Agregue un encabezado de página de 60 caracteres a su mensaje. Las variables no se admiten en el encabezado.
            </FormHelperText>
          </Box>

          {/* Botones --data-urlencode 'buttons*/}<Box sx={{ width: "100%", marginTop: 2, marginBottom: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <FormControl fullWidth>
              <FormLabel>
                Botones
              </FormLabel>
            </FormControl>

            <FormHelperText>
              Elija los botones que se agregarán a la plantilla. Puede elegir hasta 10 botones.
            </FormHelperText>

            <Button variant="contained" onClick={addButton} disabled={buttons.length >= maxButtons} sx={{ mt: 3, mb: 3 }}>
              + Agregar botón
            </Button>

            <Stack spacing={2}>
              {buttons.map((button, index) => (
                <Box
                  key={button.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {/* Campo de texto para el título del botón */}
                  <TextField
                    label="Button Title"
                    value={button.title}
                    onChange={(e) => updateButton(button.id, "title", e.target.value)}
                    fullWidth
                  />

                  {/* Selector de tipo de botón */}
                  <Select
                    value={button.type}
                    onChange={(e) => updateButton(button.id, "type", e.target.value)}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="QUICK_REPLY">Quick Reply</MenuItem>
                    <MenuItem value="URL">URL</MenuItem>
                    <MenuItem value="PHONE_NUMBER">Phone Number</MenuItem>
                  </Select>

                  {/* Campo adicional según el tipo de botón */}
                  {button.type === "URL" && (
                    <TextField
                      label="URL"
                      value={button.url}
                      onChange={(e) => updateButton(button.id, "url", e.target.value)}
                      fullWidth
                    />
                  )}

                  {button.type === "PHONE_NUMBER" && (
                    <TextField
                      label="Phone Number"
                      value={button.phoneNumber}
                      onChange={(e) => updateButton(button.id, "phoneNumber", e.target.value)}
                      fullWidth
                    />
                  )}

                  {/* Icono según el tipo de botón */}
                  {button.type === "QUICK_REPLY" && <ArrowForward />}
                  {button.type === "URL" && <Link />}
                  {button.type === "PHONE_NUMBER" && <Phone />}

                  {/* Botón para eliminar */}
                  <IconButton color="error" onClick={() => removeButton(button.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Stack>

            <Typography variant="body2" color={buttons.length >= maxButtons ? "error" : "text.secondary"} sx={{ mt: 2 }}>
              {buttons.length} / {maxButtons} buttons added
            </Typography>
          </Box>

          {/* Ejemplo --data-urlencode example */}<Box sx={{ width: '100%', marginTop: 2, marginBottom: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <FormControl fullWidth>
              <FormLabel>
                *Ejemplo
              </FormLabel>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Escribe"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              sx={{ mb: 3 }}
            />
          </Box>

          {/*Boton Guardar Plantilla*/}<Button variant="contained" size="large" color="primary" onClick={sendRequest} sx={{ mt: 3, mb: 3 }}>
            Enviar solicitud
          </Button>


        </Box>
      </Grid>

      {/* Preview (30%) */}<Grid item xs={4}>
  <Box sx={{ position: "sticky", top: 0, height: "100vh", mt: 2, borderRadius: 2 }}>
    <Box
      sx={{
        p: 3,
        bgcolor: "#fef9f3",
        height: "100%",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Vista previa
      </Typography>

      {/* Mensaje de WhatsApp */}<Box
        sx={{
          bgcolor: "#ffffff",
          p: 1,
          borderRadius: 2,
          alignSelf: "flex",
          maxWidth: "100%",
          minHeight: "40px",
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          boxShadow: 1,
        }}
      >
        <Typography variant="body1" color="text.primary" sx={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
          {message}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "flex-end" }}>
          {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })}
        </Typography>
      </Box>
      
      {/* Botones */}<Stack spacing={1} sx={{ mt: 0 }}> {/* Eliminamos el margen superior (mt) */}
        {buttons.map((button) => (
          <Box
            key={button.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start", // Alineamos a la izquierda
              gap: 1, // Reducimos el espacio entre elementos
              border: "1px solid #ccc",
              borderRadius: "20px",
              p: 1, // Reducimos el padding
              backgroundColor: "#ffffff",
              boxShadow: 1,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            {/* Icono pequeño según el tipo de botón */}
            {button.type === "QUICK_REPLY" && (
              <ArrowForward sx={{ fontSize: "16px", color: "#075e54" }} />
            )}
            {button.type === "URL" && (
              <Link sx={{ fontSize: "16px", color: "#075e54" }} />
            )}
            {button.type === "PHONE_NUMBER" && (
              <Phone sx={{ fontSize: "16px", color: "#075e54" }} />
            )}

            {/* Título del botón */}
            <Typography variant="body1" sx={{ fontWeight: "medium", color: "#075e54", fontSize: "14px" }}>
              {button.title}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
</Grid>
    </Grid>
  );
};

export default TemplateForm;