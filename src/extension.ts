import * as vscode from 'vscode';
import { saveToNoteCloud } from './commands/saveToNoteCloud';
import { Logger } from './utils/log';

export function activate(context: vscode.ExtensionContext) {
	//console.log('"code-snippet-noter" is now active!');
	Logger.initialize();
    Logger.info('log插件已激活');
	let disposable = vscode.commands.registerCommand(
		'code-snippet-noter.saveToNoteCloud',
		saveToNoteCloud
	);

	context.subscriptions.push(disposable);
}

export function deactivate() {
	Logger.info('插件已停用');
}
