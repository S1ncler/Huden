import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Hooks/useAuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();
  const admin = user?.decoded?.rol === "ADMIN";

  const logOut = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('resume');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#6e82ff', color: 'white', position: 'fixed', top: 0, left: 0, width: '100%', height: '70px', zIndex: '99' }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src="img/huden-arribaderecha.png" alt="" className="img-fluid" style={{ height: 50, marginRight: '15px' }} />
        </a>
        {
          !user ?
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            :
            <>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse pb-sm-3 pb-md-3 pb-lg-0" id="navbarNav" style={{ backgroundColor: '#6e82ff', color: 'white', width: '100%' }}>
                <ul className="navbar-nav me-auto mb-lg-0">
                  {admin ?
                    <>
                      <li className="nav-item">
                        <a className="nav-link" href="/dashboard" style={{ color: 'white' }}>Cotizador</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/admin" style={{ color: 'white' }}>Usuarios</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/adminProd" style={{ color: 'white' }}>Productos</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/fixedData" style={{ color: 'white' }}>Administracion Datos</a>
                      </li>
                    </>
                    :
                    <></>
                  }
                </ul>
                <div className='d-flex flex-row align-items-center justify-content-center gap-3'>
                  <span>{user?.decoded?.name}</span>
                  <button className='d-flex justify-content-center align-items-center bg-danger text-light' style={{ height: 30, width: 50 }} onClick={logOut}>Salir</button>
                </div>
              </div>

            </>
        }
      </div>
    </nav>
  )
}

export default Header
