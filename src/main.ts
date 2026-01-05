import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { EnvironmentConfig, initAppConfig } from './app/app.config';
import _ from 'lodash';

console.log(_.shuffle([1, 2, 3, 4, 5]));


fetch('assets/config/app-config.json')
  .then((res) => res.json() as Promise<EnvironmentConfig>)
  .then((config) =>
    bootstrapApplication(AppComponent, initAppConfig(config)).catch((err) =>
      console.error(err)
    )
  );
