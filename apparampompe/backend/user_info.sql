CREATE TABLE `user_info` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `targets_profile` JSON NOT NULL,
    `friends_profile` JSON NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_log` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'user info';
