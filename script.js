document.addEventListener('DOMContentLoaded', function () {
    // 使用all-albums.js中的相册数据
    // 给所有没有适当标签的相册添加默认标签
    albums.forEach(album => {
        if (!album.tags || album.tags.length === 0 || (album.tags.length === 1 && album.tags[0] === 'gallery')) {
            album.tags = ['性感', '私房', '写真'];
        }
    });

    // 轮播图逻辑
    function setupCarousel() {
        const carouselEl = document.getElementById('carousel');
        const dotsEl = document.getElementById('carousel-dots');
        const prevBtn = document.getElementById('prev');
        const nextBtn = document.getElementById('next');

        // 选择5个相册作为轮播图
        const featuredAlbums = albums.slice(0, 5);
        let currentSlide = 0;

        // 创建轮播图幻灯片
        featuredAlbums.forEach((album, index) => {
            // 创建幻灯片
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';

            // 创建图片
            const img = document.createElement('img');
            // 修复路径格式
            const fixedThumbnailPath = album.thumbnail.replace(/\\/g, '/');
            const fixedFolderPath = album.folder.replace(/\\/g, '/');

            // 处理特殊字符路径
            function tryEncodePath(path) {
                // 尝试不同的编码方式
                const encodedPath = path
                    .split('/')
                    .map(segment => {
                        // 只编码包含特殊字符的部分
                        if (/[^\x00-\x7F]/.test(segment)) {
                            try {
                                return encodeURIComponent(segment);
                            } catch (e) {
                                return segment;
                            }
                        }
                        return segment;
                    })
                    .join('/');
                return encodedPath;
            }

            const encodedThumbnailPath = tryEncodePath(fixedThumbnailPath);
            const encodedFolderPath = tryEncodePath(fixedFolderPath);

            img.src = encodedThumbnailPath;
            img.alt = album.title;
            img.onerror = function () {
                console.log(`轮播图原始缩略图加载失败: ${encodedThumbnailPath}`);
                console.log(`轮播图尝试加载备选图: ${encodedFolderPath}/1.jpg`);
                this.src = encodedFolderPath + '/1.jpg';
                this.onerror = function () {
                    console.log(`轮播图尝试加载备选图: ${encodedFolderPath}/01.jpg`);
                    this.src = encodedFolderPath + '/01.jpg';
                    this.onerror = function () {
                        console.log(`轮播图尝试加载备选图: ${encodedFolderPath}/001.jpg`);
                        this.src = encodedFolderPath + '/001.jpg';
                        this.onerror = function () {
                            // 如果以上都失败，尝试不同的路径格式
                            const folderName = encodedFolderPath.split('/').pop();
                            console.log(`轮播图尝试简化路径: image/${folderName}/1.jpg`);
                            this.src = `image/${folderName}/1.jpg`;
                            this.onerror = function () {
                                console.log(`轮播图所有图片加载失败: ${encodedFolderPath}`);
                                this.src = 'https://via.placeholder.com/800x400?text=加载失败';
                                console.error(`轮播图加载失败: ${encodedFolderPath} - 请检查目录是否存在或格式是否正确`);
                            };
                        };
                    };
                };
            };

            // 创建标题
            const caption = document.createElement('div');
            caption.className = 'carousel-caption';
            const title = document.createElement('h3');
            title.textContent = album.title;
            const count = document.createElement('p');
            count.textContent = `${album.count} 张精美图片`;

            caption.appendChild(title);
            caption.appendChild(count);

            // 添加到幻灯片
            slide.appendChild(img);
            slide.appendChild(caption);

            // 添加点击事件
            slide.addEventListener('click', () => {
                viewAlbum(album);
            });

            // 添加到轮播图
            carouselEl.appendChild(slide);

            // 创建指示点
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            dotsEl.appendChild(dot);
        });

        // 设置轮播图控制
        function goToSlide(n) {
            currentSlide = n;
            carouselEl.style.transform = `translateX(-${currentSlide * 100}%)`;
            document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + featuredAlbums.length) % featuredAlbums.length;
            goToSlide(currentSlide);
        });

        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % featuredAlbums.length;
            goToSlide(currentSlide);
        });

        // 自动轮播
        let interval = setInterval(() => {
            currentSlide = (currentSlide + 1) % featuredAlbums.length;
            goToSlide(currentSlide);
        }, 5000);

        // 添加触摸支持
        let startX, moveX;
        let isDragging = false;

        carouselEl.addEventListener('touchstart', (e) => {
            clearInterval(interval);
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        carouselEl.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            moveX = e.touches[0].clientX;
            const diff = moveX - startX;
            const movePercent = (diff / window.innerWidth) * 100;

            // 限制拖动范围
            if (currentSlide === 0 && diff > 0) return;
            if (currentSlide === featuredAlbums.length - 1 && diff < 0) return;

            carouselEl.style.transform = `translateX(calc(-${currentSlide * 100}% + ${movePercent}%))`;
        }, { passive: true });

        carouselEl.addEventListener('touchend', (e) => {
            isDragging = false;
            if (!moveX) return;

            const diff = moveX - startX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // 向左滑，下一张
                    currentSlide = (currentSlide - 1 + featuredAlbums.length) % featuredAlbums.length;
                } else {
                    // 向右滑，上一张
                    currentSlide = (currentSlide + 1) % featuredAlbums.length;
                }
                goToSlide(currentSlide);
            } else {
                // 回到原位
                goToSlide(currentSlide);
            }

            moveX = null;

            // 恢复自动轮播
            interval = setInterval(() => {
                currentSlide = (currentSlide + 1) % featuredAlbums.length;
                goToSlide(currentSlide);
            }, 5000);
        }, { passive: true });
    }

    // 初始化轮播图
    setupCarousel();

    const gallery = document.getElementById('gallery');
    const galleryContainer = document.querySelector('.gallery-container');

    // Get all unique tags
    const allTags = [...new Set(albums.flatMap(album => album.tags))];

    // Create tag filters
    const tagFiltersContainer = document.createElement('div');
    tagFiltersContainer.className = 'tag-filters';

    // Add "全部" tag
    const allTagSpan = document.createElement('span');
    allTagSpan.className = 'tag active';
    allTagSpan.textContent = '全部';
    allTagSpan.dataset.tag = 'all';
    tagFiltersContainer.appendChild(allTagSpan);

    // 创建标签统计
    const tagCounts = {};
    albums.forEach(album => {
        album.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    // 使用固定的标签列表（根据数据分析得出的最常用标签）
    const tags = ["全部", "年年", "写真", "AI", "Coser", "OL", "秀人", "落落", "18禁", "DJAWA", "制服", "韩系"];
    // 移除"全部"标签，因为已经在前面添加了
    const topTags = tags.slice(1);

    // Add top tags
    topTags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag';
        tagSpan.textContent = tag;
        tagSpan.dataset.tag = tag;
        tagFiltersContainer.appendChild(tagSpan);
    });

    // Insert tag filters after section-title
    const sectionTitle = document.querySelector('.section-title');
    sectionTitle.after(tagFiltersContainer);

    // 分页设置
    const itemsPerPage = 12; // 增加每页显示的数量
    let currentPage = 1;
    let filteredAlbums = albums;

    // 创建分页控制器
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn prev';
    prevBtn.textContent = '上一页';

    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';

    // 添加跳转页输入框和按钮
    const jumpContainer = document.createElement('div');
    jumpContainer.className = 'jump-container';

    const jumpInput = document.createElement('input');
    jumpInput.type = 'number';
    jumpInput.min = '1';
    jumpInput.className = 'jump-input';
    jumpInput.placeholder = '页码';

    const jumpBtn = document.createElement('button');
    jumpBtn.className = 'jump-btn';
    jumpBtn.textContent = '跳转';

    jumpContainer.appendChild(jumpInput);
    jumpContainer.appendChild(jumpBtn);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn next';
    nextBtn.textContent = '下一页';

    paginationContainer.appendChild(prevBtn);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(jumpContainer);
    paginationContainer.appendChild(nextBtn);

    // 添加分页控制器到画廊容器下方
    galleryContainer.appendChild(paginationContainer);

    // Function to render albums with pagination
    function renderAlbums(albumsToRender) {
        filteredAlbums = albumsToRender;
        currentPage = 1;
        renderCurrentPage();
    }

    // Function to render current page
    function renderCurrentPage() {
        gallery.innerHTML = '';

        const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage);
        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = Math.min(startIdx + itemsPerPage, filteredAlbums.length);

        // 更新页码信息
        pageInfo.textContent = `${currentPage} / ${totalPages} (共 ${filteredAlbums.length} 个相册)`;

        // 更新按钮状态
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        // 渲染当前页的相册
        for (let i = startIdx; i < endIdx; i++) {
            const albumElement = createAlbumElement(filteredAlbums[i]);
            gallery.appendChild(albumElement);
        }
    }

    // 上一页按钮事件
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderCurrentPage();
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // 下一页按钮事件
    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderCurrentPage();
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // 跳转页按钮事件
    jumpBtn.addEventListener('click', () => {
        jumpToPage();
    });

    // 输入框回车事件
    jumpInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            jumpToPage();
        }
    });

    // 跳转页函数
    function jumpToPage() {
        const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage);
        const pageNum = parseInt(jumpInput.value);

        if (pageNum && pageNum >= 1 && pageNum <= totalPages) {
            currentPage = pageNum;
            renderCurrentPage();
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // 清空输入框
            jumpInput.value = '';
        } else {
            // 输入无效，显示提示
            alert(`请输入有效页码 (1-${totalPages})`);
            jumpInput.value = '';
        }
    }

    // Add click event to tags
    tagFiltersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag')) {
            // Update active state
            document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active'));
            e.target.classList.add('active');

            const selectedTag = e.target.dataset.tag;

            // Filter albums
            const filteredAlbums = selectedTag === 'all'
                ? albums
                : albums.filter(album => album.tags.includes(selectedTag));

            // Render filtered albums
            renderAlbums(filteredAlbums);
        }
    });

    // Function to create album element
    function createAlbumElement(album) {
        const albumElement = document.createElement('div');
        albumElement.className = 'gallery-item';
        albumElement.dataset.albumId = album.id;

        // Create thumbnail container with loading state
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'thumbnail-container loading';

        // Create thumbnail image with enhanced error handling
        const img = document.createElement('img');

        // 修复路径格式
        const fixedThumbnailPath = album.thumbnail.replace(/\\/g, '/');
        const fixedFolderPath = album.folder.replace(/\\/g, '/');

        // 处理特殊字符路径
        function tryEncodePath(path) {
            // 尝试不同的编码方式
            const encodedPath = path
                .split('/')
                .map(segment => {
                    // 只编码包含特殊字符的部分
                    if (/[^\x00-\x7F]/.test(segment)) {
                        try {
                            return encodeURIComponent(segment);
                        } catch (e) {
                            return segment;
                        }
                    }
                    return segment;
                })
                .join('/');
            return encodedPath;
        }

        const encodedThumbnailPath = tryEncodePath(fixedThumbnailPath);
        const encodedFolderPath = tryEncodePath(fixedFolderPath);

        img.src = encodedThumbnailPath;
        img.alt = album.title;

        // 增强图片加载错误处理
        img.onerror = function () {
            console.log(`原始缩略图加载失败: ${encodedThumbnailPath}`);
            console.log(`尝试加载备选缩略图: ${encodedFolderPath}/1.jpg`);
            this.src = encodedFolderPath + '/1.jpg';
            this.onerror = function () {
                console.log(`尝试加载备选缩略图: ${encodedFolderPath}/01.jpg`);
                this.src = encodedFolderPath + '/01.jpg';
                this.onerror = function () {
                    console.log(`尝试加载备选缩略图: ${encodedFolderPath}/001.jpg`);
                    this.src = encodedFolderPath + '/001.jpg';
                    this.onerror = function () {
                        // 如果以上都失败，尝试不同的路径格式
                        const folderName = encodedFolderPath.split('/').pop();
                        console.log(`尝试简化路径: image/${folderName}/1.jpg`);
                        this.src = `image/${folderName}/1.jpg`;
                        this.onerror = function () {
                            console.log(`所有缩略图加载失败，使用占位图: ${encodedFolderPath}`);
                            this.src = 'https://via.placeholder.com/300x400?text=No+Preview';
                            // 检查目录是否存在
                            console.error(`图片加载失败: ${encodedFolderPath} - 请检查目录是否存在或格式是否正确`);
                            // 标记为错误状态
                            thumbnailContainer.classList.remove('loading');
                            thumbnailContainer.classList.add('error');
                        };
                    };
                };
            };
        };

        // 图片加载完成
        img.onload = function () {
            thumbnailContainer.classList.remove('loading');
        };

        // 将图片添加到缩略图容器
        thumbnailContainer.appendChild(img);

        // Add price tag to thumbnail container
        const price = document.createElement('div');
        price.className = 'album-price';
        price.textContent = '18禁';
        thumbnailContainer.appendChild(price);

        // Create overlay with info
        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        const title = document.createElement('h3');
        title.className = 'album-title';
        title.textContent = album.title;

        const count = document.createElement('p');
        count.className = 'image-count';
        count.textContent = `${album.count} 张精美图片`;

        // Add tags to overlay
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'album-tags';
        album.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'album-tag';
            tagSpan.textContent = tag;
            tagsContainer.appendChild(tagSpan);
        });

        overlay.appendChild(title);
        overlay.appendChild(count);
        overlay.appendChild(tagsContainer);

        // Add elements to album item
        albumElement.appendChild(thumbnailContainer);
        albumElement.appendChild(overlay);

        // Add click event to view album
        albumElement.addEventListener('click', () => {
            viewAlbum(album);
        });

        return albumElement;
    }

    // Initial render of all albums
    renderAlbums(albums);

    // Function to view an album
    function viewAlbum(album) {
        // 保存当前页码和滚动位置
        localStorage.setItem('lastPage', currentPage);
        localStorage.setItem('lastScrollPosition', window.pageYOffset);
        localStorage.setItem('lastSelectedTag', document.querySelector('.tag.active').dataset.tag);

        // 修复路径格式
        const fixedFolderPath = album.folder.replace(/\\/g, '/');

        // 处理特殊字符路径
        function tryEncodePath(path) {
            // 尝试不同的编码方式
            const encodedPath = path
                .split('/')
                .map(segment => {
                    // 只编码包含特殊字符的部分
                    if (/[^\x00-\x7F]/.test(segment)) {
                        try {
                            return encodeURIComponent(segment);
                        } catch (e) {
                            return segment;
                        }
                    }
                    return segment;
                })
                .join('/');
            return encodedPath;
        }

        // 确保正确编码
        const encodedFolderPath = tryEncodePath(fixedFolderPath);

        window.location.href = `album.html?id=${album.id}&folder=${encodeURIComponent(encodedFolderPath)}&title=${encodeURIComponent(album.title)}&count=${album.count}`;
    }

    // 检查是否从相册页面返回，恢复上次的页码和滚动位置
    function checkReturnFromAlbum() {
        const lastPage = localStorage.getItem('lastPage');
        const lastScrollPosition = localStorage.getItem('lastScrollPosition');
        const lastSelectedTag = localStorage.getItem('lastSelectedTag');

        if (lastPage && lastScrollPosition) {
            // 恢复标签过滤
            if (lastSelectedTag) {
                const tagElement = document.querySelector(`.tag[data-tag="${lastSelectedTag}"]`);
                if (tagElement) {
                    // 激活对应的标签
                    document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active'));
                    tagElement.classList.add('active');

                    // 应用标签过滤
                    const selectedTag = lastSelectedTag;
                    filteredAlbums = selectedTag === 'all'
                        ? albums
                        : albums.filter(album => album.tags.includes(selectedTag));
                }
            }

            // 恢复页码
            currentPage = parseInt(lastPage);
            renderCurrentPage();

            // 延迟一下再恢复滚动位置，确保DOM已更新
            setTimeout(() => {
                window.scrollTo(0, parseInt(lastScrollPosition));
            }, 100);
        }
    }

    // 在页面加载完成后检查是否需要恢复位置
    checkReturnFromAlbum();
}); 