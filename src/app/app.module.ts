import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { Login } from '../pages/login/login';

import {StorageService} from '../providers/storage-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ValidateUsername} from '../directives/validate.username';
import {ValidatePassword} from '../directives/validate.password';
import {HttpService} from "../providers/http-service";
import {HttpModule, JsonpModule} from '@angular/http';
import {DatePipe} from "@angular/common";
import {Dialogs} from "@ionic-native/dialogs"
import {AccountBookPage} from "../pages/AccountBook/accountBookPage";
import {CreateAccount} from "../pages/createAccount/create-account"
import {BillAdd} from "../pages/bill-add/bill-add";
import {ValidateMoney} from "../directives/validate.money"
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    Login,
    ValidateUsername,
    ValidatePassword,
    ValidateMoney,
    AccountBookPage,
    CreateAccount,
    BillAdd
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    Login,
    AccountBookPage,
    CreateAccount,
    BillAdd
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePipe,
    Dialogs,
    HttpService,
    StorageService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
