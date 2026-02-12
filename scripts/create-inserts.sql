-- Clean previous data (optional, but good for idempotency if we had reliable cascade)
-- TRUNCATE TABLE modulo_wais.wais_subtest CASCADE; 

-- Insert Subtests
INSERT INTO modulo_wais.wais_subtest (code, name) VALUES ('C', 'Cubos') ON CONFLICT (code) DO NOTHING;
INSERT INTO modulo_wais.wais_subtest (code, name) VALUES ('S', 'Semejanzas') ON CONFLICT (code) DO NOTHING;
INSERT INTO modulo_wais.wais_subtest (code, name) VALUES ('D', 'Dígitos') ON CONFLICT (code) DO NOTHING;
INSERT INTO modulo_wais.wais_subtest (code, name) VALUES ('M', 'Matrices') ON CONFLICT (code) DO NOTHING;
INSERT INTO modulo_wais.wais_subtest (code, name) VALUES ('V', 'Vocabulario') ON CONFLICT (code) DO NOTHING;
INSERT INTO modulo_wais.wais_subtest (code, name) VALUES ('A', 'Aritmética') ON CONFLICT (code) DO NOTHING;
INSERT INTO modulo_wais.wais_subtest (code, name) VALUES ('BS', 'Búsqueda de Símbolos') ON CONFLICT (code) DO NOTHING;
INSERT INTO modulo_wais.wais_subtest (code, name) VALUES ('PV', 'Puzzles Visuales') ON CONFLICT (code) DO NOTHING;
INSERT INTO modulo_wais.wais_subtest (code, name) VALUES ('I', 'Información') ON CONFLICT (code) DO NOTHING;
INSERT INTO modulo_wais.wais_subtest (code, name) VALUES ('CN', 'Clave de Números') ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;
-- Note: 'CN' (Clave de Números) is the correct code as requested by User. Match Frontend.

-- creacion de grupos de datos por edad y sus insert
-- Insertar grupo de edad 16-17
INSERT INTO modulo_wais.wais_age_group (label, min_age_months, max_age_months)
VALUES ('Edad 16-17', 16*12, 17*12)
ON CONFLICT (label) DO NOTHING;

-- Insertar normas para Edad 16-17 (corregido: sin ambigüedad de "v")
WITH data (scaled_score, c, s, d, m, v, a, bs, pv, i, cn) AS (
    VALUES
    (1,'0-15','0-8','0-9','0-8','0-8','0-3','0-9','0-4','0-1','0-23'),
    (2,'16-18','9-10','10-13','9','9-10','4-5','10-13','5','2','24-30'),
    (3,'19-20','11','14-15','10','11-13','6','14-16','6','3','31-39'),
    (4,'21-22','12','16-17','11','14-16','7','17-20','7-8','4','40-41'),
    (5,'23-27','13','18-19','12','17-18','8','21-22','9','5','42-48'),
    (6,'28-31','14','20','13-14','19-20','9','23-24','10','6','49-51'),
    (7,'32-33','15','21-22','15','21-22','0','25-26','11-12','7','52-56'),
    (8,'34-38','16','23','16','23-24','10','27-28','13','8','57-61'),
    (9,'39-43','17-18','24-25','17','25-27','11','29-31','14-15','9-10','62-66'),
    (10,'44-47','19','26-27','18-19','28-29','12','32-34','16','11','67-71'),
    (11,'48-51','20','28-29','20','30-31','13','35-36','17-18','12-13','72-76'),
    (12,'52-55','21-22','30','21','32-33','0','37-38','19','14-15','77-81'),
    (13,'56-59','23-24','31-32','22','34-35','14','39-41','20-21','16','82-85'),
    (14,'60-61','25','33','23','36-37','15-16','42-43','22','17-18','86-88'),
    (15,'62','26','34-35','24','38','17','44-46','0','19','89-97'),
    (16,'63','27-28','36-37','25','39-40','18','47-51','23','20','98-99'),
    (17,'64','29','38-39','0','41-42','19','52-55','24','21','100-102'),
    (18,'65','30-31','40-41','26','43-47','20','56-57','25','22','103-116'),
    (19,'66','32-36','42-48','0','48-57','21-22','58-60','26','23-26','117-135')
),
expanded AS (
    SELECT d.scaled_score, t.subtest_code, t.val AS raw_range
    FROM data d
    CROSS JOIN LATERAL (VALUES
        ('C',d.c),('S',d.s),('D',d.d),('M',d.m),('V',d.v),
        ('A',d.a),('BS',d.bs),('PV',d.pv),('I',d.i),('CN',d.cn)
    ) AS t(subtest_code, val)
    WHERE t.val IS NOT NULL AND t.val <> ''
),
raws AS (
    SELECT e.scaled_score,
           e.subtest_code,
           CASE
             WHEN e.raw_range ~ '^[0-9]+-[0-9]+$' THEN gs
             WHEN e.raw_range ~ '^[0-9]+$' THEN e.raw_range::int
           END AS raw_score
    FROM expanded e
    LEFT JOIN LATERAL (
        SELECT generate_series(
            split_part(e.raw_range,'-',1)::int,
            split_part(e.raw_range,'-',2)::int
        ) AS gs
        WHERE e.raw_range ~ '^[0-9]+-[0-9]+$'
    ) g ON TRUE
)
INSERT INTO modulo_wais.wais_norm_raw_to_scaled (age_group_id, subtest_id, raw_score, scaled_score)
SELECT ag.id, st.id, r.raw_score, r.scaled_score
FROM raws r
JOIN modulo_wais.wais_age_group ag ON ag.label = 'Edad 16-17'
JOIN modulo_wais.wais_subtest st ON st.code = r.subtest_code
WHERE r.raw_score IS NOT NULL
ON CONFLICT (age_group_id, subtest_id, raw_score)
DO UPDATE SET scaled_score = EXCLUDED.scaled_score;


-- siguiente grupo de edad
-- Insertar grupo de edad 18-19
INSERT INTO modulo_wais.wais_age_group (label, min_age_months, max_age_months)
VALUES ('Edad 18-19', 18*12, 19*12)
ON CONFLICT (label) DO NOTHING;


-- Insertar normas para Edad 18-19
WITH data (scaled_score, c, s, d, m, v, a, bs, pv, i, cn) AS (
    VALUES
    (1,'0-16','0-9','0-10','0-8','0-9','0-3','0-10','0-4','0-2','0-29'),
    (2,'17-20','10-11','11-13','9','10-11','4-5','11-15','5','3','30-36'),
    (3,'21-22','12','14-15','10','12-13','6','16-17','6','4','37-42'),
    (4,'23-24','13','16-17','11','14-16','7','18-21','7-8','5','43-46'),
    (5,'25-28','14','18-20','12-13','17-18','8','22-24','9','6','47-52'),
    (6,'29-32','15','21','14','19-20','9','25-27','10','7','53-58'),
    (7,'33-34','16','22','15','21-24','10','28-29','11-12','8','59-63'),
    (8,'35-40','17','23-24','16-17','25-27','11','30-31','13','9-10','64-69'),
    (9,'41-45','18-19','25-26','18','28-30','12','32-34','14-15','11-12','70-73'),
    (10,'46-50','20-21','27-28','19-20','31-32','13','35-36','16','13-14','74-79'),
    (11,'51-54','22','29-30','21','33-34','14','37-38','17-18','15','80-84'),
    (12,'55-57','23','31','22','35-36','15-16','39-41','19','16-17','85-88'),
    (13,'58-60','24-25','32-33','23','37','17','42-43','20-21','18','89-91'),
    (14,'61','26','34-35','24','38-39','18','44-45','22','19','92-94'),
    (15,'62','27','36','0','40-41','19','46-48','23','20','95-101'),
    (16,'63','28','37-38','25','42-43','20','49-51','0','21','102-104'),
    (17,'64','29','39-40','0','44-45','21','52-55','24','22','105-108'),
    (18,'65','30-31','41-42','26','46-49','22','56-57','25','23','109-118'),
    (19,'66','32-36','43-48','0','50-57','0','58-60','26','24-26','119-135')
),
expanded AS (
    SELECT d.scaled_score, t.subtest_code, t.val AS raw_range
    FROM data d
    CROSS JOIN LATERAL (VALUES
        ('C',d.c),('S',d.s),('D',d.d),('M',d.m),('V',d.v),
        ('A',d.a),('BS',d.bs),('PV',d.pv),('I',d.i),('CN',d.cn)
    ) AS t(subtest_code, val)
    WHERE t.val IS NOT NULL AND t.val <> ''
),
raws AS (
    SELECT e.scaled_score,
           e.subtest_code,
           CASE
             WHEN e.raw_range ~ '^[0-9]+-[0-9]+$' THEN gs
             WHEN e.raw_range ~ '^[0-9]+$' THEN e.raw_range::int
           END AS raw_score
    FROM expanded e
    LEFT JOIN LATERAL (
        SELECT generate_series(
            split_part(e.raw_range,'-',1)::int,
            split_part(e.raw_range,'-',2)::int
        ) AS gs
        WHERE e.raw_range ~ '^[0-9]+-[0-9]+$'
    ) g ON TRUE
)
INSERT INTO modulo_wais.wais_norm_raw_to_scaled (age_group_id, subtest_id, raw_score, scaled_score)
SELECT ag.id, st.id, r.raw_score, r.scaled_score
FROM raws r
JOIN modulo_wais.wais_age_group ag ON ag.label = 'Edad 18-19'
JOIN modulo_wais.wais_subtest st ON st.code = r.subtest_code
WHERE r.raw_score IS NOT NULL
ON CONFLICT (age_group_id, subtest_id, raw_score)
DO UPDATE SET scaled_score = EXCLUDED.scaled_score;


