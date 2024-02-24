/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import GridIps from '../Components/GridIps';
import { useEffect, useState, useMemo } from 'react'
import Header from '../Components/Header'
//import ItemTable from '../Components/ItemTable';
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

function AdminFixed() {
    const { GetFixed, UpdateFixed, isLoading } = useFixedIps();
    const navigate = useNavigate();

    const states = [
        'Activo',
        'Inactivo'
    ]

    const roles = [
        'ADMIN',
        'TIENDA',
        'VENDEDOR'
    ]

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
    const [show, setShow] = useState(false)
    const [fixedData, setFixedData] = useState([])
    const [validationErrors, setValidationErrors] = useState({});

    const columns = useMemo(
        () => [
            {
                accessorKey: 'code',
                header: 'Codigo',
                enableEditing: false,
                size: 80,
            },
            {
                accessorKey: 'labourPrice',
                header: 'Mano de obra',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.LabourPrice,
                    helperText: validationErrors?.LabourPrice,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            LabourPrice: undefined,
                        }),
                    //optionally add validation checking for onBlur or onChange
                },
            },
            {
                accessorKey: 'packagingPrice',
                header: 'Precio empaque',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.packagingPrice,
                    helperText: validationErrors?.packagingPrice,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            packagingPrice: undefined,
                        }),
                    //optionally add validation checking for onBlur or onChange
                },
            },
            {
                accessorKey: 'iva',
                header: 'Iva',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.iva,
                    helperText: validationErrors?.iva,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            iva: undefined,
                        }),
                    //optionally add validation checking for onBlur or onChange
                },
            },
            {
                accessorKey: 'fullPrice',
                header: 'Precio Completo',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.fullPrice,
                    helperText: validationErrors?.fullPrice,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            fullPrice: undefined,
                        }),
                    //optionally add validation checking for onBlur or onChange
                },
            },
            {
                accessorKey: 'patientPrice',
                header: 'Precio Paciente',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.patientPrice,
                    helperText: validationErrors?.patientPrice,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            patientPrice: undefined,
                        }),
                    //optionally add validation checking for onBlur or onChange
                },
            },
            {
                accessorKey: 'orderEmail',
                header: 'Email Ordenes',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.orderEmail,
                    helperText: validationErrors?.orderEmail,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            orderEmail: undefined,
                        }),
                    //optionally add validation checking for onBlur or onChange
                },
            },
        ],
        [validationErrors],
    );

    //call CREATE hook
    const { mutateAsync: createUser, isPending: isCreatingUser } = {}
    //useCreateUser();
    //call READ hook
    const {
        data: fetchedUsers = [],
        isError: isLoadingUsersError,
        isFetching: isFetchingUsers,
        isLoading: isLoadingUsers,
    } = {} //useGetUsers();
    //call UPDATE hook
    const { mutateAsync: UpdateUser, isPending: isUpdatingUser } = {}
    //useUpdateUser();
    //call DELETE hook
    const { mutateAsync: deleteUser, isPending: isDeletingUser } = {}
    //useDeleteUser();

    const validateRequired = (value) => !!value.length;
    const validateEmail = (email) =>
    !!email.length &&
    email
      .toLowerCase()
      .match(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      );

    function validateUser(data) {
        return {
            labourPrice: !validateRequired(data.labourPrice) ? 'La mano de obra es requerida' : '',
            packagingPrice: !validateRequired(data.packagingPrice) ? 'El empaque es requerido' : '',
            iva: !validateRequired(data.iva) ? 'El iva es requerido' : '',
            fullPrice: !validateRequired(data.fullPrice) ? 'El precio completo es requerido' : '',
            patientPrice: !validateRequired(data.patientPrice) ? 'El precio paciente es requerido' : '',
            orderEmail: !validateRequired(data.orderEmail) ? 'Ingrese un email valido' : '',
        };
    }

    //UPDATE action
    const handleSaveUser = async ({ values, table }) => {
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        const body = {
            code: values.code,
            labourPrice: values.labourPrice,
            packagingPrice: values.packagingPrice,
            iva: values.iva,
            fullPrice: values.fullPrice,
            patientPrice: values.patientPrice,
            orderEmail: values.orderEmail,
        }
        try {
            const res = await UpdateFixed(body, localStorage.getItem('token') || '');
            if (res.msg === "FIXEDDATA_UPDATED_OK") {
                Swal.fire('success', 'Datos editados correctamente', 'success');
                table.setEditingRow(null); //exit creating mode
            }
            else {
                Swal.fire('error', 'Ocurrio un error al editar los datos, por favor intentelo de nuevo', 'error');
                table.setEditingRow(null); //exit creating mode
            }
        } catch (error) {
            console.log(error);
            Swal.fire('error', 'Ocurrio un error al editar los datos, por favor intentelo de nuevo', 'error');
            table.setEditingRow(null); //exit creating mode
        }
    };

    const table = useMaterialReactTable({
        columns,
        positionActionsColumn: 'last',
        data: fixedData,
        editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
        getRowId: (row) => row.id,
        muiToolbarAlertBannerProps: isLoadingUsersError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        muiTableContainerProps: {
            sx: {
                minHeight: '0px',
            },
        },
        onCreatingRowCancel: () => setValidationErrors({}),
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveUser,
        localization: MRT_Localization_ES,
        //optionally customize modal content
        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Editar usuario</DialogTitle>
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
        state: {
            isLoading: isLoading,
            isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingUsersError,
            showProgressBars: isFetchingUsers,
        },
    });

    const handleShow = () => {
        setShow(!show);
    }
    const fetchFixedData = async () => {
        try {
            const data = await GetFixed();
            if (data) {
                setFixedData([data.msg]);
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Ha habido un error al obtener los datos, intentalo de nuevo o contacta al administrador!",
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ha habido un error al obtener los datos, intentalo de nuevo o contacta al administrador!",
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
            fetchFixedData();
    }, []);
    
    return (
        <div style={appStyles}>
            <Header />
            <section className="container mt-5">
                <div style={{ backgroundColor: '#bed0ff', padding: '15px', borderRadius: '12px' }}>
                    <h2 className="text-center" style={{ color: '#092f62', marginTop: '20px' }}>Administrador de Datos e ips</h2>
                    <hr />
                    <section id="admin-tools" className="row justify-content-md-center p-4">
                        <Box>
                            <MaterialReactTable table={table} />
                        </Box>
                        <Box sx={{ marginTop: '20px' }}>
                            <GridIps></GridIps>
                        </Box>
                    </section>
                </div>
            </section>
        </div>
    )
}

export default AdminFixed