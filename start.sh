#!/bin/bash

echo "🚀 启动电商选品工具..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查package.json是否存在
if [ ! -f "package.json" ]; then
    echo "❌ package.json 文件不存在"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 检查server.js是否存在
if [ ! -f "server.js" ]; then
    echo "❌ server.js 文件不存在"
    exit 1
fi

# 启动服务器
echo "🌟 启动服务器..."
echo "📱 前端访问地址: http://localhost:3000"
echo "🔧 API健康检查: http://localhost:3000/api/health"
echo "🛑 按 Ctrl+C 停止服务器"
echo ""

npm start