-- siguiente grupo de edad 
-- Insertar grupo de edad 20-24
INSERT INTO modulo_wais.wais_age_group (label, min_age_months, max_age_months)
VALUES ('Edad 20-24', 20*12, 24*12)
ON CONFLICT (label) DO NOTHING;

-- Insertar normas para Edad 20-24
WITH data (scaled_score, c, s, d, m, v, a, bs, pv, i, cn) AS (
    VALUES
    (1,'0-16','0-10','0-11','0-8','0-10','0-3','0-11','0-4','0-3','0-29'),
    (2,'17-20','11','12-13','9','11','4-5','12-16','5','4','30-37'),
    (3,'21-23','12','14-16','10','12-13','6','17-18','6','5','38-42'),
    (4,'24-25','13','17-18','11','14-16','7','19-21','7-8','0','43-47'),
    (5,'26-29','14','19-20','12-13','17-18','8','22-23','9','6','48-51'),
    (6,'30-33','15','21','14','19-20','9','24-27','10','7','52-59'),
    (7,'34-35','16','22','15','21-24','10','28-29','11-12','8-9','60-64'),
    (8,'36-41','17-18','23-24','16-17','25-29','11','30-31','13','10-11','65-70'),
    (9,'42-45','19-20','25-26','18','30-32','12','32-33','14-15','12-13','71-74'),
    (10,'46-50','21-22','27-28','19-20','33-34','13','34-37','16','14','75-80'),
    (11,'51-54','23','29-30','21','35-36','14','38-39','17-18','15-16','81-85'),
    (12,'55-57','24','31','22','37','15-16','40-42','19','17-18','86-89'),
    (13,'58-60','25-26','32-33','23','38-39','17','43-44','20-21','19','90-92'),
    (14,'61','27','34-35','24','40-41','18','45-47','22','20','93-95'),
    (15,'62','28','36-37','0','42-44','19','48-50','23','21','96-101'),
    (16,'63','29','38-39','25','45-46','20','51-54','0','22','102-105'),
    (17,'64','30','40-41','0','47-48','21','55-56','24','23','106-110'),
    (18,'65','31','42-43','26','49-50','22','57-58','25','24','111-117'),
    (19,'66','32-36','44-48','0','51-57','0','59-60','26','25-26','118-135')
),
expanded AS (
    SELECT d.scaled_score, t.subtest_code, t.val AS raw_range
    FROM data d
    CROSS JOIN LATERAL (VALUES
        ('C',d.c),('S',d.s),('D',d.d),('M',d.m),('V',d.v),
        ('A',d.a),('BS',d.bs),('PV',d.pv),('I',d.i),('CN',d.cn)
    ) AS t(subtest_code, val)
    WHERE t.val IS NOT NULL AND t.val <> ''
),
raws AS (
    SELECT e.scaled_score,
           e.subtest_code,
           CASE
             WHEN e.raw_range ~ '^[0-9]+-[0-9]+$' THEN gs
             WHEN e.raw_range ~ '^[0-9]+$' THEN e.raw_range::int
           END AS raw_score
    FROM expanded e
    LEFT JOIN LATERAL (
        SELECT generate_series(
            split_part(e.raw_range,'-',1)::int,
            split_part(e.raw_range,'-',2)::int
        ) AS gs
        WHERE e.raw_range ~ '^[0-9]+-[0-9]+$'
    ) g ON TRUE
)
INSERT INTO modulo_wais.wais_norm_raw_to_scaled (age_group_id, subtest_id, raw_score, scaled_score)
SELECT ag.id, st.id, r.raw_score, r.scaled_score
FROM raws r
JOIN modulo_wais.wais_age_group ag ON ag.label = 'Edad 20-24'
JOIN modulo_wais.wais_subtest st ON st.code = r.subtest_code
WHERE r.raw_score IS NOT NULL
ON CONFLICT (age_group_id, subtest_id, raw_score)
DO UPDATE SET scaled_score = EXCLUDED.scaled_score;


-- siguiente grupo de edad 
-- Insertar grupo de edad 25-34
INSERT INTO modulo_wais.wais_age_group (label, min_age_months, max_age_months)
VALUES ('Edad 25-34', 25*12, 34*12)
ON CONFLICT (label) DO NOTHING;

-- Insertar normas para Edad 25-34
WITH data (scaled_score, c, s, d, m, v, a, bs, pv, i, cn) AS (
    VALUES
    (1,'0-16','0-8','0-11','0-6','0-10','0-5','0-8','0-5','0-3','0-26'),
    (2,'17-21','9-11','12-13','7','11-12','6','9-11','6-8','4','27-36'),
    (3,'22-24','12','14-16','8-9','13-14','7','12-14','9','5','37-38'),
    (4,'25-26','13','17','10','15-16','8','15-17','10','6','39-43'),
    (5,'27-31','14','18-20','11-13','17-18','9','18-20','11-12','7','44-46'),
    (6,'32-35','15','21','14-15','19-20','10','21-23','13','8','47-55'),
    (7,'36-37','16-17','22','16','21-24','11','24-26','14','9','56-60'),
    (8,'38-43','18-19','23-24','17-19','25-29','12','27-29','15','10-11','61-66'),
    (9,'44-47','20','25-26','20','30-32','13','30-32','16','12-14','67-71'),
    (10,'48-51','21-22','27-28','21-22','33-34','14-15','33-35','17-18','15-16','72-77'),
    (11,'52-56','23-24','29-30','23','35-36','16','36-38','19','17-18','78-82'),
    (12,'57-58','25','31','0','37-38','17','39-41','20','19','83-87'),
    (13,'59-61','26','32-33','24','39-40','18','42-44','21','20','88-90'),
    (14,'62','27','34-35','0','41-42','19','45-47','22','21','91-94'),
    (15,'63','28','36-37','25','43-45','20','48-50','23-24','22','95-98'),
    (16,'64','29','38-39','0','46-47','0','51-52','25','23','99-103'),
    (17,'65','30','40-41','0','48-49','21','53-54','26','24','104-109'),
    (18,'66','31','42-43','26','50-51','22','55-57','0','25-26','110-114'),
    (19,'0','32-36','44-48','0','52-57','0','58-60','0','0','115-135')
),
expanded AS (
    SELECT d.scaled_score, t.subtest_code, t.val AS raw_range
    FROM data d
    CROSS JOIN LATERAL (VALUES
        ('C',d.c),('S',d.s),('D',d.d),('M',d.m),('V',d.v),
        ('A',d.a),('BS',d.bs),('PV',d.pv),('I',d.i),('CN',d.cn)
    ) AS t(subtest_code, val)
    WHERE t.val IS NOT NULL AND t.val <> ''
),
raws AS (
    SELECT e.scaled_score,
           e.subtest_code,
           CASE
             WHEN e.raw_range ~ '^[0-9]+-[0-9]+$' THEN gs
             WHEN e.raw_range ~ '^[0-9]+$' THEN e.raw_range::int
           END AS raw_score
    FROM expanded e
    LEFT JOIN LATERAL (
        SELECT generate_series(
            split_part(e.raw_range,'-',1)::int,
            split_part(e.raw_range,'-',2)::int
        ) AS gs
        WHERE e.raw_range ~ '^[0-9]+-[0-9]+$'
    ) g ON TRUE
)
INSERT INTO modulo_wais.wais_norm_raw_to_scaled (age_group_id, subtest_id, raw_score, scaled_score)
SELECT ag.id, st.id, r.raw_score, r.scaled_score
FROM raws r
JOIN modulo_wais.wais_age_group ag ON ag.label = 'Edad 25-34'
JOIN modulo_wais.wais_subtest st ON st.code = r.subtest_code
WHERE r.raw_score IS NOT NULL
ON CONFLICT (age_group_id, subtest_id, raw_score)
DO UPDATE SET scaled_score = EXCLUDED.scaled_score;


