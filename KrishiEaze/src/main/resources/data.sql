-- Ensure we use the correct table name 'roles' as per your entity
-- gen_random_uuid() works for Postgres 13+
INSERT INTO roles (roles_id, name)
VALUES (gen_random_uuid(), 'ROLE_FARMER')
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (roles_id, name)
VALUES (gen_random_uuid(), 'ROLE_ADMIN')
ON CONFLICT (name) DO NOTHING;