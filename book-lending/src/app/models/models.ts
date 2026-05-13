export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  data: UserData
}

export interface UserData{
  id: number;
  token: string;
  email: string;
  password: string;
  bookCount : number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  dateOfPublication: Date;
  isBorrowed: boolean;
  description: string;
}

export interface Paging{
  total: number;
  start: number;
  count: number;
}

export interface PagedResult<T> {
  data: T[];
  paging : Paging
}

export interface BookByIdResult{
  data: Book
}

export interface Loan {
  id: number;
  bookId: number;
  borrowedAt: string;
  dueDate: string;
}

export interface BookBorrowRequest{
  userId: number;
  borrowedBook : BookBorrowInfo;
}

export interface BookBorrowInfo{
  bookId: number;
  returnDate: string;
}

export interface BookBorrowResponse{
  id:number,
  userId : number;
  bookCount : number;
  borrowedBook : BookBorrowData
}

export interface BookBorrowData{
  book: Book;
  borrowDate: string;
  returnDate: string;
}

export interface ResponseBase<T>{
  error: ErrorInfo[];
  data : T;
}

export interface ErrorInfo{
  errorMessage : string;
  errorDescription : string;
}
