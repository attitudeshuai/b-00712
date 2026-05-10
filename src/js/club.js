// Club Management Logic
layui.use(['table', 'form', 'layer'], function(){
    const table = layui.table;
    const form = layui.form;
    const layer = layui.layer;
    
    App.initData();
    App.checkAuth();
    App.renderLayout(1); // 1 = Club Mgmt

    // Load Data
    let clubs = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.clubs) || '[]');

    // Render Table
    table.render({
        elem: '#clubTable',
        data: clubs,
        cols: [[
            {type: 'numbers', title: '序号', width: 80},
            {field: 'name', title: '社团名称', templet: function(d){
                return '<a href="javascript:;" class="club-name-link" data-id="' + d.id + '">' + d.name + '</a>';
            }},
            {field: 'college', title: '所属学院'},
            {field: 'type', title: '社团类型', width: 120},
            {field: 'leader', title: '负责人', width: 100},
            {field: 'phone', title: '联系电话', width: 120},
            {field: 'intro', title: '社团简介'},
            {fixed: 'right', title:'操作', toolbar: '#barDemo', width: 150}
        ]],
        page: true,
        limit: 10
    });

    // Filter Logic
    form.on('select(filter)', function(data){
        // Reload clubs in case data changed
        clubs = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.clubs) || '[]');
        
        const college = document.querySelector('select[name="college"]').value;
        const type = document.querySelector('select[name="type"]').value;

        // Filter data locally
        let filteredData = clubs.filter(item => {
            let matchCollege = college ? item.college === college : true;
            let matchType = type ? item.type === type : true;
            return matchCollege && matchType;
        });

        // Reload table with new data
        table.reload('clubTable', {
            data: filteredData,
            page: { curr: 1 } // Reset to page 1
        });
    });

    // Tool Bar Events
    table.on('tool(clubTable)', function(obj){
        const data = obj.data;
        if(obj.event === 'del'){
            layer.confirm('真的删除行么', function(index){
                // Delete from localStorage
                clubs = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.clubs) || '[]');
                clubs = clubs.filter(c => c.id !== data.id);
                localStorage.setItem(App.STORAGE_KEYS.clubs, JSON.stringify(clubs));
                
                // Also delete associated members? The prompt didn't strictly enforce this but it's good practice.
                // Requirement says: "各模块数据保持一致性（如成员所属社团删除后，关联成员同步删除）"
                let members = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.members) || '[]');
                const initialCount = members.length;
                members = members.filter(m => m.clubId !== data.id);
                if(members.length < initialCount) {
                     localStorage.setItem(App.STORAGE_KEYS.members, JSON.stringify(members));
                     console.log('Deleted associated members');
                }

                obj.del();
                layer.close(index);
                layer.msg('删除成功');
            });
        } else if(obj.event === 'edit'){
            window.location.href = 'add.html?id=' + data.id;
        }
    });

    // Click club name to show member list
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('club-name-link')) {
            const clubId = e.target.getAttribute('data-id');
            const club = clubs.find(c => c.id === clubId);
            if (club) {
                showClubMembers(club);
            }
        }
    });
});

function showClubMembers(club) {
    const members = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.members) || '[]');
    const clubMembers = members.filter(m => m.clubId === club.id);
    
    let memberRowsHtml = '';
    if (clubMembers.length > 0) {
        clubMembers.forEach(member => {
            memberRowsHtml += `
                <tr>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #f2f2f2;">${member.name}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #f2f2f2;">${member.position}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #f2f2f2;">${member.joinTime}</td>
                </tr>
            `;
        });
    } else {
        memberRowsHtml = '<tr><td colspan="3" style="padding: 20px; text-align: center; color: #999;">暂无成员</td></tr>';
    }

    const content = `
        <div style="padding: 15px;">
            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">${club.name}</h3>
                <div style="color: #666; font-size: 13px;">
                    <span style="margin-right: 15px;">负责人：${club.leader}</span>
                    <span>联系电话：${club.phone}</span>
                </div>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f8f8;">
                        <th style="padding: 10px 12px; text-align: left; font-weight: bold; border-bottom: 1px solid #e2e2e2;">姓名</th>
                        <th style="padding: 10px 12px; text-align: left; font-weight: bold; border-bottom: 1px solid #e2e2e2;">职位</th>
                        <th style="padding: 10px 12px; text-align: left; font-weight: bold; border-bottom: 1px solid #e2e2e2;">入社时间</th>
                    </tr>
                </thead>
                <tbody>
                    ${memberRowsHtml}
                </tbody>
            </table>
        </div>
    `;

    layer.open({
        type: 1,
        title: '社团成员详情',
        area: ['600px', '500px'],
        content: content
    });
}
