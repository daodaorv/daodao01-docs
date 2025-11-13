# GitHub 开发协作指南

## 📁 项目分支结构

### 当前分支配置
- `main` - 主分支，生产环境代码
- `feature/miniprogram` - 小程序端开发
- `feature/admin-console` - PC管理端开发
- `feature/mobile-admin` - 移动管理端开发
- `feature/backend` - 后端API开发

### 分支使用原则
1. **main分支**: 只用于发布生产版本，不直接开发
2. **feature分支**: 各端独立开发，避免相互影响
3. **bug分支**: `bugfix/问题描述` 用于修复bug
4. **hotfix分支**: `hotfix/紧急修复` 用于生产环境紧急修复

## 🔄 日常开发工作流

### 1. 开始新功能开发
```bash
# 切换到对应端的开发分支
git checkout feature/miniprogram
git pull origin feature/miniprogram

# 创建功能子分支
git checkout -b feature/miniprogram-user-login
```

### 2. 提交代码
```bash
# 查看更改状态
git status

# 添加文件
git add .  # 添加所有更改
git add src/components/NewComponent.vue  # 添加特定文件

# 提交（使用中文，格式规范）
git commit -m "feat: 添加用户登录功能

- 实现手机号验证码登录
- 添加记住密码功能
- 优化登录页面UI样式
- 修复登录成功后页面跳转问题"
```

### 3. 推送到远程
```bash
# 推送当前分支
git push origin feature/miniprogram-user-login
```

## 📝 提交信息规范

### 提交类型
- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整（不影响功能）
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建工具或辅助工具的变动

### 提交格式
```
<类型>: <简短描述>

<详细说明>
- 具体改动1
- 具体改动2
- 相关问题或注意事项
```

## 🎯 分支策略详解

### 开发模式
```bash
# 开发小程序功能
git checkout feature/miniprogram
git pull origin feature/miniprogram
git checkout -b feature/miniprogram-新功能名
# ... 开发 ...
git push origin feature/miniprogram-新功能名
```

### 代码审查流程
1. 功能开发完成后，创建Pull Request
2. 邀请团队成员进行代码审查
3. 根据反馈修改代码
4. 合并到主feature分支
5. 删除临时分支

## 🔧 实用命令

### 查看状态
```bash
git status  # 查看当前状态
git log --oneline -10  # 查看最近10次提交
git branch -a  # 查看所有分支
git diff  # 查看未暂存的更改
```

### 撤销操作
```bash
git reset HEAD 文件名  # 撤销暂存
git checkout -- 文件名  # 撤销文件修改
git reset --soft HEAD~1  # 撤销最近一次提交（保留修改）
git reset --hard HEAD~1  # 撤销最近一次提交（丢弃修改）
```

### 合并分支
```bash
# 合并feature到main
git checkout main
git pull origin main
git merge feature/miniprogram
git push origin main
```

## 🌐 GitHub 网页操作

### Pull Request (PR)
1. **创建PR**:
   - 访问 GitHub 仓库页面
   - 点击 "Pull requests" → "New pull request"
   - 选择源分支和目标分支
   - 填写标题和描述
   - 点击 "Create pull request"

2. **PR模板**:
   ```markdown
   ## 📝 功能描述
   简要说明这个PR实现了什么功能

   ## 🔧 主要改动
   - 改动1
   - 改动2

   ## 🧪 测试情况
   - [ ] 功能测试通过
   - [ ] 兼容性测试通过

   ## 📸 截图（如适用）

   ## 🔗 相关Issue
   Closes #issue编号
   ```

### Issues 管理
- **Bug报告**: 使用 Issue 模板创建bug报告
- **功能请求**: 描述新功能的详细需求
- **问题讨论**: 技术方案讨论和决策

## 🛡️ 代码安全

### 敏感信息处理
- 不要提交密码、API密钥等敏感信息
- 使用环境变量文件 `.env`
- 在 `.gitignore` 中排除敏感文件

### 代码备份
- 定期推送到GitHub
- 重要节点创建Tag标记
- 使用GitHub Actions自动化部署

## 👥 团队协作

### 权限管理
- **Owner**: 完全控制权限
- **Maintainer**: 管理仓库和合并PR
- **Developer**: 提交代码和创建PR
- **Viewer**: 只读权限

### 沟通规范
- PR中@相关人员审查
- Issue中及时回复讨论
- 重要决策在PR或Issue中记录

## 📊 项目管理

### 项目看板
- 创建GitHub Project项目看板
- 使用Todo、In Progress、Done列管理任务
- 将Issues和PR关联到看板

### 版本管理
```bash
# 创建版本标签
git tag -a v1.0.0 -m "正式版发布"
git push origin v1.0.0
```

## 🔗 常用链接

- 仓库地址: https://github.com/daodaorv/daodao01-docs
- Issues: https://github.com/daodaorv/daodao01-docs/issues
- Pull Requests: https://github.com/daodaorv/daodao01-docs/pulls
- Actions: https://github.com/daodaorv/daodao01-docs/actions

---

## 🚀 快速开始示例

假设你要开发小程序的用户注册功能：

```bash
# 1. 切换到小程序分支并拉取最新代码
git checkout feature/miniprogram
git pull origin feature/miniprogram

# 2. 创建功能分支
git checkout -b feature/miniprogram-user-register

# 3. 开发功能...
# 编写代码、测试、调试...

# 4. 提交代码
git add .
git commit -m "feat: 实现用户注册功能

- 添加手机号验证
- 实现验证码发送
- 添加注册成功跳转
- 优化表单验证体验"

# 5. 推送到远程
git push origin feature/miniprogram-user-register

# 6. 在GitHub创建Pull Request
# 7. 邀请同事审查代码
# 8. 合并到feature/miniprogram分支
# 9. 删除功能分支
```