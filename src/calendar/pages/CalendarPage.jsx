import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Navbar, CalendarEvent, CalendarModal, FabAddnew, FabDelete } from "../"
import { localizer, getMessagesES } from '../../helpers';
import { useEffect, useState } from 'react';
import { useAuthStore, useUiStore } from '../../hooks';
import { useCalendarStore } from '../../hooks';

export const CalendarPage = () => {

  const {openDateModal} = useUiStore();
  const {events, setActiveEvent, startLoadingEvents} = useCalendarStore();
  const {user} = useAuthStore();

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');

  const eventStyleGetter = (event, start, end, isSelected) => {

    const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid);

    const style = {
      backgroundColor: isMyEvent ? '#347CF7': '#465660',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }

    return {
      style
    }
  }

  useEffect(() => {
    startLoadingEvents();
  }, [])
  

  const onDoubleClick = (event) => {
    openDateModal('Editar');
  }

  const onSelect = (event) => {
    setActiveEvent(event);
  }

  const onViewChanged = (event) => {
    localStorage.setItem('lastView', event);
    setLastView(event);
  }
  
  return (
    <>
      <Navbar/>
      <Calendar
        culture='es'
        localizer={localizer}
        defaultView={lastView}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 80px)' }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
      />
      <CalendarModal title="Editar" />
      <FabAddnew />
      <FabDelete />
    </>
  )
}
