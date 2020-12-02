<template>
    <div class="personal">
        <el-form
                label-width="100px"
                class="demo-ruleForm clearfix"
        >
            <h3>第三方账号</h3>
            <el-form-item label="微信" prop="userName">
                <span>微信昵称</span>
                <el-button type="text" style="float: right">接触绑定</el-button>
            </el-form-item>
            <el-form-item label="QQ" prop="name">
                <span>QQ昵称</span>
                <el-button type="text" style="float: right">接触绑定</el-button>
            </el-form-item>

            <el-form-item label="微博" class="gaiphone" prop="phone">
<!--                <el-input :disabled="true" v-model="customerForm.phone"></el-input>-->
                <span>微博昵称</span>
                <el-button type="text" style="float: right" @click="unBind">接触绑定</el-button>

            </el-form-item>


        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            };
        },
        methods: {
            unBind(){

            }
        }
    }
</script>

<style scoped>

</style>
