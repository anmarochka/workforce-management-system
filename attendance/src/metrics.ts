import client from "prom-client";
import { Request, Response, NextFunction } from "express";

client.collectDefaultMetrics();

const requestCounter = new client.Counter({
  name: "attendance_service_requests_total",
  help: "Total number of requests to Attendance service",
  labelNames: ["endpoint"],
});

export const metricsMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  requestCounter.inc({ endpoint: req.path });
  next();
};

export const metricsHandler = async (req: Request, res: Response): Promise<void> => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
};
