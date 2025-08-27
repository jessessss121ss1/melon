const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

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

// 格式化中文内容为字符串
function formatChineseContent(chineseObj) {
    if (!chineseObj || typeof chineseObj !== 'object') {
        throw new Error('中文内容格式错误：必须是对象类型');
    }
    
    let formatted = '';
    
    if (chineseObj.欢迎语) {
        formatted += `${chineseObj.欢迎语}\n\n`;
    }
    
    if (chineseObj.核心卖点 && Array.isArray(chineseObj.核心卖点)) {
        formatted += `🌟 核心卖点：\n`;
        chineseObj.核心卖点.forEach((point, index) => {
            formatted += `${index + 1}. ${point}\n`;
        });
        formatted += '\n';
    }
    
    if (chineseObj.使用场景 && Array.isArray(chineseObj.使用场景)) {
        formatted += `🎯 使用场景：\n`;
        chineseObj.使用场景.forEach((scene, index) => {
            formatted += `${index + 1}. ${scene}\n`;
        });
        formatted += '\n';
    }
    
    if (chineseObj.详细参数 && typeof chineseObj.详细参数 === 'object') {
        formatted += `📋 详细参数：\n`;
        Object.entries(chineseObj.详细参数).forEach(([key, value]) => {
            formatted += `${key}：${value}\n`;
        });
        formatted += '\n';
    }
    
    if (chineseObj.注意事项 && Array.isArray(chineseObj.注意事项)) {
        formatted += `⚠️ 注意事项：\n`;
        chineseObj.注意事项.forEach((note, index) => {
            formatted += `${index + 1}. ${note}\n`;
        });
        formatted += '\n';
    }
    
    if (chineseObj.关键词标签) {
        formatted += `🏷️ 关键词：${chineseObj.关键词标签}`;
    }
    
    return formatted.trim();
}

// 格式化目标国家内容为字符串
function formatTargetCountryContent(targetObj) {
    if (!targetObj || typeof targetObj !== 'object') {
        throw new Error('目标国家内容格式错误：必须是对象类型');
    }
    
    // 获取第一个国家的数据（通常只有一个）
    const countryData = Object.values(targetObj)[0];
    if (!countryData || typeof countryData !== 'object') {
        throw new Error('目标国家数据格式错误：缺少有效的国家数据');
    }
    
    let formatted = '';
    
    if (countryData.welcome_message) {
        formatted += `${countryData.welcome_message}\n\n`;
    }
    
    if (countryData.key_features && Array.isArray(countryData.key_features)) {
        formatted += `🌟 Key Features:\n`;
        countryData.key_features.forEach((feature, index) => {
            formatted += `${index + 1}. ${feature}\n`;
        });
        formatted += '\n';
    }
    
    if (countryData.key_selling_points && Array.isArray(countryData.key_selling_points)) {
        formatted += `🌟 Key Features:\n`;
        countryData.key_selling_points.forEach((point, index) => {
            formatted += `${index + 1}. ${point}\n`;
        });
        formatted += '\n';
    }
    
    if (countryData.usage_scenarios && Array.isArray(countryData.usage_scenarios)) {
        formatted += `🎯 Usage Scenarios:\n`;
        countryData.usage_scenarios.forEach((scenario, index) => {
            formatted += `${index + 1}. ${scenario}\n`;
        });
        formatted += '\n';
    }
    
    if (countryData.specifications && typeof countryData.specifications === 'object') {
        formatted += `📋 Specifications:\n`;
        Object.entries(countryData.specifications).forEach(([key, value]) => {
            formatted += `${key}: ${value}\n`;
        });
        formatted += '\n';
    }
    
    if (countryData.precautions && Array.isArray(countryData.precautions)) {
        formatted += `⚠️ Precautions:\n`;
        countryData.precautions.forEach((precaution, index) => {
            formatted += `${index + 1}. ${precaution}\n`;
        });
        formatted += '\n';
    }
    
    if (countryData.keywords) {
        formatted += `🏷️ Keywords: ${countryData.keywords}`;
    }
    
    return formatted.trim();
}

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
        
        // 构建专业的跨境电商提示词
        const systemPrompt = `- Role: 跨境电商运营专家
- Background: 用户需要将国内商品发布到海外平台，需要一个完整且吸引人的商品信息框架，以促进销售并提升用户体验。
- Profile: 你是一位经验丰富的跨境电商运营专家，精通不同国家的消费习惯和文化差异，擅长撰写吸引人的商品描述，同时对跨境电商的运营流程和规则有深入了解。
- Skills: 你具备强大的文案撰写能力、市场分析能力、商品信息优化能力以及客户服务意识，能够根据目标市场调整商品信息，确保其符合当地消费者的期望。
- Goals: 为用户提供一个完整的商品信息框架，包括欢迎语、核心卖点、使用场景、详细参数、注意事项以及关键词标签，以提升商品在海外市场的吸引力和销售潜力。
- Constrains: 商品信息需符合目标国家的文化和消费习惯，避免文化冲突，同时确保信息的准确性和完整性。
- OutputFormat: json格式进行输出，中文介绍和对应国家的介绍，格式清晰、条理分明，便于用户直接使用或进一步调整。
{
   chinese:"xxx",
   target_country:"xxx"
}

- Workflow:
  1. 根据目标国家的文化和消费习惯撰写欢迎语，突出促销信息，吸引买家注意。
  2. 从买家角度出发，提炼商品的核心卖点，强调产品解决问题的能力和优势。
  3. 呈现使用场景，让买家能够代入使用情境，激发购买欲望。
  4. 详细列出商品的参数信息，包括颜色、材质、尺寸、容量、包装等，确保信息清晰具体。
  5. 提醒买家注意相关事项，减少售后问题和争议。
  6. 在详情页末尾添加关键词标签，优化搜索曝光。`;

        const userPrompt = `- product name：${productName}
- product description：${productDescription}
- target country: ${targetCountry}`;

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
                        content: systemPrompt
                    },
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
            return res.status(response.status).json({ 
                error: `API调用失败: ${response.status} ${response.statusText}`,
                details: errorText
            });
        }

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            let content = data.choices[0].message.content.trim();
            
            console.log('API原始返回内容:', content);
            
            // 尝试解析JSON格式的响应
            try {
                // 清理可能的markdown代码块标记
                let cleanContent = content.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
                
                const parsedContent = JSON.parse(cleanContent);
                
                console.log('解析后的JSON:', parsedContent);
                
                // 格式化中文内容为字符串
                const chineseFormatted = formatChineseContent(parsedContent.chinese);
                
                // 格式化目标国家内容为字符串  
                const targetCountryFormatted = formatTargetCountryContent(parsedContent.target_country);
                
                res.json({ 
                    success: true,
                    chinese: chineseFormatted,
                    target_country: targetCountryFormatted,
                    model: selectedModel,
                    raw_content: content // 调试用，显示原始内容
                });
            } catch (parseError) {
                console.error('JSON解析失败:', parseError.message);
                console.log('尝试解析的内容:', content);
                
                return res.status(500).json({ 
                    error: 'AI返回内容格式错误，无法解析JSON',
                    details: parseError.message,
                    raw_content: content
                });
            }
        } else {
            res.status(500).json({ error: 'API返回数据格式异常' });
        }

    } catch (error) {
        console.error('服务器错误:', error);
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
        console.log('  GET  /api/health - 健康检查');
    });
}

module.exports = app;