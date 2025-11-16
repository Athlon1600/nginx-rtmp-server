-- Adminer 4.8.1 MySQL 8.1.0 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

CREATE DATABASE `streaming` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `streaming`;

DROP TABLE IF EXISTS `channels`;
CREATE TABLE `channels` (
                            `id` int unsigned NOT NULL AUTO_INCREMENT,
                            `created_at` timestamp NULL DEFAULT NULL,
                            `name` varchar(255) NOT NULL,
                            `stream_key` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                            `is_live` tinyint NOT NULL DEFAULT '0',
                            `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
                            `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
                            PRIMARY KEY (`id`),
                            KEY `name` (`name`),
                            KEY `stream_key` (`stream_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `streams`;
CREATE TABLE `streams` (
                           `id` int NOT NULL AUTO_INCREMENT,
                           `name` varchar(255) NOT NULL,
                           `user_ip` varchar(22) NOT NULL,
                           `started_at` timestamp NOT NULL,
                           `ended_at` timestamp NULL DEFAULT NULL,
                           `bytes_in` bigint unsigned NOT NULL DEFAULT '0',
                           `ffprobe_json` text,
                           PRIMARY KEY (`id`),
                           KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 2023-09-24 23:48:02
