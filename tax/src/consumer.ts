import amqp from "amqplib";
import { pool } from "./db";
import { logger } from "./logger"; 

export const startConsumer = async () => {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    const ch = await conn.createChannel();
    const queue = "payroll_events";

    await ch.assertQueue(queue, { durable: false });

    ch.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          logger.info(` Received payroll event: ${JSON.stringify(data)}`);

          const taxRate = 0.2;
          const tax = Number(data.salary) * taxRate;

          await pool.query(
            "INSERT INTO tax_records (employee_id, date, salary, tax_amount) VALUES ($1, $2, $3, $4)",
            [data.employee_id, data.date, data.salary, tax]
          );

          logger.info(` Tax record inserted for employee_id=${data.employee_id}, tax=${tax}`);
        } catch (error) {
          logger.error(" Error processing payroll event: " + (error instanceof Error ? error.message : String(error)));
        } finally {
          ch.ack(msg);
        }
      }
    });

    logger.info(" Tax consumer is listening for payroll events...");
  } catch (err) {
    logger.error(" Failed to start tax consumer: " + (err instanceof Error ? err.message : String(err)));
  }
};
