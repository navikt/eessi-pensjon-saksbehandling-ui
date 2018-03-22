import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AppConfig {

  appConfig;

  constructor(private http: HttpClient) {
  }

  public load() {
    return this.http.get('assets/appconfig.json').toPromise().then(x => {
        this.appConfig = x;
        console.log('AppConfig loaded:');
        console.log(this.appConfig);
      }
    );
  }
}
