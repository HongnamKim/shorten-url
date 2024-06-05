import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PaginateUrlDto } from './dto/paginate-url.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('urls')
  getAllUrls() {
    return this.appService.getAllUrls();
  }

  @Get('pg-urls')
  getPaginatedUrls(@Query() body: PaginateUrlDto) {
    console.log(body);
    return this.appService.paginateUrls(body);
  }

  @Post('create')
  createShortenUrl(@Body('url') url: string) {
    return this.appService.createShortUrl(url);
  }

  @Get(':shortUrl')
  @Redirect()
  redirectOriginUrl(@Param('shortUrl') shortUrl: string) {
    const originUrl = this.appService.getOriginUrl(shortUrl);
    return { url: originUrl, statusCode: 302 };
  }

  @Post('clean')
  cleanUpUrlDb() {
    this.appService.cleanUpDb();

    return 'ok';
  }

  @Post('create-dummy')
  createDummyUrls() {
    this.appService.generateDummyData();

    return 'ok';
  }

  /*@Get()
  getHello(): string {
    const encode = base62.encode(932874923).padStart(8, '0');
    const decode = base62.decode(encode);

    console.log(encode);
    console.log(decode);

    return 'ok';
  }*/
}
