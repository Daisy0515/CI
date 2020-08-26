<template>
    <publisher :pageName="pageName" :status="status"></publisher>
</template>

<script>
    import publisher from '@/view/review/publisher/components/publisher'
    export default {
        components:{publisher},
        data() {
            return {
                pageName:"打回中",
                status:3,
            };
        },
    };
</script>

