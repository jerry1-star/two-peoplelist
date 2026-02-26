import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './modules/redis/redis.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { PostsModule } from './modules/posts/posts.module'
import { CommentsModule } from './modules/comments/comments.module'
import { CoursesModule } from './modules/courses/courses.module'
import { LearningRecordsModule } from './modules/learning-records/learning-records.module'
import { ToolsModule } from './modules/tools/tools.module'
import { CasesModule } from './modules/cases/cases.module'
import { BannersModule } from './modules/banners/banners.module'
import { RolesModule } from './modules/roles/roles.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { JwtAuthGuard } from './common/guards/jwt-auth.guard'
import { RolesGuard } from './common/guards/roles.guard'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    CoursesModule,
    LearningRecordsModule,
    ToolsModule,
    CasesModule,
    BannersModule,
    RolesModule,
    DashboardModule,
    CategoriesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
