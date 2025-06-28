import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showConfirmationDialog = ({
  title = 'Apakah Anda yakin?',
  text = "Aksi ini tidak dapat dibatalkan!",
  icon = 'warning',
  confirmButtonText = 'Ya, lanjutkan!',
  cancelButtonText = 'Batal',
  onConfirm,
  onCancel,
}) => {
  MySwal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
  }).then((result) => {
    if (result.isConfirmed) {
      if (onConfirm && typeof onConfirm === 'function') {
        onConfirm();
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      if (onCancel && typeof onCancel === 'function') {
        onCancel();
      }
    }
  });
};

export const showSwalAlert = ({
    title = "Informasi",
    text,
    icon = "info",
}) => {
    MySwal.fire({
        title: title,
        text: text,
        icon: icon,
    });
};