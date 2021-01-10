<template>
    <div>
      <el-row :gutter="20" class="mgb20">
        <el-col :span="6">
          <el-card>
            <div class="grid-content">
              <div class="grid-cont-center">
                <div class="grid-num">{{userCount}}</div>
                <div>用户总数</div>
              </div>
            </div>
          </el-card>
        </el-col>

      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-cont-center">
              <div class="grid-num">{{songCount}}</div>
              <div>歌曲总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

        <el-col :span="6">
          <el-card>
            <div class="grid-content">
              <div class="grid-cont-center">
                <div class="grid-num">{{singerCount}}</div>
                <div>歌手总数</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="grid-content">
              <div class="grid-cont-center">
                <div class="grid-num">{{songListCount}}</div>
                <div>歌单总数</div>
              </div>
            </div>
          </el-card>
        </el-col>

      </el-row>
      <el-row :gutter="20" class="mgb20">
        <div class="mgb20"> <h3>用户男女比例</h3></div>
        <el-col :span="12">
          <ve-pie :data="userSex" :theme="userSexOptions"></ve-pie>
        </el-col>
        <div class="mgb20"> <h3>歌曲风格分布</h3></div>
        <el-col :span="12">
          <ve-histogram :data="songStyle" ></ve-histogram>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mgb20">
        <div class="mgb20"> <h3>歌手性别比例</h3> </div>
        <el-col :span="12">
          <ve-pie :data="singerSex" :theme="singerSexOptions"></ve-pie>
        </el-col>
        <div class="mgb20"> <h3>一年内各个月份用户增长情况</h3></div>
        <el-col :span="12">
          <ve-histogram :data="userCreateOnYear" ></ve-histogram>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
        name: "Index",
        data(){
          return{
            userCount:'',
            songCount:'',
            singerCount:'',
            songListCount:'',
            users:[],
            singers:[],
            userSex:{           //按性别分类的用户数
              columns: ['性别','总数'],
              rows: [
                {'性别': '男','总数': 0},
                {'性别': '女','总数': 0}
              ]
            },
            singerSex:{
                columns:['性别','总数'],
              rows: [
                {'性别': '男','总数': 0},
                {'性别': '女','总数': 0},
                {'性别': '组合','总数': 0},
                {'性别': '不明','总数': 0},
              ]
            },
            songStyle:{           //按歌单风格分类
              columns: ['风格','总数'],
              rows: [
                {'风格': '华语','总数': 0},
                {'风格': '粤语','总数': 0},
                {'风格': '欧美','总数': 0},
                {'风格': '日韩','总数': 0},
                {'风格': 'BGM','总数': 0},
                {'风格': '轻音乐','总数': 0},
                {'风格': '乐器','总数': 0}
              ]
            },
            userCreateOnYear:{           //按歌单风格分类
              columns: ['月份','总数'],
              rows: [
                {'月份': 1,'总数': 0},
                {'月份': 2,'总数': 0},
                {'月份': 3,'总数': 0},
                {'月份': 4,'总数': 0},
                {'月份': 5,'总数': 0},
                {'月份': 6,'总数': 0},
                {'月份': 7,'总数': 0},
                {'月份': 8,'总数': 0},
                {'月份': 9,'总数': 0},
                {'月份': 10,'总数': 0},
                {'月份': 11,'总数': 0},
                {'月份': 12,'总数': 0},
              ]
            },
            userSexOptions:{
                color:['#87cefa','#ffc0cb']
            },
            singerSexOptions:{
              color:['#87cefa','#ffc0cb','#00FF7F','#FF0000']
            }
          }
        },
      created() {
          this.setUserCreateTimeOnYear();
      },
      mounted() {
        this.selectAllUserCount();
        this.selectAllSongsCount();
        this.selectAllSingersCount();
        this.selectAllSongListsCount();
      },
      methods:{
          selectAllUserCount(){
            var _this=this;
            this.$axios.get("http://localhost:8888/user/selectAllUser").then(function (data) {
                  _this.users=data.data;
                  console.log(data);
                  _this.userCount=data.data.length;
                  _this.userSex.rows[0]['总数']=_this.setSex(1,_this.users);
                  _this.userSex.rows[1]['总数']=_this.setSex(0,_this.users);
            })
          },
          setSex(sex,val){
            let count=0;
            for(let item of val){
              if(sex==item.sex)
              {
                count++;
              }
            }
            return count;
          },
          selectAllSongsCount(){
            var _this=this;
            this.$axios.get("http://localhost:8888/song/selectAllSongs").then(function (data) {
              _this.songCount=data.data.length;
            })
          },

        selectAllSingersCount(){
          var _this=this;
          this.$axios.get("http://localhost:8888/singer/selectAllSinger").then(function (data) {
            _this.singers=data.data;
            _this.singerCount=data.data.length;
            _this.singerSex.rows[0]['总数']=_this.getSingerSex(1,_this.singers);
            _this.singerSex.rows[1]['总数']=_this.getSingerSex(0,_this.singers);
            _this.singerSex.rows[2]['总数']=_this.getSingerSex(2,_this.singers);
            _this.singerSex.rows[3]['总数']=_this.getSingerSex(3,_this.singers);
          })
        },

        getSingerSex(sex,val){
          let count=0;
          for(let item of val){
            if(sex==item.sex)
            {
              count++;
            }
          }
          return count;
        },
        selectAllSongListsCount(){
          var _this=this;
          this.$axios.get("http://localhost:8888/songList/selectAllSongList").then(function (data) {
            _this.songListCount=data.data.length;
            console.log(data.data);
            for(let item of data.data){
              _this.setStyle(item.style);
            }
          })
        },
        setStyle(style){
          for(let item of this.songStyle.rows){
            if(style.includes(item['风格'])){
              item['总数']++;
            }
          }
        },
        setUserCreateTimeOnYear(){
            var _this=this;
            this.$axios.get("http://localhost:8888/user/selectUserCreateOnYear").then(function (data) {
              console.log(data);
              console.log(data.data);
              let result=data.data;
              for(var key in result){
                console.log(key);
                console.log(result[key]);
              }

              for(var resultItem in result){
                for(let item of _this.userCreateOnYear.rows){
                  if(item['月份']==resultItem){
                    item['总数']=result[resultItem];
                  }
                }
              }
            })
        }
      }
    }
</script>

<style scoped>
.grid-content{
  display: flex;
  align-items: center;
  height: 50px;
}

.grid-cont-center{
    flex:1;
    text-align: center;
    font-size: 14px;
    color:darkgray;
  }

.grid-num{
  font-size: 30px;
  font-weight: bold;
}
</style>
