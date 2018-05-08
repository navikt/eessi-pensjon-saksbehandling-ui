import { HttpClient }            from '@angular/common/http';
import { Injectable }            from '@angular/core';
import { Observable, of }        from 'rxjs';
import { catchError, tap }       from 'rxjs/operators';
import { AppConfig }             from '../environments/appconfig';
import { BUC, Institution, SED } from './models';

@Injectable()
export class EessiFagmodulBackendService {

    backendUrl: string;

    constructor(private http: HttpClient, private config: AppConfig) {
        this.backendUrl = config.appConfig['eessiFagmodulUrl'];
        // Strip trailing slash
        this.backendUrl = this.backendUrl.replace(/\/$/, '');
        console.log(`Backend url set to: ${this.backendUrl}`);
    }

    getInstitutions(): Observable<Institution[]> {
        const url = `${this.backendUrl}/institutions`;
        console.log(`Fetching all institutions from: ${url}`);
        return this.http.get<Institution[]>(url).pipe(
            tap((res) => console.log(res)),
            catchError(this.handleError('getInstitutions', []))
        );
    }

    getBucs(): Observable<BUC[]> {
        const url = `${this.backendUrl}/bucs`;
        console.log(`Fetching BUC's for institution (${url})`);
        return this.http.get<BUC[]>(url).pipe(
            tap((res) => console.log(res)),
            catchError(this.handleError('getBucsForInstitution', []))
        );
    }

    getSeds(): Observable<SED[]> {
        console.log(`Fetching SED's`);
        return this.http.get<SED[]>(`${this.backendUrl}/seds`).pipe(
            tap((res) => console.log(res)),
            catchError(this.handleError('getSeds', []))
        );
    }

    ping(): Observable<any> {
        console.log('Pinging backend...');
        return this.http.get(this.backendUrl + '/internal/ping').pipe(
            tap((res) => console.log(`\tResponse: ${res}`)),
            catchError(this.handleError('ping'))
        );
    }

    isalive(): Observable<any> {
        return this.http.get(this.backendUrl + '/internal/isalive');
    }

    isready(): Observable<any> {
        return this.http.get(this.backendUrl + '/internal/isready');
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            console.error(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
}