-- siguiente grupo de edad
-- Insertar grupo de edad 35-44
INSERT INTO modulo_wais.wais_age_group (label, min_age_months, max_age_months)
VALUES ('Edad 35-44', 35*12, 44*12)
ON CONFLICT (label) DO NOTHING;

-- Insertar normas para Edad 35-44
WITH data (scaled_score, c, s, d, m, v, a, bs, pv, i, cn) AS (
    VALUES
    (1,'0-12','0-8','0-10','0-5','0-9','0-4','0-6','0-3','0-3','0-20'),
    (2,'13-18','9-11','11-12','6','10-11','5','7-12','4-5','4','21-26'),
    (3,'19-21','12','13-15','7','12-13','6','13-14','6','5','27-32'),
    (4,'22-23','13','16-17','8-9','14-15','7','15-18','7','6','33-37'),
    (5,'24-28','14','18-19','10-11','16-18','8','19-20','8','0','38-43'),
    (6,'29-32','15','20','12-13','19-20','9','21-23','9','7','44-49'),
    (7,'33-35','16-17','21','14','21-23','10','24-25','10-11','8-9','50-55'),
    (8,'36-39','18','22-23','15-17','24-28','11','26-28','12','10-11','56-61'),
    (9,'40-43','19-20','24-25','18','29-31','12-13','29-31','13-14','12-14','62-67'),
    (10,'44-48','21-22','26-27','19-20','32-34','14','32-34','15','15-17','68-73'),
    (11,'49-52','23','28-29','21','35-36','15','35-36','16','18','74-79'),
    (12,'53-55','24-25','30','22','37-38','16','37-40','17-18','19','80-84'),
    (13,'56-58','26','31-32','23','39-40','17','41-42','19','20','85-87'),
    (14,'59','27','33-34','24','41-42','18','43-45','20','21','88-91'),
    (15,'60-61','28','35-36','0','43-45','19','46-48','21-22','22-23','92-95'),
    (16,'62','29','37-38','25','46-47','20','49-51','23','24','96-100'),
    (17,'63-64','30','39-40','0','48-49','21','52-53','24','25','101-107'),
    (18,'65','31','41-42','26','50-51','22','54-56','25','26','108-111'),
    (19,'66','32-36','43-48','0','52-57','0','57-60','26','0','112-135')
),
expanded AS (
    SELECT d.scaled_score, t.subtest_code, t.val AS raw_range
    FROM data d
    CROSS JOIN LATERAL (VALUES
        ('C',d.c),('S',d.s),('D',d.d),('M',d.m),('V',d.v),
        ('A',d.a),('BS',d.bs),('PV',d.pv),('I',d.i),('CN',d.cn)
    ) AS t(subtest_code, val)
    WHERE t.val IS NOT NULL AND t.val <> ''
),
raws AS (
    SELECT e.scaled_score,
           e.subtest_code,
           CASE
             WHEN e.raw_range ~ '^[0-9]+-[0-9]+$' THEN gs
             WHEN e.raw_range ~ '^[0-9]+$' THEN e.raw_range::int
           END AS raw_score
    FROM expanded e
    LEFT JOIN LATERAL (
        SELECT generate_series(
            split_part(e.raw_range,'-',1)::int,
            split_part(e.raw_range,'-',2)::int
        ) AS gs
        WHERE e.raw_range ~ '^[0-9]+-[0-9]+$'
    ) g ON TRUE
)
INSERT INTO modulo_wais.wais_norm_raw_to_scaled (age_group_id, subtest_id, raw_score, scaled_score)
SELECT ag.id, st.id, r.raw_score, r.scaled_score
FROM raws r
JOIN modulo_wais.wais_age_group ag ON ag.label = 'Edad 35-44'
JOIN modulo_wais.wais_subtest st ON st.code = r.subtest_code
WHERE r.raw_score IS NOT NULL
ON CONFLICT (age_group_id, subtest_id, raw_score)
DO UPDATE SET scaled_score = EXCLUDED.scaled_score;


-- siguiente grupo de edad
-- Insertar grupo de edad 45-54
INSERT INTO modulo_wais.wais_age_group (label, min_age_months, max_age_months)
VALUES ('Edad 45-54', 45*12, 54*12)
ON CONFLICT (label) DO NOTHING;

-- Insertar normas para Edad 45-54
WITH data (scaled_score, c, s, d, m, v, a, bs, pv, i, cn) AS (
    VALUES
    (1,'0-10','0-7','0-9','0-3','0-8','0-4','0-4','0-2','0-3','0-16'),
    (2,'11-15','8-10','10-12','4','9-10','5','5-8','3-4','4','17-27'),
    (3,'16-17','11','13-14','5-6','11-12','6','9-10','5','5','28-29'),
    (4,'18-20','12','15','7-8','13-14','7','11-14','6','6','30-32'),
    (5,'21-25','13','16-17','9-10','15-16','8','15-17','7','0','33-34'),
    (6,'26-29','14-15','18','11','17-18','9','18-19','8','7','35-41'),
    (7,'30-32','16','19-20','12','19-21','10','20-21','9','8','42-46'),
    (8,'33-36','17-18','21-22','13-14','22-26','11','22-24','10','9-11','47-52'),
    (9,'37-40','19','23-24','15-16','27-29','12','25-27','11','12-13','53-58'),
    (10,'41-45','20-21','25-26','17-18','30-32','13-14','28-30','12-13','14-15','59-65'),
    (11,'46-49','22-23','27-28','19','33-35','15','31-32','14-15','16-18','66-70'),
    (12,'50-51','24','29','20','36-37','16','33-36','16','19','71-76'),
    (13,'52-55','25','30-31','21','38-39','17','37-38','17','20','77-80'),
    (14,'56-57','26-27','32-33','22','40-41','18','39-42','18-19','21','81-84'),
    (15,'58-59','28','34-35','23','42-44','19','43-44','20','22-23','85-88'),
    (16,'60-61','29','36-37','24','45-46','20','45-48','21-22','24','89-94'),
    (17,'62-63','30','38-40','25','47','21','49-52','23','25','95-102'),
    (18,'64-65','31','41-42','0','48-51','22','53-56','24-25','26','103-104'),
    (19,'66','32-36','43-48','26','52-57','0','57-60','26','0','105-135')
),
expanded AS (
    SELECT d.scaled_score, t.subtest_code, t.val AS raw_range
    FROM data d
    CROSS JOIN LATERAL (VALUES
        ('C',d.c),('S',d.s),('D',d.d),('M',d.m),('V',d.v),
        ('A',d.a),('BS',d.bs),('PV',d.pv),('I',d.i),('CN',d.cn)
    ) AS t(subtest_code, val)
    WHERE t.val IS NOT NULL AND t.val <> ''
),
raws AS (
    SELECT e.scaled_score,
           e.subtest_code,
           CASE
             WHEN e.raw_range ~ '^[0-9]+-[0-9]+$' THEN gs
             WHEN e.raw_range ~ '^[0-9]+$' THEN e.raw_range::int
           END AS raw_score
    FROM expanded e
    LEFT JOIN LATERAL (
        SELECT generate_series(
            split_part(e.raw_range,'-',1)::int,
            split_part(e.raw_range,'-',2)::int
        ) AS gs
        WHERE e.raw_range ~ '^[0-9]+-[0-9]+$'
    ) g ON TRUE
)
INSERT INTO modulo_wais.wais_norm_raw_to_scaled (age_group_id, subtest_id, raw_score, scaled_score)
SELECT ag.id, st.id, r.raw_score, r.scaled_score
FROM raws r
JOIN modulo_wais.wais_age_group ag ON ag.label = 'Edad 45-54'
JOIN modulo_wais.wais_subtest st ON st.code = r.subtest_code
WHERE r.raw_score IS NOT NULL
ON CONFLICT (age_group_id, subtest_id, raw_score)
DO UPDATE SET scaled_score = EXCLUDED.scaled_score;


