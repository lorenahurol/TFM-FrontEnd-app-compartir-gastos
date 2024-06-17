import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ImemberGroup } from '../../interfaces/imember-group';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';
import { AlertModalService } from '../../services/alert-modal.service';

@Component({
  selector: 'app-edit-member',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './edit-member.component.html',
  styleUrl: './edit-member.component.css'
})
export class EditMemberComponent {

  member!: ImemberGroup;
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  memberForm: FormGroup;
  groupId: string = "";
  userService = inject(UsersService);
  user!: IUser;
  desactivePercent:boolean = true;

  // manejo de la ventana modal de borrado
  alertModalService = inject(AlertModalService);

  constructor() {
    this.memberForm = new FormGroup({
      percent: new FormControl('', [Validators.required]),
      equitable: new FormControl('', [Validators.required])
    }, []);
  }


  ngOnInit()
  {
    console.log(this.activatedRoute.params);
    this.activatedRoute.params.subscribe(async (params: any) => {
      // el groupId viene siempre
      if (params.groupId) {
        this.groupId = params.groupId;
        
      }
      // si viene el expenseId es para editar
      if (params.userId) {

        // Obtener el gasto
        try {
            this.member = await this.userService.getMemberByUserIdByGroupId(Number(this.groupId), Number(params.userId));
            this.user = await this.userService.getUserById(Number(params.userId));

        } catch (error) {
            console.error(error);
        }

        this.memberForm.get('percent')?.setValue(this.member.percent * 100);
        let equi : string = "Si";
        if(this.member.equitable == false){
          equi = "No";
          this.desactivePercent = false;
        }

        this.memberForm.get('equitable')?.setValue(equi);
        
      }
    });

  }

  async getDataForm() {

    let equitable:  boolean= true;
    let percent: number = 0;
    if(this.memberForm.value.equitable == "Si")
    {
      equitable = true;
      percent = 0;
    }
    else
    {
      equitable = false;
      if(this.memberForm.value.percent > 0){
        percent = Number(this.memberForm.value.percent) / 100.0;
      }
      
    }

    this.member.percent = percent;
    this.member.equitable = equitable;

    //Funcion para calcular no pasarse del 100% de los no equitativos
    let percentNoEquitable: number = await this.getTotalPercentNoEquitable();
    if((percentNoEquitable + this.member.percent) > 1)
      {
        this.alertModalService.newAlertModal({
          icon: 'notifications',
          title: 'Problema al eliminar gasto',
          body: `El % es mayor que el 100 entre todos los miembros del grupo`,
          acceptAction: true,
          backAction: false,
        });
      }
      else{
        this.userService.updateMember(this.member);
        this.backGroup();
      }


  }

  checkControl(formControlName: string, validator: string): boolean | undefined {
    return (
      this.memberForm.get(formControlName)?.hasError(validator) &&
      this.memberForm.get(formControlName)?.touched
    );
  }

  backGroup()
  {
    this.router.navigate([`/home/groups/${this.groupId}`]);
  }
  

  changeEquitable()
  {
   
    console.log(this.memberForm.value.equitable);
    if(this.memberForm.value.equitable == "Si"){
      this.desactivePercent = true;
    }
    else if(this.memberForm.value.equitable == "No")
    {
      this.desactivePercent = false;
    }
    else{
      this.desactivePercent = false;
    }
    
  }

  async getTotalPercentNoEquitable()
  {
    let totalPercentnoEqui = 0;
    //Recupero los miembros del grupo
    const members: any[] = await this.userService.getMemberUserByGroup(Number(this.groupId));
    const membersAll: Array<ImemberGroup> = [];

    /* Recorro el array de miembros y busca en el array de gastos por pagador para cruzarlos
     y montar un nuevo array con toda informarcion, usando la interface IMenber-group
     calculo el gasto total del grupo y el numero de usuarios en el grupo.
     */

    let totalE: number = 0;
    for(let mb of members)
    {
      let member : ImemberGroup;
      member = {
        user_id: mb.user_id,
        group_id: mb.group_id,
        totalEx: 0,
        percent: mb.percent,
        equitable: true,
        credit: 0
      }

      if(mb.equitable == 0)
      {
          member.equitable = false;
      }
    
      membersAll.push(member);
    }

    //Calculo los que tienen un porcentaje especifico y no comparten a partes iguales
    const noEquitableMembers : Array<ImemberGroup> = membersAll.filter(m => m.equitable === false && m.user_id != this.user.id);

    if(noEquitableMembers.length > 0)
    {
        totalPercentnoEqui = noEquitableMembers.reduce((accumulator,currentValue) => accumulator + currentValue.percent, 0); 
    }
    
    return totalPercentnoEqui;

  }


}
