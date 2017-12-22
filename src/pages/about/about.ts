import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../providers/http-service";

@Component({
  selector: 'page-list',
  templateUrl: 'about.html'
})
export class About {
  version = ''
  update = []
  createTime = ''

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public httpService: HttpService) {
    httpService.httpGetNoAuth('/version/lastVersion')
      .then(result => {
        let data = result.data;
        this.version = data.version;
        this.update = data.update;
        this.createTime = data.create_time;
      })
      .catch(reason => {
        httpService.alert("没有找到服务器君~")
      })
  }
}