--siguiente grupo de edad

-- Insertar grupo de edad 55-69
INSERT INTO modulo_wais.wais_age_group (label, min_age_months, max_age_months)
VALUES ('Edad 55-69', 55*12, 69*12)
ON CONFLICT (label) DO NOTHING;

-- Insertar normas para Edad 55-69
WITH data (scaled_score, c, s, d, m, v, a, bs, pv, i, cn) AS (
    VALUES
    (1,'0-5','0-3','0-8','0-2','0-7','0-3','0-1','0-3','0-2','0-9'),
    (2,'6-8','4-8','9-11','3','8-9','4','2-4','4','3','10-18'),
    (3,'9-10','9','12','4','10-11','5','5-6','5','0','19'),
    (4,'11-13','10','13-14','5','12','6','7-10','6','4','20-22'),
    (5,'14-17','11','15','6','13','7','11-12','0','5','23-25'),
    (6,'18-21','12','16','7','14-15','8','13-14','7','6','26-30'),
    (7,'22-25','13','17','8','16-18','9','15-16','8','7','31-35'),
    (8,'26-28','14-15','18-20','9-10','19-21','10','17-19','9','8','36-41'),
    (9,'29-32','16','21','11','22-24','11','20-21','10','9-10','42-47'),
    (10,'33-36','17-18','22-23','12-13','25-27','12','22-23','0','11-13','48-53'),
    (11,'37-40','19-20','24-25','14','28-31','13','24-26','11','14-15','54-58'),
    (12,'41-43','21-22','26','15-16','32-34','14','27-29','12-13','16-17','59-65'),
    (13,'44-47','23','27-28','17-18','35-36','15','30-32','14','18-19','66-70'),
    (14,'48-50','24','29-30','19-20','37-38','16-17','33-35','15','20-21','71-75'),
    (15,'51-53','25','31-33','21','39-41','18','36-38','16-18','22','76-78'),
    (16,'54-56','26','34-35','22','42-43','19','39-42','19-20','23','79-84'),
    (17,'57-59','27-28','36-37','23','44-45','20','43-48','21-22','24','85-93'),
    (18,'60-61','29','38-39','24','46-48','21','49-55','23-24','25','94-95'),
    (19,'62-66','30-36','40-48','25-26','49-57','22','56-60','25-26','26','96-135')
),
expanded AS (
    SELECT d.scaled_score, t.subtest_code, t.val AS raw_range
    FROM data d
    CROSS JOIN LATERAL (VALUES
        ('C',d.c),('S',d.s),('D',d.d),('M',d.m),('V',d.v),
        ('A',d.a),('BS',d.bs),('PV',d.pv),('I',d.i),('CN',d.cn)
    ) AS t(subtest_code, val)
    WHERE t.val IS NOT NULL AND t.val <> ''
),
raws AS (
    SELECT e.scaled_score,
           e.subtest_code,
           CASE
             WHEN e.raw_range ~ '^[0-9]+-[0-9]+$' THEN gs
             WHEN e.raw_range ~ '^[0-9]+$' THEN e.raw_range::int
           END AS raw_score
    FROM expanded e
    LEFT JOIN LATERAL (
        SELECT generate_series(
            split_part(e.raw_range,'-',1)::int,
            split_part(e.raw_range,'-',2)::int
        ) AS gs
        WHERE e.raw_range ~ '^[0-9]+-[0-9]+$'
    ) g ON TRUE
)
INSERT INTO modulo_wais.wais_norm_raw_to_scaled (age_group_id, subtest_id, raw_score, scaled_score)
SELECT ag.id, st.id, r.raw_score, r.scaled_score
FROM raws r
JOIN modulo_wais.wais_age_group ag ON ag.label = 'Edad 55-69'
JOIN modulo_wais.wais_subtest st ON st.code = r.subtest_code
WHERE r.raw_score IS NOT NULL
ON CONFLICT (age_group_id, subtest_id, raw_score)
DO UPDATE SET scaled_score = EXCLUDED.scaled_score;


-- siguiente grupo de edad
-- Insertar grupo de edad 70-79
INSERT INTO modulo_wais.wais_age_group (label, min_age_months, max_age_months)
VALUES ('Edad 70-79', 70*12, 79*12)
ON CONFLICT (label) DO NOTHING;

-- Insertar normas para Edad 70-79
WITH data (scaled_score, c, s, d, m, v, a, bs, pv, i, cn) AS (
    VALUES
    (1,'0-2','0-1','0-7','0-1','0-5','0-2','0','0-1','0','0-2'),
    (2,'3','2-3','8','2','6-7','3','1','2','1','3-4'),
    (3,'4','4','9','3','8','4','2','3','0','5-6'),
    (4,'5-7','5','10','0','9','5','3-4','4','2','7-8'),
    (5,'8-11','6-7','11','4','10','6','5-6','5','3','9-10'),
    (6,'12-14','8-9','12-13','5','11','7','7','0','0','11-12'),
    (7,'15-18','10','14','6','12-13','0','8-9','6','4','13-16'),
    (8,'19-20','11','15-16','7','14-15','8','10-11','0','5','17-20'),
    (9,'21-23','12-13','17','8','16-18','9','12-14','7','6','21-25'),
    (10,'24-27','14','18','9','19-20','10','15','0','7','26-31'),
    (11,'28-31','15-16','19-20','10','21-24','11','16-18','8','8-9','32-35'),
    (12,'32-34','17-18','21-22','11-12','25-27','0','19-20','9-10','10-11','36-42'),
    (13,'35-38','19','23-24','13-14','28-29','12','21-23','11','12-14','43-48'),
    (14,'39-43','20-21','25-26','15-16','30-31','13-14','24-26','12','15-16','49-53'),
    (15,'44-47','22','27-28','17-18','32-36','15','27-29','13-14','17','54-58'),
    (16,'48-50','23-24','29-30','19','37-38','16','30-33','15-16','18-19','59-64'),
    (17,'51-54','25','31-33','20','39-40','17-18','34-40','17-19','20','65-73'),
    (18,'55-57','26-27','34','21','41-42','19','41-49','20-21','21','74-75'),
    (19,'58-66','28-36','35-48','22-26','43-57','20-22','50-60','22-26','22-26','76-135')
),
expanded AS (
    SELECT d.scaled_score, t.subtest_code, t.val AS raw_range
    FROM data d
    CROSS JOIN LATERAL (VALUES
        ('C',d.c),('S',d.s),('D',d.d),('M',d.m),('V',d.v),
        ('A',d.a),('BS',d.bs),('PV',d.pv),('I',d.i),('CN',d.cn)
    ) AS t(subtest_code, val)
    WHERE t.val IS NOT NULL AND t.val <> ''
),
raws AS (
    SELECT e.scaled_score,
           e.subtest_code,
           CASE
             WHEN e.raw_range ~ '^[0-9]+-[0-9]+$' THEN gs
             WHEN e.raw_range ~ '^[0-9]+$' THEN e.raw_range::int
           END AS raw_score
    FROM expanded e
    LEFT JOIN LATERAL (
        SELECT generate_series(
            split_part(e.raw_range,'-',1)::int,
            split_part(e.raw_range,'-',2)::int
        ) AS gs
        WHERE e.raw_range ~ '^[0-9]+-[0-9]+$'
    ) g ON TRUE
)
INSERT INTO modulo_wais.wais_norm_raw_to_scaled (age_group_id, subtest_id, raw_score, scaled_score)
SELECT ag.id, st.id, r.raw_score, r.scaled_score
FROM raws r
JOIN modulo_wais.wais_age_group ag ON ag.label = 'Edad 70-79'
JOIN modulo_wais.wais_subtest st ON st.code = r.subtest_code
WHERE r.raw_score IS NOT NULL
ON CONFLICT (age_group_id, subtest_id, raw_score)
DO UPDATE SET scaled_score = EXCLUDED.scaled_score;



