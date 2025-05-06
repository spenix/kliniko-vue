<template>
    <span>
        {{ descriptionParts[0] }}
        <a href="javascript:;" title="View Activity" @click="goToActivity(item.activity_id)">#{{ descriptionParts[1] }}</a>
    </span>
</template>
<script>
    export default {
        name: 'CustomLink',
        props: {
            item: Object
        },
        computed: {
            descriptionParts () {
                var desc = (this.item.description).split('#')
                return desc
            }
        },
        methods: {
            goToActivity (id) {
                this.$router.push(`/activityLogs/view/${id}`)
            }
        }
    }
</script>
