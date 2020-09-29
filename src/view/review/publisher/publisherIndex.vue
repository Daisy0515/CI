<template>
	<div class="publisher-container">
		<el-row :gutter="40">
			<el-col :span="16">
				<el-card class="left-card-menu">
					<el-row style="margin-bottom: 20px;"><h1 style="text-align: left">评审汇总</h1></el-row>
					<el-row style="margin-bottom: 20px;" :gutter="20">
						<el-col :span="6">
							<el-card>
								<router-link to="/publisherNotAccept">
									<h1>{{ acceptCount }}</h1>
									<el-button type="text">未接受</el-button>
								</router-link>
							</el-card>
						</el-col>
						<el-col :span="6">
							<el-card>
								<router-link to="/publisherReview">
									<h1>{{ reviewCount }}</h1>
									<el-button type="text">评审中</el-button>
								</router-link>
							</el-card>
						</el-col>
						<el-col :span="6">
						    <el-card>
						        <router-link to="/publisherAboutTimeout">
						            <h1>{{ aboutTimeoutCount }}</h1>
						            <el-button type="text">即将超时</el-button>
						        </router-link>
						    </el-card>
						</el-col>
						<el-col :span="6">
						    <el-card>
						        <router-link to="/publisherAreadyTimeout">
						            <h1>{{ alreadyTimeoutCount }}</h1>
						            <el-button type="text">已经超时</el-button>
						        </router-link>
						    </el-card>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="right-card-menu">
					<el-row style="margin-bottom: 25px;">
						<el-card>
							<el-button type="text" @click="submit">发起第三方评审</el-button>
						</el-card>
					</el-row>
					<el-row style="margin-bottom: 15px;">
						<el-card>
							<el-button type="text" @click="view">查看第三方评审</el-button>
						</el-card>
					</el-row>
				</el-card>
			</el-col>
		</el-row>

	</div>
</template>

<script>
import { httpGet, httpDelete } from "@/utils/http.js";
import { specificDate } from '@/utils/getDate.js';
import { message, successTips, errTips } from "@/utils/tips.js";

	export default {
		name: 'Dashboard',
		data() {
			return {
				aboutTimeoutCount: 0, // 即将超时
				acceptCount: 0, // 未接受
				alreadyTimeoutCount: 0, // 已经超时
				reviewCount: 0, // 评审中
			}
		},
		computed: {
		},
		created: function() {
		  this.getView();
		},
		methods: {
			getView(){
				//get /v1/authorization/review/summarizing/get
				httpGet("/v1/authorization/review/summarizing/get", {role:1}).then(results => {
				  const { httpCode, msg, data } = results.data;
				  console.log("data",data);
				  if (httpCode == 200) {
				    this.acceptCount=data.acceptCount;
					this.reviewCount=data.reviewCount;
					this.aboutTimeoutCount=data.aboutTimeoutCount ;
					this.alreadyTimeoutCount=data.alreadyTimeoutCount ;
				  } else if (msg == "该条件暂无数据") {
				    message("该条件暂无数据");
				  } else if (httpCode !== 401) {
				    errTips(msg);
				  }
				});
			},
			submit(){
				this.$router.push('./submitReview');
			},
			view(){
				this.$router.push('./viewReview');
			},
		}
	}

</script>

<style lang="scss" scoped>
    .publisher {
        &-container {
            text-align: center;
        }

        .text {
            font-size: 14px;
        }

        .item {
            padding: 18px 0;
        }

    }
</style>
