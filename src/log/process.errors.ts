import { LogService } from './log.service';

export function processErrors(loggingService: LogService) {
  process.on('uncaughtException', (error) => {
    try {
      loggingService.error(`Uncaught Exception: ${error.stack || error.message}`);
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
}
