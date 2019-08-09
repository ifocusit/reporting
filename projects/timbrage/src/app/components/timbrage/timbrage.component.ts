import { Component, OnInit } from '@angular/core';
import { TimesService } from 'projects/commons/src/lib/times/times.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-timbrage',
  templateUrl: './timbrage.component.html',
  styleUrls: ['./timbrage.component.css']
})
export class TimbrageComponent implements OnInit {
  public times$: Observable<any>;

  constructor(private timesService: TimesService) {}

  ngOnInit() {
    this.times$ = this.timesService.read('2019-07');
  }
}
