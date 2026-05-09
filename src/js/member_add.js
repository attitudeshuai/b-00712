// Member Add/Edit Logic
layui.use(['form', 'laydate', 'layer'], function(){
    const form = layui.form;
    const laydate = layui.laydate;
    const layer = layui.layer;
    
    App.initData();
    App.checkAuth();
    App.renderLayout(2); // Member Mgmt

    // Init Date Picker
    laydate.render({
        elem: '#joinDate'
    });

    // Load Clubs for Select
    const clubs = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.clubs) || '[]');
    const clubSelect = document.getElementById('club-select');
    clubs.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.text = c.name;
        clubSelect.appendChild(option);
    });
    form.render('select');

    // Check Edit Mode
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const isEdit = !!id;

    let members = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.members) || '[]');

    if(isEdit){
        document.getElementById('page-title').innerText = '编辑成员';
        document.getElementById('card-title').innerText = '编辑成员';
        
        const member = members.find(m => m.id === id);
        if(member){
            form.val('memberForm', member);
            // Need to make sure clubName hidden field is set if we rely on it, but we can set it on submit
        } else {
            layer.msg('未找到该成员', {icon: 2});
        }
    }

    // Submit Handler
    form.on('submit(save)', function(data){
        const field = data.field;
        
        // Validation: Unique Student ID
        const exists = members.some(m => m.studentId === field.studentId && m.id !== field.id);
        if(exists){
            layer.msg('学号已存在', {icon: 2});
            return false;
        }

        // Get Club Name
        const selectedClub = clubs.find(c => c.id === field.clubId);
        if(selectedClub) {
            field.clubName = selectedClub.name;
        }

        if(field.id){ // Update
            const index = members.findIndex(m => m.id === field.id);
            if(index !== -1){
                members[index] = field;
            }
        } else { // Create
            field.id = 'm' + new Date().getTime();
            members.push(field);
        }

        // Save
        localStorage.setItem(App.STORAGE_KEYS.members, JSON.stringify(members));
        
        layer.msg('保存成功', {icon: 1, time: 1000}, function(){
            window.location.href = 'list.html';
        });

        return false;
    });
});
