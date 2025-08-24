import * as vscode from 'vscode';

/**
 * 显示错误信息
 * @param message 错误信息
 */
export function showError(message: string) {
	vscode.window.showErrorMessage(`Code Snippet Noter: ${message}`);
	//console.error(`Code Snippet Noter Error: ${message}`);
}

/**
 * 显示成功信息
 * @param message 成功信息
 */
export function showSuccess(message: string) {
	vscode.window.showInformationMessage(`Code Snippet Noter: ${message}`);
}

/**
 * 显示警告信息
 * @param message 警告信息
 */
export function showWarning(message: string) {
	vscode.window.showWarningMessage(`Code Snippet Noter: ${message}`);
}
