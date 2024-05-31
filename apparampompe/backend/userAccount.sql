CREATE TABLE `userRiotAccounts` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
    `create_time` datetime DEFAULT NULL COMMENT 'Create Time',
    `riotAccount` json DEFAULT NULL,
    `user_id` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `userRiotAccounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci