<template>
    <expert :timeStatus="timeStatus"></expert>
</template>

<script>
    import  expert from '@/view/review/expert/components/expert'
    export default {
        name:"expertAlreadyTimeOut",
        components: {
            expert
        },
        data(){
            return{
                timeStatus:2,//已经超时
            }
        }
    }
</script>
