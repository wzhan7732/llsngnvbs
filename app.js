// 全局变量
const albums = [
    {
        id: 1,
        title: "[XIUREN] VOL.2108 NUO MEI ZI MINI",
        folder: "image/[XIUREN] VOL.2108 NUO MEI ZI MINI [87P]",
        count: 87,
        date: "2023-12-15",
        cover: "image/[XIUREN] VOL.2108 NUO MEI ZI MINI [87P]/1.jpg"
    },
    {
        id: 2,
        title: "[JVID] 婕咪 – 我喜欢在学长的胯下",
        folder: "image/[JVID] 婕咪我喜欢在学长的胯下 [76P]",
        count: 76,
        date: "2023-12-10",
        cover: "image/[JVID] 婕咪我喜欢在学长的胯下 [76P]/1.jpg"
    },
    {
        id: 3,
        title: "[XIUREN] VOL.2113 NUO MEI ZI",
        folder: "image/[XIUREN] VOL.2113 NUO MEI ZI [55P]",
        count: 55,
        date: "2023-12-05",
        cover: "image/[XIUREN] VOL.2113 NUO MEI ZI [55P]/1.jpg"
    }
];

let currentAlbum = null;
let currentImageIndex = 0;

// DOM元素
const galleryContainer = document.querySelector('.gallery-container');
const mainImage = document.getElementById('main-image');
const albumTitle = document.getElementById('album-title');
const photoCount = document.getElementById('photo-count');
const albumDate = document.getElementById('album-date');
const thumbnailsContainer = document.querySelector('.thumbnails');
const fullscreenViewer = document.getElementById('fullscreen-viewer');
const fullscreenImage = document.getElementById('fullscreen-image');

// 初始化页面
function initPage() {
    console.log("页面初始化...");
    loadGallery();
    setupEventListeners();

    // 默认加载第一个相册
    if (albums.length > 0) {
        loadAlbumDetails(albums[0]);
    }
}

// 加载图库
function loadGallery() {
    console.log("开始加载图库...");
    galleryContainer.innerHTML = '';

    albums.forEach(album => {
        console.log(`创建相册项：${album.title}`);
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        item.dataset.id = album.id;

        const img = document.createElement('img');
        img.src = album.cover;
        img.alt = album.title;
        console.log(`设置封面图片: ${album.cover}`);

        // 添加图片加载错误处理
        img.onerror = function () {
            this.onerror = null;
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMThweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
            console.error(`封面图加载失败: ${album.cover}`);
        };

        const caption = document.createElement('div');
        caption.classList.add('caption');
        caption.innerHTML = `
            <h3>${album.title}</h3>
            <p>${album.count} 张图片</p>
        `;

        item.appendChild(img);
        item.appendChild(caption);

        // 使用更直接的点击事件绑定方式
        item.onclick = function () {
            console.log(`点击了相册: ${album.title}`);
            loadAlbumDetails(album);
        };

        galleryContainer.appendChild(item);
    });
}

// 加载相册详情
function loadAlbumDetails(album) {
    console.log(`加载相册详情: ${album.title}`);
    currentAlbum = album;
    currentImageIndex = 0;

    // 更新详情头部信息
    albumTitle.textContent = album.title;
    photoCount.textContent = `${album.count} 张图片`;
    albumDate.textContent = `发布日期: ${album.date}`;

    // 加载主图
    console.log(`设置主图: ${album.folder}/1.jpg`);
    mainImage.src = `${album.folder}/1.jpg`;
    mainImage.alt = `${album.title} - 图片1`;

    // 添加图片加载错误处理
    mainImage.onerror = function () {
        this.onerror = null;
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMThweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
        console.error(`主图加载失败: ${this.src}`);
    };

    // 加载缩略图
    loadThumbnails(album);

    // 显示详情区域，确保它是可见的
    document.querySelector('.details').style.display = 'block';
}

// 加载缩略图
function loadThumbnails(album) {
    thumbnailsContainer.innerHTML = '';

    // 为了演示，我们假设图片是按1.jpg, 2.jpg等命名的
    for (let i = 1; i <= album.count; i++) {
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('thumbnail');
        if (i === 1) thumbnail.classList.add('active');

        const img = document.createElement('img');
        img.src = `${album.folder}/${i}.jpg`;
        img.alt = `缩略图 ${i}`;

        // 添加图片加载错误处理
        img.onerror = function () {
            this.onerror = null;
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTJweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+5Ye66ZSZ5LqGPC90ZXh0Pjwvc3ZnPg==';
            console.error(`缩略图加载失败: ${this.src}`);
        };

        thumbnail.appendChild(img);
        thumbnail.addEventListener('click', () => {
            selectImage(i - 1);
        });

        thumbnailsContainer.appendChild(thumbnail);
    }
}

