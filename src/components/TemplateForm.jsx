import React, { useState, useRef, useEffect } from 'react';
import { Alert, Box, Button, Chip, Container, FormControl, FormControlLabel, FormLabel, FormHelperText, Grid, Grid2, IconButton, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Snackbar, Stack, TextField, Tooltip, Typography, alpha } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

import { Smile } from "react-feather"; // Icono para emojis
import EmojiPicker from "emoji-picker-react"; // Selector de emojis

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Delete from '@mui/icons-material/Delete';
import ArrowForward from "@mui/icons-material/ArrowForward";
import Link from "@mui/icons-material/Link";
import Phone from "@mui/icons-material/Phone";
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


import FileUploadComponent from './FileUploadComponent';
import { isValidURL, updateButtonWithValidation } from '../utils/validarUrl';

const TemplateForm = () => {

  //CAMPOS DEL FORMULARIO PARA EL REQUEST
  const [templateName, setTemplateName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [templateType, setTemplateType] = useState("text");
  const [templateNameHelperText, setTemplateNameHelperText] = useState("El nombre debe hacer referencia al texto de su plantilla.");
  const [templateNameError, setTemplateNameError] = useState(false);
  const [vertical, setVertical] = useState("");
  const [message, setMessage] = useState("");
  const [header, setHeader] = useState("");
  const [footer, setFooter] = useState("");
  const [buttons, setButtons] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [example, setExample] = useState("");
  const [exampleMedia, setExampleMedia] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [languageCode, setLanguageCode] = useState("es"); // Valor predeterminado: español
  const [languageTypeError, setLanguageTypeError] = useState(false);
  const [languageTypeHelperText, setLanguageTypeHelperText] = useState("");

  const [categoriaPlantilla, setcategoriaPlantilla] = useState("");
  const [categoriaPlantillaError, setcategoriaPlantillaError] = useState(false);
  const [categoriaPlantillaHelperText, setcategoriaPlantillaHelperText] = useState("");

  const [etiquetaPlantilla, setetiquetaPlantilla] = useState("");
  const [etiquetaPlantillaError, setetiquetaPlantillaError] = useState(false);
  const [etiquetaPlantillaHelperText, setetiquetaPlantillaHelperText] = useState("");

  const [contenidoPlantilla, setcontenidoPlantilla] = useState("");
  const [contenidoPlantillaTypeError, setcontenidoPlantillaTypeError] = useState(false);
  const [contenidoPlantillaTypeHelperText, setcontenidoPlantillaTypeHelperText] = useState("");

  const [ejemploPlantilla, setejemploPlantilla] = useState("");
  const [ejemploPlantillaError, setejemploPlantillaError] = useState(false);
  const [ejemploPlantillaHelperText, setejemploPlantillaHelperText] = useState("");

  //const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [variables, setVariables] = useState([]);
  // Estado para almacenar ejemplos de variables
  const [variableExamples, setVariableExamples] = useState({});
  const [variableExamplesError, setvariableExamplesError] = useState(false);
  const [variableExamplesHelperText, setvariableExamplesHelperText] = useState("");
  const [variableErrors, setVariableErrors] = useState({});

  //ESTE ES PARA EL EXAMPLE MEDIA
  const [mediaId, setMediaId] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const templateNameRef = useRef(null);
  const templateTypeRef = useRef(null);
  const languageCodeRef = useRef(null);
  const verticalRef = useRef(null);
  const messageRef = useRef(null);
  const exampleRef = useRef(null);
  const selectedCategoryRef = useRef(null);
  const exampleRefs = useRef({});

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

  const validateFields = () => {
    let isValid = true;

    if (templateName.trim() === "") {
      setTemplateNameError(true);
      setTemplateNameHelperText("Este campo es requerido");
      isValid = false;
      templateNameRef.current.focus();
      return isValid; // Salir de la función después del primer error
    }

    if (templateType.trim() === "") {
      setTemplateTypeError(true);
      setTemplateTypeHelperText("Este campo es requerido");
      isValid = false;
      templateTypeRef.current.focus();
      return isValid;
    }

    if (languageCode.trim() === "") {
      setLanguageTypeError(true);
      setLanguageTypeHelperText("Este campo es requerido");
      isValid = false;
      languageCodeRef.current.focus();
      return isValid;
    }

    if (vertical.trim() === "") {
      setetiquetaPlantillaError(true);
      isValid = false;
      verticalRef.current.focus();
      return isValid;
    }

    if (message.trim() === "") {
      setcontenidoPlantillaTypeError(true)
      setcontenidoPlantillaTypeHelperText("Este campo es requerido");
      isValid = false;
      messageRef.current.focus();
      return isValid;
    }

    if (example.trim() === "") {
      setejemploPlantillaError(true)
      setejemploPlantillaHelperText("Este campo es requerido");
      isValid = false;
      exampleRef.current.focus();
      return isValid;
    }

    if (selectedCategory.trim() === "") {
      setcategoriaPlantillaError(true);
      setcategoriaPlantillaHelperText("Este campo es requerido");
      isValid = false;
      selectedCategoryRef.current.focus();
      return isValid;
    }

    // Validar que todas las variables tengan un texto de ejemplo
    if (variables.length > 0) {
      const newErrors = {}; // Objeto para almacenar los errores

      for (const variable of variables) {
        if (!variableExamples[variable] || variableExamples[variable].trim() === "") {
          isValid = false;
          newErrors[variable] = "Este campo es requerido"; // Asignar mensaje de error

          // Colocar el foco en el campo de texto de ejemplo vacío
          if (exampleRefs.current[variable]) {
            exampleRefs.current[variable].focus();
          }
        } else {
          newErrors[variable] = ""; // Sin error
        }
      }

      // Actualizar el estado de errores
      setVariableErrors(newErrors);

      // Si hay errores, detener la validación
      if (!isValid) {
        return isValid;
      }
    }

    return isValid;
  };

  // Función para determinar el tipo de archivo basado en la extensión
const getMediaType = (url) => {
  // Extraer la extensión del archivo de la URL
  const extension = url.split('.').pop().toLowerCase();

  // Determinar el tipo de archivo basado en la extensión
  if (['png', 'jpeg', 'jpg', 'gif'].includes(extension)) {
    return 'IMAGE';
  } else if (['mp4', '3gp', 'mov', 'avi'].includes(extension)) {
    return 'VIDEO';
  } else if (['txt', 'xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf'].includes(extension)) {
    return 'DOCUMENT';
  } else {
    return 'null'; // En caso de que la extensión no sea reconocida
  }
};

// Recupera el token del localStorage
  const token = localStorage.getItem('authToken');

  // Decodifica el token para obtener appId y authCode
  let appId, authCode, idUsuarioTalkMe, idNombreUsuarioTalkMe, empresaTalkMe;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      appId = decoded.app_id; // Extrae appId del token
      authCode = decoded.auth_code; // Extrae authCode del token
      idUsuarioTalkMe = decoded.id_usuario;
      idNombreUsuarioTalkMe = decoded.nombre_usuario;
      empresaTalkMe = decoded.empresa;
      console.log('appId:', appId);
      console.log('authCode:', authCode);
      console.log('idUsuarioTalkMe:', idUsuarioTalkMe);
      console.log('idNombreUsuarioTalkMe:', idNombreUsuarioTalkMe);
      console.log('empresaTalkMe:', empresaTalkMe);
    
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

const iniciarRequest = async () => {
  try {
    // Hacer el primer request
    const result = await sendRequest(appId, authCode);

    // Verificar si el primer request fue exitoso
    if (result && result.status === "success") {
      // Extraer el valor de `id` del objeto `template`
      const templateId = result.template.id;

      // Hacer el segundo request, pasando el `id` como parámetro
      const result2 = await sendRequest2(templateId, idNombreUsuarioTalkMe || "Sistema.TalkMe");

      // Verificar si el segundo request fue exitoso y obtener el ID_PLANTILLA
      if (result2 && result2.ID_PLANTILLA) {
        const ID_PLANTILLA = result2.ID_PLANTILLA;

        // Hacer el tercer request usando el ID_PLANTILLA
        await sendRequest3(ID_PLANTILLA);
      } else {
        console.error("El segundo request no fue exitoso o no tiene el formato esperado.");
      }
    } else {
      console.error("El primer request no fue exitoso o no tiene el formato esperado.");
    }
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
};

  // FUNCION PARA ENVIAR LA SOLICITUD
  const sendRequest = async (appId, authCode) => {
    // Validar campos antes de enviar la solicitud
    if (!validateFields()) {
      return; // Detener la ejecución si hay errores
    }
  
    const url = `https://partner.gupshup.io/partner/app/${appId}/templates`;
    const headers = {
      Authorization: authCode,
      "Content-Type": "application/x-www-form-urlencoded",
    };
  
    const data = new URLSearchParams();
    data.append("elementName", templateName);
    data.append("category", selectedCategory.toUpperCase());
    data.append("languageCode", languageCode);
    data.append("templateType", templateType.toUpperCase());
    data.append("vertical", vertical);
    data.append("content", message);
  
    if (header) {
      data.append("header", header);
    }
  
    if (footer) { 
      data.append("footer", footer);
    }
  
    if (mediaId) {
      data.append("exampleMedia", mediaId);
    }
  
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
        return null; // Retornar null en caso de error
      }
  
      const result = await response.json();
      showSnackbar("✅ Plantilla creada exitosamente", "success");
      console.log("Response: ", result);
      return result; // Retornar el resultado
    } catch (error) {
      console.error("Error en la solicitud:", error);
      showSnackbar("❌ Error al crear la plantilla", "error");
      return null; // Retornar null en caso de error
    }
  };

  const sendRequest2 = async (templateId, idNombreUsuarioTalkMe) => {
    const url = "https://certificacion.talkme.pro/templatesGS/api/plantillas/";
    const headers = {
      "Content-Type": "application/json",
      // Agrega aquí cualquier header de autenticación si es necesario
    };
  
    // Convertir selectedCategory a ID_PLANTILLA_CATEGORIA
    let ID_PLANTILLA_CATEGORIA;
    if (selectedCategory === "MARKETING") {
      ID_PLANTILLA_CATEGORIA = 13;
    } else if (selectedCategory === "UTILITY") {
      ID_PLANTILLA_CATEGORIA = 14;
    } else {
      console.error("Categoría no válida:", selectedCategory);
      showSnackbar("❌ Categoría no válida", "error");
      return null; // Retornar null si la categoría no es válida
    }

    // Crear un objeto con los datos
    const data = {
      ID_PLANTILLA: null,
      ID_PLANTILLA_CATEGORIA: ID_PLANTILLA_CATEGORIA,
      ID_BOT_REDES: 149,
      ID_INTERNO: templateId,
      NOMBRE: templateName,
      MENSAJE: message,
      TIPO_PLANTILLA: 0,
      MEDIA: getMediaType(uploadedUrl).toLowerCase(),
      URL: uploadedUrl,
      PANTALLAS: 0,
      ESTADO: 1,
      AUTORIZADO: 1,
      ELIMINADO: 0,
      SEGUIMIENTO_EDC: 0,
      CREADO_POR: idNombreUsuarioTalkMe,
    };
  
    // Imprimir el segundo request
    console.log("Segundo request enviado:", {
      url: url,
      headers: headers,
      body: data,
    });
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
        showSnackbar(`❌ Error en el segundo request: ${errorResponse.message || "Solicitud inválida"}`, "error");
        return null; // Retornar null en caso de error
      }
  
      const result = await response.json();
      showSnackbar("✅ Segundo request completado exitosamente", "success");
      console.log("Response del segundo request: ", result);
      return result; // Retornar el resultado en caso de éxito
    } catch (error) {
      console.error("Error en el segundo request:", error);
      showSnackbar("❌ Error en el segundo request", "error");
      return null; // Retornar null en caso de error
    }
  };

  const sendRequest3 = async (ID_PLANTILLA) => {
    const tipoDatoId = 1;
  
    try {
      const results = [];
      for (let i = 0; i < variables.length; i++) {
        const variableData = {
          ID_PLANTILLA: ID_PLANTILLA,
          ID_PLANTILLA_TIPO_DATO: tipoDatoId,
          NOMBRE: variableExamples[variables[i]] || '',
          //NOMBRE: variables[i],
          PLACEHOLDER: variableExamples[variables[i]] || '',
          ORDEN: i + 1,
          CREADO_POR: "Sistema.TalkMe",
        };
        
        const response = await fetch('https://certificacion.talkme.pro/templatesGS/api/parametros/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(variableData),
        });
  
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Error al guardar la variable ${variables[i]}: ${errorMessage}`);
        }
  
        const result = await response.json();
        results.push(result);
      }
  
      console.log('Variables guardadas:', results);
      return results;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

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
      id: 'MARKETING',
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
    // Reemplazar espacios con guiones bajos
    const newValue = event.target.value.replace(/\s+/g, '_');

    // Actualizar el estado con el nuevo valor
    setTemplateName(newValue);

    // Validar si el campo está vacío
    if (newValue.trim() === "") {
      setTemplateNameError(true);
      setTemplateNameHelperText("Este campo es requerido");
    } else {
      setTemplateNameError(false);
      setTemplateNameHelperText("");
    }
  };

  //IDIOMA PLANTILLA
  const handleLanguageCodeChange = (event) => {
    const selectedLanguage = event.target.value; // Esto ya es el código de idioma ("es", "en", "fr")
    setLanguageCode(selectedLanguage); // Actualiza el estado directamente con el código

    if (selectedLanguage.trim() === "") {
      setLanguageTypeError(true);
      setLanguageTypeHelperText("Este campo es requerido");
    } else {
      setLanguageTypeError(false);
      setLanguageTypeHelperText("");
    }
  };

  // Mapeo de idiomas (código -> nombre)
  const languageMap = {
    es: "Español",
    en: "Inglés",
    fr: "Francés",
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
    const newType = event.target.value;
    setTemplateType(newType);
  
    // Solo limpiar header si el nuevo tipo NO es "TEXT"
    if (newType !== "TEXT") {
      setHeader("");
    }
  
    setMediaType("");
    setMediaURL("");
  
    if (newType.trim() === "") {
      setTemplateTypeError(true);
      setTemplateTypeHelperText("Este campo es requerido");
    } else {
      setTemplateTypeError(false);
      setTemplateTypeHelperText("");
    }
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

  const handleHeaderChange = (e) => {
    if (e.target.value.length <= charLimit){
      setHeader(e.target.value)
    }
    console.log("Nuevo valor de header:", event.target.value);
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

  // VARIABLES DEL BODY MESSAGE
  const handleAddVariable = () => {
    const newVariable = `{{${variables.length + 1}}}`;
    setMessage((prev) => `${prev} ${newVariable}`);
    setVariables([...variables, newVariable]);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => `${prev} ${emojiObject.emoji}`);
    setShowEmojiPicker(false);
  };

  // Nueva función para borrar una variable específica
  const deleteVariable = (variableToDelete) => {
    // Eliminar la variable del texto
    const newMessage = message.replace(variableToDelete, '');
    setMessage(newMessage);

    // Eliminar la variable de la lista de variables
    const updatedVariables = variables.filter(v => v !== variableToDelete);
    setVariables(updatedVariables);

    messageRef.current?.focus();
  };

  // Nueva función para borrar todas las variables
  const deleteAllVariables = () => {
    let newMessage = message;
    variables.forEach(variable => {
      newMessage = newMessage.replaceAll(variable, '');
    });
    setMessage(newMessage);
    setVariables([]);
    messageRef.current?.focus();
  };

  // Función para previsualizar el mensaje con ejemplos aplicados
  const previewMessage = () => {
    let previewHeader = header;
    let previewFooter = footer;
    let previewText = message;
    Object.entries(variableExamples).forEach(([variable, example]) => {
      previewHeader = previewHeader.replaceAll(variable, example);
      previewFooter = previewFooter.replaceAll(variable, example);
      previewText = previewText.replaceAll(variable, example);
    });
  }

  const handleUpdateExample = (variable, value) => {
    setVariableExamples(prevExamples => ({
      ...prevExamples,
      [variable]: value
    }));
  };

  // Función para generar el ejemplo combinando el mensaje y los valores de las variables
  const generateExample = () => {
    let generatedExample = message;
    Object.keys(variableExamples).forEach(variable => {
      generatedExample = generatedExample.replace(new RegExp(variable, 'g'), variableExamples[variable]);
    });
    return generatedExample;
  };

  // Función para reemplazar las variables en el mensaje con sus ejemplos
  const replaceVariables = (text, variables) => {
    let result = text;
    Object.keys(variables).forEach(variable => {
      result = result.replace(new RegExp(variable, 'g'), variables[variable]);
    });
    return result;
  };

  // Actualizar el campo "example" y "message" cuando cambie el mensaje o los ejemplos de las variables
  useEffect(() => {
    const newExample = replaceVariables(message, variableExamples);
    setExample(newExample);
    setMessage(newExample); // Ahora también actualiza message con los valores reemplazados
  }, [message, variableExamples]);

  useEffect(() => {
    setExample(previewMessage());
  }, [message, variableExamples]);


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

      {/* Formulario (70%) */}<Grid item xs={8}><Box sx={{ height: '100%', overflowY: 'auto', pr: 2 }}>

        {/* Template Name */}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
          <FormControl fullWidth>
            <FormLabel htmlFor="template-name-input">
              *Nombre de la plantilla
            </FormLabel>
            <TextField
              id="template-name-input"
              aria-required="true"
              helperText={templateNameHelperText}
              error={templateNameError}
              value={templateName}
              onChange={handleTemplateNameChange}
              fullWidth
              inputRef={templateNameRef}
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
                <Paper key={category.id} sx={{
                  p: 2,
                  cursor: category.disabled ? "default" : "pointer",
                  opacity: category.disabled ? 0.5 : 1,
                  border: categoriaPlantillaError && !selectedCategory ? "1px solid red" : "none", // Resaltar en rojo si hay error
                  "&:hover": {
                    bgcolor: category.disabled
                      ? "transparent"
                      : (theme) => alpha(theme.palette.primary.main, 0.04),
                  },
                }}>
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
          {/* Mensaje de error */}
          {categoriaPlantillaError && (
            <FormHelperText error={categoriaPlantillaError}>
              {categoriaPlantillaHelperText}
            </FormHelperText>
          )}
        </Box>

        {/* Tipo de plantilla --data-urlencode templateType*/}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
          <FormControl fullWidth>
            <FormLabel>
              *Tipo de plantilla
            </FormLabel>
          </FormControl>

          <FormControl fullWidth>
            <Select labelId="template-type-label" id="template-type" value={templateType} onChange={handleTemplateTypeChange} label="Select" ref={templateTypeRef}>
              <MenuItem value="text">TEXTO</MenuItem>
              <MenuItem value="image">IMAGEN</MenuItem>
              <MenuItem value="document">DOCUMENTO</MenuItem>
            </Select>
            <FormHelperText>
              Escoge el tipo de plantilla que se va a crear
            </FormHelperText>
          </FormControl>
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

            {/* Componente para subir archivos */}
              <FileUploadComponent
                templateType={templateType}
                onUploadSuccess={(mediaId, uploadedUrl) => {
                  setMediaId(mediaId); // Guarda el mediaId
                  setUploadedUrl(uploadedUrl); // Guarda la URL
                  //setUploadStatus("¡Archivo subido exitosamente!");
                }}
                onImagePreview={(preview) => setImagePreview(preview)} // Recibe la vista previa
                onHeaderChange={(newHeader) => setHeader(newHeader)} // Nueva prop
              />
          </Box>
        )}
        

        {/*Idioma --data-urlencodeo languageCode */}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
          <FormControl fullWidth>
            <FormLabel>*Idioma de plantilla</FormLabel>
          </FormControl>

          <FormControl fullWidth error={languageTypeError}>
            <InputLabel id="languageCode">Selección</InputLabel>
            <Select
              labelId="languageCode"
              id="languageCode"
              label="Escoge el idioma"
              aria-required="true"
              value={languageCode} // Usamos directamente el código de idioma
              onChange={handleLanguageCodeChange}
              ref={languageCodeRef}
            >
              {Object.entries(languageMap).map(([code, name]) => (
                <MenuItem key={code} value={code}>
                  {name} ({code.toUpperCase()})
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {languageTypeError ? languageTypeHelperText : "Escoge el idioma de plantilla que se va a crear"}
            </FormHelperText>
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
            aria-required="true"
            error={etiquetaPlantillaError}
            value={vertical}
            helperText="Defina para qué caso de uso, por ejemplo, actualización de cuenta, OTP, etc, en 2 o 3 palabras"
            onChange={handleVerticalChange}
            inputRef={verticalRef}
          />
        </Box>

        {/* BodyMessage --data-urlencode content */}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
          <FormControl fullWidth>
            <FormLabel>*Contenido</FormLabel>
          </FormControl>

          {/* Campo de texto con soporte para emojis y variables */}
          <Box sx={{ position: "relative" }}>
            <TextField
              fullWidth
              multiline
              aria-required="true"
              error={contenidoPlantillaTypeError}
              rows={4}
              label="Escribe"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mb: 3, mt: 4 }}
              inputRef={messageRef}
            />

            {/* Botón para agregar emojis */}
            <Button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}

            >
              <Smile size={20} />
            </Button>

            {/* Selector de emojis */}
            {showEmojiPicker && (
              <Box>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </Box>
            )}

            {/* Botón para agregar variable y borrar todas */}
            <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddVariable}
              >
                Agregar Variable
              </Button>

              {variables.length > 0 && (
                <Button
                  color="error"
                  variant="contained"
                  startIcon={<ClearIcon />}
                  onClick={deleteAllVariables}
                >
                  Borrar todas las variables
                </Button>
              )}
            </Stack>

            {/* Variables disponibles como chips con campos de texto para ejemplos */}
            {variables.length > 0 && (
              <Stack sx={{ my: 2, gap: 2 }}>
                <FormLabel sx={{ fontWeight: 'medium' }}>Variables con texto de ejemplo:</FormLabel>
                {variables.map((variable, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Chip
                      label={variable}
                      color="primary"
                      variant="contained"
                      onDelete={() => deleteVariable(variable)}
                      deleteIcon={
                        <Tooltip title="Borrar variable">
                          <DeleteIcon />
                        </Tooltip>
                      }
                    />
                    <TextField
                      size="small"
                      label="Texto de ejemplo"
                      value={variableExamples[variable] || ''}
                      onChange={(e) => handleUpdateExample(variable, e.target.value)}
                      sx={{ flexGrow: 1, maxWidth: '60%' }}
                      inputRef={(el) => (exampleRefs.current[variable] = el)} // Asignar el ref
                      error={!!variableErrors[variable]} // Mostrar error si existe
                      helperText={variableErrors[variable]} // Mostrar mensaje de error
                    />
                  </Box>
                ))}
              </Stack>
            )}

          </Box>

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
            helperText={`${footer.length} / ${charLimit} caracteres`}
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

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addButton}
            disabled={buttons.length >= maxButtons || Object.keys(validationErrors).length > 0}
            sx={{ mt: 3, mb: 3 }}
          >
            Agregar botón
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
                  label="Titulo del botón"
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
                  <MenuItem value="QUICK_REPLY">Respuesta rápida</MenuItem>
                  <MenuItem value="URL">URL</MenuItem>
                  <MenuItem value="PHONE_NUMBER">Número de teléfono</MenuItem>
                </Select>

                {/* Campo adicional según el tipo de botón */}
                {button.type === "URL" && (
                  <TextField
                    label="URL"
                    value={button.url || ''}
                    onChange={(e) => updateButtonWithValidation(
                      button.id,
                      "url",
                      e.target.value,
                      setButtons,
                      setValidationErrors
                    )}
                    fullWidth
                    error={validationErrors[button.id] !== undefined}
                    helperText={validationErrors[button.id]}
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
            {buttons.length} / {maxButtons} botones agregados
          </Typography>
        </Box>

        {/* Ejemplo --data-urlencode example */}<Box sx={{ width: '100%', marginTop: 2, marginBottom: 2, p: 4, border: "1px solid #ddd", borderRadius: 2, display: "none" }}>
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

        {/*Boton Guardar Plantilla*/}<Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={iniciarRequest}
            sx={{ mt: 3, mb: 3 }}
          >
            Enviar solicitud
          </Button>
        </Box>


      </Box>
      </Grid>

      {/* Preview (30%) */}
      <Grid item xs={4}>
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

            {/* Vista previa de la imagen */}
            {imagePreview && (
              <Box sx={{ bgcolor: "#ffffff", p: 1, borderRadius: 2, boxShadow: 1, maxWidth: "100%" }}>
                {typeof imagePreview === "string" && imagePreview.startsWith("data:image") ? (
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    style={{ width: "100%", borderRadius: 2, display: "block" }}
                  />
                ) : imagePreview.includes("video") ? (
                  <video controls width="100%">
                    <source src={imagePreview} />
                    Tu navegador no soporta este formato de video.
                  </video>
                ) : imagePreview.includes("pdf") ? (
                  <iframe src={imagePreview} width="100%" height="500px"></iframe>
                ) : null}
              </Box>
            )}
            {/* Muestra el estado de la subida */}
            {uploadStatus && <p>{uploadStatus}</p>}

            {/* Mensaje de WhatsApp */}
            <Box
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

              <Typography variant="body1" color="text.primary">
                {header}
              </Typography>


              <Typography variant="body1" color="text.primary" sx={{ fontFamily: "Helvetica Neue, Arial, sans-serif", whiteSpace: "pre-line" }}>
                {message}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary" // Cambia a un color gris más claro
                sx={{
                  fontFamily: "Helvetica Neue, Arial, sans-serif",
                  whiteSpace: "pre-line"
                }}
              >
                {footer}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "flex-end" }}>
                {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })}
              </Typography>
            </Box>

            {/* Botones */}<Stack spacing={1} sx={{ mt: 0 }}>
              {buttons.map((button) => (
                <Box
                  key={button.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 1,
                    border: "1px solid #ccc",
                    borderRadius: "20px",
                    p: 1,
                    backgroundColor: "#ffffff",
                    boxShadow: 1,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  {button.type === "QUICK_REPLY" && (
                    <ArrowForward sx={{ fontSize: "16px", color: "#075e54" }} />
                  )}
                  {button.type === "URL" && (
                    <Link sx={{ fontSize: "16px", color: "#075e54" }} />
                  )}
                  {button.type === "PHONE_NUMBER" && (
                    <Phone sx={{ fontSize: "16px", color: "#075e54" }} />
                  )}
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