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
