
export const events = [
  {
    id: '1',
    start: new Date('2022-02-18 13:00:00'),
    end: new Date('2022-02-18 15:00:00'),
    title: 'Cumpleanos de sebas',
    notes: 'Some text here'
  },
  {
    id: '2',
    start: new Date('2022-11-15 13:00:00'),
    end: new Date('2022-11-15 15:00:00'),
    title: 'Cumpleanos de valen',
    notes: 'Some text here'

  }
]

export const initialState = {
  isLoadingEvents: true,
  events: [],
  activeEvent: null,
}

export const calendarWithEventsSate = {
  isLoadingEvents: false,
  events: [...events],
  activeEvent: null,
}

export const calendarWithActiveEventState = {
  isLoadingEvents: false,
  events: [...events],
  activeEvent: {...events[0]},
}