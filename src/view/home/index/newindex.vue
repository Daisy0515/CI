<template>
    <div>
        <NewIndex v-if="userToken === null"/>
        <Developer v-if="userToken !== null && projectRole == 3"/>
        <Manager v-if="userToken !== null && projectRole == 2"/>
        <IndexForDemand v-if="userToken != null && projectRole == 1"/>
    </div>
</template>

<script>
import Developer from '@/view/home/index/developer.vue';
import Manager from '@/view/home/index/manager.vue';
import NewIndex from '@/view/home/index/index.vue';
import IndexForDemand from '@/view/home/index/indexfordemand.vue';

export default {
    components: {
        Developer,
        Manager,
        NewIndex,
        IndexForDemand,
    },
    data() {
        return {
            projectRole: 0,
            userToken: "",
        }
    },
    created() {
        this.userToken = sessionStorage.getItem("userToken");
        this.projectRole = sessionStorage.getItem("projectRole");
    }
}
</script>