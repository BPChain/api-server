CREATE KEYSPACE ethereum WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
CREATE TABLE messages(
    username text,
    sent_at timestamp,
    message text,
    sender text,
    PRIMARY KEY(username, sent_at)
);