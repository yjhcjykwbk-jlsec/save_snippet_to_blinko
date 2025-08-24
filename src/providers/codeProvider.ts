import * as vscode from 'vscode';

/**
 * 获取用户在编辑器中选中的代码
 * @returns 选中的代码字符串，如果没有选中则返回null
 */
export function getSelectedCode(): string | null {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return null;
	}

	const selection = editor.selection;
	if (selection.isEmpty) {
		return null;
	}

	return editor.document.getText(selection);
}

/**
 * 获取当前活动文件的路径
 * @returns 文件路径字符串，如果没有活动文件则返回null
 */
export function getFilePath(): string | null {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return null;
	}

	return editor.document.uri.fsPath;
}
