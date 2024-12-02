const amqp = require("amqplib");

const JOB_POSTED = 'job_posted';

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queue = "events_queue"; // Name of the queue
  }

  // Connect to RabbitMQ server
  async connect() {
    try {
      this.connection = await amqp.connect("amqp://localhost"); // RabbitMQ URL (localhost or remote)
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
      console.log("Connected to RabbitMQ and queue is ready");
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
    }
  }

  // Publish job to the RabbitMQ queue
  async publishJob(job) {
    try {
      if (!this.channel) await this.connect();

      /*const message = JSON.stringify({
        company: job.company,
        jobTitle: job.jobTitle,
        linkURL: job.linkURL,
      }); */

      
      const message = JSON.stringify({
        eventType: JOB_POSTED,
        payload: {
            company: job.company,
            jobTitle: job.jobTitle,
            jobLink: job.linkURL
        }
      });

      

      this.channel.sendToQueue(this.queue, Buffer.from(message), {
        persistent: true, // Ensure the message is not lost
      });

      console.log(`Sent job notification: ${job.jobTitle}`);
    } catch (error) {
      console.error("Error publishing job:", error);
    }
  }

  // Close the connection and channel
  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    console.log("RabbitMQ connection closed");
  }
}

module.exports = new RabbitMQService();
 