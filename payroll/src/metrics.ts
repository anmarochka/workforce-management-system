import { Router } from "express";

const router = Router();

router.get("/metrics", (_req, res) => {
  res.set("Content-Type", "text/plain");
  res.send(`# HELP payroll_service_requests_total Total number of requests\n# TYPE payroll_service_requests_total counter\npayroll_service_requests_total{endpoint="/metrics"} 1`);
});

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/ping", (_req, res) => {
  res.send("pong");
});

export default router;
