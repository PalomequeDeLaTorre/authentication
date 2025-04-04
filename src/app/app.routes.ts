import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './auth.guard';
import { EstudianteComponent } from './pages/estudiante/estudiante.component';
import { CarreraComponent } from './pages/carrera/carrera.component';
import { EstudianteinscritoComponent } from './pages/estudianteinscrito/estudianteinscrito.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'home',
        component: HomeComponent, 
        canActivate: [authGuard],
        children: [
            {
                path: 'carrera',
                component: CarreraComponent,
                
            },
            {
                path: 'estudiante',
                component: EstudianteComponent,
            },
            {
                path: 'estudianteinscrito',
                component: EstudianteinscritoComponent,

            },
            {
                path: '',
                redirectTo: 'carrera',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'register',
        component: RegisterComponent,

    },
    {
        path: '**',
        redirectTo: ''
    }
];