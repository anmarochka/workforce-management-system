import app from "./index";
import { logger } from "./logger";

const port = process.env.PORT || 3001;

app.listen(port, () => {
  logger.info(`Employees service running on port ${port}`);
});
