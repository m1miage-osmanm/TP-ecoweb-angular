import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { TagAPIResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  readonly #httpClient = inject(HttpClient);

  getTags(): Observable<TagAPIResponse> {
    const url1 = `/tags?t=${Date.now()}`;
    const url2 = `/tags?t=${Date.now()}`;

    return this.#httpClient.get<TagAPIResponse>(url1).pipe(
      switchMap(() => this.#httpClient.get<TagAPIResponse>(url2))
    );
  }
}
