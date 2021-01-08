<template>
  <div class="table">
    <div class="handle-box">
      <el-input v-model="selectWord" size="mini" placeholder="请输入歌曲名" class="handle-input" ></el-input>
      <el-button type="primary" size="mini" @click="centerDialogVisible=true">添加歌曲</el-button>
      <el-button type="primary" size="mini" @click="batchDelete">批量删除</el-button>
    </div>
    <el-table size="mini" border style="width: 100%" height="550px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="100" ></el-table-column>
      <el-table-column prop="fullName" label="歌手-歌名" width="180" align="center">
      </el-table-column>
      <el-table-column prop="sex" label="操作"  width="180" align="center">
        <template slot-scope="scope">
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
        <el-form-item prop="singerName" label="歌手名字" size="mini" >
        <el-autocomplete ref="singerNameInput" size="mini" v-model="singerName"
                         :fetch-suggestions="querySingerNameSearchAsync"
                         @select="singerNameHandleSelect"
                         @change="singerNameInputChange"
                         :clearable="false"
                         placeholder="请输入歌手名称">
        </el-autocomplete>
        </el-form-item>
        <el-form-item prop="songName" label="歌曲名字" size="mini" >
          <el-autocomplete ref="songNameInput"  size="mini" v-model="songName"
                           :fetch-suggestions="querySongNameSearchAsync" @select="songNameHandleSelect"
                           @change="songNameInputChange"
                           placeholder="请输入歌曲名称">
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button size="mini" @click="centerDialogVisible=false">取消</el-button>
          <el-button size="mini" @click="addSong()">确定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="删除歌曲" :visible.sync="delVisible" width="300px" center>
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
    data() {
      return {
        singerName:'',
        singerId:'',
        songName:'',
        songId:'',
        songListId: '',
        query1:'',
        centerDialogVisible: false,
        delVisible: false,
        delForm: {
          id: '',
        },
        registerForm: {
          singeName: '',
          songName: '',
        },
        singer: {},
        song: {},
        tableData: [],
        templateData: [],
        selectWord: '',
        currentPage: 1,
        pageSize: 5,
        selectIds: [],
      }
    },
    computed: {
      data() {
        return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
      }
    },
    watch: {
      selectWord: function () {
        if (this.selectWord == '') {
          this.tableData = this.templateData;
        } else {
          this.tableData = [];
          for (let item of this.templateData) {
            if (item.fullName.includes(this.selectWord)) {
              this.tableData.push(item);
            }
          }
        }
      }
    },
    created() {
      this.songListId = this.$route.query.id;
      this.getAllListSongs();
    },
    methods: {
      addSong() {
        var _this=this;
        let params = new URLSearchParams();
        params.append("singerName",this.singerName);
        params.append("songName",this.songName);
        params.append("songListId",this.songListId);
        this.$axios.post("http://localhost:8888/listSong/addListSong",params).then(function (data) {
          if(data.data.status==200){
              _this.$notify({
              title: '添加成功',
              type: 'success'
            });
            _this.centerDialogVisible=false;
            _this.$refs.registerForm.resetFields();
            _this.getAllListSongs();
          }else{
            _this.$notify({
              title: '添加失败',
              type: 'error'
            });
          }
        })
      },
      getAllListSongs() {
        var _this=this;
        console.log(111);
        var _this = this;
        this.$axios.get("http://localhost:8888/listSong/selectSongsBySongList/" + this.songListId).then(function (data) {
          console.log(data.data);
          var result=data.data;
          _this.templateData=result;
          _this.tableData=result;
        })
      },

      querySingerNameSearchAsync(queryString,cb){
        var results = [];
        if (queryString == '') {
          cb(results);
        } else {
            //掉接口需要的参数
            this.$axios.get("http://localhost:8888/singer/selectSingerByName/" + queryString).then(function (data) {
              console.log(data);
              if (data.data.status == 200) {
                var result = data.data.object;
                for (let singer of result) {
                  results.push({
                    value: singer.name,
                    id: singer.id,
                  })
                }
                cb(results);
              } else {
                results = [];
                cb(results);
              }
            })
          }
      },
      singerNameHandleSelect(item){
        console.log(item);
        this.singerId=item.id;
        this.singerName=item.value;
      },
      singerNameInputChange(){
       this.singerName=this.$refs.singerNameInput.value;
      },
      querySongNameSearchAsync(queryString,cb){
        var results = [];
        if (queryString == '') {
          cb(results);
        }
         else {
            //掉接口需要的参数
            this.$axios.get("http://localhost:8888/song/selectSongByLikeName/" + queryString).then(function (data) {
              console.log(data);
              if (data.data.status == 200) {
                var result = data.data.object;
                for (let song of result) {
                  results.push({
                    value: song.name,
                    id: song.id,
                  })
                }
                cb(results);
              } else {
                results = [];
                cb(results);
              }
            })
          }
      },

      songNameHandleSelect(item){
        this.songId=item.id;
        this.songName=item.value;
      },
      songNameInputChange(){
        this.songName=this.$refs.songNameInput.value
      },

     /* getSong(id) {
        var _this=this;
        this.$axios.get("http://localhost:8888/listSong/selectSongsBySongList/" + id).then(function (data) {
          console.log(data.data);
          _this.templateData.push(data.data);
          _this.tableData.push(data.data);
        })
      },*/
      //更新Url
      uploadUrlForSongAcator(id) {
        return `${this.$store.state.HOST}/song/updateSongAcator?id=${id}`
      },


      handleDelete(row) {
        this.delVisible = true;
        this.delForm = {
          id: row.id,
        }
      },

      deleteRow() {
        var _this = this;
        var id = this.delForm.id;
        this.$axios.delete("http://localhost:8888/listSong/deleteByListSongId/" + id).then(function (data) {
          if (data.data.status == 200) {
            _this.$notify({
              title: '删除成功',
              type: 'success'
            });
            _this.getAllListSongs();
          } else {
            _this.$notify({
              title: '删除失败',
              type: 'error'
            });
          }
          _this.delVisible = false;
        })
      },

      handleSelectionChange(val) {
        this.selectIds = val;
      },
      batchDelete() {
        var _this = this
        var ids = ''
        for (let item of this.selectIds) {
          ids = ids + item.id + ',';
        }
        this.$axios.delete("http://localhost:8888/song/deleteSongs/" + ids).then(function (data) {
          if (data.status == 200) {
            _this.$notify({
              title: '删除成功',
              type: 'success'
            });
            _this.getAllSong();
          } else {
            _this.$notify({
              title: '删除失败',
              type: 'error'
            });
          }
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
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
