<template>
  <div class="table">
    <div class="handle-box">
      <el-input v-model="selectWord" size="mini" placeholder="请输入用户名" class="handle-input" ></el-input>
      <el-button type="primary" size="mini" @click="centerDialogVisible=true">添加新用户</el-button>
      <el-button type="primary" size="mini" @click="batchDelete">批量删除</el-button>
    </div>
    <el-table size="mini" border style="width: 100%" height="580px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="用户头像" width="110" align="center">
        <template slot-scope="scope">
          <div class="singer-img">
            <img :src="getUrl(scope.row.avator)"  style="width: 100% " >
          </div>
          <el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatorUpload" :on-success="avatorUploadSuccess">
            <el-button size="mini" type="primary" >上传图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="120" align="center">
      </el-table-column>
      <el-table-column prop="sex" label="性别"  width="80" align="center">
        <template slot-scope="scope">
          {{changeSex(scope.row.sex)}}
        </template>
      </el-table-column>
      <el-table-column prop="phoneNum" label="手机号" width="150" align="center">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="150" align="center">
      </el-table-column>
      <el-table-column prop="birth" label="生日" width="150" align="center">
      </el-table-column>
      <el-table-column prop="introduction" label="签名" width="200" align="center">
      </el-table-column>
      <el-table-column prop="location" label="地区" width="120" align="center">
      </el-table-column>
      <el-table-column prop="sex" label="操作"  width="180" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini"  type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="tableData.length"
        @current-change="handleCurrentChange"
        layout = "total,prev,pager,next"
      >
      </el-pagination>
    </div>
    <el-dialog title="添加新用户" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="80px">
        <el-form-item prop="username" label="用户名" size="mini">
          <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" size="mini">
          <el-input type="password" v-model="registerForm.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="registerForm.checkPass" ></el-input>
        </el-form-item>
        <el-form-item prop="sex" size="mini" label="性别">
          <el-radio-group v-model="registerForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker type="date" placeholder="选择日期" v-model="registerForm.birth" style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item prop="phoneNum" label="手机号" size="mini">
          <el-input v-model="registerForm.phoneNum" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" size="mini">
          <el-input v-model="registerForm.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="introduction" label="签名" size="mini">
          <el-input v-model="registerForm.introduction" placeholder="签名" type="textarea"></el-input>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="registerForm.location" placeholder="地区"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer">
          <el-button size="mini" @click="centerDialogVisible=false">取消</el-button>
          <el-button size="mini" @click="addUser('registerForm')">确定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="EditVisible" width="400px" center>
      <el-form :model="editForm" ref="editForm" label-width="80px">
        <el-form-item prop="username" label="用户名" size="mini">
          <el-input v-model="editForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" size="mini">
          <el-input type="password" v-model="editForm.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="sex" size="mini" label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth" style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item prop="phoneNum" label="手机号" size="mini">
          <el-input v-model="editForm.phoneNum" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" size="mini">
          <el-input v-model="editForm.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="editForm.location" placeholder="地区"></el-input>
        </el-form-item>
        <el-form-item prop="introduction" label="简介" size="mini">
          <el-input v-model="editForm.introduction" placeholder="简介" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button size="mini" @click="EditVisible=false">取消</el-button>
          <el-button size="mini" @click="updateUser">确定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="删除用户" :visible.sync="delVisible" width="300px" center>
      <div align="center">删除不可恢复，是否确定删除？</div>
      <el-form :model="delForm" ref="editForm" label-width="80px">
      </el-form>
      <span slot="footer">
                <el-button size="mini" @click="delVisible = false">取消</el-button>
                <el-button size="mini" @click="deleteRow">确定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "UserManage",
    data(){
          var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.registerForm.checkPass !== '') {
              this.$refs.registerForm.validateField('checkPass');
            }
            callback();
          }
        };
          var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.registerForm.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
      return {
        centerDialogVisible:false,
        EditVisible:false,
        delVisible:false,
        delForm:{
          id:'',
        },
        editForm:{
          id:'',
          username:'',
          password:'',
          checkPass:'',
          sex:'',
          birth:'',
          phoneNum:'',
          email:'',
          location:'',
          introduction:'',
        },
        registerForm:{
          username:'',
          password:'',
          checkPass:'',
          sex:'',
          birth:'',
          phoneNum:'',
          email:'',
          location:'',
          introduction:'',
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' },
            {min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur'}
          ],
          checkPass: [
            {required: true, validator: validatePass2, trigger: 'blur' }
          ],
          birth: [
            { type: 'date', required: true, message: '请选择您的生日', trigger: 'change' }
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          phoneNum: [
            { required: true, message: '请填写您的电话号码', trigger: 'blur' },
          ],
          email: [
            {required: true,message: '请输入电子邮箱',trigger: 'blur'},
            {type: 'email',message:'请输入正确的电子邮箱地址',trigger:['blur','change']}
          ],
          location: [
            { required: true, message: '请填写您的地址', trigger: 'blur' }
          ],
          introduction: [
            { message: '请填写您的个性签名', trigger: 'blur' }
          ]
        },
        tableData:[],
        templateData:[],
        selectWord:'',
        currentPage:1,
        pageSize:5,
        selectIds:[],
      }
    },
    computed:{
      data(){
        return this.tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
      }
    },
    watch:{
      selectWord:function () {
        if(this.selectWord==''){
          this.tableData=this.templateData;
        }else{
          this.tableData=[];
          for(let item of this.templateData){
            if(item.name.includes(this.selectWord)){
              this.tableData.push(item);
            }
          }
        }
      }
    },
    created() {
      this.getAllUser();
    },
    methods:{
      addUser(registerForm){
        var _this=this;
        this.$refs[registerForm].validate((valid) => {
          if (valid) {
            this.$axios.post("http://localhost:8888/user/add",this.registerForm).then(function (data) {
              if(data.status==200){
                _this.$notify({
                  title: '新增成功',
                  type: 'success'
                });
                _this.getAllUser();
              }else{
                _this.$notify({
                  title: '新增失败',
                  type: 'error'
                });
              }
              _this.centerDialogVisible=false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //根据相对地址获取绝对地址
      getUrl(url){
        return `${this.$store.state.HOST}/${url}`
      },
      getAllUser(){
        var _this=this;
        this.$axios.get("http://localhost:8888/user/selectAllUser").then(function (data) {
          _this.tableData=data.data;
          _this.templateData=data.data;
        })
      },
      //获取性别中文
      changeSex(value){
        if(value==0){
          return '女';
        }
        if(value==1){
          return '男';
        }
        if(value==2){
          return '组合';
        }
        if(value==3){
          return '不明';
        }
        return value;
      },
      //更新Url
      uploadUrl(id){
        return `${this.$store.state.HOST}/user/updateUserAcator?id=${id}`
      },
      //更新头像之前的校验
      beforeAvatorUpload(file){
        const isJPG = (file.type === 'image/jpeg')|| (file.type === 'image/png');
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //上传图片成功之后要做的工作
      avatorUploadSuccess(res){
        let _this = this;
        if(res.status == 200){
          _this.getAllUser();
          _this.$notify({
            title: '上传成功',
            type: 'success'
          });
        }else{
          _this.$notify({
            title: '上传失败',
            type: 'error'
          });
        }
      },
      handleEdit(row){
        this.EditVisible=true;
        this.editForm  = {
          id:row.id,
          username:row.username,
          password:row.password,
          sex:row.sex,
          birth:row.birth,
          phoneNum:row.phoneNum,
          email:row.email,
          location:row.location,
          introduction:row.introduction,
        }
      },
      handleDelete(row){
        this.delVisible=true;
        this.delForm = {
          id:row.id,
        }
      },
      deleteRow(){
        var _this=this;
        var id=this.delForm.id;
        this.$axios.get("http://localhost:8888/user/deleteUser/"+id).then(function (data) {
          if(data.status==200){
            _this.$notify({
              title: '删除成功',
              type: 'success'
            });
            _this.getAllUser();
          }else{
            _this.$notify({
              title: '删除失败',
              type: 'error'
            });
          }
          _this.delVisible=false;
        })
      },
      updateUser(){
        var _this=this;
        this.$axios.post("http://localhost:8888/user/updateUser",this.editForm).then(function (data) {
          if(data.status==200){
            _this.$notify({
              title: '修改成功',
              type: 'success'
            });
            _this.getAllUser();
          }else{
            _this.$notify({
              title: '修改失败',
              type: 'error'
            });
          }
          _this.EditVisible=false;
        })
      },
      handleSelectionChange(val){
        this.selectIds=val;
      },
      batchDelete(){
        var _this=this
        var ids=''
        for(let item of this.selectIds){
          ids=ids+item.id+',';
        }
        this.$axios.get("http://localhost:8888/user/deleteUsers/"+ids).then(function (data) {
          if(data.status==200){
            _this.$notify({
              title: '删除成功',
              type: 'success'
            });
            _this.getAllUser();
          }else{
            _this.$notify({
              title: '删除失败',
              type: 'error'
            });
          }
        })
      },
      handleCurrentChange(val){
        this.currentPage=val;
      },
      //转向歌曲管理页面
      songEdit(id,name){
        this.$router.push({path:`/SongManage`,query:{id,name}});
      }
    }
  }
</script>

<style scoped>
  .handle-box{
    margin-bottom: 20px;
  }

  .singer-img{
    width: 100%;
    /* height: 40px;*/
    border-radius: 5px;
    border-bottom: 5px;
    overflow: hidden;
  }
  .handle-input{
    width: 300px;
  }
  .pagination{
    display: flex;
    justify-content: center;
  }
</style>
