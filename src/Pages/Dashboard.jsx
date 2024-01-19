import React from 'react'
import Header from '../Components/Header'
import { SectionProd } from '../Components/SectionProd'

function Dashboard() {
  const appStyles = {
    backgroundImage: 'url(./src/assets/hero-img.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    minWidth: '100vw',
    position: 'absolute',
    top: '51px',
    right: '0px',
  };
  const principios = [
    {
      id: 'P190010',
      title: 'UVINULT T 150',
      description: '275'
    },
    {
      id: 'E220002',
      title: 'Vaselina blanca',
      description: '17'
    },
    {
      id: 'E0034',
      title: 'Vitamina A',
      description: '825'
    },
    {
      id: 'P190010',
      title: 'UVINULT T 150',
      description: '275'
    },
    {
      id: 'E220002',
      title: 'Vaselina blanca',
      description: '17'
    },
    {
      id: 'E0034',
      title: 'Vitamina A',
      description: '825'
    }
  ]
  const base = [
    {
      id:'',
      title: 'Base Shower',
      description: 'cost: 12'
    },
    {
      id:'',
      title: 'Base Emulgel HQ',
      description: 'cost: 45'
    },
    {
      id:'',
      title: 'Base AR',
      description: 'cost: 35'
    },
    {
      id:'',
      title: 'Base crema ACS',
      description: 'Teo: 225, cost: 18 %PVP:90'
    },
    {
      id:'',
      title: 'Agua Purificada',
      description: 'cost 10'
    }
  ]
  const envases = [
    {
      id:'',
      title: 'ENVASE DE VIDRIO 3340 FLINT ROSCA',
      description: 'cost: 139'
    },
    {
      id:'',
      title: 'ENVASE DE VIDRIO MB30R FLINT TO',
      description: 'cost: 39.556'
    },
    {
      id:'',
      title: 'ENVASE DE VIDRIO MB40R FLINT TO',
      description: 'cost: 39.556'
    }
  ]
  return (
    <div style={appStyles}>
      <Header/>
      <section className="container mt-3 d-flex flex-column justify-content-evenly" style={{backgroundColor: 'rgba(242, 219, 213, 0.9)'}}>
          <SectionProd data={principios} title={'Principios activos'}/>
          <SectionProd data={base} title={'Bases'}/>
          <SectionProd data={envases} title={'Envases'}/>
        <button type="submit" className="btn text-light" style={{backgroundColor:'#3E0070', position: 'fixed', bottom: 20, right: 10}}>Calcular</button>
      </section>
    </div>
  )
}

export default Dashboard
