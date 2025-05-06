<template>
  <!-- TOP Nav Bar -->
  <div class="iq-top-navbar">
    <div class="iq-navbar-custom" :class="horizontal ? 'd-flex align-items-center justify-content-between' : ''">
      <div class="iq-sidebar-logo">
        <div class="top-logo">
          <router-link :to="homeURL">
            <img :src="logo" class="img-fluid" alt="logo">
            <span>DJDC</span>
          </router-link>
        </div>
      </div>
      <div class="iq-menu-horizontal" v-if="horizontal">
        <div class="iq-sidebar-menu">
          <List :items="items" class="d-flex"></List>
        </div>
      </div>
      <nav class="navbar navbar-expand-lg navbar-light p-0">
        <div class="iq-search-bar">
          <form @submit.prevent="globalSearch" class="searchbox">
            <input type="text" class="text search-input" v-model="searchKey" placeholder="Type here to search...">
            <span role="button" type="submit" class="search-link" style="color:blue;" @click="globalSearch"><i class="ri-search-line"></i></span>
          </form>
        </div>
        <b-navbar-toggle target="nav-collapse">
          <i class="ri-menu-3-line"></i>
        </b-navbar-toggle>
        <div class="iq-menu-bt align-self-center">
          <div class="wrapper-menu" @click="miniSidebar">
            <div class="main-circle"><i class="ri-more-fill"></i></div>
            <div class="hover-circle"><i class="ri-more-2-fill"></i></div>
          </div>
        </div>
        <b-collapse id="nav-collapse" is-nav>
          <slot name="responsiveRight" />
        </b-collapse>
        <slot name="right" />
      </nav>
    </div>
  </div>
  <!-- TOP Nav Bar END -->
</template>
<script>
import List from '../menus/ListStyle1'
import SideBarItems from '../../../FackApi/json/SideBar'
export default {
  name: 'NavBarStyle1',
  props: {
    homeURL: { type: Object, default: () => ({ name: 'layout1.dashboard' }) },
    title: { type: String, default: 'Dashboard' },
    logo: { type: String, default: require('../../../assets/images/djdc-logo.png') },
    horizontal: { type: Boolean, default: false },
    items: { type: Array },
    userDetails: { type: Object }
  },
  mounted () {
    document.addEventListener('click', this.closeSearch, true)
    if (this.$route?.path === '/general-search/view-results') {
      this.searchKey = this.$route?.query?.query
    }
  },
  components: {
    List
  },
  computed: {
  },
  data () {
    return {
      sidebar: SideBarItems,
      showSearch: false,
      showMenu: false,
      searchKey: ''
    }
  },
  methods: {
    globalSearch () {
      var route = `/general-search/view-results?query=${this.searchKey}`
      if (this.$route.fullPath !== route) {
        this.$router.push(route)
      }
    },
    miniSidebar () {
      this.$emit('toggle')
    }
  }
}
</script>
