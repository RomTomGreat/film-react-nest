import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
    formatMessage(level: string, message: any, ...optionalParams: any[]) {
        return JSON.stringify({ level, message, optionalParams });
    }

    log(message: any, ...optionalParams: any[]) {
        console.log(this.formatMessage('log', message, optionalParams));
    }

    warn(message: any, ...optionalParams: any[]) {
        console.log(this.formatMessage('warn', message, optionalParams));
    }

    error(message: any, ...optionalParams: any[]) {
        console.log(this.formatMessage('error', message, optionalParams));
    }
}