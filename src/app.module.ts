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

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    UsersModule,
    PostModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      //envFilePath: ['.env.development'],
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
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
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
