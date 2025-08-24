import { log } from "console";
import { Logger } from "./log";



/**
 * 从GitHub URL提取仓库名称
 * @param githubUrl GitHub仓库URL
 * @returns 仓库名（如owner/repo）或空字符串
 */
function extractRepoName(githubUrl: string): string {
	if (!githubUrl) return '';

	try {
		// 处理HTTPS格式：https://xxx.com/owner/repo[.git]/...
		const httpsMatch = githubUrl.match(/([^\/]+)\/([^\/]+)\/([^\/]+)(\.git)?/i);
		if (httpsMatch && httpsMatch.length >= 3) {
			return `${httpsMatch[3]}`;
		}

		// 处理SSH格式：git@xxx.com:owner/repo[.git]
		const sshMatch = githubUrl.match(/:([^\/]+)\/([^\/]+)(\.git)?/i);
		if (sshMatch && sshMatch.length >= 3) {
			return `${sshMatch[3]}`;
		}
	} catch (error) {
		Logger.error('提取仓库名称失败', error as Error);
	}

	return '';
}

/**
 * 将代码片段格式化为Markdown格式
 * @param snippet 代码片段
 * @returns 格式化后的Markdown字符串
 */
export function formatSnippetAsMarkdown(snippet: {
	content: string;
	language: string;
	note: string;
	filePath: string;
	githubUrl: string;
}): string {
	let markdown = `# ` + extractRepoName(snippet.githubUrl);

	// 添加笔记
	if (snippet.note) {
		markdown += `## Notes\n\n`;
		markdown += `${snippet.note}\n`;
	}

	// 添加文件信息
	markdown += `**File:** ${snippet.filePath}\n\n`;

	// 添加GitHub链接
	if (snippet.githubUrl && snippet.githubUrl !== 'Unknown repository') {
		markdown += `**GitHub:** [View on GitHub](${snippet.githubUrl})\n\n`;
	}

	// 添加代码块
	markdown += `\`\`\`${snippet.language || 'python'}\n`;
	markdown += `${snippet.content}\n`;
	markdown += `\`\`\`\n\n`;

	markdown += `#`+extractRepoName(snippet.githubUrl)+ `\n`

	return markdown;
}
