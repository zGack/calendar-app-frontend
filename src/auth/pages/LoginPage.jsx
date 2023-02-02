import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useForm } from '../../hooks/useForm';
import './LoginPage.css';

const loginFormFields = {
  loginEmail: '',
  loginPassword: ''
}

const registerFormFields = {
  registerName: '',
  registerEmail: '',
  registerPassword: '',
  registerPasswordC: ''
}


export const LoginPage = () => {

  const {loginEmail, loginPassword, onInputChange:onLoginInputChange} = useForm(loginFormFields);
  const {registerName,registerEmail, registerPassword, registerPasswordC, onInputChange:onRegisterInputChange} = useForm(registerFormFields);

  const {startLogin, startRegister, errorMessage} = useAuthStore();

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    startLogin({email: loginEmail, password: loginPassword});
  }
  
  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    if ( registerPassword !== registerPasswordC) {
      Swal.fire('Error en registro', 'Las password deben coincidir', 'error');
      return;
    }
    startRegister({
      name: registerName, 
      email: registerEmail, 
      password: registerPassword
    });
  }

  useEffect(() => {
    if ( errorMessage !== undefined) {
      Swal.fire('Error en la autenticacion', errorMessage, 'error');
    }
  }, [errorMessage])
  

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-md-6 login-form-1">
          <h3>Ingreso</h3>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Correo"
                name="loginEmail"
                value={loginEmail}
                onChange={onLoginInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                name="loginPassword"
                value={loginPassword}
                onChange={onLoginInputChange}
              />
            </div>
            <div className="d-grip gap-2">
              <input
                type="submit"
                className="btnSubmit"
                value="Login"
              />
            </div>
          </form>
        </div>

        <div className="col-md-6 login-form-2">
          <h3>Registro</h3>
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                name="registerName"
                value={registerName}
                onChange={onRegisterInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Correo"
                name="registerEmail"
                value={registerEmail}
                onChange={onRegisterInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                name="registerPassword"
                value={registerPassword}
                onChange={onRegisterInputChange}
              />
            </div>

            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Repita la contraseña"
                name="registerPasswordC"
                value={registerPasswordC}
                onChange={onRegisterInputChange}
              />
            </div>

            <div className="d-grip gap-2">
              <input
                type="submit"
                className="btnSubmit"
                value="Crear cuenta" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}