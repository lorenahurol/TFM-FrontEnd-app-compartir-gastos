import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ImemberGroup } from '../../interfaces/imember-group';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';

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
        }

        this.memberForm.get('equitable')?.setValue(equi);
        
      }
    });

  }

  getDataForm() {

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

    this.userService.updateMember(this.member);

    this.backGroup();

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
  

  //En progreso
  changeEquitable()
  {
    if(this.memberForm.value.equitable == "Si"){
      this.memberForm.get('percent')?.disabled;
    }
    else if(this.memberForm.value.equitable == "No")
    {
      this.memberForm.get('percent')?.enabled;
    }
    else{
      this.memberForm.get('percent')?.enabled;
    }
    
  }

}
