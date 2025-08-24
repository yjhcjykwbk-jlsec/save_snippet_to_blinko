import * as vscode from 'vscode';
import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';

/**
 * 获取文件所在的GitHub仓库URL
 * @param filePath 当前文件路径
 * @returns GitHub仓库URL，如果无法获取则返回null
 */
export async function getGitHubUrl(filePath: string): Promise<string | null> {
	try {
		// 获取工作区根目录
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath));
		if (!workspaceFolder) {
			return null;
		}

		// 初始化git客户端
		const git: SimpleGit = simpleGit(workspaceFolder.uri.fsPath);
		
		// 检查是否是git仓库
		if (!await git.checkIsRepo()) {
			return null;
		}

		// 获取远程仓库信息
		const remotes = await git.getRemotes(true);
		if (!remotes || remotes.length === 0) {
			return null;
		}

		// 查找origin远程仓库
		const origin = remotes.find(remote => remote.name === 'origin');
		if (!origin || !origin.refs.fetch) {
			return null;
		}

		// 获取当前分支
		const branchSummary = await git.branch();
		const currentBranch = branchSummary.current || 'main';

		// 转换为HTTPS格式的GitHub URL
		let githubUrl = origin.refs.fetch;
		
		// 处理SSH格式的URL (git@github.com:user/repo.git)
		if (githubUrl.startsWith('git@')) {
			githubUrl = githubUrl.replace(':', '/').replace('git@', 'https://');
		}
		
		// 移除.git后缀
		if (githubUrl.endsWith('.git')) {
			githubUrl = githubUrl.slice(0, -4);
		}

		// 获取文件在仓库中的相对路径
		const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);
		
		// 构建完整的文件URL
		return `${githubUrl}/blob/${currentBranch}/${relativePath}`;
	} catch (error) {
		console.error('Error getting GitHub URL:', error);
		return null;
	}
}
