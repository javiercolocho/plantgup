import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    Box,
    Button,
    Tooltip,
    Typography
} from '@mui/material';
import TemplateForm from '../components/TemplateForm';

const handleVerTemplates = () => {
    navigate('/'); // Navega a la página Home
};

const CreateTemplatePage = () => (

    <Box sx={{ padding: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
            Crear Template
        </Typography>

        <Tooltip title="Regresar">
            <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={handleVerTemplates}
                sx={{ marginBottom: 2 }}
            >
                Ver Templates
            </Button>
        </Tooltip>

        <Box
            sx={{backgroundColor: '#fdf3f5', padding: 2, borderRadius: 1, marginTop: 3}}
        >
            <Typography variant="body1">
                Tenga en cuenta que ahora es obligatorio proporcionar muestras al crear plantillas de mensajes.<br />
                Las muestras son una forma de proporcionar un ejemplo de posibles datos para su plantilla. Esto nos ayuda durante el proceso de revisión y aprobación, para que podamos entender qué
                tipo de mensaje planeas enviar.
            </Typography>
        </Box>

        <TemplateForm />

    </Box>
);

export default CreateTemplatePage;