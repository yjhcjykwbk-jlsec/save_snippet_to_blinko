/**
 * 笔记云API响应通用结构
 */
export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}

/**
 * 代码片段创建请求参数
 */
export interface CreateSnippetRequest {
	content: string;
	filePath: string;
	githubUrl: string;
	note: string;
	language: string;
}
