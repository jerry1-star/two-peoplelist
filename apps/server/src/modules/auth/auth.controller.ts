import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { SendCodeDto } from './dto/send-code.dto'
import { LoginDto } from './dto/login.dto'
import { AdminLoginDto } from './dto/admin-login.dto'
import { RefreshDto } from './dto/refresh.dto'
import { Public } from '../../common/decorators/public.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '发送验证码' })
  async sendCode(@Body() dto: SendCodeDto) {
    await this.authService.sendCode(dto.phone)
    return { message: '验证码已发送' }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '手机号验证码登录' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.phone, dto.code)
  }

  @Public()
  @Post('admin-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '管理员账号密码登录' })
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto.username, dto.password)
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新 Access Token' })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '退出登录' })
  logout(@CurrentUser() _user: unknown, @Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken)
  }
}
