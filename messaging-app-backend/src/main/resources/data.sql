INSERT INTO chat_user (name) VALUES ('Alice');
INSERT INTO chat_user (name) VALUES ('Bob');
INSERT INTO chat_user (name) VALUES ('Charlie');



INSERT INTO chat_message (user_id, text) VALUES (1, 'Hello from Alice');
INSERT INTO chat_message (user_id, text) VALUES (2, 'Hello from Bob');
INSERT INTO chat_message (user_id, text) VALUES (3, 'Hello from Charlie');

-- extra messages to exceed 20
INSERT INTO chat_message (user_id, text) VALUES (1, 'Message 4');
INSERT INTO chat_message (user_id, text) VALUES (2, 'Message 5');
INSERT INTO chat_message (user_id, text) VALUES (3, 'Message 6');
