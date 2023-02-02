import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSlice"
import { authenticatedState, initialState } from "../../fixtures/authStates"
import { testUserCred } from "../../fixtures/testUser";

describe('Pruebas en authSlice', () => { 
  test('debe regresar el estado inicial', () => { 
    expect(authSlice.getInitialState()).toEqual(initialState);
  })

  test('debe realizar un login', () => { 
    const state = authSlice.reducer(initialState, onLogin(testUserCred));
    
    expect(state).toEqual({
      status: 'authenticated',
      user: testUserCred,
      errorMessage: undefined
    })
  })

  test('debe realizar un logout', () => { 
    const state = authSlice.reducer(authenticatedState, onLogout());
    
    expect(state).toEqual({
      status: 'not-authenticated',
      user: {},
      errorMessage: undefined
    })
  })

  test('debe realizar un logout con mensaje', () => { 
    const msg = 'Credenciales no validas';
    const state = authSlice.reducer(authenticatedState, onLogout(msg));
    
    expect(state).toEqual({
      status: 'not-authenticated',
      user: {},
      errorMessage: msg
    })
  })

  test('debe limpiar el mensaje de erro', () => { 
    const msg = 'Credenciales no validas';
    const state = authSlice.reducer(authenticatedState, onLogout(msg));
    const newState = authSlice.reducer(state, clearErrorMessage());

    expect(newState.errorMessage).toBe(undefined);
  })
})