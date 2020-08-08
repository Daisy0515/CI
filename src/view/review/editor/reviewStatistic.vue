<template>
	<editor-review-list :expertAccomplishCount="expertAccomplishCount"></editor-review-list>
</template>
<script>

	import editorReviewList from '@/view/review/components/editorReviewList';

	export default {
		props: {
			expertAccomplishCount:{//评审专家完成人数(0/1/2/3)
				type: [Number,String],
				default: null,
			}
		},
		components: {
			editorReviewList,
		},
	}
</script>

