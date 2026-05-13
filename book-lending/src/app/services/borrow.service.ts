import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookBorrowRequest, BookBorrowResponse, ResponseBase } from '../models/models';
import { environment } from '../environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BorrowService {
  private http = inject(HttpClient);
  private authService = inject(AuthService)
  private apiUrl = environment.baseUrl+'borrow';

  borrow(bookId: number, returnDate: string): Observable<ResponseBase<BookBorrowResponse>> {
    const userId = this.authService.user()?.id ?? 0;
    const request : BookBorrowRequest = {
        userId: userId,
        borrowedBook : {bookId,returnDate}
    }
    return this.http.post<ResponseBase<BookBorrowResponse>>(`${this.apiUrl}/`, request );
  }
}
