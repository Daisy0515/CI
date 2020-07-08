<template>
    <manager :pageName="pageName" :status="status"></manager>
</template>

<script>
    import manager from '@/view/review/components/manager'
    export default {
        components:{manager},
        data() {
            return {
                pageName:"已经超时",
                status:6,
            };
        },
    };
</script>


