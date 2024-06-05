import { Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertModalComponent, IAlertData } from '../components/alert-modal/alert-modal.component';


@Injectable({
  providedIn: 'root',
})
export class AlertModalService {

  constructor (private alertModal: MatDialog) {
    this.alertModal = alertModal;
  }

  open(modalData: IAlertData) {
    return this.alertModal.open(AlertModalComponent,
      {
        data: modalData,
        width: '300px',
        height: '250px',
        enterAnimationDuration: '200ms',
        exitAnimationDuration: '200ms'
      });
  }
}
