import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { Error404Component } from './pages/error404/error404.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { GroupDashboardComponent } from './pages/group-dashboard/group-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: UserDashboardComponent, children: [
      {
        path: 'groups/:groupId', component: GroupDashboardComponent
      },
  ]},
  { path: '**', component: Error404Component },
];
