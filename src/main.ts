import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { graphqlUploadExpress } from 'graphql-upload-ts';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enableCors({
    origin: '*',
  });
  const rawBodyBuffer = (req: any, res: any, buf: any, encoding: any) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  };
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 1024 * 1024 * 100, maxFiles: 10 }),
  );
  app.use(
    bodyParser.urlencoded({
      verify: rawBodyBuffer,
      extended: true,
      limit: '20mb',
    }),
  );
  app.use(bodyParser.json({ verify: rawBodyBuffer, limit: '20mb' }));
  await app.listen(process.env.NODE_PORT);
}
bootstrap();
