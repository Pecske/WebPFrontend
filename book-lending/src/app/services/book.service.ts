import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, BookByIdResult, Loan, PagedResult } from '../models/models';
import { environment } from '../environment';

@Injectable({ providedIn: 'root' })
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = environment.baseUrl+'book';

  list(start: number, count: number): Observable<PagedResult<Book>> {
    const params = new HttpParams()
      .set('start', start)
      .set('count', count);
    return this.http.get<PagedResult<Book>>(`${this.apiUrl}`, { params });
  }

  getById(id: number): Observable<BookByIdResult> {
    return this.http.get<BookByIdResult>(`${this.apiUrl}/${id}`);
  }
}
