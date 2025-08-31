// 翻译功能相关
class TranslationService {
    constructor() {
        // 多语言词典映射
        this.dictionaries = {
            vietnam: {
                // 常见电商词汇
                '商品': 'sản phẩm', '产品': 'sản phẩm', '质量': 'chất lượng',
                '优质': 'chất lượng cao', '高品质': 'chất lượng cao', '新款': 'mẫu mới',
                '时尚': 'thời trang', '舒适': 'thoải mái', '耐用': 'bền',
                '实用': 'thực dụng', '方便': 'tiện lợi', '安全': 'an toàn',
                '环保': 'thân thiện môi trường', '便宜': 'giá rẻ', '实惠': 'giá hợp lý',
                '促销': 'khuyến mãi', '限时': 'có thời hạn', '包邮': 'miễn phí vận chuyển',
                '快递': 'giao hàng nhanh',
                // 电子产品
                '手机': 'điện thoại', '电脑': 'máy tính', '耳机': 'tai nghe',
                '充电器': 'sạc', '电池': 'pin', '屏幕': 'màn hình', '摄像头': 'camera',
                // 服装
                '衣服': 'quần áo', '上衣': 'áo', '裤子': 'quần', '鞋子': 'giày',
                '包包': 'túi', '帽子': 'mũ', '袜子': 'tất', '内衣': 'đồ lót',
                // 家居
                '家具': 'nội thất', '桌子': 'bàn', '椅子': 'ghế', '床': 'giường',
                '灯': 'đèn', '镜子': 'gương', '毛巾': 'khăn', '枕头': 'gối',
                // 美妆
                '化妆品': 'mỹ phẩm', '护肤品': 'sản phẩm chăm sóc da', '面膜': 'mặt nạ',
                '口红': 'son môi', '香水': 'nước hoa',
                // 形容词
                '好': 'tốt', '很好': 'rất tốt', '棒': 'tuyệt vời', '完美': 'hoàn hảo',
                '漂亮': 'đẹp', '可爱': 'dễ thương', '大': 'lớn', '小': 'nhỏ',
                '轻': 'nhẹ', '重': 'nặng', '快': 'nhanh', '慢': 'chậm'
            },
            thailand: {
                '商品': 'สินค้า', '产品': 'ผลิตภัณฑ์', '质量': 'คุณภาพ',
                '优质': 'คุณภาพสูง', '高品质': 'คุณภาพสูง', '新款': 'รุ่นใหม่',
                '时尚': 'แฟชั่น', '舒适': 'สบาย', '耐用': 'ทนทาน',
                '实用': 'ใช้งานได้', '方便': 'สะดวก', '安全': 'ปลอดภัย',
                '便宜': 'ราคาถูก', '实惠': 'คุ้มค่า', '促销': 'โปรโมชั่น',
                '手机': 'โทรศัพท์', '电脑': 'คอมพิวเตอร์', '耳机': 'หูฟัง',
                '衣服': 'เสื้อผ้า', '鞋子': 'รองเท้า', '包包': 'กระเป๋า',
                '好': 'ดี', '很好': 'ดีมาก', '漂亮': 'สวย', '大': 'ใหญ่', '小': 'เล็ก'
            },
            indonesia: {
                '商品': 'produk', '产品': 'produk', '质量': 'kualitas',
                '优质': 'berkualitas tinggi', '高品质': 'kualitas tinggi', '新款': 'model baru',
                '时尚': 'fashion', '舒适': 'nyaman', '耐用': 'tahan lama',
                '实用': 'praktis', '方便': 'mudah', '安全': 'aman',
                '便宜': 'murah', '实惠': 'terjangkau', '促销': 'promosi',
                '手机': 'handphone', '电脑': 'komputer', '耳机': 'earphone',
                '衣服': 'pakaian', '鞋子': 'sepatu', '包包': 'tas',
                '好': 'bagus', '很好': 'sangat bagus', '漂亮': 'cantik', '大': 'besar', '小': 'kecil'
            },
            malaysia: {
                '商品': 'produk', '产品': 'produk', '质量': 'kualiti',
                '优质': 'berkualiti tinggi', '高品质': 'kualiti tinggi', '新款': 'model baru',
                '时尚': 'bergaya', '舒适': 'selesa', '耐用': 'tahan lama',
                '实用': 'praktikal', '方便': 'mudah', '安全': 'selamat',
                '便宜': 'murah', '实惠': 'berpatutan', '促销': 'promosi',
                '手机': 'telefon bimbit', '电脑': 'komputer', '耳机': 'fon telinga',
                '衣服': 'pakaian', '鞋子': 'kasut', '包包': 'beg',
                '好': 'bagus', '很好': 'sangat bagus', '漂亮': 'cantik', '大': 'besar', '小': 'kecil'
            }
        };

        this.countryInfo = {
            vietnam: { name: '越南', code: 'vi' },
            thailand: { name: '泰国', code: 'th' },
            indonesia: { name: '印尼', code: 'id' },
            malaysia: { name: '马来西亚', code: 'ms' },
            philippines: { name: '菲律宾', code: 'tl' },
            singapore: { name: '新加坡', code: 'en' },
            cambodia: { name: '柬埔寨', code: 'km' },
            laos: { name: '老挝', code: 'lo' },
            myanmar: { name: '缅甸', code: 'my' }
        };
    }

