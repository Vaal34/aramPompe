CREATE TABLE `user_stat` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` char(36) NOT NULL,
    `pompe` int NOT NULL DEFAULT '0' COMMENT 'pompe count',
    `calorie` int NOT NULL DEFAULT '0' COMMENT 'calorie count',
    `username` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `user_stat_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'user stat info'