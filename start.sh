#!/bin/bash

# 智能体数据中台快速启动脚本
# 使用方法: ./start.sh

echo "🚀 启动智能体数据中台..."
echo "================================"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: npm 未安装"
    exit 1
fi

# 进入项目目录
cd "$(dirname "$0")"

echo "📁 项目目录: $(pwd)"

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 检查数据库是否存在
if [ ! -f "dev.db" ]; then
    echo "🗄️ 初始化数据库..."
    npx prisma db push
    echo "📊 添加测试数据..."
    node add-test-data.js
fi

# 启动开发服务器
echo "🌐 启动开发服务器..."
echo "================================"
echo "📍 本地地址: http://localhost:3000"
echo "📚 API文档: http://localhost:3000/api-docs"
echo "🧪 测试API: node test-dify-apis.js"
echo "================================"
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev
