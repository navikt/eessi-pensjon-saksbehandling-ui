import { Component, OnInit }           from '@angular/core';
import { EessiFagmodulBackendService } from '../eessi-fagmodul-backend.service';

@Component({
  selector: 'app-selftest',
  templateUrl: './selftest.component.html',
  styleUrls: [ './selftest.component.css' ]
})
export class SelftestComponent implements OnInit {

  backendIsUp: boolean;

  constructor(private backendService: EessiFagmodulBackendService) {
  }

  ngOnInit() {
    this.backendService.ping()
      .subscribe(() => this.backendIsUp = true);
  }

}
