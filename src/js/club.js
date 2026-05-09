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
            {field: 'name', title: '社团名称'},
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
});
