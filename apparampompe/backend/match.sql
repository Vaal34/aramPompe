CREATE TABLE `party` (
    `match_id` varchar(6) NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `joueur` varchar(30) DEFAULT NULL,
    `pompe` int DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci