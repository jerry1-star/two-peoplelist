import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR

    const message = exception instanceof HttpException
      ? (exception.getResponse() as { message?: string | string[] })?.message ?? exception.message
      : '服务器内部错误'

    const msg = Array.isArray(message) ? message[0] : message

    response.status(status).json({
      code: status,
      message: msg,
      data: null,
    })
  }
}
