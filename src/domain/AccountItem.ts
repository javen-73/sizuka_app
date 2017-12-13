export class AccountItem{
  constructor(public id:number,
                public userId:number,
                public bookId:number,
                public priceType:number,
                public itemType:string,
                public price:any,
                public status:number,
                public itemStatus:number,
                public remark:string,
                public createTime:string){}
}
