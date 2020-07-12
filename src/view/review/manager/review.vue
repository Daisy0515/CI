<template>
    <manager :pageName="pageName" :status="status"></manager>
</template>

<script>
    import manager from '@/view/review/components/manager'
    export default {
        components:{manager},
        data() {
            return {
                pageName:"评审中",
                status:2,
            };
        },
    };
</script>


