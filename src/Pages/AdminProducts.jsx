/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react'
import { useProducts } from '../services/data';
import Header from '../Components/Header';
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

function AdminProducts() {

  const { listAll, newData, updateByCode, isLoading } = useProducts();

  const navigate = useNavigate();

  const states = [
    'Activo',
    'Inactivo'
  ]

  const categories = [
    'BASE',
    'ACTIVO'
  ]

  const units = [
    'GR',
    'ML'
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
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);

  const [validationErrors, setValidationErrors] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'Codigo',
        size: 80,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.code,
          helperText: validationErrors?.code,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              code: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'category',
        header: 'Categoria',
        editVariant: 'select',
        size: 80,
        editSelectOptions: categories,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.category,
          helperText: validationErrors?.category,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              category: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
        size: 100,
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
        accessorKey: 'price',
        header: 'Precio',
        size: 80,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.price,
          helperText: validationErrors?.price,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              price: undefined,
            }),
        },
      },

      {
        accessorKey: 'unit',
        header: 'Unidad',
        editVariant: 'select',
        size: 80,
        editSelectOptions: units,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.unit,
          helperText: validationErrors?.unit,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              unit: undefined,
            }),
        },
      },
      {
        accessorKey: 'state',
        header: 'Estado',
        editVariant: 'select',
        size: 80,
        // eslint-disable-next-line react/prop-types
        Cell: ({ renderedCellValue }) => (
          <Typography>{renderedCellValue ? 'Activo' : 'Inactivo'}</Typography>
        ),
        editSelectOptions: states,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
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
    data: fetchedUsers = [],
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
      code: values.code,
      category: values.category,
      name: values.name,
      price: values.price,
      unit: values.unit,
      state: values.status === 'Activo' ? true : false,
      concentration: "0%"
    }
    try {
      const res = await newData(newRegister, localStorage.getItem('token') || '');
      if (res.msg === "ASSET_CREATED_OK") {
        Swal.fire('success', 'Producto creado correctamente', 'success');
        table.setCreatingRow(null); //exit creating mode
      }
      else if (res.msg === 'ALREADY_ASSET') {
        Swal.fire('error', 'Ya existe un producto con este codigo', 'error');
        table.setCreatingRow(null); //exit creating mode
      }
      else {
        Swal.fire('error', 'Ocurrio un error al crear el producto, por favor intentelo de nuevo', 'error');
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
      category: values.category,
      name: values.name,
      price: values.price,
      unit: values.unit,
      state: values.status === 'Activo' ? true : false,
      concentration: "0%"
    }
    try {
      const res = await updateByCode(values.code, localStorage.getItem('token') || '', newRegister);
      console.log(res)
      if (res.msg === "ASSET_UPDATED_OK") {
        Swal.fire('success', 'Producto editado correctamente', 'success');
        table.setEditingRow(null); //exit editing mode
      }
      else {
        Swal.fire('error', 'Ocurrio un error al editar el producto, por favor intentelo de nuevo', 'error');
        table.setEditingRow(null); //exit editing mode
      }
    } catch (error) {
      console.log(error);
      Swal.fire('error', 'Ocurrio un error al editar el producto, por favor intentelo de nuevo', 'error');
      table.setEditingRow(null); //exit editing mode
    }

  };
  const validateRequired = (value) => !!value.length;

  function validateProduct(product) {
    return {
      code: !validateRequired(product.code) ? 'El codigo es requerido' : '',
      category: !validateRequired(product.category) ? 'La categoria es requerida' : '',
      name: !validateRequired(product.name) ? 'El nombre es requerido' : '',
      price: !validateRequired(product.price) ? 'El precio es requerido' : '',
      unit: !validateRequired(product.unit) ? 'La unidad es requerido' : '',
      state: !validateRequired(product.state) ? 'El estado es requerido' : '',
    };
  }

  const table = useMaterialReactTable({
    columns,
    positionActionsColumn: 'last',
    data: data,
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
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateProduct,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveProduct,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Crear nuevo producto</DialogTitle>
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
        <DialogTitle variant="h3">Editar producto</DialogTitle>
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
        Crear nuevo producto
      </Button>
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

  const fetchData = async (query = {}) => {
    try {
      const data = await listAll(query);
      if (data) {
        setData(data.msg);
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
    validateToken();
    fetchData();
  }, []);
  
  return (
    <div style={appStyles}>
      <Header />
      <section className="container mt-5" >
        <div style={{ backgroundColor: '#bed0ff', padding: '15px', borderRadius: '12px' }}>
          <h2 className="text-center" style={{ color: '#092f62', marginTop: '20px' }}>Administrador de Productos</h2>
          <hr />
          <section id="admin-tools" className="row justify-content-md-center p-4">
            <MaterialReactTable table={table} />
          </section>
        </div>
      </section>
    </div>
  )
}

export default AdminProducts;
