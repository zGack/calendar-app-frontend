import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";

export const useCalendarStore = () => {

  const dispatch = useDispatch();

  const {
    events,
    activeEvent,
  } = useSelector(state => state.calendar);

  const {user} = useSelector(state => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  }

  const startSavingEvent = async(calendarEvent) => {

    try {
      if (calendarEvent.id) {

        await calendarApi.put(`/event/${calendarEvent.id}`, calendarEvent);

        dispatch(onUpdateEvent({ ...calendarEvent }));
        return;
      }

      const { data } = await calendarApi.post('/event', calendarEvent);

      dispatch(onAddNewEvent({
        ...calendarEvent,
        id: data.evento.id,
        user,
      })); 
      
    } catch (error) {
      console.log(error);      
      Swal.fire('Error al guardar', error.response.data.msg, 'error');
    }

    
  }
  
  const startDeleteEvent = async() => {

    try {

      await calendarApi.delete(`/event/${activeEvent.id}`);

      dispatch(onDeleteEvent());

    } catch (error) {
      console.log(error);      
      Swal.fire('Error al eliminar', error.response.data.msg, 'error');
    }
    
  }

  const startLoadingEvents = async() => {
    try {
      const {data} = await calendarApi.get('/event');
      
      const events = convertEventsToDateEvents(data.eventos);

      dispatch(onLoadEvents(events));

    } catch (error) {
      console.log('Error cargando eventos'); 
      console.log(error);
    }
  }

  return {
    // Props
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    // Metodos
    setActiveEvent,
    startSavingEvent,
    startDeleteEvent,
    startLoadingEvents,

  }
}
