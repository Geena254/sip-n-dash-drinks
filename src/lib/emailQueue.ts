interface EmailJob {
    recipient: string;
    subject: string;
    htmlContent: string;
    metadata?: Record<string, any>;
    attempts?: number;
}

interface QueueOptions {
    maxRetries: number;
    retryDelay: (attempt: number) => number;
    processCallback: (job: EmailJob) => Promise<any>;
}

export class EmailQueue {
    private queue: EmailJob[] = [];
    private isProcessing = false;
    private options: QueueOptions;

    constructor(options: QueueOptions) {
        this.options = options;
        setInterval(this.processQueue.bind(this), 5000); // Process every 5 seconds
    }

    async addJob(job: Omit<EmailJob, 'attempts'>): Promise<string> {
        const jobId = `job_${Date.now()}`;
        this.queue.push({
        ...job,
        attempts: 0,
        metadata: { ...job.metadata, jobId }
        });
        return jobId;
    }

    private async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return;

        this.isProcessing = true;
        const job = this.queue.shift()!;

        try {
        await this.options.processCallback(job);
        console.log(`Email sent to ${job.recipient}`);
        } catch (error) {
        console.error(`Email failed (attempt ${job.attempts}/${this.options.maxRetries})`, error);
        
        if ((job.attempts || 0) < this.options.maxRetries) {
            const nextAttempt = (job.attempts || 0) + 1;
            setTimeout(() => {
            this.queue.push({
                ...job,
                attempts: nextAttempt
            });
            }, this.options.retryDelay(nextAttempt));
        } else {
            console.error(`Final failure for job ${job.metadata?.jobId}`);
            // Here you could log to an error tracking service
        }
        } finally {
        this.isProcessing = false;
        }
    }

    getQueueLength() {
        return this.queue.length;
    }
}