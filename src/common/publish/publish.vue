<template>
	<el-card class="box-card0">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
			<el-form-item label="项目名称" prop="name"><el-input v-model="ruleForm.name"></el-input></el-form-item>
			<el-form-item label="项目类型:">
				<el-radio-group v-model="parentIndex" size="medium" @change="changeType">
					<el-radio-button :label="item.label" v-for="(item, index) in getNormalType" :key="index"></el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="项目子类型:">
				<el-radio-group v-model="typeIndex" size="medium">
					<el-radio-button :label="item.label" v-for="(item, index) in typeidData" :key="index"></el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="一句话描述需求" prop="requirement"><el-input v-model="ruleForm.requirement"></el-input></el-form-item>
			<el-form-item label="详细描述" prop="detail"><el-input type="textarea" v-model="ruleForm.detail" :rows="10"></el-input></el-form-item>
			<el-form-item label="是否开放为竞赛">
				<label v-for="(item, index) in isCompetition" :key="index">
					<input name="FruitC" type="radio" :value="item.value" v-model="ruleForm.competition " />
					{{ item.value }}
				</label>
			</el-form-item>
			<el-form-item label="竞标方查看联系方式">
				<label v-for="(item, index) in isSee" :key="index">
					<input name="Fruit" type="radio" :value="item.value" v-model="ruleForm.checkedValue" />
					{{ item.value }}
				</label>
			</el-form-item>
			<el-form-item><sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)" /></el-form-item>

			<el-form-item label="项目交付资源">
				<el-button type="primary" size="small" @click="dialogTableVisible = true">资源配置</el-button>

				<el-dialog title="交付配置" width="40%" :visible.sync="dialogTableVisible">
					<div>
					  <el-input placeholder="请输入内容" v-model="input1">
					    <template slot="prepend">名称：</template>
					  </el-input>
					</div>
					<div style="margin-top: 15px;">
					  <el-input placeholder="请输入内容" v-model="input2">
					    <template slot="prepend">描述：</template>
					  </el-input>
					</div>
					<div style="margin-top: 15px;">
					<el-radio v-model="radio" label="true" border>必需</el-radio>
					<el-radio v-model="radio" label="false" border>可选</el-radio>
					</div>
					
					<el-button type="primary" @click="addItem" size="small" style="float: right;margin-top: 15px;">添加</el-button>

					<el-table :data="deliverData">
						<el-table-column property="resourceName" label="资源名称" width="100" align="center"></el-table-column>
						<el-table-column property="content" label="资源描述" align="center"></el-table-column>
						<el-table-column property="isUpload" label="备注" align="center">
							<template slot-scope="scope">
							  <span v-if="scope.row.isUpload=='true'">必需</span>
							  <span v-if="scope.row.isUpload=='false'">可选</span>
							 
							</template>
						</el-table-column>
						<el-table-column label="操作" width="80" align="center">
							<template slot-scope="scope">
								<router-link @click.native="deleteItem(scope.row.resourceName)" to><i class="el-icon-delete"></i></router-link>
							</template>
						</el-table-column>
					</el-table>
				</el-dialog>
			</el-form-item>

			<el-form-item label="评审需求">
				<label v-for="(item, index) in isHave" :key="index">
					<input name="FruitX" type="radio" :value="item.value" v-model="haveValue" />
					{{ item.value }}
				</label>
			</el-form-item>
<div v-show="haveValue=='有'">
			<el-form-item label="评审流程">
				<el-button type="primary" size="small" @click="dialogTableVisible1 = true">评审配置</el-button>
				<el-button type="primary" size="small" style="margin-left: 3%;">参考模板</el-button>
				<el-dialog title="评审流程" width="40%" :visible.sync="dialogTableVisible1">
					<div>
					  <el-input placeholder="请输入内容" v-model="input3">
					    <template slot="prepend">评审名称：</template>
					  </el-input>
					</div>
					<div style="margin-top: 15px;">
					  <el-input placeholder="请输入内容" v-model="input4">
					    <template slot="prepend">评审要求：</template>
					  </el-input>
					</div>
					<el-button type="primary" @click="addRItem" size="small" style="float: right;margin-top: 15px;">添加</el-button>
					
					<el-table :data="reviewData">
						<el-table-column property="processName" label="评审流程" width="100" align="center"></el-table-column>
						<el-table-column property="demand" label="评审要求" align="center"></el-table-column>
						<el-table-column label="操作" width="80" align="center">
							<template slot-scope="scope">
								<router-link @click.native="deleteRItem(scope.row.processName)" to><i class="el-icon-delete"></i></router-link>
							</template>
						</el-table-column>
					</el-table>
				</el-dialog>
			</el-form-item>
</div>
			<el-form-item class="publish"><el-button type="primary" @click="submitForm('ruleForm')" size="medium">发布需求</el-button></el-form-item>
		</el-form>
	</el-card>
