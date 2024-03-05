/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import { useFixedIps } from '../services/fixed';
import Swal from 'sweetalert2';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
    MRT_EditActionButtons,
    MaterialReactTable,
    // createRow,
    useMaterialReactTable,
} from 'material-react-table';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../services/data';

function GridPercentAdjust() {
    const { GetPercents, UpdatePercents, postPercent, isLoading } = useFixedIps();
    const { listAll, isLoading: isLoadingProds } = useProducts();
    const navigate = useNavigate();

    const states = [
        'Activo',
        'Inactivo'
    ];

    const appStyles = {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        minWidth: '100vw',
        position: 'absolute',
        top: '51px',
        right: '0px',
        backgroundColor: '#f4f6f7'
    };
    const [show, setShow] = useState(false);
    const [percents, setPercents] = useState([]);
    const [assets, setAssets] = useState([]);

    const [validationErrors, setValidationErrors] = useState({});

    const columns = useMemo(
        () => [
            {
                accessorKey: 'asset',
                header: 'Activo',
                editVariant: 'select',
                editSelectOptions: assets,
                size: 80,
                muiEditTextFieldProps: {
                    select: true,
                    error: !!validationErrors?.asset,
                    helperText: validationErrors?.asset,
                },
            },
            {
                accessorKey: 'percentAdjust',
                header: 'Factor',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.percentAdjust,
                    helperText: validationErrors?.percentAdjust,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            percentAdjust: undefined,
                        }),
                    inputProps: {
                        // Define el tipo de entrada como numérico
                        inputMode: 'numeric',
                        // Define una expresión regular para aceptar números enteros o decimales
                        pattern: "[0-9]*\\.?[0-9]*",
                    },
                },
            },
            {
                accessorKey: 'status',
                header: 'Estado',
                editVariant: 'select',
                maxSize: 70,
                editSelectOptions: states,
                // eslint-disable-next-line react/prop-types
                Cell: ({ renderedCellValue }) => (
                    <Typography>{renderedCellValue ? 'Activo' : 'Inactivo'}</Typography>
                ),
                muiEditTextFieldProps: {
                    select: true,
                    error: !!validationErrors?.status,
                    helperText: validationErrors?.status,
                },
            },
        ],
        [validationErrors],
    );

    //call CREATE hook
    const { mutateAsync: createUser, isPending: isCreatingUser } = {}
    //  useCreateUser();
    //call READ hook
    const {
        data = [],
        isError: isLoadingUsersError,
        isFetching: isFetchingUsers,
        isLoading: isLoadingUsers,
    } = {} //useGetUsers();
    //call UPDATE hook
    const { mutateAsync: updateUser, isPending: isUpdatingUser } = {}
    //  useUpdateUser();
    //call DELETE hook
    const { mutateAsync: deleteUser, isPending: isDeletingUser } = {}
    //  useDeleteUser();

    //CREATE action
    const handleCreateProduct = async ({ values, table }) => {
        const newValidationErrors = validateProduct(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        const newRegister = {
            asset: values.asset,
            percentAdjust: Number(values.percentAdjust),
            status: values.status === 'Activo' ? true : false,
        }
        try {
            const res = await postPercent(newRegister, localStorage.getItem('token') || '');
            if (res.msg === "PERCENTADJUST_CREATED_OK") {
                Swal.fire('success', 'Ajuste de porcentaje creado correctamente', 'success');
                fetchPercents();
                table.setCreatingRow(null); //exit creating mode
            }
            else if (res.msg === 'ALREADY_PERCENTADJUST') {
                Swal.fire('error', 'Ya existe un ajuste de porcentaje con este activo', 'error');
                table.setCreatingRow(null); //exit creating mode
            }
            else {
                Swal.fire('error', 'Ocurrio un error al crear el ajuste de porcentaje, por favor intentelo de nuevo', 'error');
                table.setCreatingRow(null); //exit creating mode
            }
        } catch (error) {
            console.log(error);
            Swal.fire('error', 'Ocurrio un error al crear el ajuste de porcentaje, por favor intentelo de nuevo', 'error');
            table.setCreatingRow(null); //exit creating mode
        }
    };

    //UPDATE action
    const handleSaveProduct = async ({ values, table }) => {
        const newValidationErrors = validateProduct(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        const newRegister = {
            asset: values.asset,
            percentAdjust: values.percentAdjust,
            status: values.status === 'Activo' ? true : false,
        }
        try {
            const res = await UpdatePercents(values.asset, localStorage.getItem('token') || '', newRegister);
            if (res.msg === "PERCENTADJUST_UPDATED_OK") {
                Swal.fire('success', 'Ajuste de porcentaje editado correctamente', 'success');
                table.setEditingRow(null); //exit editing mode
            }
            else {
                Swal.fire('error', 'Ocurrio un error al editar el Ajuste de porcentaje, por favor intentelo de nuevo', 'error');
                table.setEditingRow(null); //exit editing mode
            }
        } catch (error) {
            console.log(error);
            Swal.fire('error', 'Ocurrio un error al editar el Ajuste de porcentaje, por favor intentelo de nuevo', 'error');
            table.setEditingRow(null); //exit editing mode
        }

    };
    const validateRequired = (value) => !!value.length;
    const isNumeric = (value) => {
        return value !== '' && /^[0-9]*\.?[0-9]*$/.test(value);
    };

    function validateProduct(product) {
        return {
            asset: !validateRequired(product.asset) ? 'El activo es requerido' : '',
            percentAdjust: !isNumeric(product.percentAdjust) ? 'El factor solo puede ser numerico' : '',
            status: !validateRequired(product.status) ? 'El estado es requerido' : ''
        };
    }

    const table = useMaterialReactTable({
        columns,
        positionActionsColumn: 'last',
        data: percents,
        createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
        editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
        getRowId: (row) => row.id,
        localization: MRT_Localization_ES,
        muiToolbarAlertBannerProps: isLoadingUsersError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        muiTableContainerProps: {
        },
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateProduct,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveProduct,
        //optionally customize modal content
        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Crear nuevo Ajuste porcentaje</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        //optionally customize modal content
        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Editar ajuste porcentaje</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                variant="contained"
                onClick={() => {
                    table.setCreatingRow(true);
                }}
            >
                Crear nuevo ajuste porcentaje
            </Button>
        ),
        state: {
            isLoading: isLoading || isLoadingProds,
            isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingUsersError,
            showProgressBars: isFetchingUsers,
        },
    });

    const fetchPercents = async (query = {}) => {
        try {
            const token = localStorage.getItem('token') || '';
            const data = await GetPercents(token);
            if (data) {
                setPercents(data[0].msg);
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Ha habido un error al obtener los ajustes de porcentaje, intentalo de nuevo o contacta al administrador!",
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ha habido un error al obtener los ajustes de porcentaje, intentalo de nuevo o contacta al administrador!",
            });
        }
    }

    const fetchProds = async (query = {}) => {
        try {
            const data = await listAll(query);
            if (data) {
                const actives = data.msg.filter(producto => producto.category === 'ACTIVO').map(producto => producto.name)
                console.log(actives)
                setAssets(actives);
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Ha habido un error al obtener los productos, intentalo de nuevo o contacta al administrador!",
                });
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ha habido un error al obtener los productos, intentalo de nuevo o contacta al administrador!",
            });
        }
    }

    const validateToken = () => {
        if (localStorage.getItem('token')) {
            const decoded = jwtDecode(localStorage.getItem('token'));
            const tiempoActualUnix = Math.floor(Date.now() / 1000);
            if (decoded.exp < tiempoActualUnix) {
                Swal.fire({
                    icon: "info",
                    title: "Oops...",
                    text: "Su sesion ha expirado",
                });
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/');
                return false;
            }
            return true;
        }
        else {
            navigate('/');
            return false;
        }
    }

    useEffect(() => {
        if (validateToken())
            fetchPercents();
        fetchProds();
    }, []);

    return (
        <MaterialReactTable table={table} />
    )
}

export default GridPercentAdjust;