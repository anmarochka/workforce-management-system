import app from "./index";

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`📦 Payroll service running on port ${PORT}`);
});
