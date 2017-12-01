import {Component, OnInit} from "@angular/core";
import {AlertController, Events, ViewController} from "ionic-angular";
import {HttpService} from "../../providers/http-service";
import {StorageService} from "../../providers/storage-service";
import {Constants} from "../../domain/Constants";
import {User} from "../../domain/User";
import {AccountBook} from "../../domain/AccountBook";

@Component({
  templateUrl:'./accountBookPage.html'
})
export class AccountBookPage implements OnInit{

  accountBooks:AccountBook[];
  user:User;
  constructor(public viewCtrl: ViewController,
                public httpService:HttpService,
                public storageService:StorageService,
                public alertCtrl:AlertController,
                public events:Events) {

  }
  ngOnInit(): void {
    this.initAccountBook();
  }
  initAccountBook(){
    this.user =this.storageService.read<User>(Constants.CURR_USER);
    //读取本地账簿列表
    this.accountBooks = this.storageService.read(Constants.ACCOUNT_BOOKS);
    //如果用户不为空，本地没有 则请求服务器
    if(this.user&&!this.accountBooks||this.accountBooks.length==0){
      this.httpService.httpGetWithAuth('accountBook/getAccountBooks?userId='+this.user.id).then(result=>{
        if(!result){
          this.httpService.alert("连接服务器失败");
        }
        if(result.code==-1||!result.data){
          this.httpService.alert(result.msg)
        }
        this.accountBooks=result.data;
        this.storageService.write(Constants.ACCOUNT_BOOKS,this.accountBooks);
      })
    }
  }
  close() {
    this.viewCtrl.dismiss();
  }
  addBook(){
    let addBookAlert=this.alertCtrl.create({
      title: '添加账簿',
      inputs: [
        {
          name: 'bookName',
          placeholder: '账簿名称'
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
        },
        {
          text: '添加',
          handler: data => {
            if(this.user){
              let url='accountBook/addAccountBook?userId='+this.user.id+'&bookName='+data.bookName
              this.httpService.httpGetWithAuth(url).then(result=>{
                if(result==null){
                  this.httpService.alert("连接服务器失败");
                }
                if(result.code==-1||!result.data){
                  this.httpService.alert("添加账簿失败");
                }
                this.accountBooks.push(result.data);
                //重新再在本地存储重新写入一次
                this.storageService.remove(Constants.ACCOUNT_BOOKS);
                this.storageService.write(Constants.ACCOUNT_BOOKS,this.accountBooks);
              });
            }else {
              this.httpService.alert("请重新再试一次")
            }
          }
        }
      ]
    })
    addBookAlert.present()
  }
  updateBook(book_id:number){
    this.httpService.alert("开发中ing","修改提示")
    console.log("update book id is"+book_id)
  }
  delBook(book_id:number){
    this.httpService.alert("开发中ing","删除提示")
    console.log("delete book id is"+book_id)
  }
  onSelectBook(book_id:number){

    console.log("select book id is"+book_id)
    let select_book:AccountBook
    for(let book of this.accountBooks){
      if(book.id==book_id){
          select_book=book;
      }
    }
    if(select_book){
      this.events.publish(Constants.CHANGE_BOOK,select_book)
      this.viewCtrl.dismiss()
    }else {
      this.httpService.alert("あれ？失败了呢","选中提示")
    }

  }
}
