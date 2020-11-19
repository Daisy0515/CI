<!--功能：展示导航栏待处理页面各个子页面的评审任务，根据不同的参数来判断
    调用页面:editorTodo(评审管理员：导航栏待处理)
-->
<template>
    <editor-review-list :status="status" :statusExplain="statusExplain"></editor-review-list>
</template>
<script>

    import editorReviewList from '@/view/review/editor/components/editorReviewList';

    export default {
        props: {
            status: {//状态1待处理2评审中3完成4中止
                type: [Number, String],
                default: null,
            },
            statusExplain: {//评审状态（评审中）1评审专家完成评审2需要额外评审专家3评审延期4评审邀请未回复
                type: [Number, String],
                default: null,
            }
        },
        components: {
            editorReviewList,
        },
    }
</script>

