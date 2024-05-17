import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = 'https://api.github.com';
  private authToken = ''; 

  constructor(private http: HttpClient) {}

  // Method to make authenticated requests to GitHub API
  private makeRequest(url: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
    return this.http.get(url, { headers });
  }

  // Method to get user data
  getUser(username: string): Observable<any> {
    const url = `${this.apiUrl}/users/${username}`;
    return this.makeRequest(url);
  }

  // Method to get user repositories
  getUserRepositories(username: string, page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.apiUrl}/users/${username}/repos?page=${page}&per_page=${pageSize}`;
    return this.makeRequest(url);
  }

  // Method to get repository languages
  getRepositoryLanguages(languagesUrl: string): Observable<any> {
    return this.makeRequest(languagesUrl);
  }
}
