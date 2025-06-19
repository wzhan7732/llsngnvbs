const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置参数
const sourceDir = 'image';
const batchSize = 10; // 每批上传的文件夹数量
const commitMessage = 'Add image folders in batches';

// 获取所有图片文件夹
function getImageFolders() {
    try {
        return fs.readdirSync(sourceDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}

// 按批次上传文件夹
async function uploadInBatches() {
    const folders = getImageFolders();
    console.log(`Found ${folders.length} folders to upload`);

    // 分批处理
    for (let i = 0; i < folders.length; i += batchSize) {
        const batch = folders.slice(i, i + batchSize);
        console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(folders.length / batchSize)}`);
        console.log(`Folders in this batch: ${batch.join(', ')}`);

        try {
            // 为每个文件夹添加到git
            batch.forEach(folder => {
                const folderPath = path.join(sourceDir, folder);
                console.log(`Adding ${folderPath} to git...`);
                try {
                    execSync(`git add "${folderPath}"`);
                    console.log(`✅ Added ${folderPath}`);
                } catch (error) {
                    console.error(`❌ Failed to add ${folderPath}:`, error.message);
                }
            });

            // 提交此批次
            const batchCommitMessage = `${commitMessage} (${i + 1}-${Math.min(i + batch.length, folders.length)})`;
            console.log(`Committing batch with message: ${batchCommitMessage}`);
            execSync(`git commit -m "${batchCommitMessage}"`);

            // 推送到远程
            console.log('Pushing to remote...');
            execSync('git push origin main');
            console.log('✅ Successfully pushed batch to remote');

            // 如果不是最后一批，等待一点时间再继续
            if (i + batchSize < folders.length) {
                console.log('Waiting 5 seconds before processing next batch...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        } catch (error) {
            console.error('❌ Error processing batch:', error.message);
            console.log('Continuing with next batch...');
        }
    }

    console.log('\n✅ All batches processed!');
}

// 执行上传
uploadInBatches().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 