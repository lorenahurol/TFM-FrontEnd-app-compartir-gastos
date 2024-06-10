import { Injectable} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertModalComponent, IAlertData } from '../components/alert-modal/alert-modal.component';


@Injectable({
  providedIn: 'root',
})
export class AlertModalService {
  alertModalRef: MatDialogRef<AlertModalComponent, any> | undefined;

  constructor(private alertModal: MatDialog) {
    this.alertModal = alertModal;
  }

  open(modalData: IAlertData) {
    return this.alertModal.open(AlertModalComponent, {
      data: modalData,
      width: '300px',
      height: '250px',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      disableClose: true,
    });
  }

  /**
   * Opens a new alert modal with the provided data, applying default values for any missing properties.
   *
   * @param {IAlertData} modalDataInput - The input data for the modal.
   * @param {string} [modalDataInput.icon] - The icon to display in the alert modal.
   * @param {string} [modalDataInput.title] - The title of the alert modal.
   * @param {string} [modalDataInput.body] - The body text of the alert modal.
   * @param {boolean} [modalDataInput.acceptAction] - Whether to show the accept action button.
   * @param {boolean} [modalDataInput.backAction] - Whether to show the back action button.
   * @returns {MatDialogRef<AlertModalComponent, any>} The reference to the opened modal.
   */
  newAlertModal(modalDataInput: IAlertData): MatDialogRef<AlertModalComponent, any> {
    // Defino los parametros por defecto en el caso no se reciban en el input
    const defaultModalData: IAlertData = {
      icon: 'warning',
      title: 'Atención!',
      body: `Error desconocido`,
      acceptAction: false,
      backAction: true,
    };
    const modalData = { ...defaultModalData, ...modalDataInput };
    this.alertModalRef = this.open(modalData);
    return this.alertModalRef;
  }
}
