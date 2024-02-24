import { useEffect } from 'react';
import Header from '../Components/Header';
import FormAuth from '../Components/FormAuth';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login() {
  const navigate = useNavigate();

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
      navigate('/dashboard');
      return true;
    }
    else {
      navigate('/');
      return false;
    }
  }

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <div style={appStyles}>
      <Header />
      <section className="container d-flex align-items-center" style={{ backgroundColor: '#bed0ff', width: '100%', height: '80vh', marginTop: '60px', borderRadius: '12px' }}>
        <div className="row">
          <div className='col-md-6 d-flex justify-content-center align-items-center' style={{ height: '50%' }}>
            <FormAuth />
          </div>
          <div className="col-md-6 rounded" style={{ height: '50%', paddingRight: '50px' }}>
            <img src="img/portada-todos-proyectos-huden.webp" alt="" className="img-fluid" style={{ borderRadius: '15px' }} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
