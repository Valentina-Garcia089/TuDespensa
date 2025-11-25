-- ============================================
-- VERIFICAR TODOS LOS CONSTRAINTS CHECK
-- ============================================

-- Ver todos los constraints CHECK en la base de datos
SELECT 
    tc.table_name,
    tc.constraint_name,
    pg_get_constraintdef(pgc.oid) as constraint_definition
FROM information_schema.table_constraints tc
JOIN pg_constraint pgc ON tc.constraint_name = pgc.conname
WHERE tc.constraint_type = 'CHECK'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;
