const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const TaskRecorder = require('./taskRecorder');

const app = express();
const PORT = 3000;

const taskRecorder = new TaskRecorder();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API密钥配置 - 安全存储在后端
const API_KEY = 'ef92ecec-036e-49dc-a65e-ae873f007f86';
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

// 模型配置
const MODELS = {
    deepseek: 'deepseek-v3-1-250821',
    doubao: 'doubao-seed-1-6-250615'
};


// 商品描述生成接口
app.post('/api/generate-description', async (req, res) => {
    try {
        const { productName, productDescription = '', targetCountry, model = 'deepseek' } = req.body;
        
        if (!productName || !productName.trim()) {
            return res.status(400).json({ error: '商品名称不能为空' });
        }

        if (!targetCountry || !targetCountry.trim()) {
            return res.status(400).json({ error: '目标销售国家不能为空' });
        }

        const selectedModel = MODELS[model] || MODELS.deepseek;
        
        // 读取用户自定义的提示词模板
        const systemPrompt = fs.readFileSync('./description', 'utf8');
        
        // 替换模板中的占位符
        const userPrompt = systemPrompt.replace('{{name}}', productName)
                                      .replace('{{description}}', productDescription || '')
                                      .replace('{{country}}', targetCountry);
        
        // 创建任务记录
        task = taskRecorder.createTask({
            taskType: 'generate-description',
            productName,
            productDescription,
            targetCountry,
            modelUsed: selectedModel,
            sessionId: req.headers['x-session-id'] || 'default'
        });
        
        // 启动任务并记录模型输入
        const startTime = Date.now();
        taskRecorder.startTask(task.id, {
            model: selectedModel,
            messages: [
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: [
                    {
                        role: "user",
                        content: userPrompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API调用失败:', response.status, errorText);
            
            if (task) {
                taskRecorder.failTask(task.id, `API调用失败: ${response.status} ${response.statusText}`);
            }
            
            return res.status(response.status).json({ 
                error: `API调用失败: ${response.status} ${response.statusText}`,
                details: errorText
            });
        }

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            let content = data.choices[0].message.content.trim();
            
            console.log('API原始返回内容:', content);
            
            // 直接返回原始内容，不做任何解析或验证
            // 让前端负责解析和验证
            if (task) {
                const endTime = Date.now();
                taskRecorder.completeTask(task.id, {
                    success: true,
                    content: content,
                    model: selectedModel
                }, {
                    responseTime: endTime - startTime
                });
            }
            
            res.json({ 
                success: true,
                raw_content: content,
                model: selectedModel,
                taskId: task?.id
            });
        } else {
            if (task) {
                taskRecorder.failTask(task.id, 'API返回数据格式异常');
            }
            res.status(500).json({ error: 'API返回数据格式异常' });
        }

    } catch (error) {
        console.error('服务器错误:', error);
        if (task) {
            taskRecorder.failTask(task.id, '服务器内部错误: ' + error.message);
        }
        res.status(500).json({ error: '服务器内部错误: ' + error.message });
    }
});

// 翻译接口（可选，用于优化翻译质量）
app.post('/api/translate', async (req, res) => {
    try {
        const { text, targetLanguage, model = 'deepseek' } = req.body;
        
        if (!text || !text.trim()) {
            return res.status(400).json({ error: '翻译文本不能为空' });
        }

        const selectedModel = MODELS[model] || MODELS.deepseek;
        
        const languageMap = {
            'vietnam': '越南语',
            'thailand': '泰语', 
            'indonesia': '印尼语',
            'malaysia': '马来语',
            'philippines': '菲律宾语',
            'singapore': '英语',
            'cambodia': '柬埔寨语',
            'laos': '老挝语',
            'myanmar': '缅甸语'
        };

        const targetLangName = languageMap[targetLanguage] || '英语';
        
        const prompt = `请将以下中文文本翻译成${targetLangName}，要求：
1. 保持商品描述的销售性和吸引力
2. 符合目标语言的表达习惯
3. 准确传达产品特色和优势
4. 适合电商平台展示

待翻译文本：${text}

请直接返回翻译结果，不要包含其他解释文字。`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: [
                    {
                        role: "system",
                        content: "你是专业的商品描述翻译助手，擅长将中文商品描述准确翻译成各种语言。"
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('翻译API调用失败:', response.status, errorText);
            return res.status(response.status).json({ 
                error: `翻译API调用失败: ${response.status} ${response.statusText}`,
                details: errorText
            });
        }

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            res.json({ 
                success: true,
                translation: data.choices[0].message.content.trim(),
                model: selectedModel,
                targetLanguage: targetLangName
            });
        } else {
            res.status(500).json({ error: '翻译API返回数据格式异常' });
        }

    } catch (error) {
        console.error('翻译服务器错误:', error);
        res.status(500).json({ error: '翻译服务器内部错误: ' + error.message });
    }
});

// 获取任务记录列表
app.get('/api/tasks', async (req, res) => {
    try {
        const { keyword, userId, dateFrom, dateTo, limit = 50, page = 1 } = req.query;
        
        const filter = {};
        if (keyword) filter.keyword = keyword;
        if (userId) filter.userId = userId;
        if (dateFrom) filter.dateFrom = dateFrom;
        if (dateTo) filter.dateTo = dateTo;

        const allTasks = taskRecorder.getAllTasks(filter);
        const total = allTasks.length;
        const startIndex = (page - 1) * limit;
        const tasks = allTasks.slice(startIndex, startIndex + parseInt(limit));

        res.json({
            success: true,
            data: tasks,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('获取任务记录失败:', error);
        res.status(500).json({ error: '获取任务记录失败: ' + error.message });
    }
});

// 获取单个任务详情
app.get('/api/tasks/:taskId', async (req, res) => {
    try {
        const task = taskRecorder.getTask(req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: '任务不存在' });
        }
        res.json({ success: true, data: task });
    } catch (error) {
        console.error('获取任务详情失败:', error);
        res.status(500).json({ error: '获取任务详情失败: ' + error.message });
    }
});

// 获取任务统计信息
app.get('/api/tasks/stats', async (req, res) => {
    try {
        const stats = taskRecorder.getTaskStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('获取统计信息失败:', error);
        res.status(500).json({ error: '获取统计信息失败: ' + error.message });
    }
});

// 健康检查接口
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器（仅在非 Vercel 环境下）
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`服务器运行在 http://localhost:${PORT}`);
        console.log('API端点:');
        console.log('  POST /api/generate-description - 生成商品描述');
        console.log('  POST /api/translate - AI翻译');
        console.log('  GET  /api/tasks - 获取任务记录列表');
        console.log('  GET  /api/tasks/:id - 获取任务详情');
        console.log('  GET  /api/tasks/stats - 获取统计信息');
        console.log('  GET  /api/health - 健康检查');
        console.log('页面:');
        console.log('  http://localhost:' + PORT + ' - 主页面');
        console.log('  http://localhost:' + PORT + '/task-manager.html - 任务管理页面');
    });
}

module.exports = app;