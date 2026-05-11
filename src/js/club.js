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
                return '<a href="javascript:;" class="layui-table-link" lay-event="viewMembers">' + d.name + '</a>';
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
        if(obj.event === 'viewMembers'){
            showClubMembers(data);
        } else if(obj.event === 'del'){
            layer.confirm('真的删除行么', function(index){
                // Delete from localStorage
                clubs = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.clubs) || '[]');
                clubs = clubs.filter(c => c.id !== data.id);
                localStorage.setItem(App.STORAGE_KEYS.clubs, JSON.stringify(clubs));
                
                let members = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.members) || '[]');
                const initialCount = members.length;
                members = members.filter(m => m.clubId !== data.id);
                if(members.length < initialCount) {
                     localStorage.setItem(App.STORAGE_KEYS.members, JSON.stringify(members));
                }

                obj.del();
                layer.close(index);
                layer.msg('删除成功');
            });
        } else if(obj.event === 'edit'){
            window.location.href = 'add.html?id=' + data.id;
        }
    });

    function showClubMembers(club) {
        const members = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.members) || '[]');
        const clubMembers = members.filter(m => m.clubId === club.id);

        let memberListHtml = '';
        if (clubMembers.length === 0) {
            memberListHtml = '<div style="text-align: center; padding: 30px; color: #999;">暂无成员</div>';
        } else {
            memberListHtml = '<table class="layui-table">';
            memberListHtml += '<thead><tr><th>序号</th><th>姓名</th><th>职位</th><th>入社时间</th></tr></thead>';
            memberListHtml += '<tbody>';
            clubMembers.forEach((m, index) => {
                memberListHtml += `<tr>
                    <td>${index + 1}</td>
                    <td>${m.name}</td>
                    <td>${m.position}</td>
                    <td>${m.joinTime || '-'}</td>
                </tr>`;
            });
            memberListHtml += '</tbody></table>';
        }

        layer.open({
            type: 1,
            title: '【' + club.name + '】成员列表',
            area: ['600px', '450px'],
            shadeClose: true,
            content: '<div style="padding: 20px;">' + memberListHtml + '</div>'
        });
    }
});
