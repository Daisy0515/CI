<template>
    <publisher :pageName="pageName" :status="status"></publisher>
</template>

<script>
    import publisher from '@/view/review/publisher/components/publisher'

    export default {
        components: {publisher},
        data() {
            return {
                pageName: "评审中",
                status: 2,
            };
        },
    };
</script>

