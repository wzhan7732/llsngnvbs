// 自动添加新图片到画廊的脚本
const fs = require('fs');
const path = require('path');

console.log('开始扫描新相册...');

// 图像目录路径
const imageDir = path.join(__dirname, 'image');
// 相册文件路径
const albumsFilePath = path.join(__dirname, 'all-albums.js');

// 读取现有的albums数组
let existingAlbums = [];
try {
    const albumsContent = fs.readFileSync(albumsFilePath, 'utf8');
    const albumsMatch = albumsContent.match(/const albums = (\[[\s\S]*?\]);/);
    
    if (albumsMatch && albumsMatch[1]) {
        // 使用eval解析albums数组（在受控环境中是安全的）
        existingAlbums = eval(albumsMatch[1]);
        console.log(`成功读取现有相册数据，共 ${existingAlbums.length} 个相册`);
    } else {
        throw new Error('无法解析albums数组');
    }
} catch (error) {
    console.error(`读取现有相册数据失败: ${error.message}`);
    process.exit(1);
}

// 获取现有相册的文件夹路径集合
const existingFolders = new Set();
existingAlbums.forEach(album => {
    if (album.folder) {
        existingFolders.add(album.folder);
    }
});

// 从文件夹名称中提取图片数量
function extractCountFromTitle(title) {
    // 尝试找到类似 [123P] 或 [123p] 或 [123P-456MB] 的格式
    const match = title.match(/\[(\d+)[pP](?:-\d+MB)?\]/);
    if (match && match[1]) {
        return parseInt(match[1]);
    }
    return null;
}

// 从标题中获取智能标签
function getSmartTags(title) {
    console.log(`为 "${title}" 生成标签...`);
    const tags = ['gallery']; // 默认标签

    // 基本分类
    if (/AI|人工智能|artificial intelligence/i.test(title)) {
        tags.push('AI');
        console.log(`  - 添加标签: AI`);
    }

    if (/Coser|cosplay|Cosplay|COS|cos/i.test(title)) {
        tags.push('Coser');
        console.log(`  - 添加标签: Coser`);
    }

    if (/XIUREN|秀人|XIAOYU|语画界|YOUMI|尤蜜荟|UGIRLS|爱尤物|FEILIN|嗲囡囡|IMISS|爱蜜社|MiiTao|蜜桃社|MFStar|模范学院|UXING|优星馆|SLADY|猎女神|XINGYAN|星颜社|LEGBABY|美腿宝贝/i.test(title)) {
        tags.push('写真');
        console.log(`  - 添加标签: 写真`);
    }

    if (/XIUREN|秀人/i.test(title)) {
        tags.push('秀人');
        console.log(`  - 添加标签: 秀人`);
    }

    if (/DJAWA|BLUECAKE|디자와|디블루/i.test(title)) {
        tags.push('DJAWA');
        console.log(`  - 添加标签: DJAWA`);
    }

    // 模特名称
    if (/年年|Nnian/i.test(title)) {
        tags.push('年年');
        console.log(`  - 添加标签: 年年`);
    }

    if (/Raku|落落/i.test(title)) {
        tags.push('落落');
        console.log(`  - 添加标签: 落落`);
    }

    if (/沫沫|蠢沫沫/i.test(title)) {
        tags.push('沫沫');
        console.log(`  - 添加标签: 沫沫`);
    }

    // 内容分级
    if (/18禁|R18|R-18|NSFW|限制级|成人|adult/i.test(title)) {
        tags.push('18禁');
        console.log(`  - 添加标签: 18禁`);
    }

    // 服装和角色标签
    if (/比基尼|bikini|Bikini/i.test(title)) {
        tags.push('比基尼');
        console.log(`  - 添加标签: 比基尼`);
    }

    if (/泳装|泳衣|swimsuit|swimwear/i.test(title)) {
        tags.push('泳装');
        console.log(`  - 添加标签: 泳装`);
    }

    if (/制服|校服|uniform/i.test(title)) {
        tags.push('制服');
        console.log(`  - 添加标签: 制服`);
    }

    if (/女仆|maid|Maid/i.test(title)) {
        tags.push('女仆');
        console.log(`  - 添加标签: 女仆`);
    }

    if (/兔女郎|bunny/i.test(title)) {
        tags.push('兔女郎');
        console.log(`  - 添加标签: 兔女郎`);
    }

    if (/护士|nurse|Nurse/i.test(title)) {
        tags.push('护士');
        console.log(`  - 添加标签: 护士`);
    }

    if (/OL|办公室|职场|office/i.test(title)) {
        tags.push('OL');
        console.log(`  - 添加标签: OL`);
    }

    if (/和服|浴衣|yukata|kimono/i.test(title)) {
        tags.push('和服');
        console.log(`  - 添加标签: 和服`);
    }

    if (/蕾丝|lace/i.test(title)) {
        tags.push('蕾丝');
        console.log(`  - 添加标签: 蕾丝`);
    }

    if (/黑白|black.*white|white.*black/i.test(title)) {
        tags.push('黑白');
        console.log(`  - 添加标签: 黑白`);
    }

    if (/皮质|皮革|leather/i.test(title)) {
        tags.push('皮质');
        console.log(`  - 添加标签: 皮质`);
    }

    // 场景标签
    if (/厨房|kitchen/i.test(title)) {
        tags.push('厨房');
        console.log(`  - 添加标签: 厨房`);
    }

    if (/图书馆|library/i.test(title)) {
        tags.push('图书馆');
        console.log(`  - 添加标签: 图书馆`);
    }

    if (/沙漠|desert/i.test(title)) {
        tags.push('沙漠');
        console.log(`  - 添加标签: 沙漠`);
    }

    if (/运动|sport|健身|gym/i.test(title)) {
        tags.push('运动');
        console.log(`  - 添加标签: 运动`);
    }

    if (/民国/i.test(title)) {
        tags.push('民国');
        console.log(`  - 添加标签: 民国`);
    }

    if (/清纯|pure/i.test(title)) {
        tags.push('清纯');
        console.log(`  - 添加标签: 清纯`);
    }

    if (/衬衫|shirt/i.test(title)) {
        tags.push('衬衫');
        console.log(`  - 添加标签: 衬衫`);
    }

    return tags;
}

