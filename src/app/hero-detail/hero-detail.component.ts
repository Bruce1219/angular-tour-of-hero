import { Component, Input } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { ActivatedRoute } from '@angular/router'; //route.snapshot.paramMap.get('id')
import { Location } from '@angular/common';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent {
  constructor(
    private route: ActivatedRoute, //提取路由引數:id
    private heroService: HeroService,//從伺服器獲取資料
    private location: Location //瀏覽器功能，用來回上一頁
  ){}

  @Input() hero?: Hero; //接收父元件資料

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    //route.snapshot:抓取元件剛成立時，paramMap:從url提取路由引數值的字典
    this.heroService.getHero(id)
    .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if(this.hero) {
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
    }
  }

  
}
