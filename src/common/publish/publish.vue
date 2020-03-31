<template>
  <el-card class="box-card0">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="项目类型:">
        <el-radio-group v-model="parentIndex" size="medium" @change="changeType">
          <el-radio-button :label="item.label" v-for="(item,index) in getNormalType" :key="index"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="项目子类型:">
        <el-radio-group v-model="typeIndex" size="medium">
          <el-radio-button :label="item.label" v-for="(item,index) in typeidData" :key="index"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="一句话描述需求" prop="requirement">
        <el-input v-model="ruleForm.requirement "></el-input>
      </el-form-item>
      <el-form-item label="详细描述" prop="detail">
        <el-input type="textarea" v-model="ruleForm.detail " :rows="10"></el-input>
      </el-form-item>
      <el-form-item label="竞标方查看联系方式">
        <label v-for="(item,index) in isSee" :key="index">
          <input name="Fruit" type="radio" :value="item.value" v-model="ruleForm.checkedValue" />
          {{item.value}}
        </label>
      </el-form-item>
      <el-form-item>
        <sourceUpload :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)" />
      </el-form-item>
      <el-form-item class="publish">
        <el-button type="primary" @click="submitForm('ruleForm')" size="medium">发布需求</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { httpGet,httpPost } from "@/utils/http.js";
import { errTips } from "@/utils/tips.js";
import sourceUpload from "@/common/upload/resourceUpload";
import { mapMutations, mapActions, mapGetters } from "vuex";
import regular from "@/mixins/regular/publish.js";
export default {
  components: {
    sourceUpload
  },
  mixins: [regular],
  data() {
    return {
      uploadIndex: false,
      parentIndex: "",
      typeIndex: "",
      parentidData: [],
      typeidData: [],
      isSee: [{ value: "是" }, { value: "否" }],
      ruleForm: {
        parentId: null,
        typeId: null,
        checkedValue: "是",
        isSelect: "",
        accessory: "",
        name: "",
        requirement: "",
        detail: "",
        type: []
      }
    };
  },
  created: function() {
    this.GETNORMALTYPE();
  },
  computed: {
    ...mapGetters(["getNormalType"])
  },
  watch: {
    getNormalType() {
      this.parentIndex = this.getNormalType[0].label;
      this.typeidData = this.getNormalType[0].children;
      this.typeidData[0]
        ? (this.typeIndex = this.typeidData[0].label)
        : errTips("此父类没有子类请重新选择") && (this.typeIndex = "");
    }
  },
  methods: {
    ...mapMutations(["setCache"]),
    ...mapActions(["GETNORMALTYPE"]),
    uploadb() {
      this.uploadIndex = !this.uploadIndex;
    },
    changeType() {
      for (let index = 0; index < this.getNormalType.length; index++) {
        if (this.getNormalType[index].label === this.parentIndex) {
          this.typeidData = this.getNormalType[index].children;
          this.typeidData[0]
            ? (this.typeIndex = this.typeidData[0].label)
            : errTips("此父类没有子类请重新选择") && (this.typeIndex = "");
          return false;
        }
      }
    },
    setIdCard(data) {
      data && (this.ruleForm.accessory = data);
      httpPost("/v1/authorization/bid/need/insert", this.ruleForm).then(results => {
        const { data, msg, httpCode } = results.data;
        if (httpCode === 200) {
          this.setCache("myDemand");
          httpGet("/v1/authorization/bid/requirementv/recommend", {
            id: data.id
          }).then(results => {
            const { httpCode, msg } = results.data;
            if (httpCode === 200) {
            } else if (httpCode !== 401) {
              errTips(msg);
            }
          });
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        let { typeIndex, parentIndex, ruleForm, getNormalType } = this;
        let { checkedValue } = ruleForm;
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
          checkedValue === "是" ? (ruleForm.isSelect = 1) : (ruleForm.isSelect = 0);
          ruleForm.accessory?this.setIdCard():(this.uploadIndex = !this.uploadIndex);
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang='scss'>
@import "@/assets/scss/publishtask.scss";
</style>