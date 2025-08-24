import * as vscode from 'vscode';

/**
 * 日志工具类，负责输出不同级别日志到VS Code输出面板
 */
export class Logger {
    private static outputChannel: vscode.OutputChannel;

    /**
     * 初始化日志输出通道
     * @param channelName 输出通道名称，将显示在VS Code的输出面板中
     */
    public static initialize(channelName: string = 'Code Snippet Notes') {
        this.outputChannel = vscode.window.createOutputChannel(channelName);
    }

    /**
     * 打印普通信息日志
     * @param message 日志信息
     */
    public static info(message: string) {
        this.log('INFO', message);
    }

    /**
     * 打印调试日志
     * @param message 日志信息
     */
    public static debug(message: string) {
        this.log('DEBUG', message);
    }

    /**
     * 打印错误日志
     * @param message 错误信息
     * @param error 错误对象（可选）
     */
    public static error(message: string, error?: Error) {
        if (error) {
            this.log('ERROR', `${message}: ${error.message}\nStack: ${error.stack}`);
        } else {
            this.log('ERROR', message);
        }
    }

    /**
     * 通用日志输出方法
     */
    private static log(level: string, message: string) {
        const timestamp = new Date().toISOString();
        this.outputChannel.appendLine(`[${timestamp}] [${level}] ${message}`);

        // 开发环境下同时输出到控制台（F12开发者工具）
        if (process.env.NODE_ENV === 'development') {
            console.log(`[${level}] ${message}`);
        }
    }

    /**
     * 显示输出面板（方便用户查看日志）
     */
    public static showOutputChannel() {
        this.outputChannel.show();
    }
}
