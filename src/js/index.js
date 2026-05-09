// Index Page Logic
layui.use(['element', 'layer'], function(){
    const element = layui.element;
    
    // Init & Auth
    App.initData();
    App.checkAuth();
    App.renderLayout(0); // 0 = Home

    // Load Data
    const clubs = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.clubs) || '[]');
    const members = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.members) || '[]');

    // Update Stats
    document.getElementById('club-count').innerText = clubs.length;
    document.getElementById('member-count').innerText = members.length;

    // Chart: Club Types
    const typeCount = {};
    clubs.forEach(c => {
        typeCount[c.type] = (typeCount[c.type] || 0) + 1;
    });
    
    const chartData = Object.keys(typeCount).map(k => ({value: typeCount[k], name: k}));
    
    const chartDom = document.getElementById('type-chart');
    if(chartDom){
        const myChart = echarts.init(chartDom);
        myChart.setOption({
            title: { text: '社团类型分布', left: 'center' },
            tooltip: { trigger: 'item' },
            legend: { orient: 'vertical', left: 'left' },
            series: [{
                name: '类型',
                type: 'pie',
                radius: '50%',
                data: chartData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        });
        
        // Handle Window Resize
        window.addEventListener('resize', function(){
            myChart.resize();
        });
    }

    // Recent Activity (Last 3 added clubs/members - simplistic approach: just show last 3 clubs)
    const recentList = document.getElementById('recent-activity');
    const recentClubs = clubs.slice(-3).reverse();
    
    let html = '';
    recentClubs.forEach(c => {
        html += `
            <li class="layui-timeline-item">
                <i class="layui-icon layui-timeline-axis">&#xe63f;</i>
                <div class="layui-timeline-content layui-text">
                    <h3 class="layui-timeline-title">${c.createTime}</h3>
                    <p>
                        新增社团：${c.name}
                        <br>类型：${c.type}
                        <br>负责人：${c.leader}
                    </p>
                </div>
            </li>
        `;
    });
    recentList.innerHTML = html;
});
