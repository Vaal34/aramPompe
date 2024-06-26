CREATE TABLE `user_info` (
    `id` int NOT NULL AUTO_INCREMENT,
    `targets_profile` json NOT NULL,
    `friends_profile` json NOT NULL,
    `user_id` char(36) NOT NULL,
    `current_target` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_log` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 22 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'user info'