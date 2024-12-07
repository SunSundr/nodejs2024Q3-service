import { LogService } from './log.service';

export function processErrors(loggingService: LogService) {
  process.on('uncaughtException', async (error) => {
    try {
      await loggingService.error(`Uncaught Exception: ${error.stack || error.message}`);
    } catch (err) {
      console.error('Failed to log uncaught exception:', err.message);
    } finally {
      process.exit(1);
    }
  });

  process.on('unhandledRejection', async (reason: unknown) => {
    try {
      await loggingService.error(`Unhandled Rejection: ${reason['stack'] || reason}`);
    } catch (err) {
      console.error('Failed to log unhandled rejection:', err.message);
    }
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT');
    await loggingService.error('>>> SIGINT <<<');
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM');
    await loggingService.error('>>> SIGTERM <<<');
  });

  // process.on('SIGUSR2', async () => {
  //   console.log('SIGUSR2');
  //   await loggingService.error('>>> SIGUSR2 <<<');
  // });
}
