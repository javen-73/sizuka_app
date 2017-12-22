import {Component} from '@angular/core';
import {Events, NavController, PopoverController} from 'ionic-angular';
import {StorageService} from "../../providers/storage-service";
import {Constants} from "../../domain/Constants";
import {User} from "../../domain/User";
import {AccountBookPage} from "../AccountBook/accountBookPage"
import {AccountBook} from "../../domain/AccountBook";
import {HttpService} from "../../providers/http-service";
import {DatePipe} from "@angular/common";
import {AccountItemResult} from "../../domain/AccountItemResult";
import {BillAdd} from "../bill-add/bill-add";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  items = []
  page =1
  current_user:User;
  default_account_book:AccountBook;
  money_data:AccountItemResult;
  lastPage:boolean;
  up:boolean= false;
  no_more = ''
  constructor(public navCtrl: NavController,
                public storageService:StorageService,
                public popoverCtrl:PopoverController,
                public events:Events,
                public httpService:HttpService,
                public datePipe:DatePipe) {

      this.initLoad();
      this.initDefaultAccount();
      this.load_data()
      this.events_fun()
      this.page++;
  }
  //上拉加载
  doInfinite(infiniteScroll) {

    if(this.up)return;
    this.up=true;

    console.log('是否可以拉取'+!this.lastPage);
    setTimeout(() => {
      if(!this.lastPage){
        console.log("正在拉取")
        this.upflush()
        this.page++
      }else {
        this.no_more ='暂无更多'
        infiniteScroll.complete()
        this.up=false;
      }
      infiniteScroll.complete();
    }, 500);
    infiniteScroll.complete();
  }

  //下拉刷新
  doRefresh(event) {
    this.storageService.remove(Constants.ACCOUNT_ITEM)
    this.page = 1
    this.load_data()
    setTimeout(function(){
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
      this.items=[]
      this.storageService.remove(Constants.ACCOUNT_ITEM)
      this.load_data()
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
  events_fun(){
    this.events.subscribe(Constants.ACCOUNT_ITEM,directive=>{
      console.log("account_item  添加"+directive)
      if(directive=='flush'){
        this.storageService.remove(Constants.ACCOUNT_ITEM)
        this.items= []
        this.load_data();
      }
    })
  }

  upflush(){

    if(!this.current_user){
      this.current_user = this.storageService.read(Constants.CURR_USER);
    }
    if(!this.default_account_book) {
      this.default_account_book = this.storageService.read(Constants.DEFAULT_ACCOUNT_BOOK);
    }
    let date:Date = new Date();
    let url='accountItem/upflush?userId='+this.current_user.id+'&bookId='+this.default_account_book.id+'&page='+this.page+'&date='+this.datePipe.transform(date,'yyyy-MM-dd')
    this.httpService.httpGetWithAuth(url).then(result=>{
      if(!result||!result.data){
        this.httpService.layer("あれ,数据被隔壁王大爷抢走了",'主子')
      }
      let data:AccountItemResult = result.data;
     this.lastPage = data.page.lastPage
     for(let i=0;i<data.page.data.length;i++){
       this.items.push(data.page.data[i])
     }
     let account_items:AccountItemResult= this.storageService.read(Constants.ACCOUNT_ITEM)
      account_items.page.data=this.items;
     account_items.page.lastPage=data.page.lastPage;
     console.log(this.items)
      this.storageService.write(Constants.ACCOUNT_ITEM,account_items);
      this.up=false;
    }).catch(error=>{
      this.httpService.layer("(,,•́ . •̀,,)哎呀呀，粗错了",'主子')
      this.up = false;
    })


  }
  load_data(){
    if(!this.current_user){
      this.current_user = this.storageService.read(Constants.CURR_USER);
    }
    if(!this.current_user||!this.current_user.id){
      console.log(this.current_user)
      return setTimeout(() => {
        this.load_data()
      }, 500);
    }
    if(!this.default_account_book){
      this.default_account_book = this.storageService.read(Constants.DEFAULT_ACCOUNT_BOOK);
      if(!this.default_account_book){
        this.initDefaultAccount()
        if(!this.default_account_book){
          return setTimeout(() => {
            this.load_data()
          }, 500);
        }
      }
    }
    let money_item = this.storageService.read<AccountItemResult>(Constants.ACCOUNT_ITEM);
    if(!money_item){
      let date:Date = new Date();
      let url='accountItem/downPull?userId='+this.current_user.id+'&bookId='+this.default_account_book.id+'&page='+1+'&date='+this.datePipe.transform(date,'yyyy-MM-dd')
      this.httpService.httpGetWithAuth(url).then(result=>{
        if(!result||!result.data){
          this.httpService.layer("あれ,数据被隔壁王大爷抢走了",'主子')
        }
        let data:AccountItemResult = result.data;
        this.money_data = data;
        this.items = data.page.data;
        this.lastPage = data.page.lastPage
        this.storageService.write(Constants.ACCOUNT_ITEM,data);
      }).catch(error=>{
        this.httpService.layer("(,,•́ . •̀,,)哎呀呀，粗错了",'主子')
      })
    }else {
      this.money_data = money_item
      this.items = money_item.page.data
      this.lastPage = this.money_data.page.lastPage
      console.log('已经从本地获取数据')
      console.log(money_item)
      console.log(money_item.page.data)
    }
  }
  addBill(){
    this.navCtrl.push(BillAdd);
  }
}
