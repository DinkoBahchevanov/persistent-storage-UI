import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pair } from './pair';
import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class PairService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getPairs(): Observable<Pair[]> {
    return this.http.get<Pair[]>(`${this.apiServerUrl}/api/pairs`);
  }

  public addPair(pair: Pair): Observable<Pair> {
    return this.http.post<Pair>(`${this.apiServerUrl}/api/pairs`, pair);
  }

  public deletePair(pairId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/api/pairs/${pairId}`);
  }
}
