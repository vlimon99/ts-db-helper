import { IDbLogger } from '../interfaces/db-logger';

export class DefaultLogger implements IDbLogger {
    private static levels = ['verbose', 'debug', 'trace', 'info', 'warn', 'error', 'fatal'];
    private levelValue = DefaultLogger.levels[3];
    public set level(level: string) {
        if (DefaultLogger.levels.indexOf(level) < 0) {
            throw new Error('level \'' + level + '\' is not a valid log level');
        }
    }

    private isLogLevelActivated(target: string) {
        return DefaultLogger.levels.indexOf(this.levelValue) <= DefaultLogger.levels.indexOf(target);
    }

    public log(...args: any[]): void {
        if (this.isLogLevelActivated('verbose')) {
            console.log(...args);
        }
    }

    public trace(message: string, ...args: any[]): void {
        if (this.isLogLevelActivated('trace')) {
            console.trace(message, ...args);
        }
    }

    public debug(message: string, ...args: any[]): void {
        if (this.isLogLevelActivated('debug')) {
            console.log(message, ...args);
        }
    }

    public info(message: string, ...args: any[]): void {
        if (this.isLogLevelActivated('info')) {
            console.info(message, ...args);
        }
    }

    public warn(message: string, ...args: any[]): void {
        if (this.isLogLevelActivated('warn')) {
            console.warn(message, ...args);
        }
    }

    public error(message: string, ...args: any[]): void {
        if (this.isLogLevelActivated('error')) {
            console.error(message, ...args);
        }
    }

    public fatal(message: string, ...args: any[]): void {
        if (this.isLogLevelActivated('fatal')) {
            console.error(message, ...args);
        }
    }
}
