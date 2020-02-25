# TWA for Timbrage application

Fiche play store : https://play.google.com/store/apps/details?id=ch.ifocusit.reporting.timbrage
Application open sources : https://github.com/jboz/reporting

https://developers.google.com/digital-asset-links/tools/generator

# dev

To release :

1. upgrade versionCode in _app/build.gradle_
2. _optional_ upgrade versionName in _app/build.gradle_
3. build with :

```bash
./gradlew clean build
```

4. _optional_ manual install :

```bash
adb install app\release\app-release.apk
```

5. upload build apk manually from developper console
