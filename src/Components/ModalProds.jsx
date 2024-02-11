// import React, {useState} from 'react'
// import Dropdown from './Dropdown'
// import { useAuthContext } from '../Hooks/useAuthContext';
// import { newData } from '../services/data';

// function ModalProds({handleShow}) {
//   const {user}= useAuthContext();
//   const [code, setCode]=useState('')
//   const [category, setCategory]=useState('ACTIVO')
//   const [name, setName]=useState('')
//   const [price, setPrice]=useState('')
//   const [unit, setUnit]=useState('GR')

//   const handleSubmit = async(e)=>{
//     e.preventDefault();
//     try {
//       const formData ={
//         code,
//         category,
//         name,
//         price,
//         unit
//       }
//       await newData(formData, user.data.msg.token);
//       // window.location.reload()
//     } catch (error) {
//       console.error("Error creating asset: ", error);
//     }
//   }

//   return (
//     <div id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="false" style={{zIndex: "1", position: "absolute", top:210, left:250, maxWidth: "90%", maxHeheight:"80%", backgroundColor: '#97afff', padding: 30, borderRadius: '12px'}}>
//       <div className="d-flex justify-content-center align-items-center">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h1 className="modal-title fs-5" id="exampleModalLabel">Registro Nuevo</h1>
//             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleShow}></button>
//           </div>
//           <div className="modal-body d-flex flex-column justify-content-center align-items-center">
//           <form className="row row-cols-2">
//             <div className="mb-2">
//               <label className="form-label text-secondary">Código</label>
//               <input type="text" className="form-control" value={code} onChange={(e)=>setCode(e.target.value)}/>
//             </div>
//             <div className="mb-2">
//               <label className="form-label text-secondary">Nombre</label>
//               <input type="text" className="form-control" value={name} onChange={(e)=>setName(e.target.value)}/>
//             </div>
//             <div className="mb-2">
//               <label className="form-label text-secondary">Precio</label>
//               <input type="text" className="form-control" value={price} onChange={(e)=>setPrice(e.target.value)} />
//             </div>
//             <div className="mb-2">
//               <label className="form-label text-secondary">Categoría</label>
//               <Dropdown
//               options={['Base', 'Activo']}
//               defaultSlected={category}
//               setValue={setCategory}
//               />
//             </div>
//             <div className="mb-2">
//               <label className="form-label text-secondary">Unidad de medida</label>
//               <Dropdown
//               options={['g', 'ml']}
//               defaultSlected={unit}
//               setValue={setUnit}
//               />
//             </div>
//           </form>
//           <button type="submit" className="btn text-light" style={{backgroundColor:'#2e2bff'}} onClick={handleSubmit}>Agregar</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ModalProds
