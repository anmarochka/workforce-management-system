import amqp from "amqplib";

export const sendToQueue = async (data: any) => {
  const conn = await amqp.connect(process.env.RABBITMQ_URL || "amqp://rabbitmq");
  const ch = await conn.createChannel();
  const queue = "payroll_events";

  await ch.assertQueue(queue, { durable: false });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  console.log("Sent to payroll_events:", data);

  setTimeout(() => conn.close(), 500);
};
