-- ============================================
-- USUARIOS DE PRUEBA PARA AQUAWASH
-- ============================================
-- CONTRASEÑAS EN TEXTO PLANO (TEMPORAL)
-- Contraseñas: cliente123, lavanderia123, admin123
-- ============================================

-- Primero eliminar usuarios existentes
DELETE FROM clientes WHERE email = 'cliente@test.com';
DELETE FROM lavanderias WHERE email = 'lavanderia@test.com';
DELETE FROM admins WHERE email = 'admin@test.com';

-- 1. CLIENTE DE PRUEBA
-- Email: cliente@test.com
-- Password: cliente123
INSERT INTO clientes (nombre, apellidos, email, telefono, password, estado_cuenta)
VALUES (
  'Juan',
  'Pérez García',
  'cliente@test.com',
  '612345678',
  'cliente123',
  'activo'
);

-- 2. LAVANDERÍA DE PRUEBA
-- Email: lavanderia@test.com
-- Password: lavanderia123
INSERT INTO lavanderias (nombre_comercial, email, telefono, password, descripcion, horarios, calle, numero, cp, ciudad, estado)
VALUES (
  'Lavandería Express',
  'lavanderia@test.com',
  '913456789',
  'lavanderia123',
  'Lavandería profesional con servicios de lavado, planchado y tintorería',
  'Lun-Vie: 8:00-20:00, Sáb: 9:00-14:00',
  'Avenida Comercial',
  '45',
  '28001',
  'Madrid',
  'activa'
);

-- 3. ADMIN DE PRUEBA
-- Email: admin@test.com
-- Password: admin123
INSERT INTO admins (nombre, email, password, estado)
VALUES (
  'Administrador',
  'admin@test.com',
  'admin123',
  'activo'
);
