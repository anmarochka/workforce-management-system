import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

export const sendToQueue = async (data: any) => {
  const conn = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
  const ch = await conn.createChannel();
  const queue = "attendance_events";

  await ch.assertQueue(queue, { durable: false });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  console.log("📤 Sent to queue:", data);

  setTimeout(() => {
    ch.close();
    conn.close();
  }, 500);
};
