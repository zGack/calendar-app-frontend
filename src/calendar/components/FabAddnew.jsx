import { addHours } from "date-fns";
import { useCalendarStore, useUiStore } from "../../hooks"


export const FabAddnew = () => {

  const {openDateModal} = useUiStore();
  const {setActiveEvent} = useCalendarStore();

  const handleClickNew = (title) => {
    setActiveEvent({
      title: '',
      notes: '',
      start: new Date(),
      end: addHours(new Date(), 2),
      bgColor: '#fafafa',
      user: {
        _id: '123',
        name: 'Sebastian'
      }
    });
    openDateModal(title);
  }

  return (
    <button
      className="btn btn-primary fab"
      onClick={() => handleClickNew('Nuevo')}
    >
      <i className="fas fa-plus"></i>

    </button>
  )
}
