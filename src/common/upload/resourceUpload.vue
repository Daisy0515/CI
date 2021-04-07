<template>
    <div class="example-simple">
        <el-dialog
            title="上传中，请勿关闭窗口！"
            :visible.sync="centerDialogVisible"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            width="30%"
            center
        >
            <div v-loading="loading" style="margin:26px 30px 80px 30px"></div>
        </el-dialog>
        <div class="upload">
            <ul>
                <li v-for="file in files" :key="file.id">
					<span>
						<i class="el-icon-document"></i>
						{{ file.name }}
					</span>
                    <span v-if="file.error">
						- 上传失败
						<i v-if="file.error != 'success'" style="font-size:13px;color:red;margin-left:10px;"
                           class="el-icon-error"></i>
					</span>
                    <span v-else-if="file.success">
						- 上传成功
						<i class="el-icon-success"></i>
					</span>
                    <i class="el-icon-delete" @click.prevent="remove(file)"></i>
                </li>
            </ul>
            <div class="example-btn">
                <file-upload
                    :input-id="'upload' + fileIndex"
                    class="btn btn-primary"
                    post-action="https://upload-z2.qiniup.com"
                    :headers="{ accept: 'text/html;charset=utf-8' }"
                    :data="qiniuData"
                    :multiple="false"
                    v-model="files"
                    @input-filter="inputFilter"
                    @input-file="inputFile"
                    ref="upload"
                >
                    <!-- :size="1024 * 1024 * 10" -->
                    <el-button type="primary" size="mini">选择资源</el-button>

                </file-upload>
                <!-- <el-button
          type="success"
          v-if="!$refs.upload || !$refs.upload.active"
          @click.prevent="$refs.upload.active = true"
        >
          Start Upload
        </el-button>-->
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.upload {
    .el-icon-document {
        margin-right: 0px;
        color: #90C0C1;
    }

    .el-icon-delete {
        margin-left: 3px;
        cursor: pointer;
        color: #90C0C1;
    }

    .el-icon-success {
        font-size: 13px;
        color: green;
        margin-left: 10px;
    }
}

.example-simple label.btn {
    margin-bottom: 0;
}

.example-btn {
    padding: 0;
}
</style>

<script>
import FileUpload from 'vue-upload-component';
import {errTips} from '@/utils/tips.js';
import {httpGet} from '@/utils/http.js';
import getFileName from '@/utils/getFileName.js';
import {setTimeout} from 'timers';
import {type} from 'os';

export default {
    components: {
        FileUpload
    },
    props: ['uploadIndex', 'fileName', 'goUpload', 'fileIndex'],  //uploadIndex 用于开启上传文件，fileIndex用来区分上传组件
    data() {
        return {
            files: [],
            centerDialogVisible: false,
            loading: false,
            qiniuData: {
                key: null,
                token: null,
                active: true,
                accept: 'text/html;charset=utf-8'
            }
        };
    },
    watch: {
        uploadIndex() {//用于监控是否上传，当uploadIndex发生变化时，开启上传文件
            if (this.files.length === 0) {  //没有文件时
                this.$emit('setIdCard', ``);
            } else {                       //有文件时
                this.centerDialogVisible = true;  //加载转圈提示开启
                this.loading = true;
                this.$refs.upload.active = true;  //开启上传文件
            }
        }
    },
    created: function () {
        httpGet('/v1/authorization/coreuser/signature/qiniu').then(results => {
            const {httpCode, msg} = results.data;
            if (httpCode === 200) {
                this.qiniuData.token = results.data.data.secret;
            } else if (httpCode !== 401) {
                errTips(msg);
            }
        });
    },
    methods: {
        remove(file) {
            this.$refs.upload.remove(file);
        },
        inputFilter(newFile, oldFile, prevent) {
            if (newFile && !oldFile) {
                if (this.goUpload) {
                    this.loading = true;
                    this.centerDialogVisible = true;
                    this.$refs.upload.active = true;
                }
                // Before adding a file
                // 添加文件前
                // Filter system files or hide files
                // 过滤系统文件 和隐藏文件
                if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
                    errTips('不可上传系统文件');
                    return prevent();
                }
                    // Filter php html js file
                    // 过滤 php html js 文件
                    // if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
                    //   errTips("不可上传")
                    //   return prevent();
                // }
                else {
                    const {yyyyMMdd, mm} = getFileName();
                    this.$nextTick(()=>{
                        this.qiniuData.key = `/cosine/resourceUpload/${yyyyMMdd}/${mm}/` + newFile.name;
                        newFile.data.key = `/cosine/resourceUpload/${yyyyMMdd}/${mm}/` + newFile.name;
                    })
                }
            }
        },
        inputFile(newFile, oldFile) {
            if (newFile && oldFile) {
                if (newFile.error != oldFile.error) {
                    this.loading = false;
                    this.centerDialogVisible = false;
                    errTips('上传失败,请刷新页面再试');
                } else if (newFile.success !== oldFile.success) {
                    setTimeout(() => {
                        this.loading = false;
                        this.centerDialogVisible = false;
                        if (typeof this.fileIndex == 'number') {
                            this.$emit('setIdCard', {
                                fileName: `http://www.resource.cosinehub.cn/${this.qiniuData.key}`,
                                fileIndex: this.fileIndex
                            });
                        } else {
                            //http://cosine.resource.ienkel.com
                            this.$emit('setIdCard', `http://www.resource.cosinehub.cn/${this.qiniuData.key}`);
                        }
                    }, 500);
                }
            }
            if (!newFile && oldFile) {
                // remove
            }
        }
    }
};
</script>
