import { useEffect, useState } from 'react';
import { useProducts } from '../services/data';
import { useFixedIps } from '../services/fixed';
import Header from '../Components/Header';
import ModalAddProduct from '../Components/ModalAddProduct';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Spinner from '../Components/spinner';
import { Typography, TextField, Box, useTheme, useMediaQuery, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DatosDialog from '../Components/DataDialog';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { useOrders } from '../services/order';


function Dashboard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { SendOrder, isLoadingOrd } = useOrders();
  const { listAll, isLoading } = useProducts();
  const { GetFixed, GetPercents } = useFixedIps();
  const [activeList, setActiveList] = useState([]);
  const [baseList, setBaseList] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState([]);
  const [fixed, setFixed] = useState({});
  const [repeateds, setRepeateds] = useState([]);
  const [opens, setOpens] = useState([]);
  const [percents, setPercents] = useState([]);


  const handleShowModal = () => {
    setShowModal(!showModal);
  }

  const handleChangeQuantity = (value, index) => {
    // Eliminar ceros no significativos del valor ingresado
    const sanitizedValue = value.replace(/^0+(?=\d)/, '');

    // Convertir el valor a un número entero
    const parsedValue = Number(sanitizedValue);

    // Verificar si el valor es un número válido, no es negativo y no contiene un cero antes del número
    if (!isNaN(parsedValue) && parsedValue >= 0 && sanitizedValue === value) {
      // Crear una copia del array quantity
      const newQuantity = [...quantity];
      // Asignar el nuevo valor al índice correspondiente
      newQuantity[Number(index)] = parsedValue;
      // Actualizar el estado con la nueva copia
      setQuantity(newQuantity);
    }
  }

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
    try {
      const data = await GetPercents();
      if (data) {
        setPercents(data[0].msg.filter(percent => percent.status === true));
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ha habido un error al obtener las ips, intentalo de nuevo o contacta al administrador!",
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
      setProducts([...products, product]);
      setQuantity([...quantity, 1]);
      setShowModal(false);
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

  const calcFullPrice = (prod, index) => {
    const prevBase = prod.pharmaceuticalForm;
    if (
      prod.activePrinciples.some(objeto => objeto.name === 'ARBUTINA') ||
      prod.activePrinciples.some(objeto => objeto.name === 'ACIDO KOJICO') ||
      prod.activePrinciples.some(objeto => objeto.name === 'ACIDO RETINOICO') ||
      prod.activePrinciples.some(objeto => objeto.name === 'HIDROQUINONA') ||
      prod.activePrinciples.some(objeto => objeto.name === 'ASCORBIL FOSFATO DE SODIO') ||
      prod.activePrinciples.some(objeto => objeto.name === 'JAROCOL RL - RESORCINA')
    ) {
      prod.pharmaceuticalForm = 'EMULGEL';
    }
    let percAct = 0;
    prod.activePrinciples.map(act => {      
      const factor = percents.find(percent => percent.asset === act.name);
      percAct += (Number(act.concentration) * (factor ? factor.percentAdjust : 1));
    });
    const percBase = 100 - percAct;
    const unitbase = (percBase * Number(prod.presentation)) / 100;
    const basePrice = baseList.find(base => base.name == prod.pharmaceuticalForm).price * unitbase;
    let activesPrice = 0;
    prod.activePrinciples.map(act => {
      const factor = percents.find(percent => percent.asset === act.name);
      const unitAct = ((Number(act.concentration) * (factor ? factor.percentAdjust : 1)) * Number(prod.presentation)) / 100;
      let activePrice = activeList.find(active => active.name == act.name).price * unitAct;
      activesPrice += activePrice;
    });
    const precio = ((activesPrice + basePrice + fixed.packagingPrice) * fixed.iva) + fixed.labourPrice;
    const finalPrice = Math.round(eval(`(${precio}${fixed.fullPrice}`));
    prod.pharmaceuticalForm = prevBase;
    products[index]['FullPrice'] = finalPrice;
    products[index]['quantity'] = quantity[index];
    return finalPrice
  }

  const calcPatPrice = (prod, index) => {
    let percAct = 0;
    prod.activePrinciples.map(act => {      
      const factor = percents.find(percent => percent.asset === act.name);
      percAct += (Number(act.concentration) * (factor ? factor.percentAdjust : 1));
    });
    const percBase = 100 - percAct;
    const unitbase = (percBase * Number(prod.presentation)) / 100;
    const basePrice = baseList.find(base => base.name == prod.pharmaceuticalForm).price * unitbase;
    let activesPrice = 0;
    prod.activePrinciples.map(act => {      
      const factor = percents.find(percent => percent.asset === act.name);
      const unitAct = ((Number(act.concentration) * (factor ? factor.percentAdjust : 1)) * Number(prod.presentation)) / 100;
      let activePrice = activeList.find(active => active.name == act.name).price * unitAct;
      activesPrice += activePrice;
    });
    const precio = ((activesPrice + basePrice + fixed.packagingPrice) * fixed.iva) + fixed.labourPrice;
    const finalPrice = Math.round(eval(`(${precio}${fixed.fullPrice}`));
    const patientPrice = Math.round(eval(`${finalPrice}${fixed.patientPrice}`));
    products[index]['PatPrice'] = patientPrice;
    return patientPrice
  }

  const handleDelete = (indexToDelete) => {
    setProducts(prevProductos => prevProductos.filter((producto, index) => index !== indexToDelete));
  }

  const encontrarRepetidosConIDs = (array) => {
    const repetidos = {};
    const resultado = [];

    // Iterar sobre el array y contar la frecuencia de cada elemento
    array.forEach((elemento, index) => {
      if (!repetidos[elemento.doctor]) {
        repetidos[elemento.doctor] = [index];
      } else {
        repetidos[elemento.doctor].push(index);
      }
    });

    // Agregar elementos repetidos al resultado
    for (const key in repetidos) {
      if (repetidos[key].length > 1) {
        resultado.push({ elemento: key, ids: repetidos[key] });
      }
    }

    // Agregar elementos no repetidos al resultado
    array.forEach((elemento, index) => {
      if (!repetidos[elemento.doctor] || repetidos[elemento.doctor].length === 1) {
        resultado.push({ elemento: elemento.doctor, ids: [index] });
        delete repetidos[elemento.doctor]; // Eliminar elemento no repetido del objeto repetidos
      }
    });

    return resultado;
  }

  const handleSendOrder = () => {
    const repeated = encontrarRepetidosConIDs(products);
    setRepeateds(repeated);
    let ops = [];
    repeated.map(() => ops.push(true));
    setOpens(ops);
  }

  const handleCloseDialog = (doctorDat, indexes, index) => {
    setProducts(prevProducts => {
      // Actualizar el doctorDat para los productos correspondientes
      indexes.forEach(ind => {
        prevProducts[ind].doctorDat = doctorDat;
      });
      return [...prevProducts];
    });

    let ops = [...opens];
    ops[index] = false;
    // Actualizar el estado 'opens' para cerrar el diálogo correspondiente
    setOpens(prevOpens => prevOpens.map((open, i) => (i === index ? false : open)));

    // Verificar si se han cerrado todos los diálogos
    if (!ops.some((open) => open === true)) {
      repeateds.map((rep, index) => generatePDF(rep, index === 0 ? true : false))
    }
  };

  const activeToString = (actives) => {
    let cadena = '';
    actives.map((active) => cadena += `${active.name} ${active.concentration}%\n`);
    return cadena;
  }

  const generatePDF = async (rep, reload) => {
    // Crear un nuevo documento PDF
    const doc = new jsPDF();
    const user = localStorage.getItem('user');

    // Agregar imagen y título
    const img = new Image();
    img.src = '/img/huden.arribaderecha.jpg'; // Reemplaza '/ruta/imagen.jpg' con la ruta real de tu imagen
    doc.addImage(img, 'JPG', 10, 5, 55, 25); // Ajusta las coordenadas y el tamaño según sea necesario
    doc.setFontSize(16);
    doc.text('LABORATORIOS HUDEN S.A.S.', 75, 10);
    doc.setFontSize(12);
    doc.text('NIT: 900.375.833-2', 75, 18);
    doc.text('CALLE 79 N° 68 G - 10 LAS FERIAS', 75, 26);
    doc.text('TEL. 457 58 88 - 322 352 91 14', 75, 34);

    const headerStyles = {
      fillColor: [250, 128, 114], // Color salmon
      textColor: [0, 0, 0], // Letras negras
      halign: 'center' // Centrar el texto del encabezado
    };

    // Agregar la tabla al PDF utilizando jspdf-autotable
    doc.autoTable({
      startY: 42,
      head: [['ORDEN DE COMPRA 2024']],
      headStyles: headerStyles // Aplicar estilos al header
    });

    const date = new Date();
    const dateFormated = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Agregar detalles
    doc.setFontSize(13);
    doc.text('FECHA:', 15, 65);
    doc.setFontSize(11);
    doc.text(`${dateFormated}`, 93, 65);
    doc.setFontSize(13);
    doc.text('ORDEN DE COMPRA:', 15, 72);
    doc.setFontSize(11);
    doc.text(`${products[rep.ids[0]].doctorDat.ordenCompra}`, 93, 72);
    doc.setFontSize(13);
    doc.text('CLIENTE:', 15, 79);
    doc.setFontSize(11);
    doc.text(`${products[rep.ids[0]].doctor}`, 93, 79);
    doc.setFontSize(13);
    doc.text('NIT O CÉDULA', 15, 86);
    doc.setFontSize(11);
    doc.text(`${products[rep.ids[0]].doctorDat.nitCedula}`, 93, 86);
    doc.setFontSize(13);
    doc.text('DIRECCIÓN DE ENVÍO Y CIUDAD:', 15, 93);
    doc.setFontSize(11);
    doc.text(`${products[rep.ids[0]].doctorDat.direccion}`, 93, 93);
    doc.setFontSize(13);
    doc.text('TELÉFONO:', 15, 100);
    doc.setFontSize(11);
    doc.text(`${products[rep.ids[0]].doctorDat.telefono}`, 93, 100);
    doc.setFontSize(13);
    doc.text('EMAIL:', 15, 107);
    doc.setFontSize(11);
    doc.text(`${products[rep.ids[0]].doctorDat.email}`, 93, 107);
    doc.setFontSize(13);
    doc.text('USUARIO QUE ENVÍA:', 15, 114);
    doc.setFontSize(11);
    doc.text(`${JSON.parse(user).decoded.name}`, 93, 114);
    doc.setFontSize(9);

    // Agregar tabla
    let tableData = [
      ['ITEM', 'COMPOSICIÓN', 'CANTIDAD', 'PRECIO', 'PRESENTACIÓN Y CONTENIDO', 'NOMBRE PACIENTE', 'TOTAL']
      // Agrega más filas según sea necesario
    ];

    rep.ids.map((i, index) => {
      tableData.push([
        index + 1,
        activeToString(products[i].activePrinciples),
        products[i].quantity,
        products[i].PatPrice.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }),
        `${products[i].pharmaceuticalForm} x ${products[i].presentation}g`,
        products[i].patientName,
        (products[i].PatPrice * products[i].quantity).toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })])
    })

    doc.autoTable({
      startY: 124,
      head: tableData.splice(0, 1),
      body: tableData,
      options: {
        margin: { left: 0 }
      },
      columnStyles: {
        0: { cellWidth: 13 },
        1: { cellWidth: 35 },
        2: { cellWidth: 22 },
        3: { cellWidth: 25 },
        4: { cellWidth: 33 },
        5: { cellWidth: 35 },
        6: { cellWidth: 25 },
      },
      color: 'white'
    });

    // Guardar el PDF en base64
    const base64String = doc.output('datauristring');
    //console.log(base64String);
    let sendProductos = [];
    rep.ids.map((i) => {
      sendProductos.push(products[i])
    })
    const body = {
      code: products[rep.ids[0]].doctorDat.ordenCompra,
      file: base64String.replace(/^data:application\/pdf;filename=generated\.pdf;base64,/, ''),
      products: sendProductos,
      date: dateFormated,
      email: JSON.parse(user).decoded.orderEmail,
      user: JSON.parse(user).decoded.name
    }
    try {
      const res = await SendOrder(body, localStorage.getItem('token') || "");
      if (res) {
        if (res.msg) {
          if (res.msg === 'ORDER_CREATED_AND_EMAIL_SENDED_OK') {
            Swal.fire({
              icon: "success",
              title: "Correcto",
              text: `Se ha enviado correctamente la orden`,
              confirmButtonText: "Ok",
            }).then((result) => {
              if (result.isConfirmed) {
                if (reload) {
                  window.location.reload();
                }
              }
            });

          }
          else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `Ah ocurrido el siguiente error: ${res.msg}, por favor contacte al administrador`,
            });
          }
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Ah ocurrido un error desconosido, por favor intentelo de nuevo mas tarde o contacte al administrador`,
          });
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Ah ocurrido un error desconosido, por favor intentelo de nuevo mas tarde o contacte al administrador`,
      });
    }
  };

  useEffect(() => {
    validateToken();
    getProducts();
    getFixedData();
  }, []);

  return (
    <div style={appStyles}>
      <Header />
      {(isLoading || isLoadingOrd) && (
        <Spinner></Spinner>
      )}
      <section className="container mt-5">
        <div style={{ backgroundColor: '#bed0ff', padding: '15px', borderRadius: '12px', minHeight: 500 }}>
          <h2 className="text-center" style={{ color: '#092f62', marginTop: '20px' }}>Productos</h2>
          <hr />
          {showModal && (
            <ModalAddProduct open={showModal} handleClose={handleCloseModal} activeList={activeList} baseList={baseList} />
          )}
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
                    <Typography fontWeight="bold">Precio tienda:</Typography> {calcFullPrice(prod, index).toLocaleString('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </Box>
                  <Box display="flex" justifyContent="space-between" paddingRight="25px" marginBottom="10px" flexDirection={isSmallScreen ? 'column' : 'row'}>
                    <Typography fontWeight="bold">Precio paciente:</Typography> {calcPatPrice(prod, index).toLocaleString('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
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
                    {prod.activePrinciples.map((active) => (
                      <>
                        <Box display="flex" justifyContent="space-between" paddingRight="25px" marginBottom="10px" flexDirection={isSmallScreen ? 'column' : 'row'}>
                          <Typography >{'• ' + active.name}</Typography> {active.concentration + '%'}
                        </Box>
                      </>
                    ))}
                  </Box>
                  <TextField
                    margin='normal'
                    sx={{ minWidth: "200px" }}
                    label="Cantidad de unidades"
                    type="number"
                    value={quantity[index]}
                    onChange={(e) => handleChangeQuantity(e.target.value, index)}
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
          {repeateds.map((rep, index) => (
            <>
              <DatosDialog
                key={index}
                open={opens[index]}
                doctor={rep.elemento}
                onClose={handleCloseDialog}
                indexs={rep.ids}
                index={index}
              />
            </>
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
