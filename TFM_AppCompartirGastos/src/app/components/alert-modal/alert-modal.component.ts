import { Component,  Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface IAlertData {
  icon?: string;
  title?: string;
  body?: string | unknown;
  acceptAction?: boolean;
  backAction?: boolean
}


@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.css',
})
export class AlertModalComponent {
  modalData: IAlertData

  @Output() sendModalAccept: EventEmitter<boolean> = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IAlertData,
    private dialogRef: MatDialogRef <AlertModalComponent>
  ) {
    this.modalData = data;
  }

  // Emisión de un evento tras el click en el botón Aceptar y cierre de la ventana
  modalAcceptFunction(): void {
    if (this.modalData.acceptAction) {
      this.sendModalAccept.emit(true);
      this.dialogRef.close();
    }
  }
}
