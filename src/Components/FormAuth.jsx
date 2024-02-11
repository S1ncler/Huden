import React, { useState } from 'react'
import { z, ZodError } from "zod";
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../services/users';
import Spinner from '../Components/spinner';
import { useAuthContext } from '../Hooks/useAuthContext';
import Swal from 'sweetalert2';

function FormAuth({ singUp, handleShow }) {
  const { user } = useAuthContext();
  const { login, isLoading } = useUsers();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const navigate = useNavigate();
  //validaciones con zod
  const signInSchema = z.object({
    email: z.string().email('El email no es válido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .max(60, 'La contraseña debe tener menos de 30 caracteres'),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataLogin = {
      email,
      password,
    };
    try {
      //login
      signInSchema.parse(formDataLogin);
      const res = await login(formDataLogin);
      console.log(res.msg)
      if (res.msg !== 'INCORRECT_USER_DATA' && res.msg !== 'NOT_REGISTERED_IP') {
        navigate('/dashboard');
      }
      else if (res.msg === 'NOT_REGISTERED_IP') {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Estas intentando acceder desde una locacion no autorizada!"
        });
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Usuario o contraseña incorrectos!"
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        // La validación falló, actualiza el estado de los errores
        setError(error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {}));
      }
      console.log('error', error)
    }
  }

  return (
    <form className="d-flex flex-column " style={{ width: '70%' }} onSubmit={handleSubmit}>
      {isLoading && (
        <Spinner></Spinner>
      )}
      <h2 style={{ color: '#092f62', marginTop: '15px', marginBottom: '40px' }}>Inicio de Sesión</h2>
      {
        singUp &&
        <div className="mb-3">
          <label for="exampleInputName" className="form-label text-secondary">Nombre</label>
          <input type="text" className="form-control" id="exampleInputName" value={name} onChange={(e) => setName(e.target.value)} />
          {error?.name && <div className="text-danger">{error?.name}</div>}
        </div>
      }
      <div className="mb-3">
        <label for="exampleInputEmail1" className="form-label text-secondary">Correo electrónico</label>
        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)} />
        {error?.email && <div className="text-danger">{error?.email}</div>}
      </div>
      <div className="mb-5">
        <label for="exampleInputPassword1" className="form-label text-secondary">Contraseña</label>
        <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error?.password && <div className="text-danger">{error?.password}</div>}
      </div>
      <button disabled={isLoading} type="submit" className="btn text-light" style={{ backgroundColor: '#2e2bff' }}>{singUp ? "Registrar" : "Ingresar"}</button>
    </form>
  )
}

export default FormAuth
