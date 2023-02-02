import { useDispatch, useSelector } from "react-redux"
import calendarApi from "../api/calendarApi";
import { onLogoutCalendar } from "../store";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store/auth/authSlice";


export const useAuthStore = () => {

  const {status, user, errorMessage} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const startLogin = async({email, password}) => {
    dispatch(onChecking()); 

    try {
      const {data} = await calendarApi.post('/auth', {email, password});

      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime());
      
      dispatch(onLogin({name: data.name, uid: data.uid}));
    } catch (error) {
      console.log({error});
      dispatch(onLogout('Email y/o password incorrectas'));

      setTimeout(() => {
        dispatch(() => {
          dispatch(clearErrorMessage());
        }, 10);
      })
    }
  }

  const startRegister = async({name, email, password}) => {
    dispatch(onChecking()); 

    try {
      const {data} = await calendarApi.post('/auth/new', {name, email, password});

      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime());
      
      dispatch(onLogin({name: data.name, uid: data.uid}));
    } catch (error) {
      dispatch(onLogout(
        error.response.data?.errors?.password?.msg || 
        error.response.data?.msg
      ));

      setTimeout(() => {
        dispatch(() => {
          dispatch(clearErrorMessage());
        }, 10);
      })
    }
  }

  const checkAuthToken = async() => {
    const token = localStorage.getItem('token');

    if (!token) return dispatch(onLogout());
    
    try {
      const {data} = await calendarApi.get('auth/renew');

      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      dispatch(onLogin({name: data.name, uid: data.uid}));
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout())
    }
  }

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogout());
  }

  return {
    //* Propiedades
    errorMessage,
    status,
    user,

    //* Metodos
    startLogin,
    startRegister,
    startLogout,
    checkAuthToken,
  }
}
