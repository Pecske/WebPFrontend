import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User, UserData } from '../models/models';
import { environment } from '../environment';

const TOKEN_KEY = 'auth.token';
const USER_KEY = 'auth.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.baseUrl+'user';

  private tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private userSignal = signal<UserData | null>(this.readUser());

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.tokenSignal());

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, payload)
      .pipe(tap(res => this.persist(res)));
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, payload)
      .pipe(tap(res => this.persist(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  private persist(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.data?.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.data));
    this.tokenSignal.set(res.data?.token);
    this.userSignal.set(res.data);
  }

  private readUser(): UserData | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
