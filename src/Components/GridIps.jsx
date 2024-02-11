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

function GridIps() {
    const { GetIps, UpdateIps, postIp, isLoading } = useFixedIps();
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
    const [ips, setips] = useState([]);

    const [validationErrors, setValidationErrors] = useState({});

    const columns = useMemo(
        () => [
            {
                accessorKey: 'code',
                header: 'Codigo',
                size: 80,
                enableEditing: false
            },
            {
                accessorKey: 'name',
                header: 'Nombre',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.name,
                    helperText: validationErrors?.name,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            name: undefined,
                        }),
                },
            },
            {
                accessorKey: 'ip',
                header: 'Ip',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.ip,
                    helperText: validationErrors?.ip,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            ip: undefined,
                        }),
                },
            },
            {
                accessorKey: 'status',
                header: 'Estado',
                editVariant: 'select',
                // eslint-disable-next-line react/prop-types
                Cell: ({ renderedCellValue }) => (
                    <Typography>{renderedCellValue ? 'Activo' : 'Inactivo'}</Typography>
                ),
                editSelectOptions: states,
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
            code: ips.length + 1,
            name: values.name,
            ip: values.ip,
            status: values.status === 'Activo' ? true : false,
        }
        try {
            const res = await postIp(newRegister, localStorage.getItem('token') || '');
            if (res.msg === "IP_CREATED_OK") {
                Swal.fire('success', 'Ip creada correctamente', 'success');
                fetchIps();
                table.setCreatingRow(null); //exit creating mode
            }
            else if (res.msg === 'ALREADY_IP') {
                Swal.fire('error', 'Ya existe una ip con este codigo', 'error');
                table.setCreatingRow(null); //exit creating mode
            }
            else {
                Swal.fire('error', 'Ocurrio un error al crear la ip, por favor intentelo de nuevo', 'error');
                table.setCreatingRow(null); //exit creating mode
            }
        } catch (error) {
            console.log(error);
            Swal.fire('error', 'Ocurrio un error al crear el producto, por favor intentelo de nuevo', 'error');
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
            name: values.name,
            ip: values.ip,
            status: values.status === 'Activo' ? true : false,
        }
        try {
            const res = await UpdateIps(values.code, localStorage.getItem('token') || '', newRegister);
            if (res.msg === "IP_UPDATED_OK") {
                Swal.fire('success', 'Producto editado correctamente', 'success');
                table.setEditingRow(null); //exit editing mode
            }
            else {
                Swal.fire('error', 'Ocurrio un error al editar la ip, por favor intentelo de nuevo', 'error');
                table.setEditingRow(null); //exit editing mode
            }
        } catch (error) {
            console.log(error);
            Swal.fire('error', 'Ocurrio un error al editar la ip, por favor intentelo de nuevo', 'error');
            table.setEditingRow(null); //exit editing mode
        }

    };
    const validateRequired = (value) => !!value.length;

    function validateProduct(product) {
        return {
            name: !validateRequired(product.name) ? 'El nombre es requerida' : '',
            ip: !validateRequired(product.ip) ? 'La ip es requerida' : '',
            status: !validateRequired(product.status) ? 'El estado es requerido' : ''
        };
    }

    const table = useMaterialReactTable({
        columns,
        positionActionsColumn: 'last',
        data: ips,
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
                <DialogTitle variant="h3">Crear nueva ip</DialogTitle>
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
                <DialogTitle variant="h3">Editar ip</DialogTitle>
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
                Crear nueva ip
            </Button>
        ),
        state: {
            isLoading: isLoading,
            isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingUsersError,
            showProgressBars: isFetchingUsers,
        },
    });

    const fetchIps = async (query = {}) => {
        try {
            const token = localStorage.getItem('token') || '';
            const data = await GetIps(token);
            if (data) {
                setips(data[0].msg);
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Ha habido un error al obtener las ips, intentalo de nuevo o contacta al administrador!",
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ha habido un error al obtener las ips, intentalo de nuevo o contacta al administrador!",
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
            fetchIps();

    }, []);
    
    return (
        <MaterialReactTable table={table} />
    )
}

export default GridIps;