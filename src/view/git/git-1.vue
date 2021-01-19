<template>
    <div class="teamApplication">
        <div class="git">
            <main id="main" role="main" class="hp2018">
                <section class="c-hero c-hero--enhanced" id="heroImage">
                    <div class="o-container">
                        <div class="c-hero__lead">
                            <h1 class="c-hero__title">Git操作说明</h1>
                            <!-- <h2 class="c-hero__copy u-marginBottom0">更便捷. 易管理. 快搜索.</h2> -->
                        </div>
                    </div>
                </section>
                <div class="container">
                    <div class="about_count">
                        <div class="about_top">
                            <p>
                                <strong>一、下载 Git</strong>
                                <br><span><b>1.从Git官网下载Git安装包</b></span>
                                <br>注意不要下成 GUI，点击官网首页电视里的下载即可。
                                <br>下载网址https://git-scm.com/downloads
                                <br><span><b>2.双击安装包安装</b></span>
                                <br>根据自己的需要配置，若是一直点下一步也没有问题。
                            </p>
                            <p>
                                <strong>二、配置 Git 环境变量（可选）</strong>
                                <br>配置环境变量后，打开 cmd 输入 git 便可直接运行。但直接使用 git-bash 也是不错的选择。
                                <br>git 安装完成后就自己配置好了环境变量。如果没有自动配置的话，可以找到 git 安装路径下的 cmd 文件夹（默认为C:\Program
                                Files\Git\cmd)，复制该路径。
                                <br>将路径添加至系统环境变量。打开文件资源管理器，右键点击左侧的此电脑->属性->高级系统设置->环境变量->在下方系统变量中找到 path ->选中 path
                                并选择编辑->新建->将刚才的路径复制到其中->保存退出。
                            </p>
                            <p>
                                <strong>三、生成并配置 SSH 密匙</strong>
                                <br>打开 git-bash，这里要执行三条命令。
                                <br>git config --global user.name "你的用户名"
                                <br>git config --global user.email "你的@邮箱.com"
                                <br>ssh-keygen -t rsa -C "你的@邮箱.com"
                                <br>示例如下：
                                <br><img class="card" src="~@/assets/img/git/git-1.png"/>
                                <br>SSH 公钥和私钥都被保存在提示的文件夹中，我们需要的是公钥，如图为C:\Users\83505.ssh\id_rsa.pub。
                            </p>
                            <p>
                                <strong>四、克隆仓库</strong>
                                <br>要克隆一个仓库，首先必须知道仓库的地址，然后使用 git clone &lt;仓库在git上的URL&gt; 命令克隆。
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {}
    };
</script>
<style lang='scss'>

</style>
