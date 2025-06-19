-- Drop tables if they exist (safe for testing setup)
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  userid VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
);

--  to synchronize the sequence (users_id_seq) with the current maximum id value in the users table.
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Create tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  createdtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdby VARCHAR(100),
  status TEXT DEFAULT 'Pending',
  assignee TEXT DEFAULT 'Unknown'
);

-- Seed users
INSERT INTO users (id, userid, password, role) VALUES
(1, 'john123',   '$2b$10$qlMVj.DFHyLNPdLd7bEVvuUfS4fGy3yC6mxUG2xWNOLXcoyJEx2d6', 'admin'),
(2, 'john1234',  '$2b$10$1fUPDhrEDJbhVANW03qYp.t/Jyq9SRK/2lrHJb.g6moEMvo3sOGxm', 'admin'),
(3, 'john12345', '$2b$10$tuoBFiwR7DRlNMe/8Z2VWujiFUGuig68qlsyV7BncmywskN6adEmq', 'admin'),
(4, 'behwa',     '$2b$10$zFpJsBxDNCMuRHZTYxize.BVSpr6XdcmcI.fyBmmdXRtzrVF0z6Qa', 'user'),
(5, 'behwa2',    '$2b$10$XNb5qxGuonPTvuDvDt6qsO1kMupl93qqEqjeGPqz25W09xh0tkqdG', 'admin'),
(6, 'behwa3',    '$2b$10$lvl/xt4umtt766liEE4Z8OKO6ajjV9WOia6Ag1KltOmO03LP8YTNO', 'admin'),
(7, 'behwa5',    '$2b$10$snsUhOlvtaJQE8kUL1UH7ubZZiLVfZ7Uz.lyo/cW95F13bl.OqJsW', 'admin'),
(8, 'behwa6',    '$2b$10$6y4QkhsWhG6f.0SBj0D3oOddI4H3I7JYq/vIVAdYTuZqlKvkANT9m', 'zookeeper'),
(9, 'behwa7',    '$2b$10$4/atHpZGhkW9ujVKPsP6bul6.6UmranvCPLwYTWvjfcHFoDpvsaU.', 'zookeeper'),
(10, 'miao',     '$2b$10$uDWRp6X0YceUQb5qR/WFV.cwU89xbq2Uuov5.EP35jwJ/e4SQKsTO', 'guide');

-- Seed tasks
INSERT INTO tasks (title, description, createdby, status)
VALUES 
('Fix bug #452', 'Resolve UI glitch in dashboard component', 'behwa3', 'Completed'),
('Prepare slide deck', 'Create final presentation slides for Q2 review', 'behwa3', 'Completed'),
('Team sync meeting', 'Weekly sync with frontend team', 'behwa3', 'Completed'),
('Database backup', 'Run full backup of production database', 'behwa3', 'Completed'),
('User feedback analysis', 'Compile and review user feedback from last release', 'behwa3', 'Completed'),
('Optimize images', 'Compress and replace large homepage images', 'behwa3', 'Completed'),
('Update dependencies', 'Run npm audit fix and review breaking changes', 'behwa3', 'Completed'),
('Add search bar', 'Implement search functionality on task list page', 'behwa3', 'Completed'),
('Test API error cases', 'Write test cases for 4xx and 5xx responses', 'behwa3', 'Completed'),
('Fix mobile layout', 'Adjust CSS for better mobile display on iPhone SE', 'behwa3', 'Completed');
