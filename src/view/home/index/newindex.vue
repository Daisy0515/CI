<template>
    <div>
        <Index v-if="userToken === null || userToken === ''"/>
        <Developer v-if="userToken !== null && userToken !== '' && projectRole == 3"/>
        <Manager v-if="userToken !== null && userToken !== '' && projectRole == 2"/>
        <IndexForDemand v-if="userToken !== null && userToken !== '' && projectRole == 1"/>
    </div>
</template>

<script>
    import Developer from '@/view/home/index/developer.vue';
    import Manager from '@/view/home/index/manager.vue';
    import Index from '@/view/home/index/index.vue';
    import IndexForDemand from '@/view/home/index/indexfordemand.vue';

export default {
    components: {
        Developer,
        Manager,
        Index,
        IndexForDemand,
    },
    data() {
        return {
            projectRole: 0,
            userToken: "",
            robotDialog: false,
        }
    },
    created() {
        this.userToken = sessionStorage.getItem("userToken");
        this.projectRole = sessionStorage.getItem("projectRole");
    }
}
</script>
<style scoped>

.close {
    position: relative;
    margin: 3px;
    width: 24px;
    height: 24px;
    background: white;
    cursor: pointer;
    box-sizing: border-box;
}
.close:hover::before, .close:hover::after {
    background: red;
}
.close:before {
    position: absolute;
    content: '';
    width: 1px;
    height: 25px;
    background: #666666;
    transform: rotate(45deg);
    top: -3px;
    left: 11px;
}
.close:after{
    content: '';
    position: absolute;
    width: 1px;
    height: 25px;
    background: #666666;
    transform: rotate(-45deg);
    top: -3px;
    left: 11px;
}
</style>