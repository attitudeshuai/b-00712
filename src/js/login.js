// Login Logic
layui.use(['form', 'layer'], function(){
    const form = layui.form;
    const layer = layui.layer;
    
    // Initialize Data on load
    App.initData();
    
    // Check if already logged in
    App.checkAuth();

    // Form Validation Rules
    form.verify({
        username: function(value){
            if(value.length < 4){
                return '用户名至少4个字符';
            }
        },
        password: function(value){
            if(value.length < 6){
                return '密码至少6个字符';
            }
        }
    });

    // Listen to Submit
    form.on('submit(login)', function(data){
        const field = data.field;
        
        // Get Admin Account from Storage
        const admin = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.admin) || '{"username":"admin","password":"123456"}');

        // Mock Auth Logic
        if(field.username === admin.username && field.password === admin.password){
            // Save login state
            const userInfo = {
                username: field.username,
                role: 'admin',
                loginTime: new Date().toISOString()
            };
            localStorage.setItem(App.STORAGE_KEYS.user, JSON.stringify(userInfo));
            
            layer.msg('登录成功', {icon: 1, time: 1000}, function(){
                window.location.href = '/index.html';
            });
        } else {
            layer.msg('用户名或密码错误', {icon: 2});
        }
        
        return false; // Prevent form reload
    });
});
