<template>
    <editor-review-list :status="status" ></editor-review-list>
</template>
<script>

    import editorReviewList from '@/view/review/components/editorReviewList';

    export default {
        data(){
            return {
               status:3,
            };
        },
        components: {
            editorReviewList,
        },
    }
</script>

