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
            {field: 'name', title: '姓名', width: 100, templet: function(d){
                return '<a href="javascript:;" class="layui-table-link" lay-event="viewDetail">' + d.name + '</a>';
            }},
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
            showMemberDetail(data);
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

    function showMemberDetail(member) {
        const clubs = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.clubs) || '[]');
        const club = clubs.find(c => c.id === member.clubId);

        const detailHtml = `
            <div class="layui-card" style="box-shadow: none; margin: 0;">
                <div class="layui-card-header" style="font-weight: bold; background-color: #f6f6f6;">基本信息</div>
                <div class="layui-card-body" style="padding: 15px;">
                    <table class="layui-table" lay-skin="line">
                        <tbody>
                            <tr>
                                <td style="width: 100px; background-color: #f8f8f8;">编号</td>
                                <td>${member.id}</td>
                                <td style="width: 100px; background-color: #f8f8f8;">姓名</td>
                                <td>${member.name}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #f8f8f8;">学号</td>
                                <td>${member.studentId}</td>
                                <td style="background-color: #f8f8f8;">性别</td>
                                <td>${member.gender}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #f8f8f8;">年级</td>
                                <td>${member.grade}</td>
                                <td style="background-color: #f8f8f8;">联系电话</td>
                                <td>${member.phone || '-'}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #f8f8f8;">所属社团</td>
                                <td>${member.clubName}</td>
                                <td style="background-color: #f8f8f8;">职位</td>
                                <td>${member.position}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #f8f8f8;">入社时间</td>
                                <td colspan="3">${member.joinTime || '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="layui-card-header" style="font-weight: bold; background-color: #f6f6f6;">社团信息</div>
                <div class="layui-card-body" style="padding: 15px;">
                    <table class="layui-table" lay-skin="line">
                        <tbody>
                            <tr>
                                <td style="width: 100px; background-color: #f8f8f8;">社团负责人</td>
                                <td>${club ? club.leader : '-'}</td>
                                <td style="width: 100px; background-color: #f8f8f8;">联系电话</td>
                                <td>${club ? club.phone : '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        layer.open({
            type: 1,
            title: '成员详情 - ' + member.name,
            area: ['550px', '520px'],
            shadeClose: true,
            content: detailHtml
        });
    }
});
