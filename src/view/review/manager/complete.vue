<template>
    <manager :pageName="pageName" :status="status"></manager>
</template>

<script>
    import manager from '@/view/review/manager/components/manager'

    export default {
        components: {manager},
        data() {
            return {
                pageName: "已完成",
                status: 4,
            };
        },
    };
</script>