// 选择图片
function selectImage(index) {
    if (!currentAlbum) return;

    currentImageIndex = index;

    // 更新主图
    mainImage.src = `${currentAlbum.folder}/${index + 1}.jpg`;
    mainImage.alt = `${currentAlbum.title} - 图片${index + 1}`;

    // 添加图片加载错误处理
    mainImage.onerror = function () {
        this.onerror = null;
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMThweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
        console.error(`图片加载失败: ${this.src}`);
    };

    // 更新缩略图选中状态
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });

    // 确保缩略图可见
    const activeThumb = document.querySelector('.thumbnail.active');
    if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// 切换到下一张图片
function nextImage() {
    if (!currentAlbum) return;

    let nextIndex = currentImageIndex + 1;
    if (nextIndex >= currentAlbum.count) {
        nextIndex = 0;
    }

    selectImage(nextIndex);
}

// 切换到上一张图片
function prevImage() {
    if (!currentAlbum) return;

    let prevIndex = currentImageIndex - 1;
    if (prevIndex < 0) {
        prevIndex = currentAlbum.count - 1;
    }

    selectImage(prevIndex);
}

// 显示全屏
function showFullscreen() {
    if (!currentAlbum) return;

    fullscreenImage.src = mainImage.src;
    fullscreenImage.alt = mainImage.alt;

    // 添加全屏图片加载错误处理
    fullscreenImage.onerror = function () {
        this.onerror = null;
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjRweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
        console.error(`全屏图片加载失败: ${this.src}`);
    };

    fullscreenViewer.classList.remove('hidden');

    // 禁止滚动
    document.body.style.overflow = 'hidden';
}

// 关闭全屏
function closeFullscreen() {
    fullscreenViewer.classList.add('hidden');

    // 恢复滚动
    document.body.style.overflow = '';
}

// 设置事件监听器
function setupEventListeners() {
    // 全屏查看
    document.getElementById('fullscreen-btn').addEventListener('click', showFullscreen);
    document.getElementById('close-fullscreen').addEventListener('click', closeFullscreen);

    // 全屏下的导航
    document.getElementById('prev-image').addEventListener('click', () => {
        prevImage();
        fullscreenImage.src = mainImage.src;
        // 确保全屏模式下图片切换时也有错误处理
        fullscreenImage.onerror = function () {
            this.onerror = null;
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjRweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
            console.error(`全屏图片加载失败: ${this.src}`);
        };
    });

    document.getElementById('next-image').addEventListener('click', () => {
        nextImage();
        fullscreenImage.src = mainImage.src;
        // 确保全屏模式下图片切换时也有错误处理
        fullscreenImage.onerror = function () {
            this.onerror = null;
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjRweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
            console.error(`全屏图片加载失败: ${this.src}`);
        };
    });

    // 图库导航
    document.getElementById('prev-btn').addEventListener('click', () => {
        // 这里简化处理，实际可能需要分页逻辑
        alert('上一页');
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        alert('下一页');
    });

    // 幻灯片播放
    document.getElementById('slideshow-btn').addEventListener('click', () => {
        showFullscreen();
        startSlideshow();
    });

    // 下载图集
    document.getElementById('download-btn').addEventListener('click', () => {
        if (currentAlbum) {
            alert(`下载图集: ${currentAlbum.title}`);
            // 实际中这里可能是一个ZIP下载链接
        }
    });

    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (!fullscreenViewer.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                closeFullscreen();
            } else if (e.key === 'ArrowRight' || e.key === ' ') {
                nextImage();
                fullscreenImage.src = mainImage.src;
                // 键盘导航图片错误处理
                fullscreenImage.onerror = function () {
                    this.onerror = null;
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjRweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
                    console.error(`键盘导航图片加载失败: ${this.src}`);
                };
            } else if (e.key === 'ArrowLeft') {
                prevImage();
                fullscreenImage.src = mainImage.src;
                // 键盘导航图片错误处理
                fullscreenImage.onerror = function () {
                    this.onerror = null;
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjRweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
                    console.error(`键盘导航图片加载失败: ${this.src}`);
                };
            }
        }
    });
}

// 幻灯片播放
let slideshowInterval = null;

function startSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }

    slideshowInterval = setInterval(() => {
        nextImage();
        fullscreenImage.src = mainImage.src;
        // 确保幻灯片播放中也有错误处理
        fullscreenImage.onerror = function () {
            this.onerror = null;
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjRweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
            console.error(`幻灯片播放图片加载失败: ${this.src}`);
        };
    }, 3000); // 每3秒切换一次
}

function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

// 关闭全屏时停止幻灯片
document.getElementById('close-fullscreen').addEventListener('click', stopSlideshow);

// 初始化页面
document.addEventListener('DOMContentLoaded', initPage); 