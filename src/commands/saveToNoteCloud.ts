import * as vscode from 'vscode';
import { getSelectedCode, getFilePath } from '../providers/codeProvider';
import { getGitHubUrl } from '../providers/gitProvider';
import { getApiConfig } from '../providers/configProvider';
import { NoteCloudClient } from '../clients/noteCloudClient';
import { Snippet } from '../types/snippet';
import { showError, showSuccess, showWarning } from '../utils/errorReporter';
import { formatSnippetAsMarkdown } from '../utils/formatter';
import { Logger } from '../utils/log';

export async function saveToNoteCloud() {
	try {
		// 1. 获取选中的代码
		const selectedCode = getSelectedCode();
		if (!selectedCode) {
			vscode.window.showErrorMessage('No code selected');
			return;
		}

		// 2. 获取文件路径
		const filePath = getFilePath();
		if (!filePath) {
			vscode.window.showErrorMessage('No active file');
			return;
		}

		// 3. 获取GitHub仓库URL
		const githubUrl = await getGitHubUrl(filePath);

		// 4. 获取用户输入的笔记内容
		const noteContent = await vscode.window.showInputBox({
			prompt: 'Enter your notes for this code snippet',
			placeHolder: 'Add your thoughts here...'
		});

		// 5. 准备发送到笔记云的数据
		const snippet: Snippet = {
			content: selectedCode,
			filePath: filePath,
			githubUrl: githubUrl || 'Unknown repository',
			note: noteContent || '',
			timestamp: new Date().toISOString(),
			language: vscode.window.activeTextEditor?.document.languageId || '',
			type:0,
		};

		// 6. 获取API配置
		const { apiUrl, apiKey } = getApiConfig();
		if (!apiUrl || !apiKey) {
			vscode.window.showErrorMessage('Please configure Note Cloud API URL and API Key first');
			return;
		}

		// 7. 发送到笔记云
		const client = new NoteCloudClient(apiUrl, apiKey);
		Logger.debug(formatSnippetAsMarkdown(snippet));
		const result = await client.saveSnippet(snippet);

		if (result.success) {
			showSuccess('Code snippet saved to note cloud successfully!');
		} else {
			showError(`Failed to save snippet: ${result.message}`);
		}
	} catch (error) {
		showError(`Error saving to note cloud: ${error instanceof Error ? error.message : String(error)}`);
	}
}
