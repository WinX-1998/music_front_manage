<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside width="200px"><Aside></Aside></el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    import Aside from "./Aside";
    import Header from "./Header";
    export default {
        name: "Home",
      components: {Header, Aside}
    }
</script>

<style scoped>

  .el-header{
    padding:0;
    background-color: #253041;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    font-size: 22px;
    color: #ffffff;
    height: 70px !important;
  }

</style>
