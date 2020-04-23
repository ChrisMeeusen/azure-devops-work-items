import {Observable, of} from "rxjs";
import {WorkItem} from "../models/work-item";

class AdoService {

    public getWorkItems(): Observable<WorkItem[]> {

        return of([]);
    }
}
