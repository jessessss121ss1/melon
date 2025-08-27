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
        if (!text.trim() || !targetCountry) return '';

        try {
            // 首先尝试AI翻译（更高质量）
            return await this.translateWithAI(text, targetCountry);
        } catch (error) {
            console.error('AI翻译失败，使用词典翻译:', error);
            
            // AI翻译失败时，尝试本地词典翻译
            const dictionary = this.dictionaries[targetCountry];
            if (dictionary) {
                let translated = this.translateWithDictionary(text, dictionary);
                if (translated !== text) {
                    return translated;
                }
            }

            // 最后尝试在线翻译服务
            const countryInfo = this.countryInfo[targetCountry];
            if (countryInfo) {
                try {
                    return await this.translateWithAPI(text, countryInfo.code);
                } catch (apiError) {
                    console.error('在线翻译也失败:', apiError);
                    return text;
                }
            }

            return text;
        }
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
        if (!productName.trim()) return null;

        try {
            return await this.generateWithAPI(productName, productDescription, targetCountry, model);
        } catch (error) {
            console.error('AI生成失败，使用模板生成:', error);
            // AI失败时降级到模板生成
            const fallbackDesc = this.generateWithTemplate(productName, model);
            return {
                chinese: fallbackDesc,
                target_country: fallbackDesc
            };
        }
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
        
        if (data.success) {
            return {
                chinese: data.chinese || '生成失败',
                target_country: data.target_country || '生成失败',
                raw_content: data.raw_content, // 用于调试
                parse_error: data.parse_error  // 用于调试
            };
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
        document.getElementById('clearBtn').addEventListener('click', () => this.handleClear());
        document.getElementById('targetCountry').addEventListener('change', () => this.updateLabels());
        
        // 初始化标签
        this.updateLabels();
    }

    updateLabels() {
        const targetCountry = document.getElementById('targetCountry').value;
        const nameLabel = document.getElementById('translatedNameLabel');
        const descLabel = document.getElementById('translatedDescLabel');
        const sectionTitle = document.getElementById('translateSectionTitle');
        
        if (targetCountry && this.translator.countryInfo[targetCountry]) {
            nameLabel.textContent = '目标国家商品名称:';
            descLabel.textContent = '目标国家商品描述:';
            sectionTitle.textContent = '目标国家';
        } else {
            nameLabel.textContent = '翻译后商品名称:';
            descLabel.textContent = '翻译后商品描述:';
            sectionTitle.textContent = '翻译结果';
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

        if (!targetCountry) {
            alert('请选择目标销售国家');
            return;
        }

        this.showLoading(true);

        try {
            // 使用专业提示词生成商品描述
            const result = await this.generator.generate(productName, productDesc, targetCountry, selectedModel);
            
            if (result && result.chinese && result.target_country) {
                // 显示中文结果
                document.getElementById('chineseName').textContent = productName;
                document.getElementById('chineseDesc').textContent = result.chinese;
                
                // 显示目标国家结果  
                document.getElementById('translatedName').textContent = productName;
                document.getElementById('translatedDesc').textContent = result.target_country;
                
                console.log('AI生成成功:', result);
            } else {
                // 如果生成失败，使用传统流程
                console.log('AI生成失败，使用传统流程');
                let chineseName = productName;
                let chineseDesc = productDesc.trim();
                
                // 如果没有输入描述，使用模板生成
                if (!chineseDesc) {
                    chineseDesc = this.generator.generateWithTemplate(productName, selectedModel);
                }

                document.getElementById('chineseName').textContent = chineseName;
                document.getElementById('chineseDesc').textContent = chineseDesc;

                // 进行翻译
                const translatedName = await this.translator.translate(chineseName, targetCountry);
                const translatedDesc = await this.translator.translate(chineseDesc, targetCountry);
                
                document.getElementById('translatedName').textContent = translatedName;
                document.getElementById('translatedDesc').textContent = translatedDesc;
            }

        } catch (error) {
            console.error('Generation error:', error);
            
            // 发生错误时，也显示基础信息
            document.getElementById('chineseName').textContent = productName;
            document.getElementById('chineseDesc').textContent = productDesc || '生成失败，请稍后重试';
            document.getElementById('translatedName').textContent = productName;
            document.getElementById('translatedDesc').textContent = '生成失败：' + error.message;
        }

        this.showLoading(false);
    }

    handleClear() {
        // 清空输入框（保留API密钥）
        document.getElementById('productName').value = '';
        document.getElementById('productDesc').value = '';
        document.getElementById('targetCountry').value = 'vietnam';
        
        // 重置模型选择到默认值
        document.getElementById('modelSelect').value = 'deepseek';

        // 清空所有输出框
        document.getElementById('chineseName').textContent = '';
        document.getElementById('chineseDesc').textContent = '';
        document.getElementById('translatedName').textContent = '';
        document.getElementById('translatedDesc').textContent = '';
        
        // 重置标签
        this.updateLabels();
    }

    showLoading(show) {
        const modal = document.getElementById('loadingModal');
        modal.style.display = show ? 'flex' : 'none';
    }
}

// 复制到剪贴板功能
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    if (!text.trim()) {
        alert('没有内容可复制');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        // 显示复制成功提示
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '已复制!';
        button.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动选择文本复制');
    });
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ProductTranslatorApp();
});