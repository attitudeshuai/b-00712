// Member List Logic
layui.use(['table', 'form', 'layer'], function(){
    const table = layui.table;
    const form = layui.form;
    const layer = layui.layer;
    
    App.initData();
    App.checkAuth();
    App.renderLayout(2); // 2 = Member Mgmt

    // Load Data
    let members = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.members) || '[]');

    // Render Table
    table.render({
        elem: '#memberTable',
        data: members,
        cols: [[
            {field: 'id', title: '编号', width: 80, sort: true},
            {field: 'name', title: '姓名', width: 100, event: 'viewDetail', style: 'color: #1E9FFF; cursor: pointer;'},
            {field: 'studentId', title: '学号', width: 120, sort: true},
            {field: 'gender', title: '性别', width: 60},
            {field: 'grade', title: '年级', width: 100},
            {field: 'clubName', title: '所属社团'},
            {field: 'position', title: '职位', width: 100},
            {fixed: 'right', title:'操作', toolbar: '#barDemo', width: 150}
        ]],
        page: true,
        limit: 10
    });

    // Search Logic
    form.on('submit(search)', function(data){
        const keyword = data.field.keyword.trim();
        
        // Reload data from storage to be safe
        members = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.members) || '[]');

        const filtered = members.filter(m => 
            m.name.includes(keyword) || m.studentId.includes(keyword)
        );

        table.reload('memberTable', {
            data: filtered,
            page: { curr: 1 }
        });
        
        return false;
    });

    // Tool Bar Events
    table.on('tool(memberTable)', function(obj){
        const data = obj.data;
        if(obj.event === 'viewDetail'){
            const allClubs = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.clubs) || '[]');
            const club = allClubs.find(c => c.id === data.clubId) || {};

            let html = '<div style="padding:15px;">'
                + '<table class="layui-table" style="margin:0;">'
                + '<colgroup><col width="100"><col></colgroup>'
                + '<tbody>'
                + '<tr><td style="font-weight:bold;">姓名</td><td>' + data.name + '</td></tr>'
                + '<tr><td style="font-weight:bold;">学号</td><td>' + data.studentId + '</td></tr>'
                + '<tr><td style="font-weight:bold;">性别</td><td>' + data.gender + '</td></tr>'
                + '<tr><td style="font-weight:bold;">年级</td><td>' + data.grade + '</td></tr>'
                + '<tr><td style="font-weight:bold;">所属社团</td><td>' + (data.clubName || '') + '</td></tr>'
                + '<tr><td style="font-weight:bold;">职位</td><td>' + data.position + '</td></tr>'
                + '<tr><td style="font-weight:bold;">入社时间</td><td>' + data.joinTime + '</td></tr>'
                + '<tr><td style="font-weight:bold;">联系电话</td><td>' + (data.phone || '') + '</td></tr>'
                + '</tbody></table>';

            if(club && club.id){
                html += '<fieldset class="layui-elem-field" style="margin-top:20px;">'
                    + '<legend>所在社团信息</legend>'
                    + '<div class="layui-field-box" style="padding:10px;">'
                    + '<table class="layui-table" style="margin:0;">'
                    + '<colgroup><col width="100"><col></colgroup>'
                    + '<tbody>'
                    + '<tr><td style="font-weight:bold;">社团名称</td><td>' + club.name + '</td></tr>'
                    + '<tr><td style="font-weight:bold;">负责人</td><td>' + club.leader + '</td></tr>'
                    + '<tr><td style="font-weight:bold;">联系方式</td><td>' + club.phone + '</td></tr>'
                    + '</tbody></table>'
                    + '</div></fieldset>';
            }

            html += '</div>';

            layer.open({
                type: 1,
                title: data.name + ' - 成员详情',
                area: ['480px', '500px'],
                shadeClose: true,
                content: html
            });
        } else if(obj.event === 'del'){
            layer.confirm('真的删除行么', function(index){
                // Delete from localStorage
                members = members.filter(m => m.id !== data.id);
                localStorage.setItem(App.STORAGE_KEYS.members, JSON.stringify(members));
                
                obj.del();
                layer.close(index);
                layer.msg('删除成功');
            });
        } else if(obj.event === 'edit'){
            window.location.href = 'add.html?id=' + data.id;
        }
    });
});
