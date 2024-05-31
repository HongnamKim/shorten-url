import { Injectable } from '@nestjs/common';
import * as base62 from 'base62';

type urlMap = {
  longUrl: string;
  visits: number;
  createdAt: Date;
};

let index = 1;

const DOMAIN_URL = 'localhost:3000';

@Injectable()
export class AppService {
  urlDB = new Map<number, urlMap>();

  getAllUrls() {
    return Array.from(this.urlDB);
  }

  createShortUrl(url: string) {
    const newRow: urlMap = {
      longUrl: url,
      visits: 0,
      createdAt: new Date(),
    };

    this.urlDB.set(index, newRow);

    const encodeUrl = base62.encode(index).padStart(8, '0');

    index++;

    return DOMAIN_URL + '/' + encodeUrl;
  }

  getOriginUrl(shortUrl: string) {
    const originIndex = base62.decode(shortUrl);
    const urlMap = this.urlDB.get(originIndex);
    urlMap.visits++;

    console.log(this.urlDB.values());

    return 'https://' + urlMap.longUrl;
  }

  cleanUpDb() {
    const removeTarget = Array.from(this.urlDB.values()).map((value, index) => {
      if (this.checkDate(value.createdAt)) {
        return index + 1;
      }
    });

    removeTarget.forEach((value) => {
      this.urlDB.delete(value);
    });
  }

  checkDate(checkDate: Date) {
    const now = new Date();
    return (now.getTime() - checkDate.getTime()) / 1000 / 3600 / 24 > 7;
  }
}
