import {Component} from '@angular/core';
import {Events, NavController, PopoverController} from 'ionic-angular';
import {StorageService} from "../../providers/storage-service";
import {Constants} from "../../domain/Constants";
import {User} from "../../domain/User";
import {AccountBookPage} from "../AccountBook/accountBookPage"
import {AccountBook} from "../../domain/AccountBook";
import {HttpService} from "../../providers/http-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  item = []
  page =1
  current_user:User;
  default_account_book:AccountBook;
  constructor(public navCtrl: NavController,
                public storageService:StorageService,
                public popoverCtrl:PopoverController,
                public events:Events,
                public httpService:HttpService) {
      for(let i=0;i<10;i++){
         this.item.push({counter:i,page:this.page})
      }
      this.page++;
      this.initLoad();
      this.initDefaultAccount();
  }
  //上拉加载
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      for (let i = 0; i < 10; i++) {
        this.item.push({counter:i,page:this.page});
      }
      this.page++;
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  //下拉刷新
  doRefresh(event) {
    setTimeout(function(){
      this.item = []
      event.complete();
    },600)

  }
  initDefaultAccount(){
    this.default_account_book = this.storageService.read<AccountBook>(Constants.DEFAULT_ACCOUNT_BOOK);
    console.log("查询默认账簿")
    console.log(this.default_account_book)
    if(!this.default_account_book&&this.current_user){
      this.httpService.httpGetWithAuth('accountBook/getDefaultAccountBook?userId='+this.current_user.id)
        .then(result=>{
          if(!result){
            this.httpService.alert("连接服务器失败");
          }
          if(result.code==-1||!result.data){
            this.httpService.alert(result.msg)
          }
          this.default_account_book = result.data;
          this.storageService.write(Constants.DEFAULT_ACCOUNT_BOOK,result.data);
        }).catch(error=>{console.log("select default account book is faild")})
    }
  }

  initLoad(){
    this.events.subscribe(Constants.CURR_USER,user=> {this.current_user= user;});
    let user:User =this.storageService.read(Constants.CURR_USER);
    this.current_user=user;
    //订阅 改变默认账簿消息
    this.events.subscribe(Constants.CHANGE_BOOK,book=>{
      this.default_account_book=book;
      this.storageService.remove(Constants.DEFAULT_ACCOUNT_BOOK);
      this.storageService.write(Constants.DEFAULT_ACCOUNT_BOOK,book);
    })
  }
  presentPopover(ev) {
    let popover = this.popoverCtrl.create(AccountBookPage, {
      /*contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement*/
    });
    popover.present({
      ev: ev
    });
  }

}
