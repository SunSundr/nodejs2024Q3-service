import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { COLOR, colorString } from 'src/common/utils/color';
import { LogOptions, LogService } from 'src/log/log.service';
import { setDatasourceUrl } from './datasourceUrl';

const prismaOptions = {
  omit: {
    user: {
      password: true,
    },
  },
  // datasourceUrl: '',
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'error' },
  ] as const,
  errorFormat: 'pretty' as const,
};

type PrismaOptions = Omit<typeof prismaOptions, 'log'> & {
  log: (typeof prismaOptions)['log'][number][];
};

const loggerName = 'PrismaLogger';

@Injectable()
export class PrismaService
  extends PrismaClient<PrismaOptions>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly logService: LogService,
    configService: ConfigService,
  ) {
    setDatasourceUrl();
    super({
      ...prismaOptions,
      // datasourceUrl: datasourceUrl(),
      log: [...prismaOptions.log], // mutable log!
    });
    if (configService.get('ORM_LOGGING') === 'true') {
      this.subscribeToPrismaEvents();
    }
  }

  private formatMessage(pefix: string, message: string): [string, string, LogOptions] {
    return [
      `${pefix}: ${colorString(COLOR.reset, message)}`,
      loggerName,
      { msgRaw: `${pefix}: ${message}` },
    ];
  }

  private subscribeToPrismaEvents() {
    this.$on('query', (e) => {
      this.logService.log(...this.formatMessage('query', `${e.query} [${e.duration}ms]`));
    });
    this.$on('info', (e) => {
      this.logService.debug(...this.formatMessage('info', e.message));
    });
    this.$on('warn', (e) => this.logService.warn(e.message, loggerName));
    this.$on('error', (e) => this.logService.error(e.message, undefined, loggerName));
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
