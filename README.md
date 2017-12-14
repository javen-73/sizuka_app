[top]
## Angular4 + ionic3 开发app历程总结
### 摘要
平时都是写java后端程序，很少接触前端开发。得知ng+ionic可以开发程序是在我上一家小公司的时候，因为人员和成本问题，小公司通常APP开发会用这种方式。从学习到动手就一个周的时间，其实也蛮简单的，只要有兴趣，定会有所收获。

### 需求
能够实现简单的记账，收入与支出，包括月报表、统计等。
##### 后台 SpringBoot+MyBatis+Redis+mysql
[Server 后台源码](https://github.com/javen-73/sizuka_server)
##### 前端 TypeScrpt+Angular+Ionic
[app 前端源码](https://github.com/javen-73/sizuka_app)

----------
## [Sizuka APP直达地址](http://aihiaihi.com)

废话不多说，先上效果图(bug图)
![](http://aihiaihi.com/img/show.gif)

### 1.TypeScript 
[TypeSpript学习文档](https://www.tslang.cn/docs/home.html)
想快速掌握一个东西就先搞懂一半，另一半再用的时候一边用一边学。所以ts不推荐全把文档啃完。

### 2.Angular
[Angular中文官网](https://angular.cn/)
简称ng,ng说简单也简单说难也难，其实用起来之后，就觉得ng的东西挺多的，适合那种大型的网站。
从jq直接开到ng第一感觉深刻的就是数据绑定，比起jq不停的更新值来说，ng相当安逸，但是这种安逸在后面做APP的时候感觉相当坑爹。

### 3.Ionic 
[Ionic文档](https://ionicframework.com/)
炒鸡简单，再搭建完成环境后，使用起来会像是在用Bootstrap做网页。

### 我所遇到的坑和资料


- [Angular4x修仙之路](https://segmentfault.com/a/1190000008754631)
- [ngx-errors](https://github.com/UltimateAngular/ngx-errors)
- [ionic环境搭建](http://blog.csdn.net/zapzqc/article/details/41802453)
- [Ionic custom icons 自定义图标，贼坑，现在还有图标的bug，特别是scss,这文档可以少走不少弯路](https://yannbraga.com/2017/06/28/how-to-use-custom-icons-on-ionic-3/)
- [Ionic 使用 animate](http://blog.csdn.net/MetaphorXi/article/details/78180410?locationNum=9&fps=1)