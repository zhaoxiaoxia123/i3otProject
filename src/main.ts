import './lib'

// //xxx 添加
// import 'core-js';
// import 'reflect-metadata';
// import 'zone.js/dist/zone';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

if (environment.production) {
  enableProdMode();  //ExpressionChangedAfterItHasBeenCheckedError  这是一个警戒机制，以防止模型数据和UI之间的不一致，从而不会向页面上的用户显示错误或旧的数据。开发环境和生产环境的检测机制是不一样的，在开发环境，当数据模型和ui不一致的可能就会报这个错误
}

platformBrowserDynamic().bootstrapModule(AppModule);
