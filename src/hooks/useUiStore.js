import { useDispatch, useSelector } from "react-redux"
import { onCloseDateModal, onOpenDateModal } from "../store";


export const useUiStore = () => {

  const dispatch = useDispatch();

  const {
    isDateModalOpen,
    modalTitle
  } = useSelector(state => state.ui);

  const openDateModal = (title) => {
    dispatch(onOpenDateModal(title));
  }

  const closeDateModal = () => {
    dispatch(onCloseDateModal());
  }
  
  return {
    // Props
    isDateModalOpen,
    modalTitle,

    // Metodos
    openDateModal,
    closeDateModal,
  }
}
