import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HeroService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  //HTTP標的頭，請求的格式為JSON

  private heroesUrl = 'api/heroes';  // URL to web api，api是請求的資源，heroes是in-memory-data-service.ts請求的物件

  constructor(
    private http: HttpClient, //將HttpClient注入進http
    private messageService: MessageService //將MessageService注入進messageService
  ) {}

  private log(message: string){
    this.messageService.add(`HeroService: ${message}`);
  }
  
  private handleError <T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }
  //泛型<T>表示適用任何類型，return of()返回一個空結果並讓程式正常運作

  getHeroes(): Observable<Hero[]> { //陣列
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        catchError(this.handleError<Hero[]>('getHeroes', []))
      )
  }
  //http.get()回傳一個 Observable<Hero[]>，它會發出單個值，指定Hero[]型別，只會回傳一個英雄陣列。
  //用pipe來擴充catchError()，catchError會攔截失敗的Observable

  getHero(id: number): Observable<Hero> { //物件
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_=>this.log(`fetch hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }
  //tap()可以檢視Observable的值來透過log()方法傳送訊息

  updateHero(hero: Hero): Observable<any> {
    return  this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  addHero(hero:Hero):Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }

  deleteHero(id: number):Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`delete hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    )
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`):
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    )
  }

}
