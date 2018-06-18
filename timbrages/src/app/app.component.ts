import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {bindCallback} from "rxjs/internal/observable/bindCallback";
import {Geolocation} from "@capacitor/core";
import {map} from "rxjs/operators";
import {GeolocationPosition} from "@capacitor/core/dist/esm/core-plugin-definitions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  coords = null;

  ngOnInit() {
    this.watchPosition().subscribe(coords => this.coords = coords);
  }

  watchPosition(): Observable<any> {
    return bindCallback(Geolocation.watchPosition)({requireAltitude: true}).pipe(
      map(position => Array.isArray(position) ? position[0] : position),
      map((position: GeolocationPosition) => position.coords)
    );
  }
}
