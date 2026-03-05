CREATE DATABASE  IF NOT EXISTS `topclass_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `topclass_db`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: topclass_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clubs`
--

DROP TABLE IF EXISTS `clubs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubs` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `club_type` enum('1','2','3','4','5','6','7','8','9','10','11','12','13') NOT NULL,
  `creator_id` char(36) NOT NULL,
  `club_uuid` char(36) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `is_private` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `club_uuid` (`club_uuid`),
  KEY `creator_id` (`creator_id`),
  CONSTRAINT `clubs_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubs`
--

LOCK TABLES `clubs` WRITE;
/*!40000 ALTER TABLE `clubs` DISABLE KEYS */;
INSERT INTO `clubs` VALUES ('d029173b-cbfa-44a8-8e9f-721646cf87bc','a','a','1','28795797-4394-4911-88a8-913e7af145ee','f937a421-8f6b-4ece-bb05-31f2a7421020',NULL,0,'2026-01-27 20:48:07');
/*!40000 ALTER TABLE `clubs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grades` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) DEFAULT NULL,
  `course_name` varchar(255) NOT NULL,
  `grade` decimal(4,2) DEFAULT NULL,
  `graded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_grades_user` (`user_id`),
  CONSTRAINT `fk_grades_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `grades_chk_1` CHECK (((`grade` >= 0) and (`grade` <= 20)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `missions`
--

DROP TABLE IF EXISTS `missions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `missions` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `creator_id` char(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `due_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_missions_creator` (`creator_id`),
  CONSTRAINT `fk_missions_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `missions`
--

LOCK TABLES `missions` WRITE;
/*!40000 ALTER TABLE `missions` DISABLE KEYS */;
/*!40000 ALTER TABLE `missions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject_grades`
--

DROP TABLE IF EXISTS `subject_grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject_grades` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) DEFAULT NULL,
  `club_id` char(36) DEFAULT NULL,
  `subject_id` char(36) DEFAULT NULL,
  `grade` decimal(4,2) DEFAULT NULL,
  `graded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_subject_grades_user` (`user_id`),
  KEY `fk_subject_grades_club` (`club_id`),
  KEY `fk_subject_grades_subject` (`subject_id`),
  CONSTRAINT `fk_subject_grades_club` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_subject_grades_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_subject_grades_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject_grades`
--

LOCK TABLES `subject_grades` WRITE;
/*!40000 ALTER TABLE `subject_grades` DISABLE KEYS */;
/*!40000 ALTER TABLE `subject_grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_clubs`
--

DROP TABLE IF EXISTS `user_clubs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_clubs` (
  `user_id` char(36) NOT NULL,
  `club_id` char(36) NOT NULL,
  PRIMARY KEY (`user_id`,`club_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `user_clubs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_clubs_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_clubs`
--

LOCK TABLES `user_clubs` WRITE;
/*!40000 ALTER TABLE `user_clubs` DISABLE KEYS */;
INSERT INTO `user_clubs` VALUES ('004730cd-6139-4019-821a-bbfba921fa68','d029173b-cbfa-44a8-8e9f-721646cf87bc'),('179c0e87-9442-4325-a4fe-5fc4362051be','d029173b-cbfa-44a8-8e9f-721646cf87bc'),('28795797-4394-4911-88a8-913e7af145ee','d029173b-cbfa-44a8-8e9f-721646cf87bc');
/*!40000 ALTER TABLE `user_clubs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_missions`
--

DROP TABLE IF EXISTS `user_missions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_missions` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) DEFAULT NULL,
  `mission_id` char(36) DEFAULT NULL,
  `points` int DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_user_missions_user` (`user_id`),
  KEY `fk_user_missions_mission` (`mission_id`),
  CONSTRAINT `fk_user_missions_mission` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_missions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_missions`
--

LOCK TABLES `user_missions` WRITE;
/*!40000 ALTER TABLE `user_missions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_missions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `global_average` decimal(4,2) DEFAULT '0.00',
  `can_create_battle` tinyint(1) DEFAULT '0',
  `profile_picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('004730cd-6139-4019-821a-bbfba921fa68','m','m','m@gmail.com','$2b$10$ukkLCHM8lBc.FGaW/PsAWusCY6R7U1lUMgyUCIrx8.WsfR7Ne7gEa',0.00,0,NULL),('00878e58-5823-4779-985e-4f330e53ae98','g','g','g@gmail.com','$2b$10$CUVhLLAapID0dtPqHj64KOAlQTx6mZbLlkznbeQsimDujaGuggeam',0.00,0,NULL),('0129ff17-207b-431e-995d-6a90ea16630c','kk','kk','kk@gmail.com','$2b$10$fzE8XPc/VWewkbCruB2X8ut08KcCZdZ1BN4oPAIzOQaUvOFXXGC6W',0.00,0,NULL),('179c0e87-9442-4325-a4fe-5fc4362051be','t','t','t@gmail.com','$2b$10$pPTcutYedKOl9HV/T3b1YuG2Dvql/nQEy9CUfOBwHhZaky/JDyY7C',0.00,0,NULL),('28795797-4394-4911-88a8-913e7af145ee','A','A','A@GMAIL.COM','$2b$10$9n5zc05zVxsQBvdghrOcB.OaAOdrBzf7GY8DqI3vZy1cNN4hyRHRm',0.00,0,NULL),('bc239595-ee39-4a44-b6de-688d0008f555','gg','gg','gg@gmail.com','$2b$10$zYM/fhwPFGTT6XEQb08TqejcIvvyXjXB/uELrqSddiOkewfe/w1iW',0.00,0,'1771512811439-991525553-115496_0-removebg-preview (1).png');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'topclass_db'
--

--
-- Dumping routines for database 'topclass_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-27 15:09:11
