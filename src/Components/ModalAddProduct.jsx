import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, Typography, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, FormHelperText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ModalAddProduct = ({ open, handleClose, activeList, baseList }) => {
    const [patientName, setPatientName] = useState('');
    const [doctor, setDoctor] = useState('');
    const [presentation, setPresentation] = useState('');
    const [pharmaceuticalForm, setPharmaceuticalForm] = useState('');
    const [activePrinciples, setActivePrinciples] = useState([{ name: '', concentration: '' }]);
    const [actButton, setActButton] = useState(true);
    const [errors, setErrors] = useState({});
    const [init, setInit] = useState(true);

    const validateForm = () => {
        const errors = {};
        if (!patientName.trim()) {
            errors.patientName = 'Ingrese el nombre del paciente';
        }
        if (!doctor.trim()) {
            errors.doctor = 'Ingrese el nombre del doctor';
        }
        if (!presentation.trim()) {
            errors.presentation = 'Ingrese la presentación';
        }
        if (!pharmaceuticalForm.trim()) {
            errors.pharmaceuticalForm = 'Seleccione la forma farmacéutica';
        }

        const validActivePrinciples = activePrinciples.filter(principle => principle.name.trim() !== '' && principle.concentration.trim() !== '');

        if (validActivePrinciples.length !== activePrinciples.length) {
            errors.activePrinciples = 'Ingrese todos los principios activos y sus concentraciones';
        } else {
            const totalConcentration = validActivePrinciples.reduce((acc, principle) => acc + parseFloat(principle.concentration), 0);
            if (totalConcentration > 100) {
                errors.activePrinciples = 'La suma de las concentraciones no puede superar 100';
            }
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddActivePrinciple = () => {
        setActivePrinciples([...activePrinciples, { name: '', concentration: '' }]);
    };

    const handleRemoveActivePrinciple = () => {
        let actives = activePrinciples.slice(0, -1);
        setActivePrinciples(actives);
    };

    const handleActivePrincipleChange = (index, field, value) => {
        const updatedActivePrinciples = [...activePrinciples];
        updatedActivePrinciples[index][field] = value;
        setActivePrinciples(updatedActivePrinciples);
    };

    const handleSubmit = () => {
        const product = {
            patientName,
            doctor,
            presentation,
            pharmaceuticalForm,
            activePrinciples,
        }
        handleClose(product);
    };

    useEffect(() => {
        if (!init) {
            setActButton(!validateForm());
        }
    }, [
        patientName,
        doctor,
        presentation,
        pharmaceuticalForm,
        activePrinciples
    ])

    const handleOnlyClose = () => {
        handleClose('close');
    }

    useEffect(() => {
        setInit(false);
    }, []);

    return (
        <Dialog open={open} onClose={handleOnlyClose}>
            <DialogTitle display="flex" justifyContent="space-between">
                <Typography fontSize={{ xs: '6vw', sm: '30px', md: '30px' }}>
                    Nuevo producto
                </Typography>
                <IconButton edge="end" color="inherit" onClick={handleOnlyClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent >
                <TextField
                    margin='normal'
                    fullWidth
                    label="Nombre del paciente"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    error={!!errors.patientName}
                    helperText={errors.patientName}
                />
                <TextField
                    margin='normal'
                    fullWidth
                    label="Doctor"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    error={!!errors.doctor}
                    helperText={errors.doctor}
                />
                <TextField
                    margin='normal'
                    fullWidth
                    label="Presentación"
                    type="number"
                    value={presentation}
                    onChange={(e) => setPresentation(e.target.value)}
                    error={!!errors.presentation}
                    helperText={errors.presentation}
                />
                <FormControl
                    margin='normal'
                    sx={{ marginBottom: '15px' }}
                    fullWidth
                >
                    <InputLabel>Forma farmacéutica</InputLabel>
                    <Select
                        value={pharmaceuticalForm}
                        onChange={(e) => setPharmaceuticalForm(e.target.value)}
                        label='Forma farmacéutica'
                    >
                        {baseList.map(base => (
                            <>
                                {base.state && (
                                    <MenuItem value={base.name}>{base.name}</MenuItem>
                                )}
                            </>
                        ))}
                    </Select>
                    {errors.pharmaceuticalForm && <FormHelperText>{errors.pharmaceuticalForm}</FormHelperText>}
                </FormControl>
                {activePrinciples.map((principle, index) => (
                    <div key={index}>
                        <FormControl
                            margin='normal'
                            fullWidth
                        >
                            <InputLabel>{`Activo ${index + 1}`}</InputLabel>
                            <Select
                                value={principle.name}
                                onChange={(e) => handleActivePrincipleChange(index, 'name', e.target.value)}
                                label={`Activo ${index + 1}`}
                            >
                                {activeList.map(active => (
                                    <>
                                        {active.state && (
                                            <MenuItem value={active.name}>{active.name}</MenuItem>
                                        )}
                                    </>

                                ))}
                            </Select>
                            <FormHelperText>{errors.pharmaceuticalForm}</FormHelperText>
                        </FormControl>
                        <TextField
                            label="% Concentración"
                            type="number"
                            value={principle.concentration}
                            onChange={(e) => handleActivePrincipleChange(index, 'concentration', e.target.value)}
                            margin='normal'
                            error={!!errors.activePrinciples}
                            helperText={errors.activePrinciples}
                        />
                    </div>
                ))}
                <IconButton
                    onClick={handleAddActivePrinciple}
                    aria-label="Agregar principio activo"
                >
                    <AddIcon />
                </IconButton>
                <IconButton
                    onClick={handleRemoveActivePrinciple}
                    aria-label="Agregar principio activo"
                    disabled={activePrinciples.length <= 1}
                >
                    <RemoveIcon />
                </IconButton>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={actButton}
                    >Guardar</Button>
                </div>
            </DialogContent>
        </Dialog >
    );
};

export default ModalAddProduct;
