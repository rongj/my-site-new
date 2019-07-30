<template>
  <div id="app">
    <div class="main-wrap">
      <div class="main-content">
        <div class="main-left">
          <div class="main-header">
            <h1>个人网站</h1>
            <h2>Coding...</h2>
          </div>
          <div class="main-navs">
            <ul>
              <li><router-link to="/" exact><i class="iconfont icon-home"></i>首页</router-link></li>
              <li><router-link to="/archive"><i class="iconfont icon-archive"></i>归档</router-link></li>
              <li><router-link to="/category"><i class="iconfont icon-category"></i>分类</router-link></li>
              <li><router-link to="/tag"><i class="iconfont icon-biaoqian"></i>标签</router-link></li>
              <li><router-link to="/about"><i class="iconfont icon-about"></i>关于</router-link></li>
              <li><router-link to="/tool"><i class="iconfont icon-tool"></i>工具</router-link></li>
            </ul>
          </div>
        </div>
        <div class="main-right">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @import '@/styles/common.scss';
  @import '@/styles/main.scss';
</style>
