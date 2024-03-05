/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from 'react'
import Header from '../Components/Header'
//import ItemTable from '../Components/ItemTable';
import { useUsers } from '../services/users';
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

function AdminUsers() {

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

  const { listAllUsers, newUser, updateUser, isLoading } = useUsers();
  const [users, setUsers] = useState([])
  const [validationErrors, setValidationErrors] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: '_id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
        size: 120,
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
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 120,
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'password',
        header: 'Contraseña',
        size: 70,
        Cell: () => (
          <Typography>{'●●●●●●●●●●'}</Typography>
        ),
        muiEditTextFieldProps: {
          type: 'password',
          required: true,
          error: !!validationErrors?.password,
          helperText: validationErrors?.password,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              password: undefined,
            }),
        },
      },
      {
        accessorKey: 'rol',
        header: 'Rol',
        editVariant: 'select',
        size: 80,
        editSelectOptions: roles,
        maxSize: 90,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.rol,
          helperText: validationErrors?.rol,
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
      {
        accessorKey: 'orderEmail',
        header: 'Email Ordenes',
        size: 120,
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
    ],
    [validationErrors],
  );

  const filteredColumns = columns.filter(column => column.accessorKey !== "_id");

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
  const validatePassword = (password) =>
    !!password.length &&
    password
      .match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
      );

  function validateUser(user) {
    return {
      name: !validateRequired(user.name) ? 'El nombre es requerido' : '',
      email: !validateEmail(user.email) ? 'Por favor inserte un email valido' : '',
      password: !validatePassword(user.password) ? 'La contraseña debe trener al menos 8 digitos, una mayuscula, una minuscula, un numero y un caracter especial' : '',
      rol: !validateRequired(user.rol) ? 'El rol es requerido' : '',
      orderEmail: !validateRequired(user.rol) ? 'Por favor inserte un email valido' : '',
    };
  }

  //CREATE action
  const handleCreateUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    const newRegister = {
      email: values.email,
      password: values.password,
      name: values.name,
      rol: values.rol,
      status: values.status === 'Activo' ? true : false
    }
    try {
      const res = await newUser(newRegister, localStorage.getItem('token') || '');
      if (res[1] === 200) {
        Swal.fire('success', 'Usuario creado correctamente', 'success');
        table.setCreatingRow(null); //exit creating mode
      }
      else if (res.msg === 'ALREADY_USER') {
        Swal.fire('error', 'Ya existe un usuario con este correo', 'error');
        table.setCreatingRow(null); //exit creating mode
      }
      else {
        Swal.fire('error', 'Ocurrio un error al crear el usuario, por favor intentelo de nuevo', 'error');
        table.setCreatingRow(null); //exit creating mode
      }
    } catch (error) {
      console.log(error);
      Swal.fire('error', 'Ocurrio un error al crear el prducto, por favor intentelo de nuevo', 'error');
      table.setEditingRow(null); //exit creating mode
    }
  };

  //UPDATE action
  const handleSaveUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    const body = {
      password: values.password,
      name: values.name,
      rol: values.rol,
      status: values.status === 'Activo' ? true : false,
      orderEmail: values.orderEmail
    }
    try {
      const res = await updateUser(values.email, localStorage.getItem('token') || '', body);
      if (res.msg === "USER_UPDATED_OK") {
        Swal.fire('success', 'Usuario editado correctamente', 'success');
        table.setEditingRow(null); //exit creating mode
      }
      else {
        Swal.fire('error', 'Ocurrio un error al editar el usuario, por favor intentelo de nuevo', 'error');
        table.setEditingRow(null); //exit creating mode
      }
    } catch (error) {
      console.log(error);
      Swal.fire('error', 'Ocurrio un error al editar el usuario, por favor intentelo de nuevo', 'error');
      table.setEditingRow(null); //exit creating mode
    }

  };

  const table = useMaterialReactTable({
    columns: filteredColumns,
    positionActionsColumn: 'last',
    data: users,
    createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
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
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    localization: MRT_Localization_ES,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Nuevo usuario</DialogTitle>
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
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        sx={{ marginTop: '5px' }}
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Crear un nuevo usuario
      </Button>
    ),
    state: {
      isLoading: isLoading,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token') || ''
      const data = await listAllUsers(token);
      if (data) {
        setUsers(data.msg);
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ha habido un error al obtener los usuarios, intentalo de nuevo o contacta al administrador!",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ha habido un error al obtener los usuarios, intentalo de nuevo o contacta al administrador!",
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
      fetchUsers();
  }, []);
  
  return (
    <div style={appStyles}>
      <Header />
      <section className="container mt-5">
        <div style={{ backgroundColor: '#bed0ff', padding: '15px', borderRadius: '12px' }}>
          <h2 className="text-center" style={{ color: '#092f62', marginTop: '20px' }}>Administrador de Usuarios</h2>
          <hr />
          <section id="admin-tools" className="row justify-content-md-center p-4">
            <MaterialReactTable table={table} />
          </section>
        </div>
      </section>
    </div>
  )
}

export default AdminUsers
