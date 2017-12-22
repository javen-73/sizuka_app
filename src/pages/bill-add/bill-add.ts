import {Component} from "@angular/core";
import {HttpService} from "../../providers/http-service";
import {StorageService} from "../../providers/storage-service";
import {DatePipe} from "@angular/common";
import {Constants} from "../../domain/Constants";
import {AccountBook} from "../../domain/AccountBook";
import {User} from "../../domain/User";
import {Events, ViewController} from "ionic-angular";

const pattern = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

@Component({
  selector: 'page-bill-add',
  templateUrl: './bill-add.html'
})
export class BillAdd {
  //前端被选择 显示的icon
  priceTypes = [];
  // 收入/支出
  priceType = '0';
  //icon Type
  selected_default = []
  //添加金额
  money: number
  remark = ''
  add_date = this.datePipe.transform(new Date(), "yyyy-MM-dd")

  constructor(public httpService: HttpService,
              public storageService: StorageService,
              public datePipe: DatePipe,
              public events: Events,
              public viewCtrl: ViewController) {
    this.initData();
  }

  initData() {
    this.httpService.httpGetNoAuth('accountItem/getItemType')
      .then(result => {
        if (!result.data) {
          this.httpService.alert("服务器出错了")
        }
        this.priceTypes = result.data;
      });
  }

  getItems(priceType: number) {
    let icons_data = this.priceTypes[priceType]
    if (icons_data) {
      return icons_data;
    }
    icons_data = []
    return icons_data;
  }

  selected_icon(map: any) {
    this.selected_default = [];

    this.selected_default.push(map);
    console.log(this.priceType)
  }

  getIconName(id: number) {
    console.log('ai-yishizhuhangzitisheji-' + id)
    return 'ai-yishizhuhangzitisheji-' + id
  }

  save() {
    if (!this.selected_default[0]) {
      this.httpService.alert("请选择一个类型")
      return;
    }
    let id = this.selected_default[0].id
    if (!id) {
      this.httpService.alert("请选择一个类型")
      return;
    }
    console.log(this.money)
    if (!this.money) {
      this.httpService.alert("请输入正确金额")
      return;
    }
    if (!pattern.test(this.money + '')) {
      this.httpService.alert("输入金额格式不正确，小数位最多2位")
      return;
    }
    let temp_money = 0
    //支出
    if (this.money && this.priceType == '0') {
      //置为负数
      this.money = -this.money;
    }
    temp_money = this.money
    if (!this.add_date) {
      this.httpService.alert("请选择日期")
      return;
    }
    let defalut_book: AccountBook = this.storageService.read(Constants.DEFAULT_ACCOUNT_BOOK);
    if (!defalut_book) {
      this.httpService.alert("抱歉,您选中的账簿没有发现")
    }
    let curr_user: User = this.storageService.read(Constants.CURR_USER);
    if (!curr_user) {
      this.httpService.alert("主人我不记得你了,请重新登录吧", "主人")
    }

    let param = {
      userId: curr_user.id,
      bookId: defalut_book.id,
      money: temp_money * 100,
      iconType: this.selected_default[0].id,
      priceType: this.priceType,
      date: this.add_date,
      remark: this.remark
    }
    let json_param = JSON.stringify(param);
    this.httpService.httpPostWithAuth("accountItem/saveBill", json_param).then(result => {
      if (!result || result.code == -1) {
        this.httpService.alert("添帐失败")
        return;
      }
      this.events.publish(Constants.ACCOUNT_ITEM, "flush")
      this.httpService.alert("添加成功", "添加")
      this.viewCtrl.dismiss()
    })

  }

}
