<template>
    <manager :pageName="pageName" :status="status"></manager>
</template>

<script>
    import manager from '@/view/review/components/manager'
    export default {
        components:{manager},
        data() {
            return {
                pageName:"即将超时",
                status:5,
            };
        },
    };
</script>


