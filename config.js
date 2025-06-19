// 网站配置文件

// 会员密码设置
const MEMBER_CONFIG = {
    password: "888888",  // 会员密码
    passwordVersion: "2" // 密码版本号，每次修改密码时递增
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MEMBER_CONFIG };
} else {
    // 浏览器环境
    if (typeof window !== 'undefined') {
        window.MEMBER_CONFIG = MEMBER_CONFIG;
    }
}