// Club Add/Edit Logic
layui.use(['form', 'laydate', 'layer'], function(){
    const form = layui.form;
    const laydate = layui.laydate;
    const layer = layui.layer;
    
    App.initData();
    App.checkAuth();
    App.renderLayout(1); // Club Mgmt

    // Init Date Picker
    laydate.render({
        elem: '#createDate'
    });

    // Check Edit Mode
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const isEdit = !!id;

    let clubs = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.clubs) || '[]');

    if(isEdit){
        document.getElementById('page-title').innerText = '编辑社团';
        document.getElementById('card-title').innerText = '编辑社团';
        
        const club = clubs.find(c => c.id === id);
        if(club){
            form.val('clubForm', club);
        } else {
            layer.msg('未找到该社团', {icon: 2});
        }
    }

    // Submit Handler
    form.on('submit(save)', function(data){
        const field = data.field;
        
        // Simple duplicate name check (optional)
        const exists = clubs.some(c => c.name === field.name && c.id !== field.id);
        if(exists){
            layer.msg('该社团名称已存在', {icon: 2});
            return false;
        }

        if(field.id){ // Update
            const index = clubs.findIndex(c => c.id === field.id);
            if(index !== -1){
                clubs[index] = field;
                
                // Update associated members logic? 
                // Currently member.json stores clubName as well.
                // If club name changes, we should update members.
                let members = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.members) || '[]');
                let membersChanged = false;
                members.forEach(m => {
                    if(m.clubId === field.id && m.clubName !== field.name) {
                        m.clubName = field.name;
                        membersChanged = true;
                    }
                });
                if(membersChanged) {
                    localStorage.setItem(App.STORAGE_KEYS.members, JSON.stringify(members));
                }
            }
        } else { // Create
            field.id = 'c' + new Date().getTime(); // Simple ID generation
            clubs.push(field);
        }

        // Save
        localStorage.setItem(App.STORAGE_KEYS.clubs, JSON.stringify(clubs));
        
        layer.msg('保存成功', {icon: 1, time: 1000}, function(){
            window.location.href = 'list.html';
        });

        return false;
    });
});
