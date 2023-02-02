import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import calendarApi from "../../src/api/calendarApi"
import { useAuthStore } from "../../src/hooks"
import { authSlice } from "../../src/store"
import { initialState, notAuthenticatedState } from "../fixtures/authStates"
import { testUserCred } from "../fixtures/testUser"

const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer
    },
    preloadedState: {
      auth: {...initialState}
    }
  })
}

describe('Pruebas en useAuthStore', () => {

  beforeEach(() => localStorage.clear());

  test('debe reggresar los valores por defecto', () => {
    const mockStore = getMockStore({...initialState})

    const {result} = renderHook(() => useAuthStore(), {
      wrapper: ({children}) => <Provider store={mockStore}> {children} </Provider>
    });
    
    expect(result.current).toEqual({
      errorMessage: undefined,
      status: 'checking',
      user: {},
      startLogin: expect.any(Function),
      startRegister: expect.any(Function),
      startLogout: expect.any(Function),
      checkAuthToken: expect.any(Function)
    })
  })

  test('startLogin debe realizar el login correctamente', async() => {

    const mockStore = getMockStore({...notAuthenticatedState});

    const {result} = renderHook(() => useAuthStore(), {
      wrapper: ({children}) => <Provider store={mockStore}> {children} </Provider>
    })

    await act(async() => {
      await result.current.startLogin(testUserCred);
    })

    const {errorMessage, status, user} = result.current;

    expect({errorMessage, status, user}).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: {name: testUserCred.name, uid: testUserCred.uid}
    })

    expect(localStorage.getItem('token')).toEqual(expect.any(String));
    expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));
    
  })

  test('startLogin debe de fallar la autenticacion', async() => {

    const mockStore = getMockStore({...notAuthenticatedState});

    const {result} = renderHook(() => useAuthStore(), {
      wrapper: ({children}) => <Provider store={mockStore}> {children} </Provider>
    })

    await act(async() => {
      await result.current.startLogin({email: testUserCred.email, password: '123'});
    })

    const {errorMessage, status, user} = result.current;
    
    expect(localStorage.getItem('token')).toBe(null);

    expect({errorMessage, status, user}).toEqual({
      errorMessage: 'Email y/o password incorrectas',
      status: 'not-authenticated',
      user: {}
    })

    await waitFor(
      () => expect(result.current.errorMessage).toBe(undefined)
    );

  })


  test('startRegister debe cerar un usuario', async() => {
    const newUser = {name: 'new user',email: 'algo@mail.com', password: '321'}

    const mockStore = getMockStore({...notAuthenticatedState});


    const {result} = renderHook(() => useAuthStore(), {
      wrapper: ({children}) => <Provider store={mockStore}> {children} </Provider>
    })

    const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
      data: {
        ok: true,
        uid: '123456',
        name: 'new user',
        token: 'ABC-123'
      }
    })

    await act(async() => {
      await result.current.startRegister(newUser);
    })
    
    const {errorMessage, status, user} = result.current;

    expect({errorMessage, status, user}).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: {name: 'new user', uid: '123456'}
    })

    spy.mockRestore();

  })

  test('startRegister debe fallar en la creacio', async() => {

    const mockStore = getMockStore({...notAuthenticatedState});

    const {result} = renderHook(() => useAuthStore(), {
      wrapper: ({children}) => <Provider store={mockStore}> {children} </Provider>
    })

    await act(async() => {
      await result.current.startRegister(testUserCred);
    })
    
    const {errorMessage, status, user} = result.current;

    expect({errorMessage, status, user}).toEqual({
      errorMessage: 'El correo ya existe',
      status: 'not-authenticated',
      user: {}
    })

  })

  test('checkAuthToken debe fallar si no hay token', async() => {
    const mockStore = getMockStore({...notAuthenticatedState});

    const {result} = renderHook(() => useAuthStore(), {
      wrapper: ({children}) => <Provider store={mockStore}> {children} </Provider>
    })

    await act(async() => {
      await result.current.checkAuthToken();
    })
    
    const {errorMessage, status, user} = result.current;

    expect({errorMessage, status, user}).toEqual({
      errorMessage: undefined,
      status: 'not-authenticated',
      user: {}
    })
   
  })


  test('checkAuthToken debe autenticar el usuario si hay token', async() => {
    const {data} = await calendarApi.post('/auth', testUserCred);
    localStorage.setItem('token',data.token);

    const mockStore = getMockStore({...initialState});

    const {result} = renderHook(() => useAuthStore(), {
      wrapper: ({children}) => <Provider store={mockStore}> {children} </Provider>
    })

    await act(async() => {
      await result.current.checkAuthToken();
    })
    
    const {errorMessage, status, user} = result.current;

    expect({errorMessage, status, user}).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: { name: 'test_user', uid: '62d5c6a6efe3bee8670a8fde'}
    })

  })
})