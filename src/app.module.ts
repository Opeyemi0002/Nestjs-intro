import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TagsModule } from './tags/tags.module';
import { MetaoptionModule } from './metaoption/metaoption.module';
import { PaginationModule } from './common/pagination/pagination.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import enviromentValidation from './config/enviroment.validation';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './auth/config/jwt.config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { UploadModule } from './uploads/upload.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';
import cloudinaryConfig from './cloudinary/config/cloudinary.config';
import { MongooseModule } from '@nestjs/mongoose';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    UsersModule,
    PostModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig, jwtConfig, cloudinaryConfig],
      validationSchema: enviromentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        synchronize: configService.get('database.synchronize'),
      }),
    }),
    TagsModule,
    MetaoptionModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.key'),
        signOptions: {
          expiresIn: configService.get('jwt.expiry'),
          audience: configService.get('jwt.audience'),
          issuer: configService.get('jwt.issuer'),
        },
      }),
    }),
    PaginationModule,
    UploadModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('appConfig.mongoDbUrl'),
        dbName: 'nestjs-blog',
      }),
    }),
    CloudinaryModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
    AccessTokenGuard,
  ],
  exports: [],
})
export class AppModule {}