-- siguiente grupo de edad

-- Insertar grupo de edad 80-84
INSERT INTO modulo_wais.wais_age_group (label, min_age_months, max_age_months)
VALUES ('Edad 80-84', 80*12, 84*12)
ON CONFLICT (label) DO NOTHING;

-- Insertar normas para Edad 80-84
WITH data (scaled_score, c, s, d, m, v, a, bs, pv, i, cn) AS (
    VALUES
    (1,'0','0','0-5','0','0-5','0-1','0','0','0','0'),
    (2,'1','1','6','0','6-7','2-3','0','1','0','1'),
    (3,'2','2','7','0','8','4','1','2-3','1','2-3'),
    (4,'3-4','3','8-9','1','9','5','2','4','2','4-5'),
    (5,'5','4-5','10','2','10','0','3','0','0','6'),
    (6,'6-7','6-7','11','3','11','6','4','5','3','7'),
    (7,'8-10','8-9','12','4','12','7','5-6','0','0','8-10'),
    (8,'11-12','10','13','5','13-14','0','7-8','6','4','11-13'),
    (9,'13-16','11','14','6','15-16','8','9-10','0','5','14-17'),
    (10,'17-20','12','15','7','17-18','9','11','7','6','18-22'),
    (11,'21-22','13-14','16','8','19-22','0','12-13','0','7','23-25'),
    (12,'23-26','15','17-18','9-10','23-24','10','14-15','8','8-9','26-32'),
    (13,'27-30','16-17','19-20','11','25-26','11','16-18','9','10-12','33-37'),
    (14,'31-34','18','21-23','12-13','27-28','12','19-21','10','13-14','38-43'),
    (15,'35-38','19-20','24-25','14','29-34','13','22-24','11-12','15-16','44-49'),
    (16,'39-43','21','26-27','15','35-36','14','25-27','13-15','17-19','50-55'),
    (17,'44-47','22','28-30','16','37-38','15','28-35','16-17','20','56-63'),
    (18,'48-51','23-24','31-32','17','39-40','16','36-41','18-19','21','64-65'),
    (19,'52-66','25-36','33-48','18-26','41-57','17-22','42-60','20-26','22-26','66-135')
),
expanded AS (
    SELECT d.scaled_score, t.subtest_code, t.val AS raw_range
    FROM data d
    CROSS JOIN LATERAL (VALUES
        ('C',d.c),('S',d.s),('D',d.d),('M',d.m),('V',d.v),
        ('A',d.a),('BS',d.bs),('PV',d.pv),('I',d.i),('CN',d.cn)
    ) AS t(subtest_code, val)
    WHERE t.val IS NOT NULL AND t.val <> ''
),
raws AS (
    SELECT e.scaled_score,
           e.subtest_code,
           CASE
             WHEN e.raw_range ~ '^[0-9]+-[0-9]+$' THEN gs
             WHEN e.raw_range ~ '^[0-9]+$' THEN e.raw_range::int
           END AS raw_score
    FROM expanded e
    LEFT JOIN LATERAL (
        SELECT generate_series(
            split_part(e.raw_range,'-',1)::int,
            split_part(e.raw_range,'-',2)::int
        ) AS gs
        WHERE e.raw_range ~ '^[0-9]+-[0-9]+$'
    ) g ON TRUE
)
INSERT INTO modulo_wais.wais_norm_raw_to_scaled (age_group_id, subtest_id, raw_score, scaled_score)
SELECT ag.id, st.id, r.raw_score, r.scaled_score
FROM raws r
JOIN modulo_wais.wais_age_group ag ON ag.label = 'Edad 80-84'
JOIN modulo_wais.wais_subtest st ON st.code = r.subtest_code
WHERE r.raw_score IS NOT NULL
ON CONFLICT (age_group_id, subtest_id, raw_score)
DO UPDATE SET scaled_score = EXCLUDED.scaled_score;



-- siguiente grupo de edad

-- Insertar grupo de edad 85-89
INSERT INTO modulo_wais.wais_age_group (label, min_age_months, max_age_months)
VALUES ('Edad 85-89', 85*12, 89*12)
ON CONFLICT (label) DO NOTHING;

-- Insertar normas para Edad 85-89
WITH data (scaled_score, c, s, d, m, v, a, bs, pv, i, cn) AS (
    VALUES
    (1,'0','0','0-4','0','0-5','0','0','0','0','0'),
    (2,'1','1','5','0','6-7','1','0','1','0','1'),
    (3,'2','2','6-7','0','8','2-3','0','2','1','2'),
    (4,'3','3-4','8','1','9','4','0','3','2','3'),
    (5,'4','5','9','2','10','5','1','4','0','4'),
    (6,'5-6','6','10','3','11','6','2','5','3','5'),
    (7,'7-9','7-8','11','4','12','0','3-4','0','0','6-7'),
    (8,'10-11','9','12','5','13-14','7','5','6','0','8-9'),
    (9,'12-14','10-11','13','0','15-16','0','6','0','4','10-13'),
    (10,'15-18','12','14','6','17-18','8','7','0','5','14-16'),
    (11,'19-21','13','15','7','19-22','9','8-9','7','6','17-19'),
    (12,'22-25','14','16','8-9','23-24','0','10','0','7','20-26'),
    (13,'26-28','15-16','17-18','10','25-26','10','11-13','8','8-9','27-30'),
    (14,'29-32','17-18','19-21','11','27-28','11','14-16','9','10-11','31-35'),
    (15,'33-37','19','22-23','12','29-34','12','17-19','10','12-15','36-42'),
    (16,'38-41','20','24-25','13','35-36','13-14','20-22','11-13','16-17','43-48'),
    (17,'42-46','21','26-29','14','37-38','15','23-28','14-16','18','49-56'),
    (18,'47-50','22-24','30-31','15','39-40','16','29-30','17-18','19','57-58'),
    (19,'51-66','25-36','32-48','16-26','41-57','17-22','31-60','19-26','20-26','59-135')
),
expanded AS (
    SELECT d.scaled_score, t.subtest_code, t.val AS raw_range
    FROM data d
    CROSS JOIN LATERAL (VALUES
        ('C',d.c),('S',d.s),('D',d.d),('M',d.m),('V',d.v),
        ('A',d.a),('BS',d.bs),('PV',d.pv),('I',d.i),('CN',d.cn)
    ) AS t(subtest_code, val)
    WHERE t.val IS NOT NULL AND t.val <> ''
),
raws AS (
    SELECT e.scaled_score,
           e.subtest_code,
           CASE
             WHEN e.raw_range ~ '^[0-9]+-[0-9]+$' THEN gs
             WHEN e.raw_range ~ '^[0-9]+$' THEN e.raw_range::int
           END AS raw_score
    FROM expanded e
    LEFT JOIN LATERAL (
        SELECT generate_series(
            split_part(e.raw_range,'-',1)::int,
            split_part(e.raw_range,'-',2)::int
        ) AS gs
        WHERE e.raw_range ~ '^[0-9]+-[0-9]+$'
    ) g ON TRUE
)
INSERT INTO modulo_wais.wais_norm_raw_to_scaled (age_group_id, subtest_id, raw_score, scaled_score)
SELECT ag.id, st.id, r.raw_score, r.scaled_score
FROM raws r
JOIN modulo_wais.wais_age_group ag ON ag.label = 'Edad 85-89'
JOIN modulo_wais.wais_subtest st ON st.code = r.subtest_code
WHERE r.raw_score IS NOT NULL
ON CONFLICT (age_group_id, subtest_id, raw_score)
DO UPDATE SET scaled_score = EXCLUDED.scaled_score;


