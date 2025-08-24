/**
 * 插件配置项
 */
export interface ExtensionConfig {
	/** 笔记云API地址 */
	noteCloudApiUrl: string;
	/** API密钥 */
	apiKey: string;
	/** 是否启用自动同步 */
	autoSync: boolean;
	/** 同步间隔(分钟) */
	syncInterval: number;
}
