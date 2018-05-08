import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {EessiFagmodulBackendService} from '../eessi-fagmodul-backend.service';
import {BUC, Institution, SED} from '../models';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private alive: boolean;

  saksId: string;

  institutions: Institution[] = [];
  selectedInstitutionId: number;
  institutionDropdownEnabled = false;

  bucs: BUC[] = [];
  selectedBucId: number;
  bucDropdownEnabled = false;

  seds: SED[] = [];
  selectedSedId: number;
  sedDropdownEnabled = false;

  constructor(private backendService: EessiFagmodulBackendService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.alive = true;
    this.route.queryParams.subscribe(params => {
      this.saksId = params['saksId'];
    });

    TimerObservable.create(0, 10000)
      .takeWhile(() => this.alive && this.institutions.length === 0)
      .subscribe(() => {
        this.backendService.getInstitutions()
          .subscribe((res) => {
            this.institutions = res;
            this.institutionDropdownEnabled = true;
          });
      });

    TimerObservable.create(0, 10000)
      .takeWhile(() => this.alive && this.bucs.length === 0)
      .subscribe(() => {
        this.backendService.getBucs().subscribe(res => {
            this.bucs = res;
            this.bucDropdownEnabled = true;
          }
        );
      });

    TimerObservable.create(0, 10000)
      .takeWhile(() => this.alive && this.seds.length === 0)
      .subscribe(() => {
        this.backendService.getSeds().subscribe(res => {
            this.seds = res;
            this.sedDropdownEnabled = true;
          }
        );
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  onChangeInstitution(event) {
    this.selectedInstitutionId = event.target.value;
  }

  onChangeBuc(event) {
    this.selectedBucId = event.target.value;
  }

  onChangeSed(event) {
    this.selectedSedId = event.target.value;
  }

  onSubmit() {
    console.log('Submit clicked');
  }
}
