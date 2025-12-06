import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV === 'development' ? resolvePrettyTransport() : undefined,
        redact: ['req.headers.authorization', 'password', 'req.body.password'],
        serializers: {
          req(req) { return { method: req.method, url: req.url }; },
        },
      },
    }),
  ],
})
export class PinoLoggerModule {}

function resolvePrettyTransport() {
  try {
    require.resolve('pino-pretty');
    return { target: 'pino-pretty' };
  } catch (err) {
    // If pino-pretty is not installed, fall back to default transport without crashing
    return undefined;
  }
}
