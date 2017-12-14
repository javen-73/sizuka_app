import {Component} from '@angular/core';
import {Events, ModalController, NavController, ViewController} from 'ionic-angular';
import {StorageService} from "../../providers/storage-service";
import {HttpService} from "../../providers/http-service";
import {Login} from "../login/login";

@Component({
  templateUrl:'logout.html'
})
export class Logout{
  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public storageService:StorageService,
              public httpService: HttpService,
              public events:Events,
              public modalCtrl: ModalController){

    this.storageService.clear()
    this.viewCtrl.dismiss()
    let login = this.modalCtrl.create(Login)
    login.present()
  }
}
