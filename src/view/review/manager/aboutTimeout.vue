<template>
    <manager :pageName="pageName" :timeStatus="timeStatus"></manager>
</template>

<script>
    import manager from '@/view/review/manager/components/manager'
    export default {
        components:{manager},
        data() {
            return {
                pageName:"即将超时",
                timeStatus:1,//对应即将超时的状态id
            };
        },
    };
</script>


