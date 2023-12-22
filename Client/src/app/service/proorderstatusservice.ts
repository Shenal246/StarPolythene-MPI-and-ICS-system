import {HttpClient} from "@angular/common/http";
import {Proorderstatus} from "../entity/proorderstatus";
import {Injectable} from "@angular/core";

@Injectable()
export class Proorderstatusservice{

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Proorderstatus>> {

    const proorderstatuses = await this.http.get<Array<Proorderstatus>>('http://localhost:8080/proorderstatuses/list').toPromise();
    if(proorderstatuses == undefined){
      return [];
    }
    return proorderstatuses;
  }

}
