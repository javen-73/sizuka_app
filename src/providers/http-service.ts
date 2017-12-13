import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';
import {LoadingController, Loading, ToastController, AlertController} from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import { StorageService } from "./storage-service";
import {ResultEntity} from "../domain/ResultEntity";
import {Constants} from "../domain/Constants";
import { Dialogs } from '@ionic-native/dialogs';
import {User} from "../domain/User";

@Injectable()
export class HttpService {
  hostUrl:string = "http://172.20.10.159:7373";
  TIME_OUT:number = 30000;
  constructor(
    private http: Http,
    public loadingCtrl: LoadingController ,
    public storageService:StorageService,
    public toastCtrl: ToastController,
    public dialogs: Dialogs,
    public alertCtrl:AlertController
  ) {
    //this.local = new Storage(LocalStorage);
  }

  public alert(msg:string,title?:string){
    if(title==null) title='提示';
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['确定']
    });
    alert.present();
  }
  public layer(msg:string,title?:string) {
    if(title==null) title='提示';
    this.dialogs.alert(msg,title);
  }

  public loading():Loading{
    let loader = this.loadingCtrl.create({
      spinner:"dots",
      content:"loading...",
      dismissOnPageChange:true, // 是否在切换页面之后关闭loading框
      showBackdrop:false //是否显示遮罩层
    });
    return loader;
  }

  /**带身份验证的get请求 */
  public httpGetWithAuth(url: string):Promise<ResultEntity> {
    url = `${this.hostUrl}/${url}`;
    var headers = new Headers();
    let token = this.getToken();
    if(token==null) {
      this.alert('异常','Token获取错误');
      return;
    }
    headers.append(Constants.AUTHORIZATION, token);
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url,options).timeout(this.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(err => {
        this.handleError(err);
      });
  }

  /**不需身份验证的get请求 */
  public httpGetNoAuth(url: string) {
    url = `${this.hostUrl}/${url}`;
    var headers = new Headers();
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options).timeout(this.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(err => {
        console.log('访问错误：'+err);
        this.handleError(err);
      });
  }
  /**不带身份验证的post请求 */
  public httpPostNoAuth(url: string, body: any) :Promise<ResultEntity>{
    url = `${this.hostUrl}/${url}`;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, body,options).timeout(this.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(err => {
        this.handleError(err);
      });
  }
  public httpPostWithAuth(url: string, body: any) :Promise<ResultEntity>{
    url = `${this.hostUrl}/${url}`;
    var headers = new Headers();
    let token = this.getToken();
    if(token==null) {
      this.alert('异常','Token获取错误');
      return;
    }
    headers.append('Content-Type', 'application/json');
    headers.append(Constants.AUTHORIZATION, token);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, body,options).timeout(this.TIME_OUT).toPromise()
      .then(res => res.json())
      .catch(err => {
        this.handleError(err);
      });
  }

  private handleError(error: Response) {
    this.alert("服务器连接失败",'提示');
    return Observable.throw(error.json().error || 'Server Error');
  }
  /**当前登录用户 */
  public getCurrUser():User{
    return this.storageService.read<User>(Constants.CURR_USER);
  }

  getToken(){
    let user = this.getCurrUser();
    if(user==null){this.layer('Token错误,请登录重试')}
    return user.token;
  }
}
