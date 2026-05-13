import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/models';

@Component({
  selector: 'app-books',
  imports: [RouterLink],
  templateUrl: './books.html',
  styleUrl: './books.scss'
})
export class BooksComponent {
  private bookService = inject(BookService);

  page = signal(1);
  pageSize = signal(6);
  total = signal(0);
  books = signal<Book[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  hasPrev = computed(() => this.page() > 1);
  hasNext = computed(() => this.page() < this.totalPages());
  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.bookService.list(this.page(), this.pageSize()).subscribe({
      next: res => {
        this.books.set(res.data);
        this.total.set(res.paging?.total);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Nem sikerült betölteni a könyveket');
        this.loading.set(false);
      }
    });
  }

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) return;
    this.page.set(page);
    this.load();
  }

  prev(): void {
    this.goTo(this.page() - 1);
  }

  next(): void {
    this.goTo(this.page() + 1);
  }
}
