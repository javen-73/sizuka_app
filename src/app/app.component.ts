import {Component, ViewChild} from '@angular/core';
import {Events, MenuController, ModalController, Nav, Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { Login } from '../pages/login/login';
import {Constants} from "../domain/Constants";
import {User} from "../domain/User";
import {StorageService} from "../providers/storage-service";
import {Logout} from "../pages/logout/logout";
import {About} from "../pages/about/about";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  backButtonPressed = false;
  rootPage: any = HomePage;
  curr_user:User;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public menu: MenuController,
              public toastCtrl: ToastController,
              public events: Events,
              public storageService: StorageService,
              public modalCtrl: ModalController) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: '记一笔', component: HomePage },
      { title: '月账单', component: ListPage },
      { title: '关   于', component: About },
      { title: '退出登录', component: Logout }
    ];
    this.initEvent();

  }
  //init Events
  initEvent(){
    //第一次登录接受
    this.events.subscribe(Constants.CURR_USER,user=> {this.curr_user= user;});
    //免密登陆
    this.initProfile()
  }
  initProfile(){
    let user:User = this.storageService.read(Constants.CURR_USER);
    this.curr_user=user;
  }


  initializeApp(){
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //注册返回按键事件
      this.registerBackButtonAction();
      //登录认证
      this.authentication();
    });
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  authentication(){
    console.log(this.storageService)
    if(!this.storageService.read(Constants.CURR_USER)){
        let modal = this.modalCtrl.create(Login)
         modal.present()
    }
  }
  registerBackButtonAction(){
    this.platform.registerBackButtonAction((): any => {
      let activeVC = this.nav.getActive();
      let page = activeVC.instance;
      if(this.menu.isOpen()){
        this.menu.close();
        return;
      }
      //当前页面非tab栏
      if (!this.nav.canGoBack() || page instanceof Login) {
        //如果导航栈为空了，或者 当前页为登录页了 则退出登录
        return this.showExit();
      }
      return this.nav.pop();
    }, 101);
  }

  showExit() {
    //如果退出标志是true 则退出
    if (this.backButtonPressed) this.platform.exitApp();
    else {
      let toast = this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
      //第一次点击安卓返回键，标志设置为true  并提示用户再按一次就退出
      this.backButtonPressed = true;
      setTimeout(() => {
        //2秒后 用户没有再次按下安卓返回键则把标志重新设置为false
        this.backButtonPressed = false;
      }, 2000)
    }
  }




}
