import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TestService {
  constructor(private httpClient: HttpClient) {}

  getData(): Observable<any> {
    return this.httpClient.get('/').pipe(catchError(_ => EMPTY));
  }
}
