-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);
INSERT INTO "fighters"
("fighterId", "firstName", "lastName", "dob", "finishes", "weightMisses", "pullOuts", "notes", "createdAt", "updatedAt")
VALUES
(1, 'Renee', 'Hernandez', '2000-06-25', 1, 0, 0, 'tell her to shower', NOW(), NOW());
