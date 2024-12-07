const amqp = require('amqplib');

/**
 * Connect to RabbitMQ and publish an event
 */
const publishEvent = async (event) => {
  try {
    // Use environment variable or default to localhost
    
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    

    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();
    
    const queue = 'events_queue'; // Define your event queue
    await channel.assertQueue(queue, { durable: true });
    
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)));
    console.log(`Event published: ${event.eventType}`);
    
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error publishing event:', error);
  }
};

module.exports = { publishEvent };
