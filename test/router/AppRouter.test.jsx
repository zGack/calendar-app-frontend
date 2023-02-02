import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CalendarPage } from "../../src/calendar";
import { useAuthStore } from "../../src/hooks"
import { AppRouter } from "../../src/router/AppRouter";

jest.mock('../../src/hooks/useAuthStore');

jest.mock('../../src/calendar',() => ({
  CalendarPage: () => <h1>CalendarPage</h1>
}));

describe('Pruebas en <AppRouter />', () => {
  const mockCheckAuthToken = jest.fn();

  beforeEach(() => jest.fn());

  test('debe mostrar la pantalla de carga y llamar checkAuthToken', () => {
    useAuthStore.mockReturnValue({
      status: 'checking',
      checkAuthToken: mockCheckAuthToken
    })

    render(<AppRouter />);

    expect(screen.getByText('Cargando...')).toBeTruthy();
    expect(mockCheckAuthToken).toHaveBeenCalled();

  })
  
  test('debe mostrar el login en caso de no estar autenticado', () => {
    useAuthStore.mockReturnValue({
      status: 'not-authenticated',
      checkAuthToken: mockCheckAuthToken
    })

    const {container} = render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText('Ingreso')).toBeTruthy();
    expect(container).toMatchSnapshot();

  })

  test('debe mostrar el calendario si esta autenticado', () => {
    useAuthStore.mockReturnValue({
      status: 'authenticated',
      checkAuthToken: mockCheckAuthToken
    })

    const {container} = render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByText('CalendarPage')).toBeTruthy();
  });
})