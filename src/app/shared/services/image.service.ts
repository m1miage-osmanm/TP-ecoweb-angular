import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomImageService {
  

  randomImageUrl = this.generateRandomImage();

  generateRandomImage(): string {
    return `https://picsum.photos/300/200?random=${Date.now()}`;
  }

  reloadImage() {
    this.randomImageUrl = this.generateRandomImage();
  }

  


  getImage(): string {
    return this.randomImageUrl;
  }

  
}
