import { Injectable } from '@nestjs/common';
import * as base62 from 'base62';
import { PaginateUrlDto } from './dto/paginate-url.dto';

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

  paginateUrls(dto: PaginateUrlDto) {
    let datas = Array.from(this.urlDB);

    let begin, end;

    begin = dto.cursorStartVisits - 1;

    if (['asc', 'ASC'].includes(dto.order__visits)) {
      // 오름차순
      datas.sort((a, b) => {
        if (a[1].visits === b[1].visits) {
          // 방문 횟수 동일할 경우 id 순
          return a[0] - b[0];
        } else {
          return a[1].visits - b[1].visits;
        }
      });

      let datasIds;
      let datasVisits;

      // 조회수 기준 필터링
      // 커서가 존재할 경우 커서 조회수 이상 데이터만 필터링
      if (dto.cursorStartVisits) {
        datasIds = datas.filter(
          (value) =>
            value[1].visits === dto.cursorStartVisits &&
            value[0] > dto.cursorStartId,
        );

        datasVisits = datas.filter(
          (value) => value[1].visits > dto.cursorStartVisits,
        );

        datas = [...datasIds, ...datasVisits];
      } else {
        begin = 0;
      }

      end = begin + dto.take;
      //begin = 0;
      //end = 20;
    } else if (['desc', 'DESC'].includes(dto.order__visits)) {
      // 내림차순
      datas.sort((a, b) => {
        if (b[1].visits === a[1].visits) {
          // 방문 횟수 동일할 경우 최신순
          return a[0] - b[0];
        } else {
          return b[1].visits - a[1].visits;
        }
      });

      // 조회수 기준 필터링
      // 커서가 존재할 경우 커서 조회수 이하 데이터만 필터링
      if (dto.cursorStartVisits) {
        datas = datas.filter(
          (value) => value[1].visits < dto.cursorStartVisits,
        );
      }

      begin = dto.cursorStartVisits - 1;
      end = begin + dto.take;
    }

    //console.log(datas);
    console.log(begin);
    console.log(end);
    const results = datas.slice(begin, end);

    return {
      data: results,
      metadata: {
        count: results.length,
        nextCursorVisits: results[results.length - 1][1].visits,
        nextCursorId: results[results.length - 1][0],
      },
    };
  }

  generateDummyData() {
    for (let i = 0; i < 100; i++) {
      this.createShortUrl(
        `www.test-url-${i}.com`,
        Math.floor(Math.random() * 50),
      );
    }
  }

  createShortUrl(url: string, visits?: number) {
    const newRow: urlMap = {
      longUrl: url,
      visits: visits ? visits : 0,
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
