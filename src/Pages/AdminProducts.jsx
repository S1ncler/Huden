import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { listAll } from '../services/data'
import ItemProd from '../Components/itemProd'

function AdminProducts() {
  const [data, setData]=useState()
  const fetchData = async (query = {})=>{
    const data= await listAll(query)
    setData(data);
  }
  useEffect(()=>{
    fetchData();
  },[])
  return (
    <div>
      <Header/>
      <div>
        <h2 className="text-center" style={{color:'#3E0070'}}>Página de Administrador de Productos</h2>
        <p className='lead text-muted'>Bienvenid@ a la página de administrador. Aquí
        podrás manejar todos los aspectos de la página web, incluyendo la administración de productos.</p>
        <hr />
        <section id="admin-tools" className="row justify-content-md-center">
        <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Código</th>
              <th scope="col">Categoría</th>
              <th scope="col">Nombre</th>
              <th scope="col">Descripción</th>
              <th scope="col">Precio</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Unidad de medida</th>
              <th scope="col">Editar</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index)=>{
              return(
                <ItemProd key={index} data={item} index={index}/>
              )
            })}
          </tbody>
        </table>
        </div>
        </section>
      </div>
    </div>
  )
}

export default AdminProducts