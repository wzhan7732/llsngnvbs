// 更新会员密码的Node.js脚本
const fs = require('fs');
const path = require('path');

// 获取命令行参数
const args = process.argv.slice(2);
const newPassword = args[0];

// 验证参数
if (!newPassword) {
    console.error('错误: 请提供新密码');
    console.log('用法: node update-password.js <新密码>');
    process.exit(1);
}

// 配置文件路径
const configPath = path.join(__dirname, 'config.js');

// 读取当前配置
try {
    // 读取文件内容
    const configContent = fs.readFileSync(configPath, 'utf8');

    // 提取当前密码版本
    const versionMatch = configContent.match(/passwordVersion:\s*"(\d+)"/);
    if (!versionMatch) {
        throw new Error('无法在配置文件中找到密码版本号');
    }

    // 计算新版本号
    const currentVersion = parseInt(versionMatch[1]);
    const newVersion = currentVersion + 1;

    // 创建新的配置内容
    const newConfigContent = `// 网站配置文件

// 会员密码设置
const MEMBER_CONFIG = {
    password: "${newPassword}",  // 会员密码
    passwordVersion: "${newVersion}" // 密码版本号，每次修改密码时递增
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MEMBER_CONFIG };
} else {
    // 浏览器环境
    if (typeof window !== 'undefined') {
        window.MEMBER_CONFIG = MEMBER_CONFIG;
    }
}`;

    // 写入新配置
    fs.writeFileSync(configPath, newConfigContent, 'utf8');

    console.log(`密码已成功更新为: ${newPassword}`);
    console.log(`密码版本已从 ${currentVersion} 更新为 ${newVersion}`);

} catch (error) {
    console.error(`更新密码失败: ${error.message}`);
    process.exit(1);
} 