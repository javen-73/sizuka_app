import {DateTime} from "ionic-angular";

export class User {
  public id:number;
  public username: string;
  public aliasName:string;
  public sex:number;
  public createTime:DateTime;
  public profilePicture:string
  public token?:string;
  constructor(){
  }
}
