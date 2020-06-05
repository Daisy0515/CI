<template>
  <div class="example-avatar">
    <div class="avatar-upload" v-show="!editt">
      <div class="text-center p-2">
        <FileUploade
          extensions="gif,jpg,jpeg,png,webp"
          accept="image/png, image/gif, image/jpeg, image/webp"
          input-id="file1"
          name="file"
          class="uploadClass"
          :headers="{'accept': 'text/html;charset=utf-8'}"
          post-action="http://upload-z2.qiniup.com"
          :data="qiniuData"
          :drop="!editt"
          v-model="filess"
          @input-filter="inputFilterr"
          @input-file="inputFilerr"
          ref="upload"
        >
          <img :src="idCard?idCard:noIdCard" class="rounded-circle">
          <p class="changeHead">点击上传身份证照片</p>
        </FileUploade>
      </div>
    </div>
  </div>
</template>
<style scoped>
.file-uploads.file-uploads-html5 label {
  cursor: pointer;
}
.example-avatar .avatar-upload .rounded-circle {
  width: 300px;
  height: 160px;
  border: 1px solid #f0f0f0;
}
</style>


<script>
import FileUploade from "vue-upload-component";
import { httpGet } from "@/utils/http.js";
import getFileName from "@/utils/getFileName.js";
import { mapGetters, mapMutations } from "vuex";
import { errTips } from "@/utils/tips.js";
export default {
  name: "idCardCom",
  components: {
    FileUploade
  },
  props: ["idCard"],
  data() {
    return {
      noIdCard: require("@/assets/img/idCard.png"),
      qiniuData: {
        key: null,
        token: null,
        active: true,
        accept: "text/html;charset=utf-8"
      },
      filess: [],
      editt: false,
      cropper: false
    };
  },
  computed: {
    ...mapGetters(["getnoImg", "getuserData"])
  },
  created: function() {
    httpGet("/v1/authorization/coreuser/signature/qiniu").then(results => {
      const { httpCode, msg } = results.data;
      if (httpCode === 200) {
        this.qiniuData.token = results.data.data.secret;
      } else if (httpCode !== 401) {
        errTips(msg);
      }
    });
  },
  methods: {
    ...mapMutations(["setLogin"]),
    editSaver() {
      this.editt = false;
      this.$refs.upload.active = true;
    },

    alert(message) {
      alert(message);
    },

    inputFilerr(newFile, oldFile ) {
      if (newFile && !oldFile) {
        this.$nextTick(function() {
          this.editt = true;
          const { yyyyMMdd, mm } = getFileName();
          this.qiniuData.key =
            `/cosine/identity/${yyyyMMdd}/${mm}/` + newFile.name;
          newFile.data.key =
            `/cosine/identity/${yyyyMMdd}/${mm}/` + newFile.name;
          this.editSaver();
        });
      }
      if (!newFile && oldFile) {
        this.editt = false;
      }
      if (newFile && oldFile) {
        if (newFile.error != oldFile.error) {
          errTips("上传失败,请刷新页面再试");
        } else if (newFile.success !== oldFile.success) {
          this.$emit(
            "setIdCard",
            `http://sjy.lingdatech.net/${this.qiniuData.key}`
          );
        }
      }
      // if (newFile.error !== oldFile.error) {
      //  alert("上传失败");
      // }
    },

    inputFilterr(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(jpg|jpeg|png|webp)$/i.test(newFile.name)) {
          errTips("请上传jpg|jpeg|png|webp格式的图片");
          return prevent();
        }
      }

      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = "";
        let URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file);
        }
      }
    }
  }
};
</script>
