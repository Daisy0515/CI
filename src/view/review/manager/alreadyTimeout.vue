<template>
    <manager :pageName="pageName" :timeStatus="timeStatus"></manager>
</template>

<script>
    import manager from '@/view/review/components/manager'
    export default {
        components:{manager},
        data() {
            return {
                pageName:"已经超时",
                timeStatus:2,//对应即将超时的状态id
            };
        },
    };
</script>


