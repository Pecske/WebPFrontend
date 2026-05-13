import { Component, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Book, Loan } from '../../models/models';
import { BorrowService } from '../../services/borrow.service';

@Component({
  selector: 'app-borrow',
  imports: [ReactiveFormsModule, RouterLink, SlicePipe],
  templateUrl: './borrow.html',
  styleUrl: './borrow.scss'
})
export class BorrowComponent {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private borrowService = inject(BorrowService)
  protected auth = inject(AuthService);
  private fb = inject(FormBuilder);

  book = signal<Book | null>(null);
  loading = signal(true);
  submitting = signal(false);
  error = signal<string | null>(null);
  loan = signal<Loan | null>(null);

  form = this.fb.nonNullable.group({
    dueDate: [this.defaultDueDate(), [Validators.required]],
    terms: [false, [Validators.requiredTrue]]
  });

  minDate = this.tomorrow();
  maxDate = this.maxAllowedDate();

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('Érvénytelen könyvazonosító');
      this.loading.set(false);
      return;
    }
    this.bookService.getById(id).subscribe({
      next: resp => {
        this.book.set(resp.data);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Könyv nem található');
        this.loading.set(false);
      }
    });
  }

  submit(): void {
    const book = this.book();
    if (!book) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.borrowService.borrow(book.id, this.form.controls.dueDate.value).subscribe({
      next: resp => {
        const borrowInfo : Loan = {
          id: resp.data.id,
          bookId : resp.data.borrowedBook.book.id,
          borrowedAt : resp.data.borrowedBook.borrowDate,
          dueDate : resp.data.borrowedBook.returnDate,
        }
        this.loan.set(borrowInfo);
        this.submitting.set(false);
        if(resp.error){
          this.error.set(resp.error.toString())
        }
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'A kölcsönzés nem sikerült');
        this.submitting.set(false);
      }
    });
  }

  private tomorrow(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }

  private defaultDueDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  }

  private maxAllowedDate(): string {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().slice(0, 10);
  }
}