-- ahora las tablas para los coeficientes

-- Tabla específica para CIT (Coeficiente Intelectual Total)
CREATE TABLE IF NOT EXISTS modulo_wais.wais_index_norm (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    type VARCHAR(10) NOT NULL,
    sum_scaled SMALLINT NOT NULL,
    value SMALLINT NOT NULL,
    percentile SMALLINT NOT NULL CHECK (percentile BETWEEN 0 AND 100),
    ic90 TEXT,
    ic95 TEXT,
    UNIQUE (type, sum_scaled)
);

-- Primer bloque de 50 filas CIT
INSERT INTO modulo_wais.wais_index_norm (type, sum_scaled, value, percentile, ic90, ic95) SELECT 'CIT', * FROM (VALUES
(10,40,0,'38-48','37-49'),
(11,40,0,'38-48','37-49'),
(12,40,0,'38-48','37-49'),
(13,40,0,'38-48','37-49'),
(14,40,0,'38-48','37-49'),
(15,40,0,'38-48','37-49'),
(16,40,0,'38-48','37-49'),
(17,40,0,'38-48','37-49'),
(18,40,0,'38-48','37-49'),
(19,40,0,'38-48','37-49'),
(20,40,0,'38-48','37-49'),
(21,40,0,'38-48','37-49'),
(22,41,0,'39-49','38-50'),
(23,41,0,'39-49','38-50'),
(24,42,0,'40-50','39-51'),
(25,43,0,'41-51','40-52'),
(26,44,0,'42-52','41-53'),
(27,44,0,'42-52','41-53'),
(28,45,0,'42-53','42-54'),
(29,46,0,'43-54','42-55'),
(30,47,0,'44-55','43-56'),
(31,47,0,'44-55','43-56'),
(32,48,0,'45-56','44-57'),
(33,49,0,'46-57','45-58'),
(34,50,0,'47-58','46-59'),
(35,50,0,'47-58','46-59'),
(36,51,0,'48-59','47-60'),
(37,52,0,'49-60','48-61'),
(38,53,0,'50-61','49-62'),
(39,53,0,'50-61','49-62'),
(40,54,0,'51-62','50-63'),
(41,55,0,'52-63','51-63'),
(42,56,0,'53-63','52-64'),
(43,57,0,'54-64','53-65'),
(44,57,0,'54-64','53-65'),
(45,58,0,'55-65','54-66'),
(46,59,0,'56-66','55-67'),
(47,60,0,'57-67','56-68'),
(48,60,0,'57-67','56-68'),
(49,61,1,'58-68','57-69'),
(50,62,1,'59-69','58-70'),
(51,63,1,'60-70','59-71'),
(52,63,1,'60-70','59-71'),
(53,64,1,'61-71','60-72'),
(54,65,1,'61-72','61-73'),
(55,66,1,'62-73','61-74'),
(56,66,1,'62-73','61-74'),
(57,67,1,'63-74','62-75'),
(58,68,2,'64-75','63-76')
) as t(sum_scaled, value, percentile, ic90, ic95)
ON CONFLICT (type, sum_scaled) DO UPDATE 
SET value = EXCLUDED.value, percentile = EXCLUDED.percentile, ic90 = EXCLUDED.ic90, ic95 = EXCLUDED.ic95;

-- Segundo bloque de 50 filas CIT (59–108)
INSERT INTO modulo_wais.wais_index_norm (type, sum_scaled, value, percentile, ic90, ic95) SELECT 'CIT', * FROM (VALUES
(59,69,2,'65-76','64-77'),
(60,69,2,'65-76','64-77'),
(61,70,2,'66-77','65-78'),
(62,71,3,'67-78','66-79'),
(63,72,3,'68-79','67-80'),
(64,72,3,'68-79','67-80'),
(65,73,4,'69-80','68-81'),
(66,74,4,'70-81','69-82'),
(67,75,5,'71-82','70-82'),
(68,75,5,'71-82','70-82'),
(69,76,5,'72-82','71-83'),
(70,77,6,'73-83','72-84'),
(71,78,7,'74-84','73-85'),
(72,78,7,'74-84','73-85'),
(73,79,8,'75-85','74-86'),
(74,80,9,'76-86','75-87'),
(75,81,10,'77-87','76-88'),
(76,81,10,'77-87','76-88'),
(77,82,12,'78-88','77-89'),
(78,83,13,'79-89','78-90'),
(79,84,14,'80-90','79-91'),
(80,84,14,'80-90','79-91'),
(81,85,16,'80-91','80-92'),
(82,86,18,'81-92','80-93'),
(83,87,19,'82-93','81-94'),
(84,87,19,'82-93','81-94'),
(85,88,21,'83-94','82-95'),
(86,89,23,'84-95','83-96'),
(87,90,25,'85-96','84-97'),
(88,91,27,'86-97','85-98'),
(89,91,27,'86-97','85-98'),
(90,92,30,'87-98','86-99'),
(91,93,32,'88-99','87-100'),
(92,94,34,'89-100','88-101'),
(93,94,34,'89-100','88-101'),
(94,95,37,'90-101','89-101'),
(95,96,39,'91-101','90-102'),
(96,97,42,'92-102','91-103'),
(97,97,42,'92-102','91-103'),
(98,98,45,'93-103','92-104'),
(99,99,47,'94-104','93-105'),
(100,100,50,'95-105','94-106'),
(101,100,50,'95-105','94-106'),
(102,101,53,'96-106','95-107'),
(103,102,55,'97-107','96-108'),
(104,103,58,'98-108','97-109'),
(105,103,58,'98-108','97-109'),
(106,104,61,'99-109','98-110'),
(107,105,63,'99-110','99-111'),
(108,106,66,'100-11','99-112')
) as t(sum_scaled, value, percentile, ic90, ic95)
ON CONFLICT (type, sum_scaled) DO UPDATE 
SET value = EXCLUDED.value, percentile = EXCLUDED.percentile, ic90 = EXCLUDED.ic90, ic95 = EXCLUDED.ic95;



