import { fireEvent, render, screen } from "@testing-library/react"
import { FabDelete } from "../../../src/calendar/components/FabDelete"
import { useCalendarStore } from "../../../src/hooks";

jest.mock('../../../src/hooks/useCalendarStore');

describe('Pruebas en <FabDelelete />', () => {

  const mockStartDeletingEvent = jest.fn()

  beforeEach(() => jest.clearAllMocks());

  test('debe mostrar el componente correctamente', () => {

    useCalendarStore.mockReturnValue({
      hasEventSelected: false,
    })

    render(<FabDelete />);

    const btn = screen.getByLabelText('btn-delete');

    expect(btn.classList).toContain('btn')
    expect(btn.classList).toContain('btn-danger')
    expect(btn.classList).toContain('fab-danger')
    expect(btn.style.display).toBe('none')

  })

  test('debe mostrar el boton si hay un evento seleccionado', () => {

    useCalendarStore.mockReturnValue({
      hasEventSelected: true
    })

    render(<FabDelete />);

    const btn = screen.getByLabelText('btn-delete');

    expect(btn.style.display).toBe('')

  })

  test('debe llamar startDeletingEvent si hay un evento activo', () => {

    useCalendarStore.mockReturnValue({
      hasEventSelected: true,
      startDeleteEvent: mockStartDeletingEvent
    })

    render(<FabDelete />);

    const btn = screen.getByLabelText('btn-delete');

    fireEvent.click(btn);

    expect(mockStartDeletingEvent).toHaveBeenCalled();

  })
})