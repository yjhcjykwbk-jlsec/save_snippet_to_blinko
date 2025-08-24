/**
 * 代码片段数据结构
 */
export interface Snippet {
	/** 代码内容 */
	content: string;
	/** 文件路径 */
	filePath: string;
	/** GitHub URL */
	githubUrl: string;
	/** 笔记内容 */
	note: string;
	/** 时间戳 */
	timestamp: string;
	/** 代码语言 */
	language: string;
	type: number;
}
