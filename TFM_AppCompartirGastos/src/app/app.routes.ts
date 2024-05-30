import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { Error404Component } from './pages/error404/error404.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { GroupDashboardComponent } from './pages/group-dashboard/group-dashboard.component';
import { LandingComponent } from './pages/landing/landing.component';
import { GroupFormPageComponent } from './pages/group-form/group-form-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, 
  children: [
      { path: '', component: UserDashboardComponent},
      { path: 'groups/groupForm', component: GroupFormPageComponent },
      { path: 'groups/:groupId', component: GroupDashboardComponent },
    ],
  },
  { path: '**', component: Error404Component },
];
