import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'books' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'books',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/books/books').then(m => m.BooksComponent)
  },
  {
    path: 'books/:id/borrow',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/borrow/borrow').then(m => m.BorrowComponent)
  },
  { path: '**', redirectTo: 'books' }
];
