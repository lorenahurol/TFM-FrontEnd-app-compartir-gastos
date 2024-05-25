import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { Error404Component } from './pages/error404/error404.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { GroupDashboardComponent } from './pages/group-dashboard/group-dashboard.component';
import { CreateGroupComponent } from './pages/create-group/create-group.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ExpenseListComponent } from './pages/expense-list/expense-list.component';
import { ExpenseViewComponent } from './pages/expense-view/expense-view.component';

export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, 
  children: [
      { path: '', component: UserDashboardComponent},
      { path: 'groups/createGroup', component: CreateGroupComponent },
      { path: 'groups/:groupId', component: GroupDashboardComponent },
      { path: 'expenses/:groupId',  component: ExpenseListComponent },
      { path: 'expenses/:groupId/add', component: ExpenseViewComponent },
      { path: 'expenses/:groupId/edit/:expenseId', component: ExpenseViewComponent },

    ],
  },
  { path: '**', component: Error404Component },
];
