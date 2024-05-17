import { Component } from '@angular/core';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent {
  username: string = '';
  repositories: any[] = [];
  loading: boolean = false;
  error: string = '';
  userProfile: any = {};
  currentPage: number = 1;
  pageSize: number = 10; // Default page size
  pageSizeOptions: number[] = [10, 20, 50, 100]; // Page size options

  constructor(private githubService: GithubService) {}

  searchUser() {
    this.loading = true;
    this.error = '';

    this.githubService.getUser(this.username)
      .subscribe(
        (data: any) => {
          this.userProfile = data;
          this.loading = false;
          this.currentPage = 1; // Reset current page when searching for a new user
          this.searchRepositories();
        },
        (error) => {
          this.error = 'User not found';
          this.repositories = [];
          this.loading = false;
        }
      );
  }

  getLanguageKeys(languages: any): string[] {
    return Object.keys(languages);
  }

  searchRepositories() {
    this.loading = true;
    this.githubService.getUserRepositories(this.username, this.currentPage, this.pageSize)
      .subscribe(
        (data: any[]) => {
          this.repositories = data;
          this.loading = false;

          // Fetch languages for each repository
          this.repositories.forEach(repo => {
            this.githubService.getRepositoryLanguages(repo.languages_url)
              .subscribe(
                (languages: any) => {
                  // Update the repository object with languages
                  repo.languages = languages;
                },
                (error) => {
                  console.error('Error fetching languages:', error);
                }
              );
          });
        },
        (error) => {
          this.error = 'Error fetching repositories';
          this.repositories = [];
          this.loading = false;
        }
      );
  }

  nextPage() {
    this.currentPage++;
    this.searchRepositories();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchRepositories();
    }
  }

  changePageSize() {
    this.currentPage = 1; // Reset current page when changing page size
    this.searchRepositories();
  }
}
