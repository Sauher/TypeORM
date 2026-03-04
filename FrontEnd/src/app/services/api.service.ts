import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000/api';

  selectAll(table: string) {
    return this.http.get(`${this.apiUrl}/${table}`);
  }

  delete(table: string, id: string) {
    return this.http.delete(`${this.apiUrl}/${table}/${id}`);
  }
}
