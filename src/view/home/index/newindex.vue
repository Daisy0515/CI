<template>
    <div>
        <Developer v-if="projectRole == 3"/>
        <Manager v-if="projectRole == 2"/>
        <IndexForDemand v-if="projectRole == 1"/>
        <NewIndex v-else/>
    </div>
</template>

<script>
import Developer from '@/view/home/index/developer.vue';
import Manager from '@/view/home/index/manager.vue';
import NewIndex from '@/view/home/index/newindex.vue';
import IndexForDemand from '@/view/home/index/indexfordemand.vue';

export default {
    components: {
        Developer,
        Manager,
        NewIndex,
        IndexForDemand,
    },
    data(){
        return{
            projectRole: 0,
        }
    },
    created() {
        this.projectRole = sessionStorage.getItem("projectRole");
    }
}
</script>