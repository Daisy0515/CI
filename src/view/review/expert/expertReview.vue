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
                currentPage: 2,//评审中页面
            };
        }
    }
</script>
