import {HttpClient} from "@angular/common/http";
import {Proorder} from "../entity/proorder";
import {Injectable} from "@angular/core";

@Injectable()
export class ProorderService{

  constructor(private http: HttpClient) {  }

  async delete(code: string): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/proorders/' + code).toPromise();
  }

  async update(proorder: Proorder): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/proorders', proorder).toPromise();
  }


  async getAll(query:string): Promise<Array<Proorder>> {
    const proorders = await this.http.get<Array<Proorder>>('http://localhost:8080/proorders'+query).toPromise();
    if(proorders == undefined){
      return [];
    }
    return proorders;
  }

  async add(proorder: Proorder): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/proorders', proorder).toPromise();
  }

  async getAllList(): Promise<Array<Proorder>> {
    const proorders = await this.http.get<Array<Proorder>>('http://localhost:8080/proorders/list').toPromise();
    if(proorders == undefined){
      return [];
    }
    return proorders;
  }

}
