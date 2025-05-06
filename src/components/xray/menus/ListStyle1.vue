<template>
  <b-collapse tag="ul" :class="className" :visible="open" :id="idName" :accordion="accordianName">
    <li v-for="(item, index) in itemList" :key="index" :class="item.is_heading ? 'iq-menu-title' :activeLink(item) && item.children ? 'active' : activeLink(item) ? 'active' : ''">
      <i v-if="item.is_heading" class="ri-subtract-line" />
      <span v-if="item.is_heading">{{ $t(item.name) }}</span>
      <router-link :to="item.link" v-if="!item.is_heading" :class="`iq-waves-effect ${activeLink(item) && item.children ? 'active' : activeLink(item) ? 'active' : ''}`" v-b-toggle="item.name" :style="`color: ${activeLink(item) ? '#089bab' : '#fff !important'};`">
        <i :class="item.icon" v-if="item.is_icon_class" :style="`${ isChildComponent ? 'margin-left: 20px' : '' }`"/>
        <template v-else v-html="item.icon">
        </template>
        <span>{{ $t(item.name) }}</span>
        <i v-if="item.children" class="ri-arrow-right-s-line iq-arrow-right" />
        <small v-html="item.append" :class="item.append_class" />
      </router-link>
      <List v-if="item.children" :isChildComponent="true" :items="item.children" :userDetails="userDetails" :open="item.link.name !== '' && activeLink(item) && item.children ? true : !!(item.link.name !== '' && activeLink(item))" :idName="item.name" :accordianName="`sidebar-accordion-${item.class_name}`" :className="`iq-submenu ${item.class_name}`" />
    </li>
  </b-collapse>
</template>
<script>
import List from './ListStyle1'
import { xray } from '../../../config/pluginInit'
import _ from 'lodash'
export default {
  name: 'List',
  props: {
    items: Array,
    className: { type: String, default: 'iq-menu' },
    horizontal: Boolean,
    open: { type: Boolean, default: false },
    idName: { type: String, default: 'sidebar' },
    accordianName: { type: String, default: 'sidebar' },
    userDetails: { type: Object },
    isChildComponent: { type: Boolean, default: false }
  },
  data () {
    return {
      itemList: []
    }
  },
  components: {
    List
  },
  watch: {
    userDetails: _.debounce(function (data) {
      this.itemList = this.items?.filter(d => {
        return d?.userRoleAllowed?.includes(data?.role)
      })
    })
  },
  methods: {
    activeLink (item) {
      return xray.getActiveLink(item, this.$route.name)
    }
  },
  mounted () {
    if (this.isChildComponent) {
      this.itemList = this.items
    }
  }
}
</script>
