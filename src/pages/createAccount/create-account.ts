import {Component} from '@angular/core';
import {Events, NavController, ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StorageService} from "../../providers/storage-service";
import {User} from "../../domain/User";
import {Constants} from "../../domain/Constants";
import {HttpService} from "../../providers/http-service";
import {Md5} from "ts-md5/dist/md5";

@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html'
})
export class CreateAccount{
  createForm: FormGroup;
  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public formBuilder: FormBuilder,
              public storageService:StorageService,
              public httpService: HttpService,
              public events:Events){
    this.initForm();
  }
  initForm(){
    let user = this.storageService.read<User>(Constants.CURR_USER);
    this.createForm = this.formBuilder.group({
      aliasName:['',Validators.compose([Validators.required,Validators.minLength(2)])],
      username:[user==null?'':user.username,Validators.compose([Validators.required,Validators.minLength(4)])],
      password: ['',Validators.compose([Validators.required,Validators.minLength(6)]) ]
    });
  }

  goHide(){
    this.viewCtrl.dismiss()
  }
  create(){
    let loader = this.httpService.loading();
    loader.present();
    let pwd = this.createForm.controls['password'].value;
    this.createForm.controls['password'].setValue(Md5.hashStr(this.createForm.controls['password'].value).toString());
    this.httpService.httpPostNoAuth("account/create",this.createForm.value)
      .then(result=>{
        loader.dismiss();
        this.createForm.controls['password'].setValue(pwd);
        if(result.code==-1||!result.data){
          this.httpService.alert(result.msg,"注册失败")
          console.log("register faild"+result.msg)
          return ;
        }
        let user:User = result.data;
        this.events.publish(Constants.CREATE_USER,user);
        this.httpService.alert(result.msg)
        this.viewCtrl.dismiss()
      }).catch(error=>{
        loader.dismiss()
      this.createForm.controls['password'].setValue(pwd);
    })
  }
}
