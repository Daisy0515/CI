<template>
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
              <br>git 安装完成后就自己配置好了环境变量。如果没有自动配置的话，可以找到 git 安装路径下的 cmd 文件夹（默认为C:\Program Files\Git\cmd)，复制该路径。
              <br>将路径添加至系统环境变量。打开文件资源管理器，右键点击左侧的此电脑->属性->高级系统设置->环境变量->在下方系统变量中找到 path ->选中 path 并选择编辑->新建->将刚才的路径复制到其中->保存退出。
            </p>
            <p>
              <strong>三、生成并配置 SSH 密匙</strong>
              <br>打开 git-bash，这里要执行三条命令。
              <br>git config --global user.name "你的用户名" 
              <br>git config --global user.email "你的@邮箱.com"
              <br>ssh-keygen -t rsa -C "你的@邮箱.com"
              <br>示例如下：
              <br><img class="card" src="~@/assets/img/git/git-1.png" />
              <br>SSH 公钥和私钥都被保存在提示的文件夹中，我们需要的是公钥，如图为C:\Users\83505.ssh\id_rsa.pub。
            </p>
            <p>
              <strong>四、上传项目至 git</strong>
              <br><b> 1.初始化本地仓库</b>
              <br>打开终端，选择一个文件夹作文本地仓库，进入该文件夹下，执行命令：
              <br>git init
              <br>返回 “Reinitialized existing Git repository in 文件路径” 即为初始化成功。
              <br><b>2. 将你的 github 远程端连接到本地仓库</b>
              <br>（不必要）查看当前的远程库。执行命令：
              <br>git remote -v
              <br>可以查看当前的远程库及其对应的克隆地址。
              <br>添加一个远程库。要添加一个新的远程仓库，可以指定一个简单的名字，以便将来引用。执行： 
              <br>git remote add [库名] [仓库网络地址]
              <br><b>3. 将远程端版本合并到本地版本中</b>
              <br>由于是首次执行，本地版本甚至没有 master 分支，需要更新本地版本使之与远端同步。执行命令：
              <br>git pull [库名] master
              <br>即可将远端的 master 分支合并到本地。若无这一步，系统会报以下错误：
              <br>error: src refspec master does not match any.
              <br>error: failed to push some refs to '仓库网络地址'
              <br>PS:此步骤会生成一个 .git 文件夹用来做版本控制；另外会有一个 .gitignore 文件，用来排除一些不想上传的文件。
              <br><b>4. 向 git 添加文件</b>
              <br>将你想上传的文件放置于当前文件夹下，执行命令：
              <br>git add &lt;file&gt; 或者 git add .
              <br>以此来添加单个文件或一次添加所有文件。之后可执行 git status 命令来检查你刚才添加的文件是否确实添加到位。
              <br><b>5. 提交刚才添加的文件到本地版本库，并加上注释</b>
              <br>执行命令：
              <br>git commit -m "注释信息"
              <br>该注释信息是你这次版本更新的备注信息，最终会显示在 git Repository 文件列表对应的项目后。
              <br><b>6. 将本地仓库内容上传</b>
              <br>执行命令：
              <br>git pull [库名] master (分支名)
              <br>输入git的账号密码后，系统返回上传进度，上传成功。
              <br>若步骤3未及时执行，会导致版本冲突，报错如下：
              <br>! [rejected] master -> master (non-fast-forward)
              <br>error: failed to push some refs to 'git@git.com:BIUSekale/test.git'
              <br>hint: Updates were rejected because the tip of your current branch is behind
              <br>hint: its remote counterpart. Integrate the remote changes (e.g.
              <br>hint: 'git pull ...') before pushing again.
              <br>hint: See the 'Note about fast-forwards' in 'git push --help' for details.
              <br>可以在步骤6时执行强制上传命令：
              <br>git pull [库名] master -f
              <br>但是原来网络端master分支的文件会被全部替换，要谨慎使用。所以也可以选择重新 git init 重头再来。
            </p>
            <p>
              <strong>五、Git仓库</strong>
              <br><b>1.关联远程库</b>
              <br>要关联一个远程库，使用命令git remote add &lt;远程仓库名&gt; &lt;此仓库在git上的URL>。
              <br>可以使用 git remote 查看当前关联的远程库, git remote -v 能查看更多详细信息。
              <br><b>2.推送本地</b>
              <br>关联后，使用命令git push -u &lt;远程仓库名&gt; &lt;分支名&gt; 推送本地此&lt;分支名&gt;的所有内容至远程仓库对应的&lt;分支名&gt;里。
              <br>要克隆一个仓库，首先必须知道仓库的地址，然后使用 git clone &lt;仓库在git上的URL&gt; 命令克隆。
            </p>
            <p>
              <strong>六、分支管理</strong>
              <br><b>1. 查看分支</b>
              <br>git branch, 可增加参数 -a 和 -v
              <br><b>2. 创建分支</b>
              <br>git branch (新的分支名) //没有参数时，git branch 会列出你在本地的分支。
              <br><b>3.切换分支</b>
              <br>git checkout &lt;已有分支名>
              <br>4. 创建+切换分支（本地）
              <br>git checkout -b &lt;新的分支名>
              <br>5. 创建+切换分支（从远程仓库）
              <br>git checkout -b &lt;新的本地分支名&gt; &lt;远程仓库名&gt;/&lt;远程分支名&gt;
              <br>6. 合并某分支到当前分支
              <br>git merge &lt;已有分支名&gt;
              <br>7. 删除分支
              <br>git branch -d &lt;已有分支名&gt;
              <br>8. 强行删除分支（在未merge之前）
              <br>git branch -d &lt;已有分支名&gt;
            </p>	
            <p>
              <strong>七、分支合并</strong>
              <br><b>1.本地合并分支</b>
              <br>合并当前分支和其他分支: git merge &lt;其他分支名&gt;, 若两个分支之间存在冲突,必须手动解决冲突后再提交。
              <br>•	使用git status查看冲突的文件。
              <br>•	我们保留其中一个分支内容(feature1),删掉Git给我们的标记符号。
              <br>•	再次提交add和commit提交, 用git log --graph命令可以看到分支合并图。
              <br><b>2. 远程合并分支</b>
              <br>git fetch &lt;远程仓库名&gt;
              <br>git merge &lt;远程仓库名&gt;/&lt;远程分支名&gt;
              <br>执行上面两步,先必须通过git remote add &lt;远程仓库名&gt; &lt;此仓库在git上的URL&gt;与远程仓库关联,然后再fetch和merge,解决冲突与本地一样。
              <br>NOTE: git pull &lt;远程仓库名&gt; &lt;远程分支名>:&lt;本地分支名&gt; 等同于git fetch 和 git merge两条指令顺序执行。
              <br>•	通过设置追踪关系: git branch --set-upstream &lt;本地分支名&gt; &lt;远程仓库名&gt;/&lt;远程分支名&gt;, git pull 不加参数就可以能够使用。
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  methods: {}
};
</script>
<style lang='scss'>
</style>