// 扫描image目录，查找新相册
let newAlbums = [];
try {
    // 读取image目录下的所有文件夹
    const folders = fs.readdirSync(imageDir)
        .filter(item => {
            const folderPath = path.join(imageDir, item);
            return fs.statSync(folderPath).isDirectory();
        });

    console.log(`找到 ${folders.length} 个文件夹，开始检查新相册...`);

    // 检查每个文件夹是否已存在于albums中
    folders.forEach(folder => {
        const folderPath = path.join(imageDir, folder);
        const relativeFolderPath = `image/${folder}`;

        // 如果文件夹已存在于albums中，跳过
        if (existingFolders.has(relativeFolderPath)) {
            return;
        }

        console.log(`发现新相册: ${folder}`);

        try {
            // 读取文件夹内的图片文件
            const files = fs.readdirSync(folderPath)
                .filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
                });

            // 计算图片数量
            const count = files.length;

            if (count > 0) {
                // 确定缩略图
                let thumbnail = '';

                // 尝试常见的缩略图文件名
                const possibleThumbnails = ['1.jpg', '01.jpg', '001.jpg', 'cover.jpg', 'thumb.jpg'];
                for (const thumbName of possibleThumbnails) {
                    if (files.includes(thumbName)) {
                        thumbnail = `image/${folder}/${thumbName}`;
                        break;
                    }
                }

                // 如果没有找到匹配的缩略图，使用第一张图片
                if (!thumbnail && count > 0) {
                    // 按文件名排序，选择第一个
                    const sortedFiles = files.sort();
                    thumbnail = `image/${folder}/${sortedFiles[0]}`;
                }

                // 从文件夹名称中提取图片数量（如果可能）
                const extractedCount = extractCountFromTitle(folder);
                
                // 创建相册对象
                const album = {
                    id: `album_${existingAlbums.length + newAlbums.length}`,
                    title: folder,
                    folder: relativeFolderPath,
                    count: extractedCount || count, // 使用提取的数量或实际文件数
                    thumbnail: thumbnail,
                    tags: getSmartTags(folder)
                };

                // 添加到新相册数组
                newAlbums.push(album);
                console.log(`已添加新相册: ${folder} (${count}张图片)`);
            } else {
                console.log(`跳过空文件夹: ${folder}`);
            }
        } catch (error) {
            console.error(`处理文件夹 ${folder} 时出错: ${error.message}`);
        }
    });

    console.log(`发现 ${newAlbums.length} 个新相册`);

    // 如果有新相册，更新albums.js文件
    if (newAlbums.length > 0) {
        // 合并现有相册和新相册
        const updatedAlbums = [...existingAlbums, ...newAlbums];
        
        // 格式化albums数组为字符串
        let albumsString = JSON.stringify(updatedAlbums, null, 4);
        
        // 修复格式，使其符合JavaScript语法
        albumsString = albumsString.replace(/"([^"]+)":/g, '    "$1":');
        
        // 创建新的文件内容
        const newFileContent = `const albums = ${albumsString};\n`;
        
        // 备份原文件
        const backupPath = `${albumsFilePath}.${Date.now()}.bak`;
        fs.copyFileSync(albumsFilePath, backupPath);
        console.log(`已备份原文件到: ${backupPath}`);
        
        // 写入新文件
        fs.writeFileSync(albumsFilePath, newFileContent, 'utf8');
        console.log(`已更新 all-albums.js 文件，添加了 ${newAlbums.length} 个新相册`);
    } else {
        console.log('没有发现新相册，无需更新文件');
    }

} catch (error) {
    console.error(`扫描目录时出错: ${error.message}`);
    process.exit(1);
}