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
            {field: 'name', title: '姓名', width: 100},
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
});
