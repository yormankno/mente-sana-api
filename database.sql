-- =========================================================
--  Base de datos: salud_mental
--  Esquema de tablas para: usuarios, notificaciones,
--  evaluaciones, preguntas de evaluaciones, contenido terapéutico
--  Compatible con PostgreSQL 12+
-- =========================================================

-- (Opcional) Crear BD y conectarse
-- Omitir si ya estás dentro de una BD
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'salud_mental') THEN
      PERFORM dblink_exec('dbname=' || current_database(), $$SELECT 1$$); -- no-op para tener dblink? (ignorar si no existe)
      EXECUTE 'CREATE DATABASE salud_mental WITH TEMPLATE = template1 ENCODING = ''UTF8'' LC_COLLATE = ''C'' LC_CTYPE = ''C''';
   END IF;
EXCEPTION WHEN undefined_function THEN
   -- Si no tienes dblink, ignora, igual se intentará crear la base.
   BEGIN
      EXECUTE 'CREATE DATABASE salud_mental WITH TEMPLATE = template1 ENCODING = ''UTF8''';
   EXCEPTION WHEN duplicate_database THEN
      -- ya existe
      NULL;
   END;
END$$;

-- Conectarse (si corres en psql interactivo)
-- \c salud_mental

-- =========================================================
--  Extensiones opcionales
-- =========================================================
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
--  Función y trigger para updated_at
-- =========================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
--  Tabla: users
-- =========================================================
CREATE TABLE IF NOT EXISTS users (
  id           BIGSERIAL PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  password     TEXT NOT NULL,                    -- guardar hash
  role         TEXT NOT NULL DEFAULT 'paciente',
  name         TEXT,
  age          INT CHECK (age IS NULL OR age >= 0),
  gender       TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_role_chk CHECK (role IN ('paciente','profesional','admin'))
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================================================
--  Tabla: notifications
-- =========================================================
CREATE TABLE IF NOT EXISTS notifications (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  message      TEXT,
  status       TEXT NOT NULL DEFAULT 'unread',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT notifications_status_chk CHECK (status IN ('unread','read'))
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status  ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- =========================================================
--  Tabla: evaluations
-- =========================================================
CREATE TABLE IF NOT EXISTS evaluations (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,          -- p.ej: 'GAD-7', 'PHQ-9'
  score        INT,
  result       TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_type    ON evaluations(type);
CREATE INDEX IF NOT EXISTS idx_evaluations_created ON evaluations(created_at);

-- =========================================================
--  Tabla: evaluation_questions
-- =========================================================
CREATE TABLE IF NOT EXISTS evaluation_questions (
  id             BIGSERIAL PRIMARY KEY,
  evaluation_id  BIGINT NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  question       TEXT NOT NULL,
  answer         TEXT
);

CREATE INDEX IF NOT EXISTS idx_eval_questions_eval_id ON evaluation_questions(evaluation_id);

-- =========================================================
--  Tabla: therapeutic_content
-- =========================================================
CREATE TABLE IF NOT EXISTS therapeutic_content (
  id           BIGSERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  type         TEXT NOT NULL,   -- 'video','audio','article','game'
  url          TEXT,
  category     TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT content_type_chk CHECK (type IN ('video','audio','article','game'))
);

CREATE INDEX IF NOT EXISTS idx_content_type     ON therapeutic_content(type);
CREATE INDEX IF NOT EXISTS idx_content_category ON therapeutic_content(category);
CREATE INDEX IF NOT EXISTS idx_content_created  ON therapeutic_content(created_at);

-- =========================================================
--  Semillas mínimas (opcional)
-- =========================================================
-- INSERT INTO users (email, password, role, name) VALUES
-- ('admin@demo.com', '$2b$10$hash...', 'admin', 'Admin Demo');

-- INSERT INTO therapeutic_content (title, type, url, category) VALUES
-- ('Respiración 4-7-8', 'audio', 'https://example.com/audio1.mp3', 'ansiedad');

-- =========================================================
--  Listo
-- =========================================================