-- Tercer bloque de 50 filas CIT (109–158)
INSERT INTO modulo_wais.wais_index_norm (type, sum_scaled, value, percentile, ic90, ic95) SELECT 'CIT', * FROM (VALUES
(109,107,68,'101-112','100-113'),
(110,107,68,'101-112','100-113'),
(111,108,70,'102-113','101-114'),
(112,109,73,'103-114','102-115'),
(113,110,75,'104-115','103-116'),
(114,110,75,'104-115','103-116'),
(115,111,77,'105-116','104-117'),
(116,112,79,'106-117','105-118'),
(117,113,81,'107-118','106-119'),
(118,113,81,'107-118','106-119'),
(119,114,82,'108-119','107-120'),
(120,115,84,'109-120','108-120'),
(121,116,86,'110-120','109-121'),
(122,116,86,'110-120','109-121'),
(123,117,87,'111-121','110-122'),
(124,118,88,'112-122','111-123'),
(125,119,90,'113-123','112-124'),
(126,120,91,'114-124','113-125'),
(127,120,91,'114-124','113-125'),
(128,121,92,'115-125','114-126'),
(129,122,93,'116-126','115-127'),
(130,123,94,'117-127','116-128'),
(131,123,94,'117-127','116-128'),
(132,124,95,'118-128','117-129'),
(133,125,95,'118-129','118-130'),
(134,126,96,'119-130','118-131'),
(135,126,96,'119-130','118-131'),
(136,127,96,'120-131','119-132'),
(137,128,97,'121-132','120-133'),
(138,129,97,'122-133','121-134'),
(139,129,97,'122-133','121-134'),
(140,130,98,'123-134','122-135'),
(141,131,98,'124-135','123-136'),
(142,132,98,'125-136','124-137'),
(143,133,99,'126-137','125-138'),
(144,133,99,'126-137','125-138'),
(145,134,99,'127-138','126-139'),
(146,135,99,'128-139','127-139'),
(147,136,99,'129-139','128-140'),
(148,136,99,'129-139','128-140'),
(149,137,99,'130-140','129-141'),
(150,138,99,'131-141','130-142'),
(151,139,100,'132-142','131-143'),
(152,139,100,'132-142','131-143'),
(153,140,100,'133-143','132-144'),
(154,141,100,'134-144','133-145'),
(155,142,100,'135-145','134-146'),
(156,143,100,'136-146','135-147'),
(157,143,100,'136-146','135-147'),
(158,144,100,'137-147','136-148')
) as t(sum_scaled, value, percentile, ic90, ic95)
ON CONFLICT (type, sum_scaled) DO UPDATE 
SET value = EXCLUDED.value, percentile = EXCLUDED.percentile, ic90 = EXCLUDED.ic90, ic95 = EXCLUDED.ic95;

-- Último bloque de filas CIT (159–190)
INSERT INTO modulo_wais.wais_index_norm (type, sum_scaled, value, percentile, ic90, ic95) SELECT 'CIT', * FROM (VALUES
(159,145,100,'137-148','137-149'),
(160,146,100,'138-149','137-150'),
(161,146,100,'138-149','137-150'),
(162,147,100,'139-150','138-151'),
(163,148,100,'140-151','139-152'),
(164,149,100,'141-152','140-153'),
(165,149,100,'141-152','140-153'),
(166,150,100,'142-153','141-154'),
(167,151,100,'143-154','142-155'),
(168,152,100,'144-155','143-156'),
(169,153,100,'145-156','144-157'),
(170,153,100,'145-156','144-157'),
(171,154,100,'146-157','145-158'),
(172,155,100,'147-158','146-158'),
(173,156,100,'148-158','147-159'),
(174,157,100,'149-159','148-160'),
(175,157,100,'149-159','148-160'),
(176,158,100,'150-160','149-161'),
(177,159,100,'151-161','150-162'),
(178,160,100,'152-162','151-163'),
(179,160,100,'152-162','151-163'),
(180,160,100,'152-162','151-163'),
(181,160,100,'152-162','151-163'),
(182,160,100,'152-162','151-163'),
(183,160,100,'152-162','151-163'),
(184,160,100,'152-162','151-163'),
(185,160,100,'152-162','151-163'),
(186,160,100,'152-162','151-163'),
(187,160,100,'152-162','151-163'),
(188,160,100,'152-162','151-163'),
(189,160,100,'152-162','151-163'),
(190,160,100,'152-162','151-163')
) as t(sum_scaled, value, percentile, ic90, ic95)
ON CONFLICT (type, sum_scaled) DO UPDATE 
SET value = EXCLUDED.value, percentile = EXCLUDED.percentile, ic90 = EXCLUDED.ic90, ic95 = EXCLUDED.ic95;



-- siguiente tabla
-- Tabla específica para IVP (Índice Visoespacial)
-- Replaced by wais_index_norm
-- CREATE TABLE IF NOT EXISTS modulo_wais.wais_ivp ...

-- Todas las filas IVP
INSERT INTO modulo_wais.wais_index_norm (type, sum_scaled, value, percentile, ic90, ic95) SELECT 'IVP', * FROM (VALUES
(2,50,0,'48-64','47-65'),
(3,52,0,'50-65','49-67'),
(4,56,0,'54-69','52-70'),
(5,59,0,'56-71','55-73'),
(6,62,1,'59-74','58-76'),
(7,64,1,'61-76','59-77'),
(8,67,1,'63-79','62-80'),
(9,70,2,'66-81','65-83'),
(10,73,4,'69-84','67-85'),
(11,75,5,'70-86','69-87'),
(12,78,7,'73-88','72-90'),
(13,81,10,'76-91','74-92'),
(14,83,13,'77-93','76-94'),
(15,86,18,'80-95','79-97'),
(16,89,23,'83-98','81-99'),
(17,92,30,'85-101','84-102'),
(18,94,34,'87-102','86-104'),
(19,97,42,'90-105','88-106'),
(20,100,50,'92-108','91-109'),
(21,103,58,'95-110','94-112'),
(22,105,63,'97-112','95-113'),
(23,108,70,'99-115','98-116'),
(24,111,77,'102-117','101-119'),
(25,114,82,'105-120','103-121'),
(26,117,87,'107-123','106-124'),
(27,119,90,'109-124','108-126'),
(28,122,93,'112-127','110-128'),
(29,125,95,'114-130','113-131'),
(30,128,97,'117-132','116-134'),
(31,131,98,'120-135','118-136'),
(32,134,99,'122-137','121-139'),
(33,137,99,'125-140','124-142'),
(34,139,100,'127-142','125-143'),
(35,143,100,'130-145','129-147'),
(36,146,100,'133-148','132-149'),
(37,150,100,'136-152','135-153'),
(38,150,100,'136-152','135-153')
) as t(sum_scaled, value, percentile, ic90, ic95)
ON CONFLICT (type, sum_scaled) DO UPDATE 
SET value = EXCLUDED.value, percentile = EXCLUDED.percentile, ic90 = EXCLUDED.ic90, ic95 = EXCLUDED.ic95;


-- siguiente tabla

-- Tabla específica para IMT (Índice de Memoria de Trabajo)
-- Replaced by wais_index_norm
-- CREATE TABLE IF NOT EXISTS modulo_wais.wais_imt ...
-- Todas las filas IMT
INSERT INTO modulo_wais.wais_index_norm (type, sum_scaled, value, percentile, ic90, ic95) SELECT 'IMT', * FROM (VALUES
(2,50,0,'48-60','46-62'),
(3,50,0,'48-60','46-62'),
(4,50,0,'48-60','46-62'),
(5,53,0,'50-63','49-64'),
(6,56,0,'53-66','52-67'),
(7,60,0,'57-70','56-71'),
(8,63,1,'60-72','58-74'),
(9,66,1,'62-75','61-76'),
(10,69,2,'65-78','64-79'),
(11,73,4,'69-82','68-83'),
(12,76,5,'71-84','70-86'),
(13,79,8,'74-87','73-88'),
(14,82,12,'77-90','76-91'),
(15,85,16,'80-93','79-94'),
(16,88,21,'83-95','81-97'),
(17,91,27,'85-98','84-99'),
(18,94,34,'88-101','87-102'),
(19,97,42,'91-104','90-105'),
(20,100,50,'94-106','92-108'),
(21,103,58,'96-109','95-110'),
(22,106,66,'99-112','98-113'),
(23,108,70,'101-114','100-115'),
(24,111,77,'104-117','102-118'),
(25,114,82,'106-119','105-121'),
(26,117,87,'109-122','108-123'),
(27,119,90,'111-124','110-125'),
(28,122,93,'114-127','113-128'),
(29,125,95,'117-129','115-131'),
(30,127,96,'118-131','117-132'),
(31,130,98,'121-134','120-135'),
(32,132,98,'123-136','122-137'),
(33,135,99,'126-139','125-140'),
(34,138,99,'129-141','127-143'),
(35,140,100,'130-143','129-144'),
(36,143,100,'133-146','132-147'),
(37,147,100,'137-150','136-151'),
(38,150,100,'140-152','138-154')
) as t(sum_scaled, value, percentile, ic90, ic95)
ON CONFLICT (type, sum_scaled) DO UPDATE 
SET value = EXCLUDED.value, percentile = EXCLUDED.percentile, ic90 = EXCLUDED.ic90, ic95 = EXCLUDED.ic95;

