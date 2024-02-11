import React, { useEffect, useState } from 'react';
import { useProducts } from '../services/data';
import { useFixedIps } from '../services/fixed';
import Header from '../Components/Header';
import ModalAddProduct from '../Components/ModalAddProduct';
import ResumePedido from '../Components/ResumePedido';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Spinner from '../Components/spinner';
import { Typography, TextField, Box, useTheme, useMediaQuery, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


function Dashboard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { listAll, isLoading } = useProducts();
  const { GetFixed } = useFixedIps();
  const [activeList, setActiveList] = useState([]);
  const [baseList, setBaseList] = useState([]);
  const [data, setData] = useState();
  const [products, setProducts] = useState([]);
  const [selecData, setSelectData] = useState();
  const [addComponent, setAddComponent] = useState(1);
  const [formData, setFormData] = useState();
  const [showResume, setShowResume] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState([]);
  const [fixed, setFixed] = useState({});

  const handleChangeQuantity = (event, index) => {
    let newQuantity = quantity;
    newQuantity[index] = event.target.value;
    setQuantity(newQuantity);
  };

  const MySwal = withReactContent(Swal)

  //funcion para abrir-cerrar modal
  const handleShowModal = () => {
    if (selecData != undefined) {
      MySwal.fire({
        title: 'Si no has descargado la cotización, se borrarán los datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            window.location.reload()
            Swal.fire("Saved!", "", "success");
          } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
          }
        });
    } else {
      setShowModal(!showModal);
      setShowResume(false);
    }
  }

  //funcion para abrir-cerrar modal
  const handleShowResume = () => {
    setShowResume(!showResume);
    setShowModal(false)
  }

  //funcion para recibir data de componente hijo
  const handledatachild = (data) => {
    setFormData(data)
  }

  //funcion que maneja la seleccion de los productos a cotizar
  const handleSelectData = (data) => {
    setSelectData((prevData) => ({
      ...prevData,
      [formData?.Paciente]: formData,
      //[data._id]: data,
    }))
  }



  //funcion que maneja agregar mas de un principio activo
  const handleAddPrincipiosItem = () => {
    if (addComponent < 3) {
      setAddComponent(addComponent + 1)
    } else {
      alert("Solo se permiten tres activos")
    }
  };

  const getProducts = async () => {
    try {
      const { msg } = await listAll();
      if (msg) {
        const bases = msg.filter(base => base.category === 'BASE');
        const actives = msg.filter(active => active.category === 'ACTIVO');
        setBaseList(bases);
        setActiveList(actives);
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al obtener los productos, por favos intentalo mas tarde o contacta al administrador!"
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al obtener los productos, por favos intentalo mas tarde o contacta al administrador!"
      });
    }
  }

  const getFixedData = async () => {
    try {
      const { msg } = await GetFixed();
      if (msg) {
        setFixed(msg);
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al obtener los datos fijos, por favos intentalo mas tarde o contacta al administrador!"
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al obtener los datos fijos, por favos intentalo mas tarde o contacta al administrador!"
      });
    }
  }

  //constante para pasar los estilos de la pagina
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

  const handleCloseModal = (product) => {
    if (product !== 'close') {
      setShowModal(false);
      setProducts([...products, product]);
      setQuantity([...quantity, 0]);
    } else {
      setShowModal(false);
    }
  };

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

  const calcFullPrice = (prod) => {
    if (
      prod.activePrinciples.some(objeto => objeto.name === 'ARBUTINA') ||
      prod.activePrinciples.some(objeto => objeto.name === 'ACIDO KOJICO') ||
      prod.activePrinciples.some(objeto => objeto.name === 'ACIDO RETINOICO') ||
      prod.activePrinciples.some(objeto => objeto.name === 'HIDROQUINONA') ||
      prod.activePrinciples.some(objeto => objeto.name === 'ASCORBIL FOSFATO DE SODIO') ||
      prod.activePrinciples.some(objeto => objeto.name === 'JAROCOL RL - RESORCINA')
    ) {
      console.log('entre a cambiar la base')
      prod.pharmaceuticalForm = 'EMULGEL';
    }
    let percAct = 0;
    prod.activePrinciples.map(act => percAct += Number(act.concentration));
    const percBase = 100 - percAct;
    const unitbase = (percBase * Number(prod.presentation)) / 100;
    const basePrice = baseList.find(base => base.name == prod.pharmaceuticalForm).price * unitbase;
    let activesPrice = 0;
    prod.activePrinciples.map(act => {
      const unitAct = (Number(act.concentration) * Number(prod.presentation)) / 100;
      let activePrice = activeList.find(active => active.name == act.name).price * unitAct;
      activesPrice += activePrice;
    });
    const precio = ((activesPrice + basePrice + fixed.packagingPrice) * fixed.iva) + fixed.labourPrice;
    const finalPrice = Math.round(eval(`(${precio}${fixed.fullPrice}`));
    return finalPrice.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });;
  }

  const calcPatPrice = (prod) => {
    let percAct = 0;
    prod.activePrinciples.map(act => percAct += Number(act.concentration));
    const percBase = 100 - percAct;
    const unitbase = (percBase * Number(prod.presentation)) / 100;
    const basePrice = baseList.find(base => base.name == prod.pharmaceuticalForm).price * unitbase;
    let activesPrice = 0;
    prod.activePrinciples.map(act => {
      const unitAct = (Number(act.concentration) * Number(prod.presentation)) / 100;
      let activePrice = activeList.find(active => active.name == act.name).price * unitAct;
      activesPrice += activePrice;
    });
    const precio = ((activesPrice + basePrice + fixed.packagingPrice) * fixed.iva) + fixed.labourPrice;
    const finalPrice = Math.round(eval(`(${precio}${fixed.fullPrice}`));
    const patientPrice = Math.round(eval(`${finalPrice}${fixed.patientPrice}`));
    return patientPrice.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });;
  }

  const handleDelete = (index) => {
    let array = products.splice(index + 1, 1);
    let array2 = quantity.splice(index + 1, 1);
    setProducts(array);
    setQuantity(array2);
  }

  const handleSendOrder = () => {

  }

  useEffect(() => {
    validateToken();
    getProducts();
    getFixedData();
  }, []);

  return (
    <div style={appStyles}>
      <Header />
      {isLoading && (
        <Spinner></Spinner>
      )}
      <section className="container mt-5">
        <div style={{ backgroundColor: '#bed0ff', padding: '15px', borderRadius: '12px', minHeight: 500 }}>
          <h2 className="text-center" style={{ color: '#092f62', marginTop: '20px' }}>Productos</h2>
          <hr />
          {showModal ?
            <><ModalAddProduct open={showModal} handleClose={handleCloseModal} activeList={activeList} baseList={baseList} />
              {/* <ModalAddProducts
                addComponent={addComponent}
                handleSelectData={handleSelectData}
                selecData={selecData}
                show={showResume}
                handleShow={handleShowResume}
                handleAddPrincipiosItem={handleAddPrincipiosItem}
                base={base}
                principios={principios}
                handledatachild={handledatachild}
                handleShowModal={handleShowModal} /> */}
            </>
            : showResume &&
            <ResumePedido handleShow={handleShowResume} selecData={selecData} />
          }
          {products.map((prod, index) => (
            <div key={index}>
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
                marginTop="15px"
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                <Box flex={1}>
                  <Box marginBottom={isSmallScreen ? '15px' : '40px'}>
                    <Typography variant="h6" margin='normal'>{`Producto ${index + 1} ${prod.pharmaceuticalForm} - ${prod.presentation}g`}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" paddingRight="25px" marginBottom="10px" flexDirection={isSmallScreen ? 'column' : 'row'}>
                    <Typography fontWeight="bold">Precio tienda:</Typography> {calcFullPrice(prod)}
                  </Box>
                  <Box display="flex" justifyContent="space-between" paddingRight="25px" marginBottom="10px" flexDirection={isSmallScreen ? 'column' : 'row'}>
                    <Typography fontWeight="bold">Precio paciente:</Typography> {calcPatPrice(prod)}
                  </Box>
                </Box>
                <Box flex={1}>
                  <Box>
                    <Box display="flex" justifyContent="space-between" paddingRight="25px" marginBottom="10px" flexDirection={isSmallScreen ? 'column' : 'row'}>
                      <Typography fontWeight="bold">Nombre del paciente:</Typography> {prod.patientName}
                    </Box>
                    <Box display="flex" justifyContent="space-between" paddingRight="25px" marginBottom="10px" flexDirection={isSmallScreen ? 'column' : 'row'}>
                      <Typography fontWeight="bold">Nombre del doctor:</Typography> {prod.doctor}
                    </Box>
                  </Box>
                  <TextField
                    margin='normal'
                    sx={{ minWidth: "200px" }}
                    label="Cantidad de unidades"
                    type="number"
                    value={quantity[index]}
                    onChange={(e) => setQuantity(e.target.value, index)}
                  />
                </Box>
                <Box alignSelf="flex-start">
                  <IconButton onClick={() => handleDelete(index)} color='error'>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </div>
          ))}
          <Box
            style={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleShowModal}
              sx={{ marginRight: '5px' }}
            >
              Agregar producto
            </Button>
            {products.length >= 1 && (
              <Button
                variant="contained"
                color="success"
                onClick={handleSendOrder}
              >
                Enviar pedido
              </Button>
            )}
          </Box>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
