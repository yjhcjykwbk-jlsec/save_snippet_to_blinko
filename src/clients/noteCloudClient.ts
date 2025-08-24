import axios, { AxiosInstance, AxiosError } from 'axios';
import { Snippet } from '../types/snippet';
import { formatSnippetAsMarkdown } from '../utils/formatter';

export interface SaveResult {
	success: boolean;
	message: string;
	data?: any;
}

export class NoteCloudClient {
	private axios: AxiosInstance;

	constructor(apiUrl: string, apiKey: string) {
		this.axios = axios.create({
			baseURL: apiUrl,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			}
		});
	}


	snippetToMarkdown(snippet: Snippet): string {
		// 格式化时间戳为可读性更强的格式
		const formattedDate = new Date(snippet.timestamp).toLocaleString();

		// 构建Markdown内容
		const markdownParts: string[] = [];

		// 标题部分 - 使用文件路径作为主标题
		markdownParts.push(`# 代码片段: ${snippet.filePath.split('/').pop() || 'unknown'}`);

		// 元信息部分 - 使用表格展示关键信息
		markdownParts.push('## 元信息');
		markdownParts.push('| 项目 | 内容 |');
		markdownParts.push('|------|------|');
		markdownParts.push(`| 文件路径 | \`${snippet.filePath}\` |`);
		if (snippet.githubUrl) {
			markdownParts.push(`| GitHub 链接 | [查看代码](${snippet.githubUrl}) |`);
		}
		markdownParts.push(`| 语言 | ${snippet.language} |`);
		markdownParts.push(`| 保存时间 | ${formattedDate} |`);

		// 代码内容部分 - 使用对应语言的代码块
		markdownParts.push('\n## 代码内容');
		markdownParts.push(`\`\`\`${snippet.language || 'plaintext'}`);
		markdownParts.push(snippet.content);
		markdownParts.push('```');

		// 笔记部分 - 如果有笔记内容则添加
		if (snippet.note && snippet.note.trim()) {
			markdownParts.push('\n## 笔记');
			markdownParts.push(snippet.note);
		}

		// 拼接所有部分并返回
		return markdownParts.join('\n');
	}


	/**
	 * 保存代码片段到笔记云
	 * @param snippet 代码片段信息
	 * @returns 保存结果
	 */
	async saveSnippet(snippet: Snippet): Promise<SaveResult> {
		try {
			var data = { content: formatSnippetAsMarkdown(snippet), type: 0 };
			const response = await this.axios.post('/api/v1/note/upsert', data);
			return {
				success: true,
				message: 'Snippet saved successfully',
				data: response.data
			};
		} catch (error) {
			if (error instanceof AxiosError) {
				return {
					success: false,
					message: error.response?.data?.message || `HTTP error: ${error.response?.status}`
				};
			}
			return {
				success: false,
				message: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * 获取笔记云中的代码片段列表
	 * @returns 代码片段列表
	 */
	async getSnippets(): Promise<SaveResult> {
		try {
			const response = await this.axios.get('/snippets');
			return {
				success: true,
				message: 'Snippets retrieved successfully',
				data: response.data
			};
		} catch (error) {
			if (error instanceof AxiosError) {
				return {
					success: false,
					message: error.response?.data?.message || `HTTP error: ${error.response?.status}`
				};
			}
			return {
				success: false,
				message: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}
}
