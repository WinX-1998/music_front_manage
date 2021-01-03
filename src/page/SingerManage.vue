<template>
    <div class="table">
        <div class="handle-box">
          <el-input v-model="selectWord" size="mini" placeholder="请输入歌手名" class="handle-input" ></el-input>
          <el-button type="primary" size="mini" @click="centerDialogVisible=true">添加歌手</el-button>
        </div>
        <el-table size="mini" border style="width: 100%" height="800px" :data="tableData">
          <el-table-column label="歌手图片" width="110" align="center">
            <template slot-scope="scope">
              <div class="singer-img">
                <img :src="getUrl(scope.row.pic)"  style="width: 100%" >
              </div>
              <el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatorUpload" :on-success="avatorUploadSuccess">
                <el-button size="mini" type="primary" >上传图片</el-button>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="歌手" width="120" align="center">
          </el-table-column>
          <el-table-column prop="sex" label="性别"  width="80" align="center">
            <template slot-scope="scope">
              {{changeSex(scope.row.sex)}}
            </template>
          </el-table-column>
          <el-table-column prop="birth" label="生日" width="150" align="center">
          </el-table-column>
          <el-table-column prop="location" label="地区" width="120" align="center">
          </el-table-column>
          <el-table-column prop="introduction" label="简介" width="200" align="center">
          </el-table-column>
        </el-table>
      <el-dialog title="添加歌手" :visible.sync="centerDialogVisible" width="400px" center>
        <el-form :model="registerForm" ref="registerForm" label-width="80px">
          <el-form-item prop="name" label="歌手名" size="mini">
            <el-input v-model="registerForm.name" placeholder="歌手名"></el-input>
          </el-form-item>
          <el-form-item prop="sex" size="mini" label="性别">
            <el-radio-group v-model="registerForm.sex">
              <el-radio :label="0">女</el-radio>
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">组合</el-radio>
              <el-radio :label="3">不明</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="birth" label="生日" size="mini">
            <el-date-picker type="date" placeholder="选择日期" v-model="registerForm.birth" style="width: 100%"></el-date-picker>
          </el-form-item>
          <el-form-item prop="location" label="地区" size="mini">
            <el-input v-model="registerForm.location" placeholder="地区"></el-input>
          </el-form-item>
          <el-form-item prop="introduction" label="简介" size="mini">
            <el-input v-model="registerForm.introduction" placeholder="简介" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="mini" @click="centerDialogVisible=false">取消</el-button>
          <el-button size="mini" @click="addSinger">确定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SingerManage",
        data(){
          return {
            centerDialogVisible:false,
            registerForm:{
              name:'',
              sex:'',
              birth:'',
              location:'',
              introduction:''
            },
            tableData:[],
            templteData:[],
            selectWord:'',
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
        this.getAllSinger();
      },
      methods:{
          addSinger(){
            var _this=this;
            this.$axios.post("http://localhost:8888/singer/add",this.registerForm).then(function (data) {
              console.log(data);
              _this.centerDialogVisible=false;
            })
          },
        //根据相对地址获取绝对地址
        getUrl(url){
          return `${this.$store.state.HOST}/${url}`
        },
        getAllSinger(){
          var _this=this;
          this.$axios.get("http://localhost:8888/singer/selectAllSinger").then(function (data) {
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
          return `${this.$store.state.HOST}/singer/updateSingerAcator?id=${id}`
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
            _this.getAllSinger();
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
      }
    }
</script>

<style scoped>
  .handle-box{
    margin-bottom: 20px;
  }

  .singer-img{
    width: 100%;
   /* height: 120px;*/
    border-radius: 5px;
    border-bottom: 5px;
    overflow: hidden;
  }
  .handle-input{
    width: 300px;
  }
</style>
