import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Alert
} from '@mui/material';

// eslint-disable-next-line react/prop-types
const DatosDialog = ({ open, doctor, onClose, indexs, index }) => {
    const [ordenCompra, setOrdenCompra] = useState('');
    const [nitCedula, setNitCedula] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [camposCompletos, setCamposCompletos] = useState(false);
    const [error, setError] = useState('');

    // Función para verificar si todos los campos están completos
    const checkCamposCompletos = () => {
        return ordenCompra !== '' && nitCedula !== '' && direccion !== '' && ciudad !== '' && telefono !== '' && email !== '';
    };

    // Función para manejar el cambio en los campos y verificar si todos están completos
    const handleInputChange = (e, name) => {
        const { value } = e.target;
        switch (name) {
            case 'ordenCompra':
                setOrdenCompra(value);
                break;
            case 'nitCedula':
                setNitCedula(value);
                break;
            case 'direccion':
                setDireccion(value);
                break;
            case 'ciudad':
                setCiudad(value);
                break;
            case 'telefono':
                setTelefono(value);
                break;
            case 'email':
                setEmail(value);
                break;
            default:
                break;
        }
        setCamposCompletos(checkCamposCompletos());
    };

    const handleSubmit = () => {
        // Validaciones
        if (!ordenCompra || !nitCedula || !direccion || !ciudad || !telefono || !email) {
            setError('Por favor, introduzca un correo electrónico válido');
            return;
        }
        else
        {
            setError('')
        }

        // Validación de formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor, introduzca un correo electrónico válido');
            return;
        }
        else
        {
            setError('')
        }

        // Envío de datos
        const datos = {
            ordenCompra,
            nitCedula,
            direccion,
            ciudad,
            telefono,
            email,
            indexs
        };
        onClose(datos, indexs, index);
    };

    return (
        <Dialog open={open} onClose={''}>
            <DialogTitle>{`Ingrese los datos para el doctor: ${doctor}`}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Número de orden de compra"
                    fullWidth
                    value={ordenCompra}
                    onChange={(e) => { handleInputChange(e, 'ordenCompra') }}
                />
                <TextField
                    margin="dense"
                    label="Nit o cédula"
                    fullWidth
                    value={nitCedula}
                    onChange={(e) => { handleInputChange(e, 'nitCedula') }}
                />
                <TextField
                    margin="dense"
                    label="Dirección de envío"
                    fullWidth
                    value={direccion}
                    onChange={(e) => { handleInputChange(e, 'direccion') }}
                />
                <TextField
                    margin="dense"
                    label="Ciudad"
                    fullWidth
                    value={ciudad}
                    onChange={(e) => { handleInputChange(e, 'ciudad') }}
                />
                <TextField
                    margin="dense"
                    label="Teléfono"
                    fullWidth
                    value={telefono}
                    onChange={(e) => { handleInputChange(e, 'telefono') }}
                />
                <TextField
                    margin="dense"
                    label="Correo electrónico"
                    fullWidth
                    value={email}
                    onChange={(e) => { handleInputChange(e, 'email') }}
                />
                {error !== '' && <Alert severity="error">{error}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} color="primary" disabled={!camposCompletos}>
                    Enviar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DatosDialog;