import * as vscode from 'vscode';

/**
 * 获取API配置信息
 * @returns 包含apiUrl和apiKey的配置对象
 */
export function getApiConfig(): { apiUrl: string; apiKey: string } {
	const config = vscode.workspace.getConfiguration('codeSnippetNoter');
	
	return {
		apiUrl: config.get<string>('noteCloudApiUrl') || '',
		apiKey: config.get<string>('apiKey') || ''
	};
}

/**
 * 检查配置是否完整
 * @returns 如果配置完整则返回true，否则返回false
 */
export function isConfigComplete(): boolean {
	const { apiUrl, apiKey } = getApiConfig();
	return !!apiUrl && !!apiKey;
}

/**
 * 打开配置页面
 */
export function openConfigPage() {
	vscode.commands.executeCommand('workbench.action.openSettings', 'codeSnippetNoter');
}
