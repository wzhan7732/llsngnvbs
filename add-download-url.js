// 读取原始的 all-albums.js 文件
const fs = require('fs');
const path = require('path');

// 读取原始文件
console.log('读取 all-albums.js 文件...');
const allAlbumsFile = path.join(__dirname, 'all-albums.js');
const allAlbumsContent = fs.readFileSync(allAlbumsFile, 'utf8');

// 提取 albums 数组
const startMarker = 'const albums = [';
const endMarker = '];';

const startIndex = allAlbumsContent.indexOf(startMarker) + startMarker.length;
const endIndex = allAlbumsContent.lastIndexOf(endMarker);

const albumsArrayString = allAlbumsContent.substring(startIndex, endIndex);
// 解析 albums 数组
const albumsArray = eval('[' + albumsArrayString + ']');

console.log(`找到 ${albumsArray.length} 个相册。`);
console.log('添加 downloadUrl 字段...');

// 添加 downloadUrl 字段到每个相册
let modified = 0;
albumsArray.forEach(album => {
    if (!album.downloadUrl) {
        album.downloadUrl = "https://share.feijipan.com/s/R1Hq8tAd?code=2gat"; // 默认下载链接
        modified++;
    }
});

console.log(`已修改 ${modified} 个相册。`);

// 重建 all-albums.js 文件
const newContent = `const albums = ${JSON.stringify(albumsArray, null, 4)};`;
const backupFile = path.join(__dirname, 'all-albums.js.bak');

console.log('备份原始文件到 all-albums.js.bak...');
fs.writeFileSync(backupFile, allAlbumsContent);

console.log('写入新文件...');
fs.writeFileSync(allAlbumsFile, newContent);

console.log('完成！'); 