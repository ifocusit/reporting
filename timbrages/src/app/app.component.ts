import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {bindCallback} from "rxjs/internal/observable/bindCallback";
import {CameraResultType, FilesystemDirectory, Geolocation, GetUriResult, Plugins} from "@capacitor/core";
import {map} from "rxjs/operators";
import {CameraOptions, GeolocationPosition} from "@capacitor/core/dist/esm/core-plugin-definitions";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'Timbrage Application';

  coords = null;
  image: SafeResourceUrl;
  path: GetUriResult;
  message: string;

  constructor(private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.watchPosition().subscribe(coords => this.coords = coords);
  }

  watchPosition(): Observable<any> {
    return bindCallback(Geolocation.watchPosition)({requireAltitude: true}).pipe(
      map(position => Array.isArray(position) ? position[0] : position),
      map((position: GeolocationPosition) => position.coords)
    );
  }

  share(): void {
    const {Share} = Plugins;

    Share.share({
      title: 'See cool stuff',
      text: 'Really awesome thing you need to see right meow',
      url: this.path.uri,
      dialogTitle: 'Share with buddies'
    })
      .then(() => this.message = "shared !")
      .catch((err) => this.message = err);
  }

  grabPhoto() {

    const {Camera, Filesystem} = Plugins;

    Camera.getPhoto(<CameraOptions>{
      quality: 100,
      resultType: CameraResultType.Uri
    })
      .then((photo) => {
          Filesystem.readFile({
            path: photo.path
          })
            .then((result) => {
              let date = new Date(),
                time = date.getTime(),
                fileName = time + '.jpeg';

              Filesystem.writeFile({
                data: result.data,
                path: fileName,
                directory: FilesystemDirectory.Documents
              })
                .then((result) => {
                  Filesystem.getUri({
                    directory: FilesystemDirectory.Documents,
                    path: fileName
                  })
                    .then((result) => {
                      this.path = result;
                    }, (err) => {
                      this.message = err;
                    });
                }, (err) => {
                  this.message = err;
                });
            }, (err) => {
              this.message = err;
            });
        }, (err) => {
          this.message = err;
        }
      );
  }


  takePhoto() {
    const {Camera} = Plugins;
    Camera.getPhoto(<CameraOptions>{
      quality: 100,
      resultType: CameraResultType.Base64
    })
      .then(photo => this.image = this.sanitizer.bypassSecurityTrustResourceUrl(photo && (photo.webPath)));
  }

  get imageSrc(): string {
    return this.path.uri.replace('file://', '_capacitor_')
  }
}
