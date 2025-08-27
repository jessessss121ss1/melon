# 电商选品工具 - 商品翻译生成器

一个基于AI的电商商品描述生成和多语言翻译工具，支持DeepSeek和豆包模型。

## 功能特性

- 🤖 **AI智能生成**：使用DeepSeek和豆包模型生成专业商品描述
- 🌍 **多语言翻译**：支持越南、泰国、印尼等9个东南亚国家语言
- 🔒 **安全架构**：API密钥安全存储在后端，前端不暴露
- 📱 **响应式设计**：完美适配桌面端和移动端
- ⚡ **智能降级**：AI服务不可用时自动使用模板生成

## 技术架构

### 前端
- 纯HTML/CSS/JavaScript
- 响应式三栏布局
- 实时翻译和生成

### 后端
- Node.js + Express
- 安全的API密钥管理
- RESTful API接口

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置API密钥

编辑 `server.js` 文件，更新API密钥：

```javascript
const API_KEY = 'your-api-key-here';
```

### 3. 启动服务

```bash
# 生产环境
npm start

# 开发环境（自动重启）
npm run dev
```

### 4. 访问应用

打开浏览器访问：http://localhost:3000

## API接口

### 生成商品描述

```bash
POST /api/generate-description
Content-Type: application/json

{
  "productName": "蓝牙耳机",
  "model": "deepseek"
}
```

### AI翻译

```bash
POST /api/translate
Content-Type: application/json

{
  "text": "这是一款优质的蓝牙耳机",
  "targetLanguage": "vietnam"
}
```

### 健康检查

```bash
GET /api/health
```

## 支持的模型

- **DeepSeek**: `deepseek-v3-1-250821`
- **豆包**: `doubao-seed-1-6-250615`

## 支持的语言

| 国家 | 语言 | 代码 |
|------|------|------|
| 越南 | 越南语 | vietnam |
| 泰国 | 泰语 | thailand |
| 印度尼西亚 | 印尼语 | indonesia |
| 马来西亚 | 马来语 | malaysia |
| 菲律宾 | 菲律宾语 | philippines |
| 新加坡 | 英语 | singapore |
| 柬埔寨 | 柬埔寨语 | cambodia |
| 老挝 | 老挝语 | laos |
| 缅甸 | 缅甸语 | myanmar |

## 使用说明

1. **选择AI模型**：DeepSeek或豆包
2. **输入商品名称**：必填项
3. **输入商品描述**：可选，不填会自动生成
4. **选择目标国家**：默认选择越南
5. **点击生成描述**：获取AI生成的专业描述和翻译

## 安全说明

- ✅ API密钥仅存储在后端服务器
- ✅ 前端不暴露任何敏感信息
- ✅ 所有API调用通过后端代理
- ✅ 支持CORS跨域安全策略

## 错误处理

- API调用失败时自动降级到本地模板
- 翻译失败时使用词典翻译
- 详细的错误信息和日志记录

## 开发说明

### 项目结构

```
melon/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 前端逻辑
├── server.js           # 后端服务器
├── package.json        # 项目配置
├── README.md           # 说明文档
└── test_api.html       # API测试页面（可选）
```

### 环境要求

- Node.js 16+
- npm 7+
- 现代浏览器支持

## License

MIT License