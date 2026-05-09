/**
 * common.js - Core logic for data initialization and auth
 */

// Constants
const DATA_PATHS = {
    clubs: '/data/club.json',
    members: '/data/member.json'
};

const STORAGE_KEYS = {
    user: 'loginUser',
    clubs: 'clubData',
    members: 'memberData',
    admin: 'adminAccount' // Added admin account
};

// Initialize Data
async function initData() {
    // Init Admin Account if missing
    if (!localStorage.getItem(STORAGE_KEYS.admin)) {
        const admin = {
            username: 'admin',
            password: '123456' // Default
        };
        localStorage.setItem(STORAGE_KEYS.admin, JSON.stringify(admin));
    }

    // Check if data exists in localStorage
    if (!localStorage.getItem(STORAGE_KEYS.clubs)) {
        try {
            const response = await fetch(DATA_PATHS.clubs);
            const data = await response.json();
            localStorage.setItem(STORAGE_KEYS.clubs, JSON.stringify(data));
            console.log('Club data initialized');
        } catch (error) {
            console.error('Failed to load club data', error);
        }
    }

    if (!localStorage.getItem(STORAGE_KEYS.members)) {
        try {
            const response = await fetch(DATA_PATHS.members);
            const data = await response.json();
            localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(data));
            console.log('Member data initialized');
        } catch (error) {
            console.error('Failed to load member data', error);
        }
    }
}

// Check Authentication
function checkAuth() {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (!user && !isLoginPage) {
        window.location.href = '/login.html';
    } else if (user && isLoginPage) {
        window.location.href = '/index.html';
    }
    
    return user ? JSON.parse(user) : null;
}

// Logout
function logout() {
    localStorage.removeItem(STORAGE_KEYS.user);
    window.location.href = '/login.html';
}

// Helper: Get Logged In User
function getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    return user ? JSON.parse(user) : null;
}

// Export functions to global scope (simple module pattern for vanilla JS without modules)
window.App = {
    initData,
    checkAuth,
    logout,
    getCurrentUser,
    renderLayout, // Export renderLayout
    STORAGE_KEYS
};

// Layout Renderer
function renderLayout(activeNavIndex = 0) {
    const user = getCurrentUser();
    if (!user) return; // Should be handled by checkAuth

    // Header HTML
    const headerHtml = `
        <div class="layui-header">
            <div class="layui-logo layui-bg-black">校园社团管理系统</div>
            
            <!-- Mobile Toggle Button -->
            <ul class="layui-nav layui-layout-left layui-show-xs-block layui-hide-sm" style="left: 0;">
                <li class="layui-nav-item">
                    <a href="javascript:;" id="mobile-nav-toggle" style="padding: 0 20px; display: flex; align-items: center; height: 60px;">
                        <i class="layui-icon layui-icon-spread-left" style="font-size: 20px;"></i>
                    </a>
                </li>
            </ul>
            
            <!-- Header Right -->
            <ul class="layui-nav layui-layout-right">
                <li class="layui-nav-item layui-show-md-inline-block">
                    <a href="javascript:;">
                        <img src="//t.cn/RCzsdCq" class="layui-nav-img">
                        ${user.username}
                    </a>
                    <dl class="layui-nav-child">
                        <dd><a href="/src/pages/user/profile.html">个人中心</a></dd>
                        <dd><a href="javascript:;" onclick="App.logout()">退出登录</a></dd>
                    </dl>
                </li>
            </ul>
        </div>
    `;

    // Sidebar HTML
    const navItems = [
        { title: '首页', href: '/index.html' },
        { title: '社团管理', href: '/src/pages/club/list.html' },
        { title: '成员管理', href: '/src/pages/member/list.html' },
        { title: '个人中心', href: '/src/pages/user/profile.html' }
    ];

    let navHtml = '';
    navItems.forEach((item, index) => {
        const activeClass = index === activeNavIndex ? 'layui-this' : '';
        navHtml += `<li class="layui-nav-item ${activeClass}"><a href="${item.href}">${item.title}</a></li>`;
    });

    const sidebarHtml = `
        <div class="layui-side layui-bg-black">
            <div class="layui-side-scroll">
                <ul class="layui-nav layui-nav-tree" lay-filter="test">
                    ${navHtml}
                </ul>
            </div>
        </div>
    `;

    // Inject into specific containers or body if using full layout class
    // We assume the page has <div class="layui-layout layui-layout-admin">
    const layoutContainer = document.querySelector('.layui-layout-admin');
    if (layoutContainer) {
        layoutContainer.insertAdjacentHTML('afterbegin', headerHtml + sidebarHtml);
    }
    
    // Re-render element (LayUI requirement)
    if (window.layui && layui.element) {
        layui.element.render('nav');
    }

    // Mobile Toggle Event
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    if(toggleBtn){
        toggleBtn.addEventListener('click', function(){
            const layout = document.querySelector('.layui-layout-admin');
            layout.classList.toggle('show-side');
            
            // Toggle 'layui-this' on the toggle button itself to show active state
            if(layout.classList.contains('show-side')){
                this.parentElement.classList.add('layui-this');
            } else {
                this.parentElement.classList.remove('layui-this');
            }
        });
    }
}

// Global Layer Config
if (window.layui) {
    layui.use(['layer'], function(){
        const layer = layui.layer;
        layer.config({
            offset: '100px' // Global offset for all layer calls (including msg)
        });
    });
}

