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
                return '<a href="javascript:;" class="member-name-link" data-id="' + d.id + '">' + d.name + '</a>';
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
        if(obj.event === 'del'){
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

    // Click member name to show detail
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('member-name-link')) {
            const memberId = e.target.getAttribute('data-id');
            const member = members.find(m => m.id === memberId);
            if (member) {
                showMemberDetail(member);
            }
        }
    });
});

function showMemberDetail(member) {
    const clubs = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.clubs) || '[]');
    const club = clubs.find(c => c.id === member.clubId);

    const content = `
        <div style="padding: 20px;">
            <div style="border-bottom: 1px solid #e2e2e2; padding-bottom: 15px; margin-bottom: 15px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">成员详情</h3>
            </div>
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #333;">基本信息</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2; background: #f8f8f8; width: 100px;">姓名</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2;">${member.name}</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2; background: #f8f8f8; width: 100px;">学号</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2;">${member.studentId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2; background: #f8f8f8;">性别</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2;">${member.gender}</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2; background: #f8f8f8;">年级</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2;">${member.grade}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2; background: #f8f8f8;">联系电话</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2;" colspan="3">${member.phone || '-'}</td>
                    </tr>
                </table>
            </div>
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #333;">社团信息</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2; background: #f8f8f8; width: 100px;">所属社团</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2;">${member.clubName}</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2; background: #f8f8f8; width: 100px;">职位</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2;">${member.position}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2; background: #f8f8f8;">入社时间</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2;" colspan="3">${member.joinTime}</td>
                    </tr>
                </table>
            </div>
            ${club ? `
            <div>
                <h4 style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #333;">社团负责人联系方式</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2; background: #f8f8f8; width: 100px;">社团负责人</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2;">${club.leader}</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2; background: #f8f8f8; width: 100px;">联系电话</td>
                        <td style="padding: 8px 12px; border: 1px solid #e2e2e2;">${club.phone}</td>
                    </tr>
                </table>
            </div>
            ` : ''}
        </div>
    `;

    layer.open({
        type: 1,
        title: '成员详情',
        area: ['650px', '550px'],
        content: content
    });
}