-- siguiente
-- Tabla específica para IRP (Índice de Razonamiento Fluido)
-- Replaced by wais_index_norm
-- CREATE TABLE IF NOT EXISTS modulo_wais.wais_irp ...

-- Todas las filas IRP
INSERT INTO modulo_wais.wais_index_norm (type, sum_scaled, value, percentile, ic90, ic95) SELECT 'IRP', * FROM (VALUES
(3,50,0,'47-60','46-61'),
(4,50,0,'47-60','46-61'),
(5,50,0,'47-60','46-61'),
(6,50,0,'47-60','46-61'),
(7,52,0,'49-61','48-63'),
(8,54,0,'51-63','50-64'),
(9,56,0,'53-65','52-66'),
(10,58,0,'55-67','54-68'),
(11,60,0,'57-69','56-70'),
(12,62,1,'59-71','57-72'),
(13,64,1,'60-73','59-74'),
(14,66,1,'62-74','61-76'),
(15,68,2,'64-76','63-77'),
(16,70,2,'66-78','65-79'),
(17,73,4,'69-81','68-82'),
(18,75,5,'71-83','70-84'),
(19,77,6,'73-85','71-86'),
(20,79,8,'74-87','73-88'),
(21,81,10,'76-88','75-90'),
(22,83,13,'78-90','77-91'),
(23,85,16,'80-92','79-93'),
(24,87,19,'82-94','81-95'),
(25,89,23,'84-96','83-97'),
(26,91,27,'86-98','84-99'),
(27,93,32,'87-100','86-101'),
(28,95,37,'89-101','88-103'),
(29,97,42,'91-103','90-104'),
(30,100,50,'94-106','93-107'),
(31,102,55,'96-108','95-109'),
(32,104,61,'98-110','96-111'),
(33,106,66,'99-112','98-113'),
(34,108,70,'101-114','100-115'),
(35,110,75,'103-115','102-117'),
(36,112,79,'105-117','104-118'),
(37,114,82,'107-119','106-120'),
(38,116,86,'109-121','108-122'),
(39,119,90,'112-124','110-125'),
(40,121,92,'113-126','112-127'),
(41,123,94,'115-127','114-129'),
(42,125,95,'117-129','116-130'),
(43,127,96,'119-131','118-132'),
(44,129,97,'121-133','120-134'),
(45,131,98,'123-135','122-136'),
(46,133,99,'125-137','123-138'),
(47,136,99,'127-140','126-141'),
(48,138,99,'129-141','128-143'),
(49,140,100,'131-143','130-144'),
(50,142,100,'133-145','132-146'),
(51,144,100,'135-147','134-148'),
(52,147,100,'138-150','136-151'),
(53,149,100,'139-152','138-153'),
(54,150,100,'140-153','139-154'),
(55,150,100,'140-153','139-154'),
(56,150,100,'140-153','139-154'),
(57,150,100,'140-153','139-154')
) as t(sum_scaled, value, percentile, ic90, ic95)
ON CONFLICT (type, sum_scaled) DO UPDATE 
SET value = EXCLUDED.value, percentile = EXCLUDED.percentile, ic90 = EXCLUDED.ic90, ic95 = EXCLUDED.ic95;

-- siguiente
-- Tabla específica para ICV (Índice de Comprensión Verbal)
-- Replaced by wais_index_norm
-- CREATE TABLE IF NOT EXISTS modulo_wais.wais_icv ...

-- Todas las filas ICV
INSERT INTO modulo_wais.wais_index_norm (type, sum_scaled, value, percentile, ic90, ic95) SELECT 'ICV', * FROM (VALUES
(3,50,0,'47-60','46-61'),
(4,50,0,'47-60','46-61'),
(5,50,0,'47-60','46-61'),
(6,50,0,'47-60','46-61'),
(7,51,0,'48-61','47-62'),
(8,54,0,'51-63','50-64'),
(9,56,0,'53-65','53-65'),
(10,58,0,'55-67','54-68'),
(11,60,0,'57-69','56-70'),
(12,63,1,'60-72','58-73'),
(13,65,1,'61-74','60-75'),
(14,67,1,'63-75','62-77'),
(15,69,2,'65-77','64-78'),
(16,71,3,'67-79','66-80'),
(17,73,4,'69-81','68-82'),
(18,75,5,'71-83','70-84'),
(19,78,7,'73-86','72-87'),
(20,80,9,'75-87','74-89'),
(21,82,12,'77-89','76-90'),
(22,84,14,'79-91','78-92'),
(23,86,18,'81-93','80-94'),
(24,88,21,'83-95','82-96'),
(25,90,25,'85-97','83-98'),
(26,92,30,'86-99','85-100'),
(27,94,34,'88-101','87-102'),
(28,96,39,'90-102','89-104'),
(29,98,45,'92-104','91-105'),
(30,100,50,'94-106','93-107'),
(31,102,55,'96-108','95-109'),
(32,104,61,'98-110','96-111'),
(33,106,66,'99-112','98-113'),
(34,108,70,'101-114','100-115'),
(35,110,75,'103-115','102-117'),
(36,112,79,'105-117','104-118'),
(37,114,82,'107-119','106-120'),
(38,116,86,'109-121','108-122'),
(39,118,88,'111-123','110-124'),
(40,120,91,'113-125','111-126'),
(41,122,93,'114-127','113-128'),
(42,124,95,'116-128','115-130'),
(43,126,96,'118-130','117-131'),
(44,128,97,'120-132','119-133'),
(45,130,98,'122-134','121-135'),
(46,132,98,'124-136','123-137'),
(47,133,99,'125-137','123-138'),
(48,135,99,'126-139','125-140'),
(49,137,99,'128-140','127-142'),
(50,139,100,'130-142','129-144'),
(51,141,100,'132-144','131-145'),
(52,143,100,'134-146','133-147'),
(53,145,100,'136-148','135-149'),
(54,147,100,'138-150','136-151'),
(55,150,100,'140-153','139-154'),
(56,150,100,'140-153','139-154'),
(57,150,100,'140-153','139-154')
) as t(sum_scaled, value, percentile, ic90, ic95)
ON CONFLICT (type, sum_scaled) DO UPDATE 
SET value = EXCLUDED.value, percentile = EXCLUDED.percentile, ic90 = EXCLUDED.ic90, ic95 = EXCLUDED.ic95;

-- Insert Index Compositions (Mapping Indices to Subtests)
-- ICV (Verbal Comprehension): S, V, I
INSERT INTO modulo_wais.wais_index_composition (index_code, subtest_id)
SELECT 'ICV', id FROM modulo_wais.wais_subtest WHERE code IN ('S', 'V', 'I')
ON CONFLICT DO NOTHING;

-- IRP (Perceptual Reasoning): C, M, PV
INSERT INTO modulo_wais.wais_index_composition (index_code, subtest_id)
SELECT 'IRP', id FROM modulo_wais.wais_subtest WHERE code IN ('C', 'M', 'PV')
ON CONFLICT DO NOTHING;

-- IMT (Working Memory): D, A
INSERT INTO modulo_wais.wais_index_composition (index_code, subtest_id)
SELECT 'IMT', id FROM modulo_wais.wais_subtest WHERE code IN ('D', 'A')
ON CONFLICT DO NOTHING;

-- IVP (Processing Speed): BS, CN
INSERT INTO modulo_wais.wais_index_composition (index_code, subtest_id)
SELECT 'IVP', id FROM modulo_wais.wais_subtest WHERE code IN ('BS', 'CN')
ON CONFLICT DO NOTHING;

-- CIT (Total IQ): All 10 Core Subtests
INSERT INTO modulo_wais.wais_index_composition (index_code, subtest_id)
SELECT 'CIT', id FROM modulo_wais.wais_subtest WHERE code IN ('C', 'S', 'D', 'M', 'V', 'A', 'BS', 'PV', 'I', 'CN')
ON CONFLICT DO NOTHING;


