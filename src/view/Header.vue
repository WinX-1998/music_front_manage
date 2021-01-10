<template>
    <div >
      <!-- 折叠图片 -->
      <div class="collapse-btn" @click="collapseChange">
        <i class="el-icon-menu"></i>
      </div>
      <div class="logo">music后台管理</div>
      <div class="header-right">
      <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
          <i class="el-icon-rank"></i>
        </el-tooltip>
      </div>
        <div class="user-avator">
          <img src="../assets/img/user.jpg"/>
        </div>
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    {{adminName}}
                    <i class="el-icon-caret-bottom"></i>
                </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
</template>

<script>
    import bus from'../assets/js/bus.js'
    export default {
        name: "Header",
        data(){
          return {
            collapse: false,
            fullscreen:false
        }
        },
        computed:{
            adminName(){
                return localStorage.getItem("adminName");
            }
        },
        methods:{
          //侧边栏折叠
          collapseChange(){
            this.collapse = !this.collapse;
            bus.$emit('collapse',this.collapse);
          },

          //全屏
          handleFullScreen(){
            if(this.fullscreen){
              if(document.exitFullscreen){
                document.exitFullscreen();
              }else if(document.webkitCancelFullScreen){      //safari 、Chrome
                document.webkitCancelFullScreen();
              }else if (document.mozCancelFullScreen){        //firefox
                document.mozCancelFullScreen();
              }else if(document.msExitFullScreen){            //ie
                document.msExitFullScreen();
              }
            }else{
              let element = document.documentElement;
              if(element.requestFullscreen){
                element.requestFullscreen();
              }else if(element.webkitRequestFullScreen){      //safari 、Chrome
                element.webkitRequestFullScreen();
              }else if(element.mozRequestFullScreen){         //firefox
                element.mozRequestFullScreen();
              }else if (element.msRequestFullScreen){         //ie
                element.msRequestFullScreen();
              }
            }
            this.fullscreen = !this.fullscreen;
          },

          handleCommand(command){
            if(command=='logout'){
              localStorage.removeItem("adminName");
              this.$router.push("/");
            }
          }
        }
    }
</script>

<style scoped>

  .collapse-btn{
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
  }

  .logo{
    float: left;
    line-height: 70px;
  }


  .btn-fullscreen{
    transform: rotate(45deg);
    margin-right: 0px;
    font-size: 24px;
  }


  .header-right{
    float: right;
    padding-right: 50px;
    display:flex;
    height: 70px;
    align-items: center;
  }
  .user-avator{
    margin-left: 20px;
  }

  .user-avator img{
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .user-name{
    margin-left: 10px;
  }

  .el-dropdown-link{
    color: #ffffff;
    cursor: pointer;
  }
</style>
