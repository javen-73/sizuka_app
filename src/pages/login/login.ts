import {Component} from '@angular/core';
import {Events, ModalController, NavController, ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StorageService} from "../../providers/storage-service";
import {User} from "../../domain/User";
import {Constants} from "../../domain/Constants";
import {HttpService} from "../../providers/http-service";
import {Md5} from "ts-md5/dist/md5";
import {CreateAccount} from "../createAccount/create-account";

@Component({
  selector: 'app-login',
  templateUrl: 'login.html'
})
export class Login{
  loginForm: FormGroup;
  create_username:string;
  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public formBuilder: FormBuilder,
              public storageService:StorageService,
              public httpService: HttpService,
              public events:Events,
              public modalCtrl: ModalController){
    this.initForm();
  }
  initForm(){
    let user = this.storageService.read<User>(Constants.CURR_USER);
    this.events.subscribe(Constants.CREATE_USER,create_user=>{
      this.create_username=create_user?create_user.username:'';
    })

    this.loginForm = this.formBuilder.group({
      username:[user==null?'':user.username,Validators.compose([Validators.required,Validators.minLength(4)])],
      password: ['',Validators.compose([Validators.required,Validators.minLength(6)]) ]
    });
  }

  goHide(){
    this.viewCtrl.dismiss()
  }
  login(){
    let loader = this.httpService.loading();
    //发布登录成功消息，刷新首页信息
    this.viewCtrl.onDidDismiss(()=>{
      this.events.publish("LOGIN_SUCCESS");
    });
    loader.present();
    let pwd = this.loginForm.controls['password'].value;
    this.loginForm.controls['password'].setValue(Md5.hashStr(this.loginForm.controls['password'].value).toString());
    console.log(this.loginForm.value)
    this.httpService.httpPostNoAuth("account/login",this.loginForm.value)
      .then(result=>{
        loader.dismiss();
        this.loginForm.controls['password'].setValue(pwd);
        if(result.code==-1){
          /*this.httpService.alert(result.msg,"登录失败");*/
          this.httpService.alert(result.msg,"登录失败")
          console.log("login faild"+result.msg)
          return ;
        }
        let user:User = result.data;
        if(!user){
         /* this.httpService.alert(result.msg,"登录失败");*/
          console.log("login faild"+result.msg)
          this.httpService.alert(result.msg,"登录失败")
          return ;
        }
        this.storageService.write(Constants.CURR_USER,user);
        this.events.publish(Constants.CURR_USER,user);
        this.viewCtrl.dismiss()
      }).catch(error=>{
        loader.dismiss()
      this.loginForm.controls['password'].setValue(pwd);
    })
  }
  createAccount(){
    let modal = this.modalCtrl.create(CreateAccount)
    modal.present()
  }
}
