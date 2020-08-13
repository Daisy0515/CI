<template>
	<expert :currentPage="currentPage"></expert>
</template>

<script>
	import  expert from '@/view/review/expert/components/expert'
	export default {
		components: {
			expert
		},
		data() {
			return {
				currentPage:3,//已完成页面
			};
		}
	}
</script>
