import { LogService } from './log.service';

export function processErrors(loggingService: LogService) {
  process.on('uncaughtException', async (error) => {
    try {
      await loggingService.error(`Uncaught Exception: ${error.message}`, error.stack);
    } catch (err) {
      console.error('Failed to log uncaught exception:', err.message);
    } finally {
      process.exit(1);
    }
  });

  process.on('unhandledRejection', async (reason: unknown) => {
    try {
      await loggingService.error(
        `Unhandled Rejection: ${reason['stack'] || reason}`,
        reason['stack'],
      );
    } catch (err) {
      console.error('Failed to log unhandled rejection:', err.message);
    }
  });

  process.on('SIGINT', async () => {
    const msg = 'Closing the application by "SIGINT"';
    console.warn(msg);
    await loggingService.warn(msg);
    await loggingService.close();
  });

  process.on('SIGTERM', async () => {
    const msg = 'Closing the application by "SIGTERM"';
    console.warn(msg);
    await loggingService.warn(msg);
    await loggingService.close();
  });
}
