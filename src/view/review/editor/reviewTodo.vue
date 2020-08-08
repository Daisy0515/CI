<template>
    <editor-review-list :status="status" :statusExplain="statusExplain"></editor-review-list>
</template>
<script>

    import editorReviewList from '@/view/review/components/editorReviewList';

    export default {
        props: {
            status: {//状态1待处理2评审中3完成4中止
                type: [Number,String],
                default: null,
            },
            statusExplain: {//评审状态（评审中）1评审专家完成评审2需要额外评审专家3评审延期4评审邀请未回复
                type: [Number,String],
                default: null,
            }
        },
        components: {
            editorReviewList,
        },
    }
</script>

