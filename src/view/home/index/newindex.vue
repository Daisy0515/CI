<template>
    <div>
        <div id="ROBOT">
            <div style="position: fixed;z-index: 9999;right: 0;top: 800px;">
                <img src="./ROBOT.gif" v-on:click="robotDialog=true;">
            </div>
        </div>
        <div id="robot_dialog" v-show="robotDialog">
            <div style="position:fixed;top:200px;width: 900px;height: 600px;border: 1px solid #dfdfdf;overflow: hidden;
            left: 50%;margin-left: -450px;box-shadow: 0 0 15px #555;z-index: 9999;background-color: white;">
                <a class="close" style="position: absolute;right:15px;top:15px;z-index: 9999" v-on:click="robotDialog=false;"></a>
                <Robot></Robot>
            </div>
        </div>
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
    import ToolSet from '@/view/home/index/newtoolset2.vue';
    import Robot from '@/view/home/index/robot.vue';

export default {
    components: {
        Developer,
        Manager,
        Index,
        IndexForDemand,
        ToolSet,
        Robot,
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