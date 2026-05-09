// Profile Logic
layui.use(['form', 'layer'], function(){
    const form = layui.form;
    const layer = layui.layer;
    
    App.initData();
    const currentUser = App.checkAuth();
    App.renderLayout(3); // 3 = Profile

    // Display Info
    if(currentUser){
        // Format role/time for display
        const displayData = {
            ...currentUser,
            role: currentUser.role === 'admin' ? '管理员' : '普通用户',
            loginTime: new Date(currentUser.loginTime).toLocaleString()
        };
        form.val('infoForm', displayData);
    }

    // Verify Pass
    form.verify({
        pass: [
          /^[\S]{6,12}$/
          ,'密码必须6到12位，且不能出现空格'
        ]
    });

    // Change Password
    form.on('submit(changePwd)', function(data){
        const field = data.field;
        
        // Get Admin Data
        const admin = JSON.parse(localStorage.getItem(App.STORAGE_KEYS.admin));
        
        // Verify Old
        if(field.oldPassword !== admin.password){
            layer.msg('原密码错误', {icon: 2});
            return false;
        }
        
        // Verify Match
        if(field.newPassword !== field.confirmPassword){
            layer.msg('两次密码输入不一致', {icon: 2});
            return false;
        }

        // Update
        admin.password = field.newPassword;
        localStorage.setItem(App.STORAGE_KEYS.admin, JSON.stringify(admin));
        
        layer.msg('密码修改成功，请重新登录', {icon: 1, time: 2000}, function(){
            App.logout();
        });

        return false;
    });
});
