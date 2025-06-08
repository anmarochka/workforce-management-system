import client from "prom-client";
import express from "express";

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const requestCounter = new client.Counter({
  name: "employee_service_requests_total",
  help: "Total number of requests",
  labelNames: ["endpoint"],
});

export const metricsMiddleware = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) => {
  requestCounter.inc({ endpoint: req.path });
  next();
};

export const metricsHandler = async (
  _req: express.Request,
  res: express.Response
) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
};
