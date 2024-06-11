import { Component, Input } from '@angular/core';
import { IUserGroups } from '../../interfaces/iuser-groups.interface';

@Component({
  selector: 'app-group-info-card',
  standalone: true,
  imports: [],
  templateUrl: './group-info-card.component.html',
  styleUrl: './group-info-card.component.css'
})
export class GroupInfoCardComponent {
  @Input() infoGroup!: IUserGroups;

  formatAmount(amount: number | undefined): string {
    if (amount === undefined) {
      return '';
    } else {
      amount = Math.round((amount + Number.EPSILON) * 100) / 100;
    }
    let strAmount: string = amount.toString();
    strAmount = strAmount.replace('.', ',');
    return strAmount + ' €';
  }
}
