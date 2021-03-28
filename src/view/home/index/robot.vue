<template>
    <div id="robot">
        
       <div style="width: 70px;height: 60px;float: left;position: relative; top:5px;"
       :key="tag"
       v-for="tag in dynamicTags">
              <a href="http://www.runoob.com"><el-image
        
                style="width: 50px; height: 50px ;"
                :src="url"
                :fit="fit"> </el-image></a>
        </div>
        
        
        <!-- <ul  v-infinite-scroll="load" style="overflow:auto">
            <li v-for="i in dynamicTags" class="infinite-list-item"><el-image
                style="width: 100px; height: 100px"
                :src="url"
                :fit="fit"></el-image></li>
          </ul> -->
          <!-- <el-scrollbar style="height: 100%;">
            <ul  v-infinite-scroll="load" style="overflow:auto">
                <li v-for="i in dynamicTags" class="infinite-list-item"><el-image
                    style="width: 100px; height: 100px"
                    :src="url"
                    :fit="fit"></el-image></li>
              </ul>
        </el-scrollbar> -->
        <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

    </div>
</template>

<script>
export default {
    name: "robot",
    data() {
      return {
        dynamicTags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: '',
        fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      };
    },
    methods: {
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    }
}
</script>

<style scoped>
     .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>