import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { CountByDesignation } from "../report/entity/countbydesignation";

@Injectable({
  providedIn: 'root'
})
 
export class ReportService {

  constructor(private http: HttpClient) {  }

  async countByDesignation(): Promise<Array<CountByDesignation>> {

    const countbydesignations = await this.http.get<Array<CountByDesignation>>('http://localhost:8080/reports/countbydesignation').toPromise();
    if(countbydesignations == undefined){
      return [];
    }
    return countbydesignations;
  }

}


