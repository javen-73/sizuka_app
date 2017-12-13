export class Page{
  constructor(public page:number,
                public pageSize:number,
                public pages:number,
                public lastPage:boolean,
                public data:any[]){}
}
