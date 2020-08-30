<template>
    <expert :timeStatus="timeStatus"></expert>
</template>

<script>
    import  expert from '@/view/review/expert/components/expert'
    export default {
        name:"expertAboutTimeOut",
        components: {
            expert
        },
        data(){
            return{
                timeStatus:1,//即将超时
            }
        }
    }
</script>
