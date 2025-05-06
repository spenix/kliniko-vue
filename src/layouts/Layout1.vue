<template>
  <div>
    <div id="show-overlay"></div>
    <Loader />
    <div class="wrapper">
      <!-- Sidebar  -->
      <SideBarStyle1 :items="verticalMenu" :userDetails="userDetails" :horizontal="horizontal" :logo="logo" @toggle="sidebarMini" />
      <div id="content-page" class="content-page" :class="horizontal ? 'ml-0' : ''">
        <!-- TOP Nav Bar -->
        <NavBarStyle1 title="Dashboard" :userDetails="userDetails" :homeURL="{ name: 'dashboard1.home' }" @toggle="sidebarMini" :logo="logo" :horizontal="horizontal" :items="horizontalMenu">
          <template slot="responsiveRight">
            <ul class="navbar-nav ml-auto navbar-list">
              <li class="nav-item" :hidden="userDetails?.role == 'SA'">
                <a class="search-toggle iq-waves-effect language-title" href="javascript:;"><img :src="logo" alt="logo" class="img-fluid mr-1" style="height: 20px; width: 20px;" /> {{ userActiveBranch?.name }} <i class="ri-arrow-down-s-line" v-if="!isFixedBranch"></i></a>
                <div class="iq-sub-dropdown" v-if="!isFixedBranch">
                  <a class="iq-sub-card" href="javascript:void(0)" v-for="(branch, i) in userDetails?.branches" :key="`branch-${i}`" @click="changeUserBranch(branch.id)">
                    <img :src="branch.logo ? branch.logo : require('../assets/images/branch-img/no-image.jpg')" alt="logo" class="img-fluid rounded  mr-2" width="50" height="50" />{{ branch.name }}
                  </a>
                </div>
              </li>
              <li class="nav-item iq-full-screen">
                <a href="javascript:;" class="iq-waves-effect" id="btnFullscreen"><i class="ri-fullscreen-line"></i></a>
              </li>
            </ul>
          </template>
          <template slot="right">
            <ul class="navbar-list">
              <li>
                <a href="javascript:;" class="search-toggle iq-waves-effect d-flex align-items-center">
                  <img :src="userProfile" class="img-fluid rounded mr-3" alt="user">
                  <div class="caption">
                    <h6 class="mb-0 line-height">{{ userDetails?.name }}</h6>
                    <span class="font-size-12">{{ userRoleName }}</span>
                  </div>
                </a>
                <div class="iq-sub-dropdown iq-dropdown">
                  <div class="iq-card shadow-none m-0">
                    <div class="iq-card-body p-0 ">
                      <div class="bg-primary p-3">
                        <h5 class="mb-0 text-white line-height">Hello {{ userDetails?.name }}</h5>
                        <span class="text-white font-size-12">{{ userRoleName }}</span>
                      </div>
                      <!-- <a href="javascript:;" class="iq-sub-card iq-bg-primary-hover" @click="routerTarget('/user/profile')">
                        <div class="media align-items-center">
                          <div class="rounded iq-card-icon iq-bg-primary">
                            <i class="ri-file-line"></i>
                          </div>
                          <div class="media-body ml-3">
                            <h6 class="mb-0 ">{{ $t('nav.user.profileTitle') }}</h6>
                            <p class="mb-0 font-size-12">{{ $t('nav.user.profileSub') }}</p>
                          </div>
                        </div>
                      </a> -->
                      <a href="javascript:;" class="iq-sub-card iq-bg-primary-success-hover"  @click="routerTarget('/user/profile-edit')">
                        <div class="media align-items-center">
                          <div class="rounded iq-card-icon iq-bg-success">
                            <i class="ri-profile-line"></i>
                          </div>
                          <div class="media-body ml-3">
                            <h6 class="mb-0 ">{{ $t('nav.user.profileEditTitle') }}</h6>
                            <p class="mb-0 font-size-12">{{ $t('nav.user.profileEditSub') }}</p>
                          </div>
                        </div>
                      </a>
                      <!-- <a href="javascript:;" class="iq-sub-card iq-bg-primary-danger-hover">
                        <div class="media align-items-center">
                          <div class="rounded iq-card-icon iq-bg-danger">
                            <i class="ri-account-box-line"></i>
                          </div>
                          <div class="media-body ml-3">
                            <h6 class="mb-0 ">{{ $t('nav.user.accountSettingTitle') }}</h6>
                            <p class="mb-0 font-size-12">{{ $t('nav.user.accountSettingSub') }}</p>
                          </div>
                        </div>
                      </a>
                      <a href="javascript:;" class="iq-sub-card iq-bg-primary-secondary-hover">
                        <div class="media align-items-center">
                          <div class="rounded iq-card-icon iq-bg-secondary">
                            <i class="ri-lock-line"></i>
                          </div>
                          <div class="media-body ml-3">
                            <h6 class="mb-0 ">{{ $t('nav.user.privacySettingTitle') }}</h6>
                            <p class="mb-0 font-size-12">{{ $t('nav.user.privacySettingSub')}}</p>
                          </div>
                        </div>
                      </a> -->
                      <div class="d-inline-block w-100 text-center p-3">
                        <a class="iq-bg-danger iq-sign-btn" href="javascript:void(0)" @click="logout" role="button">{{ $t('nav.user.signout') }}<i class="ri-login-box-line ml-2"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </template>
        </NavBarStyle1>
        <!-- TOP Nav Bar END -->
        <transition name="router-anim" :enter-active-class="`animated ${animated.enter}`" mode="out-in"
                    :leave-active-class="`animated ${animated.exit}`">
          <router-view/>
        </transition>
        <FooterStyle1>
          <template v-slot:left>
            <li class="list-inline-item"><a href="javascript:;">Privacy Policy</a></li>
            <li class="list-inline-item"><a href="javascript:;">Terms of Use</a></li>
          </template>
          <template v-slot:right>
            Copyright 2023 <a href="javascript:;">DJDC APP</a> All Rights Reserved.
          </template>
        </FooterStyle1>
      </div>
    </div>
  </div>
