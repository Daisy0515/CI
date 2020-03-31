<template>
  <div class="example-avatar">
    <div class="avatar-upload" v-show="!edit">
      <div class="text-center p-2">
        <file-uploade
          extensions="jpg,jpeg,png,webp"
          accept="image/png, image/jpeg, image/webp"
          input-id="file3"
          name="file"
          :headers="{'accept': 'text/html;charset=utf-8'}"
          post-action="http://upload-z2.qiniup.com"
          :data="qiniuData"
          :drop="!edit"
          v-model="files"
          @input-filter="inputFilter"
          @input-file="inputFile"
          ref="upload"
        >
          <img :src="getuserData.headurl?getuserData.headurl:getnoImg" class="rounded-circle">
          <p class="changeHead">点击更换头像</p>
        </file-uploade>
      </div>
    </div>
  </div>
</template>
<style>
.file-uploads.file-uploads-html5 label {
  cursor: pointer;
}
.example-avatar .avatar-upload .rounded-circle {
  width: 90px;
  height: 90px;
  border: 1px solid #f0f0f0;
}
</style>


<script>
import FileUploade from "vue-upload-component";
import { httpGet, httpPut } from "@/utils/http.js";
import getFileName from "@/utils/getFileName.js";
import { mapGetters, mapMutations } from "vuex";
import { errTips } from "@/utils/tips.js";
export default {
  name: "avatarUpload",
  components: {
    FileUploade
  },

  data() {
    return {
      qiniuData: {
        key: null,
        token: null,
        active: true,
        accept: "text/html;charset=utf-8"
      },
      files: [],
      edit: false,
      cropper: false
    };
  },
  computed: {
    ...mapGetters(["getnoImg", "getuserData"])
  },
  created: function() {
    httpGet("/v1/authorization/coreuser/signature/qiniu").then(results => {
      const { httpCode,msg } = results.data;
      if (httpCode === 200) {
        this.qiniuData.token = results.data.data.secret;
      } else if (httpCode !== 401) {
        errTips(msg);
      }
    });
  },
  methods: {
    ...mapMutations(["setLogin"]),
    editSave() {
      this.edit = false;
      this.$refs.upload.active = true;
    },

    alert(message) {
      alert(message);
    },

    inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        this.$nextTick(function() {
          this.edit = true;
          const { yyyyMMdd, mm } = getFileName();
          this.qiniuData.key = `/cosine/head/${yyyyMMdd}/${mm}/` + newFile.name;
          newFile.data.key = `/cosine/head/${yyyyMMdd}/${mm}/` + newFile.name;
          this.editSave();
        });
      }
      if (!newFile && oldFile) {
        this.edit = false;
      }
      if (newFile && oldFile) {
        if (newFile.error != oldFile.error) {
          errTips("上传失败,请刷新页面再试");
        } else if (newFile.success !== oldFile.success) {
          httpPut("/v1/authorization/coreuser/head/send", {
            headurl: `http://cosine.resource.ienkel.com/${this.qiniuData.key}`
          }).then(results => {
            const { httpCode, msg } = results.data;
            if (httpCode === 200) {
              // this.imageUrl = URL.createObjectURL(file.raw);
              let newuserData = {};
              Object.assign(newuserData, this.getuserData);
              newuserData.headurl = `http://cosine.resource.ienkel.com/${
                this.qiniuData.key
              }`;
              sessionStorage.setItem("userData", JSON.stringify(newuserData));
              this.setLogin();
            } else if (httpCode !== 401) {
              errTips(msg);
            }
          });
        }
      }
      // if (newFile.success !== oldFile.success) {
      //   httpPut("/v1/authorization/coreuser/head/send", {
      //     headurl: `http://cosine.resource.ienkel.com/${this.qiniuData.key}`
      //   }).then(results => {
      //     if (results.data.httpCode === 200) {
      //       // this.imageUrl = URL.createObjectURL(file.raw);
      //       let newuserData = {};
      //       Object.assign(newuserData, this.getuserData);
      //       newuserData.headurl = `http://cosine.resource.ienkel.com/${
      //         this.qiniuData.key
      //       }`;
      //       sessionStorage.setItem("userData", JSON.stringify(newuserData));
      //       this.setLogin();
      //     }
      //   });
      // }
      // if (newFile.error !== oldFile.error) {
      //  alert("上传失败");
      // }
    },

    inputFilter(newFile, oldFile, prevent) {
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
