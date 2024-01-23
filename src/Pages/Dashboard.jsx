import React, { useEffect, useState } from 'react'
import { listAll } from '../services/data'
import Header from '../Components/Header'
import { SectionProd } from '../Components/SectionProd'
import ButtonFixed from '../Components/ButtonFixed'
import ModalResume from '../Components/ModalResume'
import { FormItem } from '../Components/FormItem'
import PrincipiosItem from '../Components/PrincipiosItem'


function Dashboard() {
  const [data, setData]=useState()
  const [selecData, setSelectData]= useState()
  const [addComponent, setAddComponent]= useState(1)
  const [show, setShow]=useState(false)
  const [namePatient, setNamePatien]=useState('')
  const [nameDoctor, setNameDoctor]=useState('')
  const [number, setNumber]=useState('')
  const [concentration, setConcentration]=useState('')
  //funcion para abrir-cerrar modal
  const handleShow = ()=>{
    setShow(!show);
  }

  //funcion que maneja la seleccion de los productos a cotizar
  const handleSelectData=(data)=>{
    const formData={
      'Paciente':namePatient.toLowerCase(),
      'Doctor':nameDoctor.toLowerCase(),
      'Presentacion':number.toUpperCase().replace(/[^0-9]/g,""),
    }
    setSelectData((prevData)=>({
      ...prevData,
      [formData.name_doctor]: formData,
      [data.id]: data,
    }))
  }
  //funcion que maneja agregar mas de un principio activo
  const handleAddPrincipiosItem = () => {
    setAddComponent((prevCount) => prevCount + 1);
  };

  //función para traer la data
  const fetchData = async (query = {})=>{
    const data= await listAll(query)
    setData(data);
  }
  const principios = data?.filter((item)=>item.category === 'Activo')
  const base = data?.filter((item)=>item.category === 'Base')
  const fFarmaceutica = data?.filter((item)=>item.category === 'F. Farmaceutica')
  useEffect(()=>{
    fetchData();
  },[])

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

  return (
    <div style={appStyles}>
      <Header/>
      <section className="container mt-5">
        <div style={{backgroundColor: '#bed0ff', padding: '15px', borderRadius:'12px'}}>
        <h2 className="text-center" style={{color:'#092f62', marginTop: '20px'}}>Productos</h2>
          <hr />
          <section>
            <div className="row">
              <div className="col-5">
                <FormItem title={'Nombre'} placeholder={'Paciente'} value={namePatient} setValue={setNamePatien}/>
              </div>
              <div className="col-5">
                <FormItem title={'Nombre'} placeholder={'Doctor'} value={nameDoctor} setValue={setNameDoctor}/>
              </div>
              <div className="col-5">
                <SectionProd data={fFarmaceutica} handleSelectData={handleSelectData} title={'Forma Farmacéutica'}/>
              </div>
              <div className="col-5">
                <SectionProd data={base} handleSelectData={handleSelectData} title={'Base'}/>
              </div>
              <div className="col-5">
                <FormItem title={'Presentación'} placeholder={'Número'} value={number} setValue={setNumber}/>
              </div>
            </div>
            {[...Array(addComponent)].map((_, index) => (
              <PrincipiosItem key={index} principios={principios} handleSelectData={handleSelectData} value={concentration} setValue={setConcentration} />
            ))}
            <button className="btn btn-primary" onClick={handleAddPrincipiosItem}>
              Agregar Más Principios
            </button>
            {selecData && <ButtonFixed title={'Calcular'} handleShow={handleShow}/>}
            {show && <ModalResume handleShow={handleShow} selecData={selecData}/>}
          </section>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