</template>
<script>
import Loader from '../components/xray/loader/Loader'
import SideBarStyle1 from '../components/xray/sidebars/SideBarStyle1'
import NavBarStyle1 from '../components/xray/navbars/NavBarStyle1'
import SideBarItems from '../FackApi/json/SideBar'
import HorizontalItems from '../FackApi/json/HorizontalMenu'
import profile from '../assets/images/user/1.jpg'
import loader from '../assets/images/djdc-logo.png'
import { xray } from '../config/pluginInit'
import { Users } from '../FackApi/api/chat'
import { mapGetters, mapActions } from 'vuex'
import userService from '../services/user'
import authService from '../services/auth'
import _ from 'lodash'
export default {
  name: 'Layout1',
  components: {
    Loader,
    SideBarStyle1,
    NavBarStyle1
  },
  mounted () {
    this.userDetailsSetup()
    this.updateRadio()
  },
  computed: {
    ...mapGetters({
      selectedLang: 'Setting/langState',
      langsOptions: 'Setting/langOptionState',
      colors: 'Setting/colorState',
      userDetails: 'Auth/userDetails',
      userActiveBranch: 'Auth/userActiveBranch'
    })
  },
  watch: {
    userDetails: _.debounce(function (data) {
      if (data?.profile_path) {
        var cnt = data?.profile_path.split('/')
        if (cnt.length > 3) {
          this.userProfile = data?.profile_path
        } else {
          this.userProfile = process.env.VUE_APP_API_BASE_URL + data?.profile_path
        }
      }
    }, 300),
    userActiveBranch: _.debounce(function (data) {
      if (data?.logo) {
        var cnt = data?.logo.split('/')
        if (cnt.length > 3) {
          this.logo = data?.logo
        } else {
          this.logo = process.env.VUE_APP_API_BASE_URL + data?.logo
        }
      }
    }, 300)
  },
  // sidebarTicket
  data () {
    return {
      horizontal: false,
      mini: false,
      darkMode: false,
      animated: { enter: 'zoomIn', exit: 'zoomOut' },
      animateClass: [
        { value: { enter: 'zoomIn', exit: 'zoomOut' }, text: 'Zoom' },
        { value: { enter: 'fadeInUp', exit: 'fadeOutDown' }, text: 'Fade' },
        { value: { enter: 'slideInLeft', exit: 'slideOutRight' }, text: 'Slide' },
        { value: { enter: 'rotateInDownLeft', exit: 'rotateOutDownLeft' }, text: 'Roll' }
      ],
      horizontalMenu: HorizontalItems,
      verticalMenu: SideBarItems,
      userProfile: profile,
      logo: loader,
      usersList: Users,
      rtl: false,
      message: [
        { image: require('../assets/images/user/01.jpg'), name: 'Nik Emma Watson', date: '13 jan' },
        { image: require('../assets/images/user/02.jpg'), name: 'Greta Life', date: '14 Jun' },
        { image: require('../assets/images/user/03.jpg'), name: 'Barb Ackue', date: '16 Aug' },
        { image: require('../assets/images/user/04.jpg'), name: 'Anna Sthesia', date: '21 Sept' },
        { image: require('../assets/images/user/05.jpg'), name: 'Bob Frapples', date: '29 Sept' }
      ],
      notification: [
        { image: require('../assets/images/user/01.jpg'), name: 'Nik Emma Watson', date: '23 hour ago', description: 'Enjoy smart access to videos, games' },
        { image: require('../assets/images/user/02.jpg'), name: 'Greta Life', date: '14 hour ago', description: 'Google Chromecast: Enjoy a world of entertainment' },
        { image: require('../assets/images/user/03.jpg'), name: 'Barb Ackue', date: '16 hour ago', description: 'Dell Inspiron Laptop: Get speed and performance from' },
        { image: require('../assets/images/user/04.jpg'), name: 'Anna Sthesia', date: '21 hour ago', description: 'Deliver your favorite playlist anywhere in your home ' },
        { image: require('../assets/images/user/05.jpg'), name: 'Bob Frapples', date: '11 hour ago', description: 'MacBook Air features up to 8GB of memory, a fifth-generation' }
      ],
      userRoles: [ { text: 'SYSTEM ADMINISTRATOR', value: 'SA' },
        { text: 'ADMINISTRATOR', value: 'AD' },
        { text: 'OPERATIONAL MANAGER', value: 'OM' },
        { text: 'OFFICER IN CHARGE', value: 'OIC' },
        { text: 'DENTAL ASSISTANT', value: 'DA' },
        { text: 'Receptionist', value: 'RC' }

      ],
      userRoleName: '',
      isFixedBranch: false
    }
  },
  methods: {
    ...mapActions({
      langChangeState: 'Setting/setLangAction',
      rtlAdd: 'Setting/setRtlAction',
      rtlRemove: 'Setting/removeRtlAction',
      isLoggedInAction: 'Auth/isLoggedInAction',
      userTokenAction: 'Auth/userTokenAction',
      userDetailsAction: 'Auth/userDetailsAction',
      userActiveBranchAction: 'Auth/userActiveBranchAction'
    }),
    changeUserBranch (branchId) {
      var branch = this.userDetails?.branches?.find(d => {
        return d?.id === branchId
      })
      localStorage.setItem('active-branch', branchId)
      this.userActiveBranchAction(branch)
      this.$bvToast.toast(`Your active branch is ${branch?.name}`, {
          title: 'Switch Active Branch',
          autoHideDelay: 2000,
          appendToast: false
        })
    },
    getUserRoleName (userDatail) {
      if (userDatail) {
        var d = this.userRoles.find(d => {
          return d?.value === userDatail?.role
        })
        this.isFixedBranch = ['RC', 'DA'].includes(userDatail?.role)
        this.userRoleName = d?.text ?? 'N/A'
        var defaultBranch = {}
        if (localStorage.getItem('active-branch')) {
          defaultBranch = userDatail?.branches?.find(d => {
            return d?.id === parseInt(localStorage.getItem('active-branch'))
          })
        } else {
          defaultBranch = userDatail?.branches?.length ? userDatail?.branches[0] : {}
          localStorage.setItem('active-branch', defaultBranch?.id)
        }
        this.userActiveBranchAction(defaultBranch)
       }
    },
    userDetailsSetup () {
      var isLoggedIn = localStorage.getItem('isLoggedIn')
      var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
      this.isLoggedInAction(isLoggedIn)
      if (typeof user === 'object') {
        this.userTokenAction(isLoggedIn)
        this.userTokenAction(user?.token)
        userService.getAllUserDetails()
        .then(({ data }) => {
          if (data?.success) {
            this.userDetailsAction(data?.data)
            this.getUserRoleName(data?.data)
          }
        })
        .catch(error => { console.log(error) })
      }
    },
    updateRadio () {
      this.horizontal = this.$store.getters['Setting/horizontalMenuState']
      this.mini = this.$store.getters['Setting/miniSidebarState']
    },
    sidebarHorizontal () {
      this.$store.dispatch('Setting/horizontalMenuAction')
      this.updateRadio()
    },
    sidebarMini () {
      xray.triggerSet()
      this.$store.dispatch('Setting/miniSidebarAction')
      this.updateRadio()
    },
    rtlChange () {
      if (this.rtl) {
        this.rtlRemove()
      } else {
        this.rtlAdd()
      }
    },
    changeColor (code) {
      document.documentElement.style.setProperty('--iq-primary', code.primary)
      document.documentElement.style.setProperty('--iq-primary-light', code.primaryLight)
      if (this.darkMode) {
        document.documentElement.style.setProperty('--iq-bg-dark-color', code.bodyBgDark)
      } else {
        document.documentElement.style.setProperty('--iq-bg-light-color', code.bodyBgLight)
      }
    },
    reset () {
      this.changeColor({ primary: '#827af3', primaryLight: '#b47af3', bodyBgLight: '#efeefd', bodyBgDark: '#1d203f' })
      this.animated = { enter: 'zoomIn', exit: 'zoomOut' }
      this.light()
    },
    logout () {
      authService.logout()
      .then(({ data, status }) => {
        if (data?.success) {
          this.removeLocalStorageUserAccess()
        }
        if (status === 401) {
          this.removeLocalStorageUserAccess()
        }
        this.$swal(data?.message)
      })
      .catch(error => {
        console.log(error)
       this.removeLocalStorageUserAccess()
      })
    },
    removeLocalStorageUserAccess () {
        localStorage.removeItem('active-branch')
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
        localStorage.setItem('isLoggedIn', 0)
        this.$router.push({ name: 'auth1.sign-in1' })
    },
    langChange (lang) {
      this.langChangeState(lang)
      this.$i18n.locale = lang.value
      document.getElementsByClassName('iq-show')[0].classList.remove('iq-show')
      if (lang.value === 'ar') {
        this.rtlAdd(lang)
      } else {
        this.rtlRemove(lang)
      }
    },
    routerTarget (route) {
      this.$router.push(route)
    }
  }
}
</script>
<style>
  @import url("../assets/css/custom.css");
  div.required label::after {
      content: " * ";
      color: #B94A48;
      display: inline;
      position: unset;
      opacity: 1;
  }
</style>
