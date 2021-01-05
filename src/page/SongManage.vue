<template>
  <div class="table">
    <div class="handle-box">
      <el-input v-model="selectWord" size="mini" placeholder="请输入歌曲名" class="handle-input" ></el-input>
      <el-button type="primary" size="mini" @click="centerDialogVisible=true">添加歌曲</el-button>
      <el-button type="primary" size="mini" @click="batchDelete">批量删除</el-button>
    </div>
    <el-table size="mini" border style="width: 100%" height="580px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="歌曲图片" width="110" align="center">
        <template slot-scope="scope">
          <div class="song-img">
            <img :src="getUrl(scope.row.pic)"  style="width: 100% " >
          </div>
          <el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeSongAvatorUpload" :on-success="avatorUploadSuccess">
            <el-button size="mini" type="primary" >上传图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="歌名" width="120" align="center">
      </el-table-column>
      <el-table-column prop="introduction" label="专辑" width="200" align="center">
      </el-table-column>
      <el-table-column   label="歌词" width="200" align="center">
      <template slot-scope="scope">
        {{scope.row.lyric}}
      </template>
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
   <!-- <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px">
        <div>
          <label>歌名</label>
          <el-input type="text" name="name" ></el-input>
        </div>
        <div>
          <label>专辑</label>
          <el-input type="text" name="introduction" ></el-input>
        </div>
        <div>
          <label>歌词</label>
          <el-input type="textarea" name="lyric" ></el-input>
        </div>
        <div>
          <label>歌曲上传</label>
          <el-input type="file" name="file"></el-input>
        </div>
      </el-form>
      <span slot="footer">
          <el-button size="mini" @click="centerDialogVisible=false">取消</el-button>
          <el-button size="mini" @click="addSong">确定</el-button>
        </span>
    </el-dialog>-->
    <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px">
        <el-form-item prop="name" label="歌曲名" size="mini">
          <el-input v-model="registerForm.name" placeholder="歌曲名"></el-input>
        </el-form-item>
        <el-form-item prop="introduction" label="专辑" size="mini">
        <el-input v-model="registerForm.introduction" placeholder="专辑" type="text"></el-input>
        </el-form-item>
        <el-form-item prop="lyric" label="歌词" size="mini">
          <el-input v-model="registerForm.lyric" placeholder="歌词" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="上传" prop="files">
          <el-upload
            ref="uploads"
            :auto-upload="false"
            class="upload-demo"
            :action=uploadMpUrl()
            :data="registerForm"
            :on-success="upFile"
            name="file"
            accept=".mp3"
            >
          <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
        <span slot="footer">
          <el-button size="mini" @click="centerDialogVisible=false">取消</el-button>
          <el-button size="mini" @click="addSong('registerForm')">确定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="修改歌手" :visible.sync="EditVisible" width="400px" center>
      <el-form :model="editForm" ref="editForm" label-width="80px">
        <el-form-item prop="name" label="歌曲名" size="mini">
          <el-input v-model="editForm.name" placeholder="歌曲名"></el-input>
        </el-form-item>
        <el-form-item prop="introduction" label="专辑" size="mini">
        <el-input v-model="editForm.introduction" placeholder="专辑" type="text"></el-input>
        </el-form-item>
        <el-form-item prop="lyric" label="歌词" size="mini">
          <el-input v-model="editForm.lyric" placeholder="歌词" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button size="mini" @click="EditVisible=false">取消</el-button>
          <el-button size="mini" @click="updateSong">确定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="删除歌手" :visible.sync="delVisible" width="300px" center>
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
    name: "SongManage",
    data(){
      return {
        singerId:'',
        singerName:'',
        centerDialogVisible:false,
        EditVisible:false,
        delVisible:false,
        delForm:{
          id:'',
        },
        editForm:{
          singerId:this.singerId,
          name:'',
          introduction:'',
          lyric:'',
        },
        registerForm:{
          singerId:this.singerId,
          name:'',
          introduction:'',
          lyric:'',
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
      this.singerId = this.$route.query.id;
      this.singerName = this.$route.query.name;
      this.getAllSong();
    },
    methods:{
      addSong(registForm){
        this.$refs.uploads.submit();
      },
      //根据相对地址获取绝对地址
      getUrl(url){
        return `${this.$store.state.HOST}/${url}`
      },
      getAllSong(){
        var _this=this;
        this.$axios.get("http://localhost:8888/song/selectAllSongs").then(function (data) {
          _this.tableData=data.data;
          _this.templateData=data.data;
        })
      },
      //更新Url
      uploadUrl(id){
        return `${this.$store.state.HOST}/song/updateSongAcator?id=${id}`
      },

      uploadMpUrl(){
        return `${this.$store.state.HOST}/song/addSong`
      },

      handleEdit(row){
        this.EditVisible=true;
        this.editForm  = {
          id:row.id,
          name:row.name,
          singerId:row.singerId,
          lyric:row.lyric,
          introduction:row.introduction,
        }
      },
      handleDelete(row){
        this.delVisible=true;
        this.delForm = {
          id:row.id,
        }
      },
      //更新头像之前的校验
      beforeSongAvatorUpload(file){
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
          _this.getAllSong();
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
      deleteRow(){
        var _this=this;
        var id=this.delForm.id;
        this.$axios.delete("http://localhost:8888/song/deleteSong/"+id).then(function (data) {
          if(data.status==200){
            _this.$notify({
              title: '删除成功',
              type: 'success'
            });
            _this.getAllSong();
          }else{
            _this.$notify({
              title: '删除失败',
              type: 'error'
            });
          }
          _this.delVisible=false;
        })
      },
      updateSong(){
        var _this=this;
        this.$axios.post("http://localhost:8888/song/updateSong",this.editForm).then(function (data) {
          if(data.status==200){
            _this.$notify({
              title: '修改成功',
              type: 'success'
            });
            _this.getAllSong();
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
        this.$axios.delete("http://localhost:8888/song/deleteSongs/"+ids).then(function (data) {
          if(data.status==200){
            _this.$notify({
              title: '删除成功',
              type: 'success'
            });
            _this.getAllSong();
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
      upFile(res){
        console.log(res);
        if (res.status == 200) {
          // 文件上传成功后的回调，比如一些提示信息或者页面跳转都写在这里
          this.$message.success(res.msg);
          this.centerDialogVisible=false;
          this.getAllSong();
        } else {
          this.$message.error(res.msg);
          let _this = this;
          setTimeout(function() {
            _this.$refs.uploads.clearFiles();
          }, 1000);
        }
      }
    }
  }
</script>

<style scoped>
  .handle-box{
    margin-bottom: 20px;
  }

  .song-img{
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
