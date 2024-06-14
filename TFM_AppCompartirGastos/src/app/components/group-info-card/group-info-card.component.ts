import { Component, Input, inject } from '@angular/core';
import { IUserGroups } from '../../interfaces/iuser-groups.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-info-card',
  standalone: true,
  imports: [],
  templateUrl: './group-info-card.component.html',
  styleUrl: './group-info-card.component.css'
})
export class GroupInfoCardComponent {
  @Input() infoGroup!: IUserGroups;

  router = inject(Router);

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

  isGroupHome(): boolean {
    return this.router.url.includes('/home/groups');
  }

  goToGroup(group_id: number) {
    console.log('ir a grupo', group_id);
    this.router.navigate([`/home/groups/${group_id}`]);
  }
}