const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class TaskRecorder {
    constructor() {
        this.recordsFile = path.join(__dirname, 'task_records.json');
        this.records = [];
        this.loadRecords();
    }

    async loadRecords() {
        try {
            const data = await fs.readFile(this.recordsFile, 'utf8');
            this.records = JSON.parse(data);
        } catch (error) {
            this.records = [];
        }
    }

    async saveRecords() {
        try {
            await fs.writeFile(this.recordsFile, JSON.stringify(this.records, null, 2));
        } catch (error) {
            console.error('保存任务记录失败:', error);
        }
    }

    generateId() {
        return crypto.randomBytes(16).toString('hex');
    }

    createTask(taskData) {
        const task = {
            id: this.generateId(),
            taskType: taskData.taskType,
            status: 'pending',
            createdAt: new Date().toISOString(),
            startedAt: null,
            completedAt: null,
            duration: null,
            userId: taskData.userId || 'anonymous',
            sessionId: taskData.sessionId || this.generateId(),
            retryCount: 0,
            errorMessage: null,
            productName: taskData.productName,
            productDescription: taskData.productDescription,
            targetCountry: taskData.targetCountry,
            modelUsed: taskData.modelUsed,
            modelInput: null,
            modelOutput: null,
            metrics: {
                responseTime: null,
                apiLatency: null,
                processingTime: null
            }
        };

        this.records.push(task);
        this.saveRecords();
        return task;
    }

    startTask(taskId, modelInput) {
        const task = this.records.find(r => r.id === taskId);
        if (task) {
            task.status = 'running';
            task.startedAt = new Date().toISOString();
            task.modelInput = modelInput;
            this.saveRecords();
        }
        return task;
    }

    completeTask(taskId, result, metrics = {}) {
        const task = this.records.find(r => r.id === taskId);
        if (task) {
            const completedAt = new Date().toISOString();
            const startTime = new Date(task.startedAt);
            const endTime = new Date(completedAt);
            
            task.status = 'completed';
            task.completedAt = completedAt;
            task.duration = endTime - startTime;
            task.modelOutput = result;
            task.metrics = {
                responseTime: metrics.responseTime || null,
                apiLatency: metrics.apiLatency || null,
                processingTime: metrics.processingTime || null
            };
            this.saveRecords();
        }
        return task;
    }

    failTask(taskId, errorMessage) {
        const task = this.records.find(r => r.id === taskId);
        if (task) {
            task.status = 'failed';
            task.completedAt = new Date().toISOString();
            task.errorMessage = errorMessage;
            if (task.startedAt) {
                const startTime = new Date(task.startedAt);
                const endTime = new Date(task.completedAt);
                task.duration = endTime - startTime;
            }
            this.saveRecords();
        }
        return task;
    }

    retryTask(taskId) {
        const task = this.records.find(r => r.id === taskId);
        if (task) {
            task.retryCount++;
            task.status = 'pending';
            task.startedAt = null;
            task.completedAt = null;
            task.errorMessage = null;
            this.saveRecords();
        }
        return task;
    }

    getTask(taskId) {
        return this.records.find(r => r.id === taskId);
    }

    getAllTasks(filter = {}) {
        let filtered = this.records;

        if (filter.keyword) {
            const keyword = filter.keyword.toLowerCase();
            filtered = filtered.filter(r => 
                (r.productName && r.productName.toLowerCase().includes(keyword)) ||
                (r.productDescription && r.productDescription.toLowerCase().includes(keyword))
            );
        }
        if (filter.userId) {
            filtered = filtered.filter(r => r.userId === filter.userId);
        }
        if (filter.dateFrom) {
            filtered = filtered.filter(r => new Date(r.createdAt) >= new Date(filter.dateFrom));
        }
        if (filter.dateTo) {
            filtered = filtered.filter(r => new Date(r.createdAt) <= new Date(filter.dateTo));
        }

        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getTaskStats() {
        const stats = {
            total: this.records.length,
            pending: this.records.filter(r => r.status === 'pending').length,
            running: this.records.filter(r => r.status === 'running').length,
            completed: this.records.filter(r => r.status === 'completed').length,
            failed: this.records.filter(r => r.status === 'failed').length,
            avgDuration: null,
            totalTokensUsed: null
        };

        const completedTasks = this.records.filter(r => r.status === 'completed' && r.duration);
        if (completedTasks.length > 0) {
            const totalDuration = completedTasks.reduce((sum, task) => sum + task.duration, 0);
            stats.avgDuration = Math.round(totalDuration / completedTasks.length);
        }

        const tasksWithTokens = this.records.filter(r => r.modelOutput && r.modelOutput.tokensUsed);
        if (tasksWithTokens.length > 0) {
            stats.totalTokensUsed = tasksWithTokens.reduce((sum, task) => sum + task.modelOutput.tokensUsed, 0);
        }

        return stats;
    }

    clearOldRecords(daysOld = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        const originalLength = this.records.length;
        this.records = this.records.filter(r => new Date(r.createdAt) > cutoffDate);
        
        if (this.records.length !== originalLength) {
            this.saveRecords();
        }
        
        return originalLength - this.records.length;
    }
}

module.exports = TaskRecorder;