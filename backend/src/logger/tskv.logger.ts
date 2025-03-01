import { Injectable, LoggerService } from "@nestjs/common";

@Injectable()
export class TskvLogger implements LoggerService {
    formatMessage(level: string, message: any, ...optionalParams: any[]) {
        return `level=${level}\tmessage=${message}\toptionalParams=${optionalParams}\n`;
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