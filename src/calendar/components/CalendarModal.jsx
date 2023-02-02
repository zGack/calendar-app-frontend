import { addHours, differenceInSeconds } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';

import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useCalendarStore, useUiStore } from '../../hooks';
import { getEnvVariables } from '../../helpers';

registerLocale('es', es);

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

if (getEnvVariables().VITE_MODE !== 'test') {
  Modal.setAppElement('#root');
}

export const CalendarModal = ({title = 'Nuevo'}) => {
  
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {isDateModalOpen, closeDateModal, modalTitle} = useUiStore();
  const {activeEvent, startSavingEvent} = useCalendarStore()

  const [formValues, setFormValues] = useState({
    title: '',
    notes: '',
    start: new Date(),
    end: addHours(new Date(), 2),
  });

  const titleClass = useMemo(() => {
    if (!formSubmitted ) return '';
    return (formValues.title.length > 0)
      ? ''
      : 'is-invalid'
  }, [formValues.title, formSubmitted])

  useEffect(() => {
    if (activeEvent) {
      setFormValues({...activeEvent});
    }
    
  }, [activeEvent])
  

  const handleInputChange = ({target}) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    })
  }

  const handleDateChange = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event
    })
  }

  const handleCloseModal = () => {
    closeDateModal();
  }

  const handleSubmit = async(event) => {
    event.preventDefault();
    setFormSubmitted(true);

    const difference = differenceInSeconds(formValues.end, formValues.start);
    
    if (isNaN(difference) || difference <= 0) {
      Swal.fire('Fechas incorrectas', 'Revisa las fechas ingresadas', 'error');
      return;
    }

    if (formValues.title.length <= 0) return;

    await startSavingEvent(formValues);

    closeDateModal();
    setFormSubmitted(false);
  }

  return (
    <Modal
      isOpen={isDateModalOpen}
      onRequestClose={handleCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <h1> {modalTitle} evento </h1>
      <hr />
      <form className="container" onSubmit={handleSubmit}>

        <div className="form-group mb-2">
          <label>Fecha y hora inicio</label>
          <DatePicker
            selected={formValues.start}
            onChange={(event) => handleDateChange(event, 'start')}
            className="form-control"
            dateFormat="Pp"
            showTimeSelect
            locale='es'
            timeCaption='Hora'
          />
        </div>

        <div className="form-group mb-2">
          <label>Fecha y hora fin</label>
          <DatePicker
            minDate={formValues.start}
            selected={formValues.end}
            onChange={(event) => handleDateChange(event, 'end')}
            className="form-control"
            dateFormat="Pp"
            showTimeSelect
            locale='es'
            timeCaption='Hora'
          />
        </div>

        <hr />
        <div className="form-group mb-2">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${titleClass}`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={formValues.title}
            onChange={handleInputChange}
          />
          <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
        </div>

        <div className="form-group mb-2">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={formValues.notes}
            onChange={handleInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">Información adicional</small>
        </div>

        <button
          type="submit"
          className="btn btn-outline-primary btn-block"
        >
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>

      </form> 
    </Modal>
  )
}
