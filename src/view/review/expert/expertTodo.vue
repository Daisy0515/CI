<template>
    <expert :currentPage="currentPage"></expert>
</template>

<script>
    import expert from '@/view/review/expert/components/expert'

    export default {
        components: {
            expert
        },
        data() {
            return {
                currentPage: 1,//待处理页面
            };
        }
    }
</script>


