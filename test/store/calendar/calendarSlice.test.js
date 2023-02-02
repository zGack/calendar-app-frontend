import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, calendarWithEventsSate, events, initialState } from "../../fixtures/calendarStates";

describe('Pruebas en calendarSlice', () => {  
  test('debe regresar el estado por defecto', () => { 
    const state = calendarSlice.getInitialState();
    expect(state).toEqual(initialState);
  })

  test('onSetActiveEvent debe activa el evento', () => {
    const state = calendarSlice.reducer(calendarWithEventsSate, onSetActiveEvent(events[0]));
    
    expect(state.activeEvent).toEqual(events[0]);
  })
  
  test('onAddNewEvent debe agregar el evento', () => {
    const newEvent = {
      id: '3',
      start: new Date('2022-11-15 13:00:00'),
      end: new Date('2022-11-15 15:00:00'),
      title: 'Cumpleanos de valen',
      notes: 'Some text here'
    }

    const state = calendarSlice.reducer(calendarWithEventsSate, onAddNewEvent(newEvent));
    expect(state.events).toEqual([...events, newEvent]);
  })

  test('onUpdateEvent debe actualizar el evento', () => {
    const updatedEvent = {
      id: '1',
      start: new Date('2022-11-15 13:00:00'),
      end: new Date('2022-11-15 15:00:00'),
      title: 'Nuevo titulo',
      notes: 'Algo diferente aca'
    }

    const state = calendarSlice.reducer(calendarWithEventsSate, onUpdateEvent(updatedEvent));
    expect(state.events).toContain(updatedEvent);
  })

  test('onDeleteEvent debe borrar el evento activo', () => { 
    const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent());
    expect(state.activeEvent).toBe(null);
    expect(state.events).not.toContain(events[0])
  })

  test('onLoadEvents debe establecer los eventos', () => {
    const state = calendarSlice.reducer(initialState, onLoadEvents(events));
    expect(state.events).toEqual(events);
    expect(state.isLoadingEvents).toBeFalsy();
  })

  test('onLogoutCalendar debe limpiar el estado', () => { 
    const state = calendarSlice.reducer(calendarWithEventsSate, onLogoutCalendar());
    expect(state).toEqual(initialState);
  })
})