    async translate(text, targetCountry) {
        if (!text.trim() || !targetCountry) throw new Error('翻译文本和目标国家不能为空');

        // 只使用AI翻译，如果失败就直接抛出错误
        return await this.translateWithAI(text, targetCountry);
    }

    async translateWithAI(text, targetCountry) {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                targetLanguage: targetCountry
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `翻译服务器错误: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.translation) {
            return data.translation;
        } else {
            throw new Error('翻译服务器返回数据格式异常');
        }
    }

    translateWithDictionary(text, dictionary) {
        let result = text;
        
        // 按词典进行替换
        for (const [chinese, translation] of Object.entries(dictionary)) {
            const regex = new RegExp(chinese, 'g');
            result = result.replace(regex, translation);
        }
        
        return result;
    }

    async translateWithAPI(text, targetLangCode) {
        try {
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=zh|${targetLangCode}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                if (data.responseData && data.responseData.translatedText) {
                    return data.responseData.translatedText;
                }
            }
        } catch (error) {
            console.log('API translation failed, using dictionary fallback');
        }
        
        return text;
    }
}

// 描述生成器
class DescriptionGenerator {
    constructor() {
        this.deepseekTemplates = [
            '这款{产品}采用优质材料制造，具有出色的性能，为您带来卓越的使用体验。',
            '专业级{产品}，精工细作，满足您的多种需求。',
            '高品质{产品}，设计精美，性能稳定可靠。',
            '时尚{产品}，工艺精湛，适合各种使用场景。',
            '实用{产品}，品质保证，为您的生活增添便利。'
        ];

        this.doubaoTemplates = [
            '精选{产品}，匠心工艺，品质卓越，为您的生活带来全新体验。',
            '优质{产品}，时尚设计，实用功能，满足您的个性化需求。',
            '专业{产品}，创新科技，优雅外观，提升您的生活品质。',
            '高端{产品}，精致做工，可靠性能，是您的理想选择。',
            '经典{产品}，现代工艺，持久耐用，值得您的信赖与选择。'
        ];

        // API配置
        this.apiConfig = {
            deepseek: {
                url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
                model: 'deepseek-v3-1-250821'
            },
            doubao: {
                url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions', 
                model: 'doubao-seed-1-6-250615'
            }
        };
    }

    async generate(productName, productDescription, targetCountry, model = 'deepseek') {
        if (!productName.trim()) throw new Error('商品名称不能为空');

        return await this.generateWithAPI(productName, productDescription, targetCountry, model);
    }

    async generateWithAPI(productName, productDescription, targetCountry, model) {
        const response = await fetch('/api/generate-description', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productName: productName,
                productDescription: productDescription,
                targetCountry: targetCountry,
                model: model
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `服务器错误: ${response.status}`);
        }

        const data = await response.json();
        
        console.log('API响应数据:', data);
        
        console.log('API响应数据:', data);
        
        if (data.success && data.raw_content) {
            try {
                // 从raw_content中解析JSON
                let cleanContent = data.raw_content.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
                const parsedContent = JSON.parse(cleanContent);
                
                // 检查新的JSON结构：title和description下分别有chinese和target
                if (!parsedContent.title || !parsedContent.description) {
                    throw new Error('JSON格式错误：缺少title或description字段');
                }
                
                if (!parsedContent.title.chinese || !parsedContent.title.target ||
                    !parsedContent.description.chinese || !parsedContent.description.target) {
                    throw new Error('JSON格式错误：title或description缺少chinese/target子字段');
                }
                
                return {
                    title: {
                        chinese: parsedContent.title.chinese,
                        target: parsedContent.title.target
                    },
                    description: {
                        chinese: parsedContent.description.chinese,
                        target: parsedContent.description.target
                    },
                    raw_content: data.raw_content,
                    taskId: data.taskId
                };
            } catch (parseError) {
                console.error('解析raw_content失败:', parseError);
                throw new Error('JSON解析失败，请重新尝试');
            }
        } else {
            throw new Error(data.error || '服务器返回数据格式异常');
        }
    }


    generateWithTemplate(productName, model) {
        // 根据模型选择不同的模板
        const templates = model === 'doubao' ? this.doubaoTemplates : this.deepseekTemplates;
        
        // 随机选择模板
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        // 替换模板中的占位符
        let description = template.replace('{产品}', productName);

        // 根据模型添加不同的结尾
        if (model === 'doubao') {
            description += ' 豆包AI推荐，品质有保障！';
        } else {
            description += ' 模板生成，仅供参考！';
        }

        return description;
    }
}

// 主应用类
class ProductTranslatorApp {
    constructor() {
        this.translator = new TranslationService();
        this.generator = new DescriptionGenerator();
        this.init();
    }

    init() {
        // 绑定事件监听器
        document.getElementById('generateBtn').addEventListener('click', () => this.handleGenerate());
        document.getElementById('targetCountry').addEventListener('change', () => this.updateLabels());
        
        // 添加自适应高度功能
        const productDescTextarea = document.getElementById('productDesc');
        productDescTextarea.classList.add('auto-resize');
        productDescTextarea.addEventListener('input', this.autoResize);
        
        // 初始化标签
        this.updateLabels();
    }
    
    autoResize(event) {
        const textarea = event.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
    }

    updateLabels() {
        const targetCountry = document.getElementById('targetCountry').value;
        const descLabel = document.getElementById('translatedDescLabel');
        const sectionTitle = document.getElementById('translateSectionTitle');
        
        if (targetCountry && this.translator.countryInfo[targetCountry]) {
            const countryName = this.translator.countryInfo[targetCountry].name;
            if (descLabel) descLabel.textContent = `目标国家商品描述`;
            if (sectionTitle) sectionTitle.textContent = `目标国家版本`;
        } else {
            if (descLabel) descLabel.textContent = '目标国家商品描述';
            if (sectionTitle) sectionTitle.textContent = '目标国家版本';
        }
    }

    async handleGenerate() {
        const productName = document.getElementById('productName').value.trim();
        const productDesc = document.getElementById('productDesc').value.trim();
        const targetCountry = document.getElementById('targetCountry').value;
        const selectedModel = document.getElementById('modelSelect').value;

        if (!productName) {
            alert('请输入商品名称');
            return;
        }

        if (!productDesc) {
            alert('请输入商品描述');
            return;
        }

        if (!targetCountry) {
            alert('请选择目标销售国家');
            return;
        }

        this.showLoading(true);

        try {
            // 使用专业提示词生成商品描述
            const result = await this.generator.generate(productName, productDesc, targetCountry, selectedModel);
            
            // 显示中文标题和描述
            document.getElementById('chineseTitle').textContent = result.title.chinese;
            const formattedChineseDesc = typeof result.description.chinese === 'object' ? 
                this.formatObjectToText(result.description.chinese) : result.description.chinese;
            document.getElementById('chineseDesc').textContent = formattedChineseDesc;
            
            // 显示目标国家标题和描述
            document.getElementById('targetTitle').textContent = result.title.target;
            const formattedTargetDesc = typeof result.description.target === 'object' ? 
                this.formatObjectToText(result.description.target) : result.description.target;
            document.getElementById('translatedDesc').textContent = formattedTargetDesc;
            
            console.log('AI生成成功:', result);

        } catch (error) {
            console.error('Generation error:', error);
            
            // 直接显示错误信息，不提供兜底内容
            alert('生成失败：' + error.message);
            
            // 清空所有输出框
            document.getElementById('chineseTitle').textContent = '';
            document.getElementById('chineseDesc').textContent = '';
            document.getElementById('targetTitle').textContent = '';
            document.getElementById('translatedDesc').textContent = '';
        }

        this.showLoading(false);
    }
    
    formatObjectToText(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        
        let formatted = '';
        
        // 处理中文对象格式
        if (obj.欢迎语) {
            formatted += `${obj.欢迎语}\n\n`;
        }
        
        if (obj.核心卖点) {
            formatted += `🌟 核心卖点：\n${obj.核心卖点}\n\n`;
        }
        
        if (obj.使用场景) {
            formatted += `🎯 使用场景：\n${obj.使用场景}\n\n`;
        }
        
        if (obj.详细参数) {
            const params = typeof obj.详细参数 === 'object' ? 
                JSON.stringify(obj.详细参数, null, 2).replace(/[{}\"]/g, '').replace(/,\n/g, '\n').trim() :
                obj.详细参数;
            formatted += `📋 详细参数：\n${params}\n\n`;
        }
        
        if (obj.注意事项) {
            formatted += `⚠️ 注意事项：\n${obj.注意事项}\n\n`;
        }
        
        if (obj.关键词标签) {
            formatted += `🏷️ 关键词：${obj.关键词标签}`;
        }
        
        // 处理英文对象格式
        if (obj.Welcome || obj.welcome_message) {
            formatted += `${obj.Welcome || obj.welcome_message}\n\n`;
        }
        
        if (obj['Key Features'] || obj.key_features) {
            formatted += `🌟 Key Features:\n${obj['Key Features'] || obj.key_features}\n\n`;
        }
        
        if (obj['Usage Scenarios'] || obj.usage_scenarios) {
            formatted += `🎯 Usage Scenarios:\n${obj['Usage Scenarios'] || obj.usage_scenarios}\n\n`;
        }
        
        if (obj.Specifications || obj.specifications) {
            const specs = obj.Specifications || obj.specifications;
            const formattedSpecs = typeof specs === 'object' ? 
                JSON.stringify(specs, null, 2).replace(/[{}\"]/g, '').replace(/,\n/g, '\n').trim() :
                specs;
            formatted += `📋 Specifications:\n${formattedSpecs}\n\n`;
        }
        
        if (obj.Precautions || obj.precautions) {
            formatted += `⚠️ Precautions:\n${obj.Precautions || obj.precautions}\n\n`;
        }
        
        if (obj.Keywords || obj.keywords) {
            formatted += `🏷️ Keywords: ${obj.Keywords || obj.keywords}`;
        }
        
        return formatted.trim() || JSON.stringify(obj, null, 2);
    }

    handleClear() {
        // 清空输入框
        document.getElementById('productName').value = '';
        document.getElementById('productDesc').value = '';
        document.getElementById('targetCountry').value = 'vietnam';
        
        // 重置模型选择到默认值
        document.getElementById('modelSelect').value = 'deepseek';

        // 清空所有输出框
        document.getElementById('chineseTitle').textContent = '';
        document.getElementById('chineseDesc').textContent = '';
        document.getElementById('targetTitle').textContent = '';
        document.getElementById('translatedDesc').textContent = '';
        
        // 重置标签
        this.updateLabels();
    }

    showLoading(show) {
        const generateBtn = document.getElementById('generateBtn');
        const chineseTitle = document.getElementById('chineseTitle');
        const chineseDesc = document.getElementById('chineseDesc');
        const targetTitle = document.getElementById('targetTitle');
        const translatedDesc = document.getElementById('translatedDesc');
        const progressBar = document.getElementById('progressBar');
        
        if (show) {
            // 显示顶部进度条
            if (progressBar) {
                progressBar.classList.add('active');
            }
            
            // 按钮变为加载状态
            generateBtn.classList.add('loading');
            generateBtn.disabled = true;
            
            // 结果区域显示加载状态
            chineseTitle.innerHTML = `
                <div class="result-loading">
                    <div class="loading-spinner"></div>
                    <div class="loading-message">AI正在生成中文标题...</div>
                </div>
            `;
            chineseDesc.innerHTML = `
                <div class="result-loading">
                    <div class="loading-spinner"></div>
                    <div class="loading-message">AI正在生成中文描述...</div>
                </div>
            `;
            targetTitle.innerHTML = `
                <div class="result-loading">
                    <div class="loading-spinner"></div>
                    <div class="loading-message">AI正在生成目标国家标题...</div>
                </div>
            `;
            translatedDesc.innerHTML = `
                <div class="result-loading">
                    <div class="loading-spinner"></div>
                    <div class="loading-message">AI正在生成目标国家描述...</div>
                </div>
            `;
        } else {
            // 隐藏进度条
            if (progressBar) {
                progressBar.classList.remove('active');
            }
            
            // 恢复按钮状态
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
        }
    }
}

// 复制到剪贴板功能
function copyToClipboard(elementId, buttonElement) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    if (!text.trim()) {
        alert('没有内容可复制');
        return;
    }

    // 获取按钮元素
    const button = buttonElement || event.target;
    const originalText = button.textContent;
    
    // 先尝试现代的 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess(button, originalText);
        }).catch(err => {
            console.error('Clipboard API 失败:', err);
            // 降级到传统方法
            fallbackCopyToClipboard(text, button, originalText);
        });
    } else {
        // 降级到传统方法
        fallbackCopyToClipboard(text, button, originalText);
    }
}

// 传统复制方法（兼容性更好）
function fallbackCopyToClipboard(text, button, originalText) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(button, originalText);
        } else {
            showCopyError();
        }
    } catch (err) {
        console.error('传统复制方法也失败:', err);
        showCopyError();
    } finally {
        document.body.removeChild(textArea);
    }
}

// 显示复制成功
function showCopySuccess(button, originalText) {
    button.textContent = '已复制!';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.style.color = '';
    }, 2000);
}

// 显示复制错误
function showCopyError() {
    alert('复制失败，请手动选择文本复制');
}

// 全局函数，供 HTML 按钮调用
function clearAllFields() {
    if (window.app) {
        window.app.handleClear();
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ProductTranslatorApp();
});