import {Page} from "./Page";

export class AccountItemResult{
  constructor(public earn:string,
                public disburse:string,
                public balance:string,
                public page:Page){}
}
//earn 收入
// balance 结算
// disburse 支出
