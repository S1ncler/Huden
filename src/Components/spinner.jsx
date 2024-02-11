import React from 'react';
import { CircularProgress } from '@mui/material';

const Spinner = () => {
    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente para el difuminado
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999, // Asegura que el spinner esté por encima de otros elementos
        }}>
            <CircularProgress color="primary" />
        </div>
    );
};

export default Spinner;