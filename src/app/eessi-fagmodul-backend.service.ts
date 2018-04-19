import { HttpClient }      from '@angular/common/http';
import { Injectable }      from '@angular/core';
import { Observable }      from 'rxjs/Observable';
import { of }              from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { AppConfig }       from '../environments/appconfig';

@Injectable()
export class EessiFagmodulBackendService {

  backendUrl: string;

  constructor(private http: HttpClient, private config: AppConfig) {
    this.backendUrl = config.appConfig[ 'eessiFagmodulUrl' ];
    console.log(`Backend url set to: ${this.backendUrl}`);
  }

  ping(): Observable<any> {
    console.log('Pinging backend')
    return this.http.get(this.backendUrl + '/internal/selftest', { responseType: 'json' }).pipe(
      tap((res) => console.log(res)),
      catchError(this.handleError('ping'))
    );
  }

  isalive(): Observable<any> {
    return this.http.get(this.backendUrl + 'internal/isalive');
  }

  isready(): Observable<any> {
    return this.http.get(this.backendUrl + 'internal/isready');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
