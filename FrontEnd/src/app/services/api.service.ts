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

  create(table: string, data: any) {
    return this.http.post(`${this.apiUrl}/${table}`, data);
  }

  update(table: string, id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${table}/${id}`, data);
  }

  selectByParent(table: string, parentTable: string, parentId: string) {
    return this.http.get(`${this.apiUrl}/${table}/${parentTable}/${parentId}`);
  }
}
