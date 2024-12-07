import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(readonly configService: ConfigService) {}

  static instance: AppConfigService;

  private returnDefault<T>(value: string, result: unknown, defaultValue: T): T {
    if (result === undefined && defaultValue) return defaultValue;
    throw new Error(
      `The environment variable "${value}" is missing or its definition is incorrect`,
    );
  }

  getInteger(value: string, defaultValue?: number, radix = 10): number {
    const result = this.configService.get(value, defaultValue);
    if (typeof result === 'string') return parseInt(result, radix);
    if (typeof result === 'number') return result;
    return this.returnDefault<number>(value, result, defaultValue);
  }

  getFloat(value: string, defaultValue?: number): number {
    const result = this.configService.get(value, defaultValue);
    if (typeof result === 'string') return parseFloat(result);
    if (typeof result === 'number') return result;
    return this.returnDefault<number>(value, result, defaultValue);
  }

  getString(value: string, defaultValue?: string): string {
    const result = this.configService.get(value, defaultValue);
    if (typeof result === 'string') return result;
    return this.returnDefault<string>(value, result, defaultValue);
  }

  getBoolean(value: string, defaultValue?: boolean): boolean {
    const result = this.configService.get(value, defaultValue);
    if (typeof result === 'string') return result === 'true';
    if (typeof result === 'boolean') return result;
    return this.returnDefault<boolean>(value, result, defaultValue);
  }
}

export const APP_CONFIG_SERVICE = 'IAppConfigService';

export const appConfigServiceProvider: Provider = {
  inject: [ConfigService],
  provide: APP_CONFIG_SERVICE,
  useFactory: (configService: ConfigService) =>
    AppConfigService.instance || (AppConfigService.instance = new AppConfigService(configService)),
};