</template>
<script>
import { httpGet, httpPost,httpPut } from '@/utils/http.js';
import { errTips } from '@/utils/tips.js';
import sourceUpload from '@/common/upload/resourceUpload';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import regular from '@/mixins/regular/publish.js';
export default {
	components: {
		sourceUpload
	},
	mixins: [regular],
	data() {
		return {
			id:"",
			uploadIndex: false,
			input1: '',
			input2: '',
			radio:'',
			deliverData: [],
			input3:'',
			input4:'',
			reviewData:[],
			dialogTableVisible: false,
			dialogTableVisible1: false,
			parentIndex: '',
			typeIndex: '',
			parentidData: [],
			typeidData: [],
			isSee: [{ value: '是' }, { value: '否' }],
			isCompetition: [{ value: '是' }, { value: '否' }],
			isHave: [{ value: '有' }, { value: '无' }],
			haveValue:'有',
			ruleForm: {
				parentId: null,
				typeId: null,
				checkedValue: '是',
				competition:'否',
				isSelect: '',
				accessory: '',
				name: '',
				requirement: '',
				detail: '',
				type: []
			},
			ruleForm1:{
				id:null,
				isReview:'',
				reviewProcessList:[],
				reviewResourceList:[],
				
			}
		};
	},
	created: function() {
		this.GETNORMALTYPE();
	},
	computed: {
		...mapGetters(['getNormalType'])
	},
	watch: {
		getNormalType() {
			this.parentIndex = this.getNormalType[0].label;
			this.typeidData = this.getNormalType[0].children;
			this.typeidData[0] ? (this.typeIndex = this.typeidData[0].label) : errTips('此父类没有子类请重新选择') && (this.typeIndex = '');
		}
	},
	methods: {
		...mapMutations(['setCache']),
		...mapActions(['GETNORMALTYPE']),
		addItem(){
			var L=this.deliverData.length;
			var index = -1;
			for(var i=0;i<L;i++){
				if (this.input1 == this.deliverData[i].resourceName){
					index=i;
					break;
				}
			}
			if(index>-1){
				errTips('资源名称已存在');
			} else {
				var item={projectId:null,resourceName:this.input1,content:this.input2,isUpload:this.radio};
				console.log(item);
				this.deliverData.push(item);
			}
			
			this.input1="";
			this.input2="";
			this.radio="";
			//console.log(this.deliverData);
		},
		deleteItem(itemName){
			var L=this.deliverData.length;
			//console.log(L);
			var index = -1;
			for(var i=0;i<L;i++){
				if (itemName == this.deliverData[i].resourceName){
					index=i;
					
					break;
				}
			}
			if(index>-1){
				//console.log(index);
				this.deliverData.splice(index,1);
				//console.log(this.deliverData);
			}
			
		},
		addRItem(){
			var L=this.reviewData.length;
			var index = -1;
			for(var i=0;i<L;i++){
				if (this.input3 == this.reviewData[i].processName){
					index=i;
					break;
				}
			}
			if(index>-1){
				errTips('评审流程已存在');
			}else{
				var item={projectId:null,processName:this.input3,demand:this.input4};
				//console.log(item);
				this.reviewData.push(item);
			}
			
			this.input3="";
			this.input4="";
			//console.log(this.deliverData);
		},
		deleteRItem(itemName){
			var L=this.reviewData.length;
			//console.log(L);
			var index = -1;
			for(var i=0;i<L;i++){
				if (itemName == this.reviewData[i].processName){
					index=i;
					
					break;
				}
			}
			if(index>-1){
				//console.log(index);
				this.reviewData.splice(index,1);
				//console.log(this.deliverData);
			}
			
		},
		
		uploadb() {
			this.uploadIndex = !this.uploadIndex;
		},
		changeType() {
			for (let index = 0; index < this.getNormalType.length; index++) {
				if (this.getNormalType[index].label === this.parentIndex) {
					this.typeidData = this.getNormalType[index].children;
					this.typeidData[0] ? (this.typeIndex = this.typeidData[0].label) : errTips('此父类没有子类请重新选择') && (this.typeIndex = '');
					return false;
				}
			}
		},
		setIdCard(data) {
			data && (this.ruleForm.accessory = data);
			httpPost('/v1/authorization/bid/need/insert', this.ruleForm).then(results => {
				const { data, msg, httpCode } = results.data;
				if (httpCode === 200) {
					this.id = data.id;
					this.ruleForm1.id=this.id;
					for (var i=0;i<this.reviewData.length;i++){
						this.reviewData[i].projectId=this.id;
					}
					for (var i=0;i<this.deliverData.length;i++){
						this.deliverData[i].projectId=this.id;
					}
					this.ruleForm1.reviewProcessList=this.reviewData;
					this.ruleForm1.reviewResourceList=this.deliverData;
					this.haveValue === '有' ? (this.ruleForm1.isReview= true) : (this.ruleForm1.isReview= false);
					//put /v1/authorization/review/isreview/update 
					console.log(this.ruleForm1);
					httpPut('/v1/authorization/review/isreview/update',this.ruleForm1).then(results=>{
						const { data, msg, httpCode } = results.data;
						if (httpCode === 200) {
							this.setCache('myDemand');
							//这个函数是干嘛的？？
							httpGet('/v1/authorization/bid/requirementv/recommend', {
								id: data.id
							}).then(results => {
								const { httpCode, msg } = results.data;
								if (httpCode === 200) {
								} else if (httpCode !== 401) {
									errTips(msg);
								}
							});
							
						} else {
							errTips(msg);
						}
					})	
				} else if (httpCode !== 401) {
					errTips(msg);
				}
			});
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				let { typeIndex, parentIndex, ruleForm, getNormalType } = this;
				let { checkedValue } = ruleForm;
				let { competition } = ruleForm;
				if (valid) {
					for (let i of getNormalType) {
						if (parentIndex === i.label) {
							ruleForm.parentId = i.value;
							for (let o of i.children) {
								if (typeIndex === o.label) {
									ruleForm.typeId = o.value;
								}
							}
						}
					}
					checkedValue === '是' ? (ruleForm.isSelect = 1) : (ruleForm.isSelect = 0);
					competition === '是'?(ruleForm.isCompetition = 1) : (ruleForm.isCompetition = 0);
					ruleForm.accessory ? this.setIdCard() : (this.uploadIndex = !this.uploadIndex);
				} else {
					return false;
				}
			});
		}
	}
};
</script>
<style lang="scss">
@import '@/assets/scss/publishtask.scss';
</style>
