HOST="workforce-postgres.postgres.database.azure.com"
PORT="5432"
USER="pgadminuser"
SSL="sslmode=require"
PASSWORD="Admin123!" 

# --- Создание таблицы employees ---
psql "host=$HOST port=$PORT user=$USER dbname=employees_db $SSL password=$PASSWORD" <<EOF
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  position VARCHAR(100),
  salary NUMERIC(10, 2),
  hired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

# --- Создание таблицы attendance ---
psql "host=$HOST port=$PORT user=$USER dbname=attendance_db $SSL password=$PASSWORD" <<EOF
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  date DATE NOT NULL,
  hours INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

# --- Создание таблицы payroll ---
psql "host=$HOST port=$PORT user=$USER dbname=payroll_db $SSL password=$PASSWORD" <<EOF
CREATE TABLE IF NOT EXISTS payroll (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

# --- Создание таблицы taxes ---
psql "host=$HOST port=$PORT user=$USER dbname=tax_db $SSL password=$PASSWORD" <<EOF
CREATE TABLE IF NOT EXISTS taxes (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  tax_type VARCHAR(100),
  amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

echo "Все таблицы успешно созданы!"
