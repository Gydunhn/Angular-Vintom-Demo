import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';

export interface VintomVideoData {
  projectCode: string;
  id?: string;
  name: string;
  data_source: string;
  language: string;
  image: string;
  colour: string;
  percent: string | number;
  chart: string;
  cta_url?: string;
}

export interface VintomPlayerData {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class VintomService {
  private apiUrl = 'https://api.vintom.com';
  private projectCode = 'VINTOMFEATURESDEMO1';
  private credentials = {
    username: 'vintomfeatures',
    password: 'demo'
  };

  constructor(private http: HttpClient) { }

  sendSingleVideoRequest(data: VintomVideoData): Observable<any> {
    const url = `${this.apiUrl}/videos`;
    const authHeader = 'Basic ' + btoa(`${this.credentials.username}:${this.credentials.password}`);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', authHeader);

    if (!data.projectCode) {
      data.projectCode = this.projectCode;
    }

    return this.http.post(url, data, {
      headers,
      withCredentials: false
    }).pipe(
      tap(response => {
        console.log('Response from Vintom server:', response);
      }),
      catchError(error => {
        console.error('Error details:', error);
        throw error;
      })
    );
  }

  preparePlayerData(data: VintomVideoData, isHybrid: boolean = true): VintomPlayerData {
    if (typeof window !== 'undefined' && (window as any).preparePlayerData) {
      return (window as any).preparePlayerData(data, isHybrid);
    }
    console.error('preparePlayerData function not found. Make sure the Vintom script is loaded.');
    return {};
  }

  buildDataPackageFormData(file: File, codeLength?: number): FormData {
    const formData = new FormData();
    formData.append('projectCode', this.projectCode);
    formData.append('database', file);

    if (codeLength) {
      formData.append('codeLength', codeLength.toString());
    }

    return formData;
  }

  sendDataPackage(formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/databases`;
    const authHeader = 'Basic ' + btoa(`${this.credentials.username}:${this.credentials.password}`);
    const headers = new HttpHeaders()
      .set('Authorization', authHeader);

    return this.http.post(url, formData, {
      headers,
      withCredentials: false
    }).pipe(
      tap(response => {
        console.log('Response from data package upload:', response);
      }),
      catchError(error => {
        console.error('Error in data package upload:', error);
        throw error;
      })
    );
  }
}
