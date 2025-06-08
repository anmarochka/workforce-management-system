import amqp from "amqplib";
import pool  from "./db";
import { sendToQueue } from "./queue";
import { logger } from "./logger"; 
export const startConsumer = async () => {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || "amqp://rabbitmq:5672");
    const ch = await conn.createChannel();
    const queue = "attendance_events";

    await ch.assertQueue(queue, { durable: false });

    ch.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          logger.info(`Received attendance event: ${JSON.stringify(data)}`);

          if (!data.employee_id || !data.date || !data.hours) {
            logger.warn(`Missing required fields in message: ${JSON.stringify(data)}`);
            ch.ack(msg);
            return;
          }

          const hourlyRate = 10;
          const salary = data.hours * hourlyRate;

          await pool.query(
            "INSERT INTO payroll (employee_id, date, hours, salary) VALUES ($1, $2, $3, $4)",
            [data.employee_id, data.date, data.hours, salary]
          );

          await sendToQueue({
            employee_id: data.employee_id,
            date: data.date,
            salary: salary,
          });

          logger.info(`Payroll entry added for employee_id=${data.employee_id}, salary=${salary}`);
        } catch (error) {
          logger.error(`Error processing message: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
          ch.ack(msg);
        }
      }
    });

    logger.info("Payroll consumer is listening for attendance events...");
  } catch (err) {
    logger.error(`Failed to start consumer: ${err instanceof Error ? err.message : String(err)}`);
  }
};
