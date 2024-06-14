import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { Error404Component } from './pages/error404/error404.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { GroupDashboardComponent } from './pages/group-dashboard/group-dashboard.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ExpenseListComponent } from './pages/expense-list/expense-list.component';
import { ExpenseViewComponent } from './pages/expense-view/expense-view.component';
import { authGuard } from './common/guards/auth.guard';
import { UpdateUserComponent } from './pages/update-user/update-user.component';
import { GroupFormPageComponent } from './pages/group-form/group-form-page.component';
import { AddGroupMembersPageComponent } from './pages/add-group-members-page/add-group-members-page.component';
import { rolesGuard } from './common/guards/roles.guard';
import { MessagesComponent } from './pages/messages/messages.component';
import { EditMemberComponent } from './components/edit-member/edit-member.component';

export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, 
    children: [
      { path: '', component: UserDashboardComponent },
      { path: 'users/update', component: UpdateUserComponent },
      { path: 'groupform/new', component: GroupFormPageComponent },
      { path: 'groupform/:groupId', component: GroupFormPageComponent, canActivate: [rolesGuard] },
      { path: 'groups/:groupId', component: GroupDashboardComponent, canActivate: [rolesGuard]},
      { path: 'groups/:groupId/invitation', component: AddGroupMembersPageComponent, canActivate: [rolesGuard]},
      { path: 'expenses/:groupId', component: ExpenseListComponent, canActivate: [rolesGuard]},
      { path: 'expenses/:groupId/add', component: ExpenseViewComponent, canActivate: [rolesGuard]},
      { path: 'expenses/:groupId/edit/:expenseId', component: ExpenseViewComponent, canActivate: [rolesGuard]},
      { path: 'messages/:groupId', component: MessagesComponent, canActivate: [rolesGuard]},
      { path: 'members/:groupId/:userId', component: EditMemberComponent},
    ], canActivate: [authGuard]},
  { path: '**', component: Error404Component },
];
