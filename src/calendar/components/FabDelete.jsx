import { useCalendarStore } from "../../hooks"

export const FabDelete = () => {

  const {startDeleteEvent, hasEventSelected} = useCalendarStore();

  const handleDeleteClick = () => {
    startDeleteEvent();
  }

  return (
    <button
      aria-label="btn-delete"
      className="btn btn-danger fab-danger"
      onClick={handleDeleteClick}
      style={{
        display: hasEventSelected ? '': 'none'
      }}
    >
      <i className="fas fa-trash-alt"></i>

    </button>
  )
}
