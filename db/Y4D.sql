-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: y4d_dashboard
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `accreditations`
--

DROP TABLE IF EXISTS `accreditations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accreditations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_modified_by` int DEFAULT NULL,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accreditations`
--

LOCK TABLES `accreditations` WRITE;
/*!40000 ALTER TABLE `accreditations` DISABLE KEYS */;
INSERT INTO `accreditations` VALUES (3,'CAF International Certificate','International accreditation certificate','accreditation-1759837437040-356768685.jpg',1,NULL,'2025-11-11 04:51:24',0,'2025-10-07 11:41:48','2025-10-07 11:43:57','india'),(4,'NGO Grading Certificate','Official NGO grading recognition','accreditation-1759837446679-643835332.jpg',1,NULL,'2025-11-11 04:51:24',0,'2025-10-07 11:41:48','2025-10-07 11:44:06','india'),(14,'sdafasd','adfwdasf','accreditation-1763009515385-962136580.png',1,NULL,'2025-11-13 04:51:55',0,'2025-11-13 04:51:55','2025-11-13 04:51:55','india'),(15,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','aaaaaaaaaaaaaaaaaaaaaa','accreditation-1764768137179-392124003.png',1,NULL,'2025-12-03 13:22:17',0,'2025-12-03 13:22:17','2025-12-03 13:22:17','india'),(18,'Global Test','Test for Global','test.jpg',1,NULL,'2026-02-21 09:28:01',1,'2026-02-21 09:28:01','2026-02-21 09:28:01','global'),(19,'India Test','Test for India','test2.jpg',1,NULL,'2026-02-21 09:28:01',2,'2026-02-21 09:28:01','2026-02-21 09:28:01','india');
/*!40000 ALTER TABLE `accreditations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `resource_type` varchar(100) NOT NULL,
  `resource_id` int DEFAULT NULL,
  `details` text,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `user_agent` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_audit_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,1,'create','user',3,'Created user test111 with role viewer',NULL,'2025-09-01 08:46:34',NULL,NULL,NULL),(2,1,'delete','user',3,'Deleted user account: test111',NULL,'2025-09-01 08:46:40',NULL,NULL,NULL),(3,1,'delete','user',4,'Deleted user account: varad',NULL,'2025-09-01 08:47:49',NULL,NULL,NULL),(4,1,'update_status','user',2,'Changed status of user test to rejected',NULL,'2025-09-01 08:47:55',NULL,NULL,NULL),(5,1,'update_role','user',5,'Changed role of user tet to editor',NULL,'2025-09-01 08:53:52',NULL,NULL,NULL),(6,1,'delete','user',5,'Deleted user account: tet',NULL,'2025-09-01 08:57:11',NULL,NULL,NULL),(7,1,'update_status','user',2,'Changed status of user test to approved',NULL,'2025-09-01 08:57:21',NULL,NULL,NULL),(8,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 08:34:56',NULL,NULL,NULL),(9,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 09:36:00',NULL,NULL,NULL),(10,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 10:32:56',NULL,NULL,NULL),(11,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 10:44:23',NULL,NULL,NULL),(12,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 10:46:45',NULL,NULL,NULL),(13,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 10:48:13',NULL,NULL,NULL),(14,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 10:49:47',NULL,NULL,NULL),(15,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 10:51:59',NULL,NULL,NULL),(16,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 10:53:24',NULL,NULL,NULL),(17,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 10:55:33',NULL,NULL,NULL),(18,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 11:23:58',NULL,NULL,NULL),(19,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 11:24:08',NULL,NULL,NULL),(20,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 11:24:18',NULL,NULL,NULL),(21,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 11:24:47',NULL,NULL,NULL),(22,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 11:24:55',NULL,NULL,NULL),(23,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 11:41:53',NULL,NULL,NULL),(24,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 11:46:12',NULL,NULL,NULL),(25,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 12:10:46',NULL,NULL,NULL),(26,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 12:28:38',NULL,NULL,NULL),(27,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 12:29:09',NULL,NULL,NULL),(28,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 13:01:42',NULL,NULL,NULL),(29,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 13:01:50',NULL,NULL,NULL),(30,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 13:09:42',NULL,NULL,NULL),(31,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-10 13:12:47',NULL,NULL,NULL),(32,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-11 05:13:07',NULL,NULL,NULL),(33,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-11 05:16:38',NULL,NULL,NULL),(34,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-11 06:33:35',NULL,NULL,NULL),(35,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-11 07:38:27',NULL,NULL,NULL),(36,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-11 07:39:37',NULL,NULL,NULL),(37,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-11 07:57:10',NULL,NULL,NULL),(38,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-11 11:24:31',NULL,NULL,NULL),(39,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-13 07:08:12',NULL,NULL,NULL),(40,1,'update_permissions','user',8,'Updated permissions for user 8',NULL,'2025-11-13 07:08:21',NULL,NULL,NULL),(41,1,'delete','user',9,'Deleted user account: shrinivas',NULL,'2026-02-19 09:26:20',NULL,NULL,NULL),(42,1,'delete','user',8,'Deleted user account: shriw87',NULL,'2026-02-19 09:26:26',NULL,NULL,NULL),(43,1,'delete','user',6,'Deleted user account: shri',NULL,'2026-02-19 09:26:32',NULL,NULL,NULL),(44,1,'update_permissions','user',7,'Updated permissions for user 7',NULL,'2026-02-21 11:06:23',NULL,NULL,NULL),(45,1,'create','user',10,'Created user shri with role admin',NULL,'2026-03-13 12:43:52',NULL,NULL,NULL);
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `media_type` enum('image','video') DEFAULT 'image',
  `media` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_modified_by` int DEFAULT NULL,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `page` varchar(100) DEFAULT 'home',
  `section` varchar(100) DEFAULT 'hero',
  `category` varchar(100) DEFAULT 'main',
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (8,'image','banner-1760072479932-535698790.jpeg',1,NULL,'2025-11-11 04:51:24','2025-10-10 05:01:19','2025-10-10 05:01:19','about','hero','main','india'),(10,'image','banner-1760072530271-600905313.jpeg',1,NULL,'2025-11-11 04:51:24','2025-10-10 05:02:10','2025-10-10 05:02:10','legal-status','hero','main','india'),(11,'video','banner-1760072557833-87714137.mp4',1,NULL,'2025-11-11 04:51:24','2025-10-10 05:02:38','2025-10-10 05:02:38','our-work','quality-education','main','india'),(12,'video','banner-1760072586780-921144055.mp4',1,NULL,'2025-11-11 04:51:24','2025-10-10 05:03:06','2025-10-10 05:03:06','our-work','livelihood','main','india'),(13,'video','banner-1760072604066-505390941.mp4',1,NULL,'2025-11-11 04:51:24','2025-10-10 05:03:24','2025-10-10 05:03:24','our-work','healthcare','main','india'),(14,'video','banner-1760072618027-810371476.mp4',1,NULL,'2025-11-11 04:51:24','2025-10-10 05:03:38','2025-10-10 05:03:38','our-work','environmental-sustainability','main','india'),(15,'video','banner-1760072631155-578685624.mp4',1,NULL,'2025-11-11 04:51:24','2025-10-10 05:03:51','2025-10-10 05:03:51','our-work','idp','main','india'),(17,'image','banner-1760072667059-361815714.jpeg',1,NULL,'2025-11-11 04:51:24','2025-10-10 05:04:27','2025-10-10 05:04:27','media-corner','stories','main','india'),(18,'image','banner-1760072678723-211915918.jpeg',1,NULL,'2025-11-11 04:51:24','2025-10-10 05:04:38','2025-10-10 05:04:38','media-corner','blogs','main','india'),(19,'image','banner-1760072702668-177346382.jpeg',1,NULL,'2025-11-11 04:51:24','2025-10-10 05:05:02','2025-10-10 05:05:02','media-corner','events','main','india'),(20,'image','banner-1760072715982-37559876.jpeg',1,NULL,'2025-11-11 04:51:24','2025-10-10 05:05:15','2025-10-10 05:05:15','media-corner','documentaries','main','india'),(22,'image','banner-1760165245865-98810421.jpeg',1,NULL,'2025-11-11 04:51:24','2025-10-11 06:47:25','2025-10-11 06:47:25','home','hero','main','india'),(23,'image','banner-1760165255763-277515691.jpeg',1,NULL,'2025-11-11 04:51:24','2025-10-11 06:47:35','2025-10-11 06:47:35','home','hero','main','india'),(24,'image','banner-1760165264313-350675944.jpeg',1,NULL,'2025-11-11 04:51:24','2025-10-11 06:47:44','2025-10-11 06:47:44','home','hero','main','india'),(30,'image','banner-1764217523355-369427773.jpg',1,1,'2025-11-27 04:25:23','2025-11-27 04:25:23','2025-11-27 04:25:23','our-team','hero','main','india'),(34,'image','banner-1771493391668-315279689.png',1,1,'2026-02-19 09:29:51','2026-02-19 09:29:51','2026-02-19 09:29:51','our-work','healthcare','main','india'),(45,'image','banner-1771669195944-968264409.jpg',1,1,'2026-02-21 10:19:55','2026-02-21 10:19:55','2026-02-21 10:19:55','home','hero','main','global'),(48,'image','banner-1772008670642-809143424.png',1,1,'2026-02-25 08:37:50','2026-02-25 08:37:50','2026-02-25 08:37:50','our-work','quality-education','main','india'),(49,'image','banner-1772617895237-933850078.png',1,1,'2026-03-04 09:51:35','2026-03-04 09:51:35','2026-03-04 09:51:35','home','hero','main','global'),(50,'image','banner-1772617895429-237650817.jpg',1,1,'2026-03-04 09:51:35','2026-03-04 09:51:35','2026-03-04 09:51:35','home','hero','main','global'),(51,'image','banner-1772617895455-154107923.jpg',1,1,'2026-03-04 09:51:35','2026-03-04 09:51:35','2026-03-04 09:51:35','home','hero','main','global'),(52,'image','banner-1772617895468-234618086.jpg',1,1,'2026-03-04 09:51:35','2026-03-04 09:51:35','2026-03-04 09:51:35','home','hero','main','global'),(56,'image','banner-1773406717152-97881707.jpg',1,1,'2026-03-13 12:58:37','2026-03-13 12:58:37','2026-03-13 12:58:37','media-corner','blogs','main','global'),(57,'image','banner-1773406762630-307964891.png',1,1,'2026-03-13 12:59:22','2026-03-13 12:59:22','2026-03-13 12:59:22','media-corner','blogs','main','global'),(58,'image','banner-1773406910291-649981850.jpg',1,1,'2026-03-13 13:01:50','2026-03-13 13:01:50','2026-03-13 13:01:50','media-corner','blogs','main','india'),(59,'image','banner-1773409592305-616524870.jpg',1,1,'2026-03-13 13:46:32','2026-03-13 13:46:32','2026-03-13 13:46:32','media-corner','newsletters','main','india');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `images` json DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `published_date` date NOT NULL,
  `is_published` tinyint(1) DEFAULT '1',
  `last_modified_by` int DEFAULT NULL,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (9,'Y4D Foundation Expands to Kenya: Advancing Digital Equity in the Age of AI','The world is transforming at an unprecedented pace.\r\nArtificial Intelligence is reshaping industries. Automation is redefining jobs. Digital platforms are influencing how we learn, work, trade, and govern. Nations across the globe are investing heavily in AI ecosystems, digital infrastructure, and future-ready skills to remain competitive in the global economy.\r\nYet, while some regions accelerate into the AI revolution, many communities are still striving to access something far more basic — foundational computer literacy.\r\nThis widening digital divide is not merely a technological gap. It is an equity gap.\r\nToday, Y4D Foundation proudly announces the expansion of its mission to Kenya, marking a significant milestone in our global commitment to digital inclusion and equitable access to opportunity.\r\nThe Global Context: A World Powered by AI\r\nWe are entering an era where digital literacy is no longer optional — it is foundational.\r\nArtificial Intelligence tools are transforming:\r\n•	Education systems\r\n•	Healthcare delivery\r\n•	Financial services\r\n•	Agriculture and climate resilience\r\n•	Entrepreneurship and global trade\r\nAccording to the ITU\'s Facts and Figures 2025, about 6 billion people—roughly three-quarters of the global population—are now online, yet 2.2 billion remain offline. \r\nThe divide is stark: 94% of people in high-income countries use the internet, compared to just 23% in low-income countries. Without targeted action, the AI boom could widen inequality rather than reduce it. Without intentional intervention, the AI revolution risks deepening inequality — creating a world where opportunity is determined by access to technology.\r\nDigital Literacy as a Tool for Equity\r\nAt Y4D Foundation, we believe that equity begins with access.\r\nComputer literacy is not just about learning how to operate a device. It is about:\r\n•	Building confidence\r\n•	Expanding career pathways\r\n•	Enabling informed participation in society\r\n•	Unlocking entrepreneurship\r\n•	Connecting communities to global opportunities\r\nWhen a young person gains foundational computing skills, they unlock access to:\r\n•	Online education platforms\r\n•	Digital financial services\r\n•	Remote employment opportunities\r\n•	Global knowledge networks\r\nIn the AI era, digital literacy becomes more than a skill — it becomes the gateway to dignity, empowerment, and economic mobility.\r\nWhy Kenya? Why Now?\r\nKenya represents both opportunity and urgency.\r\nWith a vibrant youth population, growing innovation ecosystems, and increasing digital adoption, the country stands at a pivotal moment. However, disparities in access to structured computer education — particularly in underserved and rural communities — continue to limit potential.\r\nAs the world advances into AI-driven economies, ensuring that young people in Kenya are not left behind is not just a development priority — it is a global responsibility.\r\nY4D Foundation’s expansion into Kenya aims to bridge this gap through structured computer literacy programs, youth-centred digital training, and community-based learning models that prioritise inclusion.\r\nBuilding an Inclusive Digital Future\r\nTechnological advancement should reduce inequality — not widen it.\r\nOur work in Kenya will focus on creating accessible digital learning environments, empowering youth with practical computer skills, and laying the groundwork for advanced digital competencies. By strengthening foundational literacy today, we prepare communities for tomorrow\'s innovations.\r\nDigital equity ensures that opportunity is not limited by geography, income, or infrastructure. It ensures that the promise of AI and digital transformation is shared — not concentrated.\r\nAs Y4D Foundation expands its reach, we remain guided by a simple belief:\r\nThe future must not belong only to those already ahead.\r\nIt must be built with those who are ready to rise.\r\n','[\"1773997408079-945353209.jpeg\",\"1774000781605-370548127.jpeg\"]',NULL,NULL,'[]','2026-03-20',1,1,'2026-03-20 09:59:41','2026-03-13 11:15:29','2026-03-20 09:59:41','global');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `board_trustees`
--

DROP TABLE IF EXISTS `board_trustees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board_trustees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `bio` text,
  `image` varchar(255) DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `last_modified_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` enum('india','global','both') DEFAULT 'both',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board_trustees`
--

LOCK TABLES `board_trustees` WRITE;
/*!40000 ALTER TABLE `board_trustees` DISABLE KEYS */;
INSERT INTO `board_trustees` VALUES (17,'Ms. Bipasha Brahmachari','Director','null','trustee-1773399731699-43074675.png','{}',NULL,'2026-03-13 11:02:11','2026-03-13 11:04:17','2026-03-13 11:04:17','global'),(18,'Mr. Bijesh Kumar','Secretary',NULL,'trustee-1773399895970-679591938.jpg','{}',NULL,'2026-03-13 11:04:55','2026-03-13 11:04:55','2026-03-13 11:04:55','global'),(24,'Mr. Praful Nikam','President',NULL,'trustee-1774001433156-121713727.png','{}',NULL,'2026-03-20 10:10:33','2026-03-20 10:10:33','2026-03-20 10:10:33','global');
/*!40000 ALTER TABLE `board_trustees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `careers`
--

DROP TABLE IF EXISTS `careers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `careers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `requirements` text,
  `location` varchar(255) DEFAULT NULL,
  `type` enum('full-time','part-time','contract','internship') DEFAULT 'full-time',
  `is_active` tinyint(1) DEFAULT '1',
  `last_modified_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `careers`
--

LOCK TABLES `careers` WRITE;
/*!40000 ALTER TABLE `careers` DISABLE KEYS */;
INSERT INTO `careers` VALUES (3,'Frontend','Frontend','HTNL','Pune','full-time',1,NULL,'2025-08-23 11:57:50','2025-08-23 11:57:50','2025-11-11 04:40:59','india'),(4,'Backend','Backend','TEst backend','Remote','full-time',1,NULL,'2025-08-28 09:15:40','2025-11-11 11:14:09','2025-11-11 11:14:09','india'),(10,'fsdzg','szdfg','fzsdcdg','zsdfg','full-time',1,NULL,'2025-11-11 11:15:27','2025-11-11 11:15:27','2025-11-11 11:15:27','india'),(12,'asd','asd','asd','adf','full-time',1,NULL,'2026-02-21 10:47:25','2026-02-21 10:47:25','2026-02-21 10:47:25','india'),(13,'sdf','sdaf','fsd','sdf','full-time',1,NULL,'2026-02-21 10:48:28','2026-02-21 10:48:28','2026-02-21 10:48:28','global');
/*!40000 ALTER TABLE `careers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentaries`
--

DROP TABLE IF EXISTS `documentaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `video_url` varchar(500) NOT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `published_date` date NOT NULL,
  `is_published` tinyint(1) DEFAULT '1',
  `last_modified_by` int DEFAULT NULL,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `video_filename` varchar(255) DEFAULT NULL,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentaries`
--

LOCK TABLES `documentaries` WRITE;
/*!40000 ALTER TABLE `documentaries` DISABLE KEYS */;
INSERT INTO `documentaries` VALUES (14,'khasd','sdasdsadadsad','','1773410889048-577041302.png','0:00','2026-03-13',1,1,'2026-03-13 14:08:52','2026-03-13 14:08:09','2026-03-13 14:08:52','1773410888221-509028110.mp4','india');
/*!40000 ALTER TABLE `documentaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dynamic_banners`
--

DROP TABLE IF EXISTS `dynamic_banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dynamic_banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `media_type` enum('image','video') DEFAULT 'image',
  `media` varchar(255) DEFAULT NULL,
  `page` varchar(100) DEFAULT 'home',
  `section` varchar(100) DEFAULT 'hero',
  `category` varchar(100) DEFAULT 'main',
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '0',
  `button_text` varchar(100) DEFAULT NULL,
  `button_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dynamic_banners`
--

LOCK TABLES `dynamic_banners` WRITE;
/*!40000 ALTER TABLE `dynamic_banners` DISABLE KEYS */;
INSERT INTO `dynamic_banners` VALUES (1,'Homepage Hero 1',NULL,'image','home-hero1.jpg','home','hero','main',1,1,NULL,NULL,'2025-10-10 04:45:00','2025-10-10 04:45:00'),(2,'Homepage Hero 2',NULL,'image','home-hero2.jpg','home','hero','main',1,2,NULL,NULL,'2025-10-10 04:45:00','2025-10-10 04:45:00'),(3,'About Us Banner',NULL,'image','about-hero.jpg','about','hero','main',1,1,NULL,NULL,'2025-10-10 04:45:00','2025-10-10 04:45:00'),(4,'Campaign Section 1',NULL,'image','campaign1.jpg','home','campaigns','main',1,1,NULL,NULL,'2025-10-10 04:45:00','2025-10-10 04:45:00'),(5,'Campaign Section 2',NULL,'image','campaign2.jpg','home','campaigns','main',1,2,NULL,NULL,'2025-10-10 04:45:00','2025-10-10 04:45:00'),(6,'Team Banner',NULL,'image','team-banner.jpg','team','hero','main',1,1,NULL,NULL,'2025-10-10 04:45:00','2025-10-10 04:45:00'),(7,'Contact Header',NULL,'image','contact-header.jpg','contact','hero','main',1,1,NULL,NULL,'2025-10-10 04:45:00','2025-10-10 04:45:00');
/*!40000 ALTER TABLE `dynamic_banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `environment_sustainability`
--

DROP TABLE IF EXISTS `environment_sustainability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `environment_sustainability` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `content` longtext,
  `image_url` varchar(500) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `additional_images` json DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `meta_keywords` text,
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '0',
  `last_modified_by` int DEFAULT NULL,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `environment_sustainability`
--

LOCK TABLES `environment_sustainability` WRITE;
/*!40000 ALTER TABLE `environment_sustainability` DISABLE KEYS */;
INSERT INTO `environment_sustainability` VALUES (1,'wwwwwwww','wwwwwwww','wwwwwwwwww','/uploads/our-work/environment_sustainability/1757076349576-990950840.jpg','','[]','','','',1,0,NULL,'2025-11-11 04:51:05','2025-09-05 12:45:49','2025-09-05 12:45:49','india'),(2,'aaaaaaaaaaaaaaa','aaaaaaaaaaaaa','aaaaaaaaaaaaa','/uploads/our-work/environment_sustainability/1757076364146-230044246.jpg','','[]','','','',1,0,NULL,'2025-11-11 04:51:05','2025-09-05 12:46:04','2025-09-05 12:46:04','india'),(3,'vvvvvvvvvvvvvv','vvvvvvvvv','vvvvvvvvv','/uploads/our-work/environment_sustainability/1757076378226-200974697.jpg','','[]','','','',1,0,NULL,'2025-11-11 04:51:05','2025-09-05 12:46:18','2025-09-05 12:46:18','india'),(4,'vvvvvvvvvvvvvv','vvvvvvvvvvvv','vvvvvvvvvvvvvvv','/uploads/our-work/environment_sustainability/1757076390142-365775624.jpg','','[]','','','',1,0,NULL,'2025-11-11 04:51:05','2025-09-05 12:46:30','2025-09-05 12:46:30','india'),(5,'jhSADKJBSDK','L;ASDKFOPAJFNASDKJFHIUSDAHFCKJDAXSFCDAXKJFCHSDABFCHSDAXCKBSDXSHCGBSDKXHCBKHDSXVCBKHDAFHVCBSDALIFVKJDVCKID','L;ASDKFOPAJFNASDKJFHIUSDAHFCKJDAXSFCDAXKJFCHSDABFCHSDAXCKBSDXSHCGBSDKXHCBKHDSXVCBKHDAFHVCBSDALIFVKJDVCKID','/uploads/our-work/environment_sustainability/1758288299019-624892202.jpg','https://youtu.be/WpBn9w-Js_c?si=qdNibPbYggbQiUUs','[]','','','',1,0,NULL,'2025-11-11 04:51:05','2025-09-19 13:24:59','2025-09-19 13:24:59','india'),(6,'weaftwerastge','frdstgtrferstygers','ersatygerastgwera','/uploads/our-work/environment_sustainability/1758805685593-994066199.webp','','[]','','','',1,0,NULL,'2025-11-11 04:51:05','2025-09-25 13:08:05','2025-09-25 13:08:05','india'),(7,'sdfg','fdg','dfg','/uploads/our-work/environment_sustainability/1771664443376-2856989.jpg','','[]','','','',1,0,1,'2026-02-21 09:00:43','2026-02-21 09:00:43','2026-02-21 09:00:43','global');
/*!40000 ALTER TABLE `environment_sustainability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `date` date NOT NULL,
  `time` time DEFAULT NULL,
  `location` varchar(500) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `published_date` date NOT NULL,
  `is_published` tinyint(1) DEFAULT '1',
  `last_modified_by` int DEFAULT NULL,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (7,'wrat','fsdtgere','2025-09-25',NULL,'erftgr','1758784855361-296039867.webp','2025-09-25',1,NULL,'2025-11-11 04:50:42','2025-09-25 07:20:55','2025-09-25 07:20:58','india'),(8,'shrizzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz','oihysdaffuhgwdzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz','2025-11-28','19:08:00','frsdg','1758785093808-262875845.webp','2025-09-25',1,1,'2025-11-26 13:38:52','2025-09-25 07:24:53','2025-11-26 13:38:52','india');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `healthcare`
--

DROP TABLE IF EXISTS `healthcare`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `healthcare` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `content` longtext,
  `image_url` varchar(500) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `additional_images` json DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `meta_keywords` text,
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '0',
  `last_modified_by` int DEFAULT NULL,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `healthcare`
--

LOCK TABLES `healthcare` WRITE;
/*!40000 ALTER TABLE `healthcare` DISABLE KEYS */;
INSERT INTO `healthcare` VALUES (1,'sds','sads','sad','/uploads/our-work/healthcare/1758868993791-304033282.webp','','[]','','','',1,0,NULL,'2025-11-11 04:51:05','2025-09-05 12:33:44','2025-09-26 06:43:13','india'),(6,'dfsafdsf','dfhgbfsdhb','sdfhgfersdg','/uploads/our-work/healthcare/1758805536260-649350914.webp','','[]','','','',1,0,NULL,'2025-11-11 04:51:05','2025-09-25 13:05:36','2025-09-26 06:43:31','india');
/*!40000 ALTER TABLE `healthcare` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `impact_data`
--

DROP TABLE IF EXISTS `impact_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `impact_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `beneficiaries` int NOT NULL DEFAULT '15',
  `states` int NOT NULL DEFAULT '20',
  `projects` int NOT NULL DEFAULT '200',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'both',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `impact_data`
--

LOCK TABLES `impact_data` WRITE;
/*!40000 ALTER TABLE `impact_data` DISABLE KEYS */;
INSERT INTO `impact_data` VALUES (1,15,22,200,'2026-02-21 10:10:26','both'),(2,26,22,200,'2026-02-21 10:12:54','global'),(3,30,22,200,'2026-02-25 12:45:20','india');
/*!40000 ALTER TABLE `impact_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `integrated_development`
--

DROP TABLE IF EXISTS `integrated_development`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `integrated_development` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `content` longtext,
  `image_url` varchar(500) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `additional_images` json DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `meta_keywords` text,
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '0',
  `last_modified_by` int DEFAULT NULL,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `integrated_development`
--

LOCK TABLES `integrated_development` WRITE;
/*!40000 ALTER TABLE `integrated_development` DISABLE KEYS */;
INSERT INTO `integrated_development` VALUES (4,'fedgfsdaxf','dsfzsdaxfcdsx','xzcxvdsf','/uploads/our-work/integrated_development/1757077033946-322945416.jpg','','[]','','','',0,0,NULL,'2025-11-11 04:51:05','2025-09-05 12:57:13','2025-09-25 13:31:52','india'),(5,'dfl,mmnsakj','esdkopkjfoiwdasflosdnlkfhsdosflkfgfsdngjfsdhgvosdhogsdljhgjsdgvjsdhgvjhdsogvfhfsdovhgosdahvgo;jhsao;h;ofghsdcogvhfjohvgoufvgkjfsc','esdkopkjfoiwdasflosdnlkfhsdosflkfgfsdngjfsdhgvosdhogsdljhgjsdgvjsdhgvjhdsogvfhfsdovhgosdahvgo;jhsao;h;ofghsdcogvhfjohvgoufvgkjfsc','/uploads/our-work/integrated_development/1758289136538-35483692.jpg','https://youtu.be/WpBn9w-Js_c?si=qdNibPbYggbQiUUs','[]','','','',0,0,NULL,'2025-11-11 04:51:05','2025-09-19 13:38:56','2025-09-25 13:31:57','india'),(6,'dfsghesd','dfhggbfesdhgbfesdg','zdfhgfsdhtersdhg','/uploads/our-work/integrated_development/1758805767397-232678579.webp','','[]','','','',1,0,NULL,'2025-11-11 04:51:05','2025-09-25 13:09:27','2025-09-25 13:09:27','india');
/*!40000 ALTER TABLE `integrated_development` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `livelihood`
--

DROP TABLE IF EXISTS `livelihood`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livelihood` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `content` longtext,
  `image_url` varchar(500) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `additional_images` json DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `meta_keywords` text,
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '0',
  `last_modified_by` int DEFAULT NULL,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livelihood`
--

LOCK TABLES `livelihood` WRITE;
/*!40000 ALTER TABLE `livelihood` DISABLE KEYS */;
INSERT INTO `livelihood` VALUES (1,'Test','Test','Test','1756673735664-445766465.png','','[]','','','',1,0,NULL,'2025-11-11 04:51:05','2025-08-31 20:55:35','2025-08-31 20:55:35','india'),(8,'sedfhgrs','sdfghbfsd','sdfghsed','/uploads/our-work/livelihood/1758805458495-947551224.webp','','[]','','','',1,0,NULL,'2025-11-11 04:51:05','2025-09-25 13:04:18','2025-09-26 06:41:47','india'),(9,'fgg','xdfgdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','fsgxg','/uploads/our-work/livelihood/1760094262391-748727182.jpeg','https://youtu.be/CY48leb3bFk?si=Tt63bXEEQTF1fzt3','[]','','','',1,0,1,'2025-11-26 12:48:28','2025-10-10 11:04:22','2025-11-26 12:48:28','india'),(10,'global','global','sd','/uploads/our-work/livelihood/1771663883002-494527352.jpg','','[]','','','',1,0,1,'2026-02-21 08:51:23','2026-02-21 08:51:23','2026-02-21 08:51:23','global');
/*!40000 ALTER TABLE `livelihood` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_attempts`
--

DROP TABLE IF EXISTS `login_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_attempts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `success` tinyint(1) DEFAULT '0',
  `attempted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `login_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=606 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_attempts`
--

LOCK TABLES `login_attempts` WRITE;
/*!40000 ALTER TABLE `login_attempts` DISABLE KEYS */;
INSERT INTO `login_attempts` VALUES (1,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 06:53:22'),(2,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 06:54:21'),(3,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 06:54:22'),(4,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 06:55:12'),(5,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 06:55:21'),(6,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 06:55:31'),(7,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 06:55:34'),(8,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 06:55:41'),(9,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 06:55:49'),(10,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 06:55:59'),(11,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 06:58:44'),(12,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 07:00:47'),(13,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 07:00:55'),(14,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 07:01:15'),(15,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 07:01:23'),(16,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 07:01:24'),(17,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 07:01:34'),(18,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 07:01:34'),(19,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 07:01:40'),(20,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-25 08:53:52'),(21,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 10:07:10'),(22,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 10:09:01'),(23,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 10:11:13'),(24,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 10:11:14'),(25,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 10:11:14'),(26,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 10:11:20'),(27,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 10:11:37'),(28,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 10:11:37'),(29,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:53:09'),(30,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:53:10'),(31,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:53:10'),(32,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:53:11'),(33,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:53:11'),(34,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:53:11'),(35,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:53:11'),(36,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:53:11'),(37,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:53:12'),(38,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:53:12'),(39,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:53:12'),(40,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:53:28'),(41,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:57:26'),(42,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 13:57:45'),(43,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:00:09'),(44,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:00:32'),(45,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:02:30'),(46,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:08:11'),(47,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:08:16'),(48,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:08:27'),(49,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:08:38'),(50,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:08:41'),(51,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:08:41'),(52,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:08:42'),(53,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:08:42'),(54,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:08:42'),(55,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:08:42'),(56,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:08:43'),(57,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:21:20'),(58,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:21:21'),(59,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:21:39'),(60,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:21:40'),(61,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:21:45'),(62,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:21:53'),(63,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-26 14:28:36'),(64,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-28 07:43:36'),(65,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-28 07:43:38'),(66,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-28 07:43:39'),(67,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-28 07:43:39'),(68,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-28 07:43:39'),(69,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-28 07:43:39'),(70,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-28 07:43:39'),(71,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-28 07:43:39'),(72,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-28 07:43:39'),(73,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-28 07:43:40'),(74,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-28 07:43:40'),(75,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 08:52:55'),(76,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 09:04:12'),(77,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 09:09:11'),(78,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 09:09:33'),(79,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 09:11:18'),(80,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 10:07:30'),(81,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 10:14:23'),(82,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 10:28:00'),(83,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 11:12:16'),(84,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 12:12:20'),(85,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 12:13:17'),(86,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 12:14:14'),(87,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 12:27:06'),(88,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-28 12:27:12'),(89,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-28 12:27:13'),(90,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 12:27:15'),(91,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 12:28:06'),(92,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 12:36:03'),(93,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 13:39:01'),(94,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 13:41:09'),(95,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 17:32:35'),(96,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 17:50:48'),(97,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 17:51:08'),(98,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 17:53:10'),(99,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 18:07:38'),(100,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 18:31:44'),(101,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 18:41:51'),(102,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 18:45:13'),(103,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-28 18:53:55'),(104,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 07:09:34'),(105,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 07:13:53'),(106,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 08:19:21'),(107,1,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1',1,'2025-08-29 09:20:50'),(108,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 11:08:34'),(109,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 11:12:18'),(110,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 11:13:26'),(111,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 11:17:49'),(112,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 11:22:35'),(113,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 13:46:34'),(114,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 14:09:20'),(115,2,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 14:10:02'),(116,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 14:16:47'),(117,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 14:19:12'),(118,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 14:27:37'),(119,2,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',0,'2025-08-29 14:27:45'),(120,2,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 14:27:47'),(121,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 14:27:55'),(122,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 14:49:59'),(123,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 14:56:04'),(124,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 15:00:24'),(125,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 15:00:51'),(126,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 15:00:56'),(127,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 15:03:49'),(128,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 15:03:53'),(129,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 15:19:08'),(130,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 15:31:36'),(131,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 15:36:48'),(132,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 17:19:34'),(133,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 17:50:43'),(134,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 17:54:18'),(135,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 17:55:22'),(136,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 17:57:19'),(137,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 18:08:49'),(138,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 18:23:00'),(139,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 18:33:00'),(140,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 18:33:09'),(141,1,'::1','Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1',1,'2025-08-29 18:33:16'),(142,1,'::1','Mozilla/5.0 (Linux; Android 11; SM-T970) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.35 Safari/537.36',1,'2025-08-29 18:33:32'),(143,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-29 18:33:48'),(144,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 07:52:07'),(145,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 07:52:23'),(146,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 08:37:18'),(147,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 08:51:37'),(148,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 08:54:41'),(149,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 08:56:10'),(150,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 09:02:12'),(151,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 09:05:44'),(152,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 09:09:55'),(153,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 09:10:27'),(154,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 09:18:23'),(155,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 09:45:59'),(156,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 09:48:14'),(157,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 09:48:34'),(158,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 09:49:03'),(159,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 10:01:14'),(160,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 10:05:33'),(161,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 10:11:00'),(162,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 10:12:08'),(163,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 10:12:32'),(164,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 10:34:48'),(165,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 10:35:34'),(166,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 10:55:08'),(167,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 10:58:52'),(168,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 11:32:57'),(169,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 12:41:54'),(170,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 12:43:20'),(171,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-30 12:51:12'),(172,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 17:20:20'),(173,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 17:22:28'),(174,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 17:25:11'),(175,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 17:26:31'),(176,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 17:26:47'),(177,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 17:28:49'),(178,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 17:45:47'),(179,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 18:08:25'),(180,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 18:30:01'),(181,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 18:32:24'),(182,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 18:45:49'),(183,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 18:59:17'),(184,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 19:00:55'),(185,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 19:25:32'),(186,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 19:36:49'),(187,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 19:49:24'),(188,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 19:52:43'),(189,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 19:59:32'),(190,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 20:00:47'),(191,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 20:03:54'),(192,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 20:04:20'),(193,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 20:16:09'),(194,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 20:24:15'),(195,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 20:53:27'),(196,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 21:02:55'),(197,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 21:03:41'),(198,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-08-31 21:19:31'),(199,1,'::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36 Edg/139.0.0.0',1,'2025-09-01 08:23:33'),(200,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-09-01 08:47:18'),(201,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-09-01 08:53:13'),(202,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-09-01 09:12:52'),(204,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',1,'2025-09-01 09:14:08'),(205,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-01 09:43:55'),(206,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-01 09:48:12'),(207,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-01 17:54:09'),(208,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-01 18:00:53'),(209,7,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',0,'2025-09-01 18:01:33'),(210,7,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',0,'2025-09-01 18:01:37'),(211,7,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-01 18:01:42'),(212,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-01 18:02:05'),(213,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',0,'2025-09-02 13:31:12'),(214,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',0,'2025-09-02 13:31:20'),(215,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-02 13:31:23'),(216,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-04 05:18:58'),(217,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-04 12:48:33'),(218,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-04 12:50:26'),(219,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-04 14:34:15'),(220,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-04 14:47:34'),(221,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-05 05:57:32'),(222,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-05 08:07:22'),(223,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-05 10:51:51'),(224,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',1,'2025-09-05 12:33:18'),(225,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-06 04:30:50'),(226,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-06 06:30:25'),(227,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-06 12:29:43'),(228,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-08 06:16:57'),(229,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-08 06:17:44'),(230,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-08 06:21:08'),(231,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-09 06:21:03'),(232,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',0,'2025-09-09 06:38:32'),(233,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',0,'2025-09-09 06:38:45'),(234,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-09 06:38:50'),(235,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-09 08:57:40'),(236,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-09 12:34:08'),(237,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-10 04:34:04'),(238,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-12 09:32:36'),(239,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-15 08:32:42'),(240,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-18 07:53:43'),(241,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-18 10:50:54'),(242,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-18 10:56:41'),(243,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',0,'2025-09-18 11:14:12'),(244,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',0,'2025-09-18 11:14:17'),(245,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-18 11:14:26'),(246,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-18 11:38:01'),(247,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-19 11:09:56'),(248,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-19 12:26:20'),(249,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-20 06:34:15'),(250,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-20 09:26:45'),(251,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-20 12:00:17'),(252,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-23 10:30:28'),(253,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-23 10:31:45'),(254,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',0,'2025-09-23 11:15:02'),(255,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-23 11:15:05'),(256,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-23 14:04:39'),(257,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-24 09:24:14'),(258,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',0,'2025-09-24 12:26:46'),(259,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-24 12:26:53'),(260,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-25 07:10:42'),(261,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-25 07:20:29'),(262,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-25 07:23:08'),(263,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-25 10:10:22'),(264,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',0,'2025-09-25 12:48:49'),(265,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-25 12:48:55'),(266,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 05:52:52'),(267,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 06:17:25'),(268,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 06:23:02'),(269,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 06:48:12'),(270,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 06:48:57'),(271,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 06:55:22'),(272,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 06:56:34'),(273,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 07:04:19'),(274,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 09:46:26'),(275,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 10:10:55'),(276,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',0,'2025-09-26 10:32:13'),(277,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 10:32:18'),(278,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',0,'2025-09-26 10:48:02'),(279,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 10:48:05'),(280,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 10:48:28'),(281,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 10:57:43'),(282,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 11:04:02'),(283,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 11:13:05'),(284,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 11:15:06'),(285,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 11:16:10'),(286,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 11:22:26'),(287,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 11:28:56'),(288,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 11:31:20'),(289,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-09-26 11:52:28'),(290,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-10-06 04:08:08'),(291,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-10-07 06:45:38'),(292,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-10-07 06:46:33'),(293,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-10-07 09:11:41'),(294,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-10-07 09:12:21'),(295,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-10-07 09:12:44'),(296,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-10-07 09:13:50'),(297,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-10-07 11:40:32'),(298,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1,'2025-10-07 13:27:33'),(299,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',1,'2025-10-10 04:35:24'),(300,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',1,'2025-10-10 04:45:56'),(301,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',1,'2025-10-10 09:42:46'),(302,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',1,'2025-10-10 09:57:46'),(303,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',1,'2025-10-10 10:44:02'),(304,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',1,'2025-10-10 11:22:22'),(305,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',1,'2025-10-10 11:24:57'),(306,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',1,'2025-10-10 12:04:26'),(307,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',0,'2025-10-10 12:14:40'),(308,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',1,'2025-10-10 12:14:47'),(309,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',1,'2025-10-11 06:43:26'),(310,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-10-31 05:20:38'),(311,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-10-31 05:20:58'),(312,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-10-31 05:21:04'),(313,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-10-31 05:21:09'),(314,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-10-31 05:21:15'),(315,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-10-31 05:21:25'),(316,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-10-31 07:30:31'),(317,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-10-31 07:33:53'),(318,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-01 04:46:10'),(319,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-01 05:03:57'),(320,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-01 12:14:16'),(321,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 05:39:45'),(322,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 06:32:38'),(323,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 07:46:57'),(325,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 07:51:23'),(327,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 07:53:42'),(329,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 08:12:46'),(332,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 08:34:17'),(335,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 09:35:32'),(336,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 10:07:29'),(338,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-10 10:31:59'),(339,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 10:32:07'),(342,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 10:43:48'),(344,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 10:46:21'),(346,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 10:49:34'),(348,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 10:51:42'),(350,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-10 10:53:02'),(351,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 10:53:06'),(353,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 10:54:46'),(355,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 10:58:33'),(356,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 11:24:31'),(358,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-10 11:41:22'),(359,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 11:41:24'),(361,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 11:45:20'),(362,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 11:52:58'),(363,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 11:58:43'),(365,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 12:00:27'),(366,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 12:11:13'),(367,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 12:14:47'),(368,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 12:17:03'),(369,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 12:50:36'),(370,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 12:55:37'),(371,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 12:57:15'),(372,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 13:09:06'),(374,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-10 13:12:28'),(375,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 05:11:24'),(377,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 05:12:49'),(379,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 05:16:03'),(381,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 05:18:22'),(382,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-11 06:07:38'),(383,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-11 06:07:43'),(384,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 06:07:45'),(386,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-11 06:10:11'),(387,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 06:10:13'),(389,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 07:39:24'),(391,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 07:50:11'),(392,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 07:52:43'),(393,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-11 07:53:56'),(394,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 07:54:07'),(395,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 07:56:28'),(399,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 08:00:24'),(400,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 09:31:47'),(401,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 09:40:30'),(402,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-11 09:49:54'),(403,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 09:49:59'),(404,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 10:09:05'),(406,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 11:15:41'),(407,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 11:16:23'),(408,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 11:21:37'),(409,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 11:23:12'),(411,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 11:24:06'),(413,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 11:27:39'),(415,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 11:53:23'),(416,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 12:01:33'),(417,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 12:06:02'),(418,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 12:06:28'),(419,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 12:06:43'),(421,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 12:08:34'),(423,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 12:12:01'),(425,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 12:13:11'),(426,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-11 12:19:24'),(427,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 12:19:36'),(430,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 12:32:35'),(431,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 12:48:09'),(432,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 12:53:11'),(434,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 13:04:26'),(436,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-11 13:11:21'),(437,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-12 09:57:30'),(439,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-13 04:50:29'),(440,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-13 05:36:20'),(441,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-13 05:36:51'),(442,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-13 05:39:48'),(443,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-13 05:45:43'),(444,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-13 05:48:48'),(445,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-13 06:27:38'),(446,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-13 07:07:54'),(447,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-13 07:19:55'),(448,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-13 07:20:02'),(449,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-13 07:20:06'),(450,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-13 07:20:15'),(452,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-13 07:21:38'),(453,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-13 07:28:13'),(454,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-13 07:29:32'),(455,1,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-13 08:16:15'),(456,1,'127.0.0.1','Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1',1,'2025-11-25 08:58:00'),(457,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-26 10:49:10'),(458,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-26 10:49:13'),(459,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-26 12:19:06'),(460,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-26 12:46:40'),(461,1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Safari/605.1.15',1,'2025-11-26 12:59:27'),(462,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-26 13:01:25'),(463,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-27 04:21:50'),(464,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-27 04:22:29'),(465,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-28 11:12:40'),(466,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-28 11:26:30'),(467,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 12:59:22'),(468,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 12:59:28'),(469,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 12:59:52'),(472,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-03 13:12:39'),(473,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 13:36:16'),(474,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 13:36:54'),(475,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-03 13:37:00'),(476,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-03 13:37:48'),(478,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-04 04:16:11'),(479,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-12-04 04:27:17'),(481,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/2.1.47 Chrome/138.0.7204.251 Electron/37.7.0 Safari/537.36',1,'2025-12-04 05:05:13'),(482,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-04 05:05:52'),(483,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-04 05:21:03'),(484,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-04 05:44:22'),(485,1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Safari/605.1.15',1,'2025-12-04 06:08:27'),(486,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-04 06:15:59'),(487,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-04 06:56:45'),(488,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-04 07:22:30'),(489,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-12-04 07:42:53'),(490,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',0,'2026-02-19 09:25:36'),(491,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-19 09:25:53'),(492,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-20 09:24:34'),(493,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 06:18:31'),(494,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 06:18:49'),(495,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 06:19:08'),(496,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 06:20:25'),(497,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',0,'2026-02-21 06:25:15'),(498,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 06:53:09'),(499,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 06:55:11'),(500,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 06:57:47'),(501,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',0,'2026-02-21 07:46:33'),(502,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 07:50:50'),(503,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 07:54:10'),(504,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',0,'2026-02-21 07:54:55'),(505,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',0,'2026-02-21 07:55:18'),(506,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',0,'2026-02-21 07:55:31'),(507,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',0,'2026-02-21 07:55:49'),(508,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 08:03:26'),(509,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 08:04:03'),(510,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 08:05:53'),(511,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 08:07:25'),(512,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 08:08:33'),(513,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 08:15:16'),(514,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 08:34:39'),(515,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 08:34:58'),(516,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 08:50:51'),(517,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 08:52:12'),(518,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 08:55:03'),(519,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 09:10:31'),(520,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 09:12:05'),(521,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',0,'2026-02-21 09:12:42'),(522,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 09:12:49'),(523,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 09:20:33'),(524,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 09:30:33'),(525,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 09:30:48'),(526,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 09:31:07'),(527,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 09:36:46'),(528,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 09:45:52'),(529,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 09:46:13'),(530,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 09:56:52'),(531,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 09:58:07'),(532,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:12:25'),(533,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:12:40'),(534,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:13:24'),(535,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:14:11'),(536,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:19:40'),(537,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:28:16'),(538,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:29:36'),(539,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:39:58'),(540,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:40:11'),(541,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:44:50'),(542,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:48:16'),(543,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:50:10'),(544,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:53:36'),(545,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 10:57:00'),(546,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 11:02:00'),(547,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 11:14:05'),(548,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 11:22:25'),(549,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-21 11:22:49'),(550,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-24 06:26:43'),(551,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-24 06:27:04'),(552,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-25 08:35:41'),(553,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-25 08:36:16'),(554,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-25 09:15:10'),(555,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-25 09:15:27'),(556,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-25 12:12:16'),(557,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-25 12:44:20'),(558,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-25 12:44:32'),(559,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',0,'2026-02-28 05:59:52'),(560,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-28 06:00:01'),(561,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-28 06:00:14'),(562,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-28 06:29:25'),(563,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-28 06:41:47'),(564,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-02-28 07:07:50'),(565,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-04 09:23:09'),(566,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-04 09:30:34'),(567,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-04 09:53:13'),(568,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 10:10:32'),(569,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 10:19:40'),(570,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 10:42:28'),(571,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 10:43:07'),(572,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 10:57:44'),(573,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 11:01:43'),(574,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 11:08:59'),(575,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 11:14:20'),(576,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 11:21:43'),(577,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 11:21:55'),(578,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 11:22:11'),(579,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',0,'2026-03-13 12:02:02'),(580,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',0,'2026-03-13 12:03:18'),(581,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 12:04:00'),(582,NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',0,'2026-03-13 12:08:12'),(583,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 12:32:29'),(584,10,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',0,'2026-03-13 12:44:28'),(585,10,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 12:44:50'),(586,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 12:49:31'),(587,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 12:57:52'),(588,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 13:01:25'),(589,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 14:02:21'),(590,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 14:03:38'),(591,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 14:06:24'),(592,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 14:14:46'),(593,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 14:22:32'),(594,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 14:23:14'),(595,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 14:25:38'),(596,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',1,'2026-03-13 14:44:01'),(597,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',1,'2026-03-20 09:01:50'),(598,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',1,'2026-03-20 09:07:23'),(599,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',1,'2026-03-20 09:25:26'),(600,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',1,'2026-03-20 10:20:04'),(601,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',1,'2026-03-21 05:33:20'),(602,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',1,'2026-03-21 05:37:06'),(603,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',1,'2026-03-21 06:10:44'),(604,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',1,'2026-03-21 08:04:22'),(605,1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',1,'2026-03-21 08:04:35');
/*!40000 ALTER TABLE `login_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `management`
--

DROP TABLE IF EXISTS `management`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `management` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `bio` text,
  `image` varchar(255) DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `last_modified_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `management`
--

LOCK TABLES `management` WRITE;
/*!40000 ALTER TABLE `management` DISABLE KEYS */;
INSERT INTO `management` VALUES (1,'Robert Johnson','CEO','Founder and CEO with vision for growth.','ceo.jpg',NULL,NULL,'2025-08-23 11:48:55','2025-08-23 11:48:55','2025-11-11 04:40:33','india'),(2,'Sarah Williams','CTO','Technical lead with expertise in software architecture.','cto.jpg',NULL,NULL,'2025-08-23 11:48:55','2025-08-23 11:48:55','2025-11-11 04:40:33','india'),(4,'Q','q','qq',NULL,'{}',NULL,'2025-08-28 10:31:52','2025-08-28 10:31:52','2025-11-11 04:40:33','india'),(8,'zxsd','afzsd','',NULL,'{}',NULL,'2025-12-04 08:00:20','2025-12-04 08:00:20','2025-12-04 08:00:20','india');
/*!40000 ALTER TABLE `management` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mentors`
--

DROP TABLE IF EXISTS `mentors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mentors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `bio` text,
  `image` varchar(255) DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `last_modified_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentors`
--

LOCK TABLES `mentors` WRITE;
/*!40000 ALTER TABLE `mentors` DISABLE KEYS */;
INSERT INTO `mentors` VALUES (11,'Radhakrishnan Pillai','Academician & Author',NULL,NULL,'{}',NULL,'2025-09-24 12:29:34','2025-09-24 12:29:34','2025-11-11 04:40:19','india'),(12,'Ankush Tiwari','Founder Pi Lab','null','1758869168556-824824939.webp','{}',NULL,'2025-09-24 12:29:49','2025-09-26 06:46:08','2025-11-11 04:40:19','india'),(13,'Mrutunjay Singh','CEO',NULL,NULL,'{}',NULL,'2025-09-24 12:30:04','2025-09-24 12:30:04','2025-11-11 04:40:19','india'),(20,'shri','shri',NULL,'1771670526354-214697947.jpg','{}',NULL,'2026-02-21 10:42:06','2026-02-21 10:42:06','2026-02-21 10:42:06','global');
/*!40000 ALTER TABLE `mentors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletters`
--

DROP TABLE IF EXISTS `newsletters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `file_path` varchar(500) DEFAULT NULL,
  `published_date` date NOT NULL,
  `is_published` tinyint(1) DEFAULT '1',
  `last_modified_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletters`
--

LOCK TABLES `newsletters` WRITE;
/*!40000 ALTER TABLE `newsletters` DISABLE KEYS */;
INSERT INTO `newsletters` VALUES (1,'Test','Test','1756406533363-543581198.pdf','2025-11-11',1,NULL,'2025-08-28 18:42:13','2025-09-01 17:58:40','2025-11-11 04:41:23','india'),(3,'s','df','1757054940819-569986157.pdf','2025-09-05',1,NULL,'2025-09-05 06:49:00','2025-09-05 06:49:51','2025-11-11 04:41:23','india'),(4,'a','s','1757059700097-331451000.pdf','2025-09-05',1,NULL,'2025-09-05 08:08:20','2025-09-05 08:08:24','2025-11-11 04:41:23','india'),(5,'vb','vvb','1757059720358-956918620.pdf','2025-09-05',1,NULL,'2025-09-05 08:08:40','2025-09-05 08:08:44','2025-11-11 04:41:23','india'),(6,'sdaffewfrwe','dafwedfrew','1758795609179-141007189.pdf','2025-09-25',1,NULL,'2025-09-25 10:20:09','2025-09-25 10:20:11','2025-11-11 04:41:23','india'),(7,'saddSA','asdfsda','1758883356578-312356693.pdf','2025-09-26',1,NULL,'2025-09-26 10:42:36','2025-09-26 10:42:36','2025-11-11 04:41:23','india'),(8,'fsdggfsdd','fdgbfsdg','1758883453485-970576568.pdf','2025-09-26',1,NULL,'2025-09-26 10:44:13','2025-09-26 10:44:13','2025-11-11 04:41:23','india'),(13,'asdf','asd','1762847889742-475903796.pdf','2025-11-11',1,8,'2025-11-11 07:58:09','2025-11-11 07:58:09','2025-11-11 07:58:09','india'),(14,'sdfrxf','zxfc','1762859898315-805383333.pdf','2025-11-11',1,1,'2025-11-11 11:18:18','2025-11-11 11:18:18','2025-11-11 11:18:18','india'),(19,'Global Test Newsletter','Test','1771661223239-947395889.pdf','2026-02-21',1,1,'2026-02-21 08:07:03','2026-02-21 08:07:03','2026-02-21 08:07:03','global'),(20,'asd','sdf','1771664471924-268266981.pdf','2026-02-21',1,1,'2026-02-21 09:01:11','2026-02-21 09:01:11','2026-02-21 09:01:11','global'),(21,'global','global','1771665109716-932468980.pdf','2026-02-21',1,1,'2026-02-21 09:11:49','2026-02-21 09:11:49','2026-02-21 09:11:49','global'),(22,'shri','hkasfdhkasfd','1771665448686-829766544.pdf','2026-02-21',1,1,'2026-02-21 09:17:28','2026-02-21 09:17:28','2026-02-21 09:17:28','global'),(23,'Shri','shri','1773406218983-592702984.pdf','2026-03-13',1,1,'2026-03-13 12:50:19','2026-03-13 12:50:19','2026-03-13 12:50:19','india');
/*!40000 ALTER TABLE `newsletters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'New Registration Request','New registration request from Varad Test (test@gmail.com)','warning',0,'2025-08-29 14:09:15'),(2,2,'Account Approved','Your account has been approved by administrator. You can now login.','success',0,'2025-08-29 14:09:52'),(3,1,'New Registration Request','New registration request from Test111 (test111@gmail.com)','warning',0,'2025-08-30 09:10:23'),(4,1,'New Registration Request','New registration request from Varad (varad@syntiaro.com)','warning',0,'2025-09-01 08:47:14'),(6,1,'New Registration Request','New registration request from Testttt (tet@t.c)','warning',0,'2025-09-01 08:49:59'),(8,1,'New Registration Request','New registration request from shri (shri@gmail.com)','warning',0,'2025-09-01 09:12:46'),(10,1,'New Registration Request','New registration request from Arjun (arjun@test.com)','warning',0,'2025-09-01 18:00:45'),(11,7,'Account Approved','Your account has been approved by administrator. You can now login.','success',0,'2025-09-01 18:01:20'),(12,1,'New Registration Request','New registration request from shree (shriw87@gmail.com)','warning',0,'2025-11-10 07:46:26'),(14,1,'New Registration Request','New registration request from s (shrinivas@gmail.com)','warning',0,'2025-11-13 07:19:30'),(16,1,'New Registration Request','New registration request from Waghmare S (waghmareshrinivas99@gmail.com)','warning',0,'2025-12-03 12:59:09');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `our_work_items`
--

DROP TABLE IF EXISTS `our_work_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `our_work_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_category` enum('quality_education','livelihood','healthcare','environment_sustainability','integrated_development') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `content` longtext,
  `image_url` varchar(500) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `additional_images` json DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `meta_keywords` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `section_category` (`section_category`,`is_active`,`display_order`),
  CONSTRAINT `our_work_items_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `our_work_items_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `our_work_items`
--

LOCK TABLES `our_work_items` WRITE;
/*!40000 ALTER TABLE `our_work_items` DISABLE KEYS */;
INSERT INTO `our_work_items` VALUES (1,'quality_education','School Development Program','Building and renovating schools in rural areas','Detailed content about school development...',NULL,NULL,NULL,NULL,NULL,NULL,1,1,NULL,NULL,'2025-08-30 11:24:11','2025-08-30 11:24:11','india'),(2,'quality_education','Digital Literacy Initiative','Teaching digital skills to underprivileged children','Content about digital literacy program...',NULL,NULL,NULL,NULL,NULL,NULL,1,2,NULL,NULL,'2025-08-30 11:24:11','2025-08-30 11:24:11','india'),(3,'livelihood','Vocational Training Center','Skill development for unemployed youth','Content about vocational training...',NULL,NULL,NULL,NULL,NULL,NULL,1,1,NULL,NULL,'2025-08-30 11:24:11','2025-08-30 11:24:11','india'),(4,'livelihood','Micro-Enterprise Support','Funding and mentoring for small businesses','Content about micro-enterprise support...',NULL,NULL,NULL,NULL,NULL,NULL,1,2,NULL,NULL,'2025-08-30 11:24:11','2025-08-30 11:24:11','india'),(5,'healthcare','Mobile Health Clinic','Healthcare services in remote villages','Content about mobile health clinics...',NULL,NULL,NULL,NULL,NULL,NULL,1,1,NULL,NULL,'2025-08-30 11:24:11','2025-08-30 11:24:11','india'),(6,'healthcare','Maternal Health Program','Support for pregnant women and new mothers','Content about maternal health...',NULL,NULL,NULL,NULL,NULL,NULL,1,2,NULL,NULL,'2025-08-30 11:24:11','2025-08-30 11:24:11','india'),(7,'environment_sustainability','Tree Plantation Drive','Afforestation and environmental conservation','Content about tree plantation...',NULL,NULL,NULL,NULL,NULL,NULL,1,1,NULL,NULL,'2025-08-30 11:24:11','2025-08-30 11:24:11','india'),(8,'environment_sustainability','Waste Management Initiative','Recycling and waste reduction programs','Content about waste management...',NULL,NULL,NULL,NULL,NULL,NULL,1,2,NULL,NULL,'2025-08-30 11:24:11','2025-08-30 11:24:11','india'),(9,'integrated_development','Community Development Program','Holistic development of rural communities','Content about community development...',NULL,NULL,NULL,NULL,NULL,NULL,1,1,NULL,NULL,'2025-08-30 11:24:11','2025-08-30 11:24:11','india'),(10,'integrated_development','Disaster Relief Operations','Emergency response and rehabilitation','Content about disaster relief...',NULL,NULL,NULL,NULL,NULL,NULL,1,2,NULL,NULL,'2025-08-30 11:24:11','2025-08-30 11:24:11','india');
/*!40000 ALTER TABLE `our_work_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `our_work_sections`
--

DROP TABLE IF EXISTS `our_work_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `our_work_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` enum('quality_education','livelihood','healthcare','environment_sustainability','integrated_development') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `content` longtext,
  `image_url` varchar(500) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `additional_images` json DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `meta_keywords` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `our_work_sections_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `our_work_sections_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `our_work_sections`
--

LOCK TABLES `our_work_sections` WRITE;
/*!40000 ALTER TABLE `our_work_sections` DISABLE KEYS */;
INSERT INTO `our_work_sections` VALUES (1,'quality_education','Quality Education','Providing quality education for all',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2025-08-30 09:42:46','2025-08-30 09:42:46','india'),(2,'livelihood','Livelihood','Creating sustainable livelihood opportunities',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2025-08-30 09:42:46','2025-08-30 09:42:46','india'),(3,'healthcare','Healthcare','Improving healthcare access and quality',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2025-08-30 09:42:46','2025-08-30 09:42:46','india'),(4,'environment_sustainability','Environment Sustainability','Promoting environmental conservation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2025-08-30 09:42:46','2025-08-30 09:42:46','india'),(5,'integrated_development','Integrated Development Program (IDP)','Comprehensive development programs',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2025-08-30 09:42:46','2025-08-30 09:42:46','india');
/*!40000 ALTER TABLE `our_work_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `reset_token` varchar(255) NOT NULL,
  `token_expiry` datetime NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_token` (`user_id`,`reset_token`),
  KEY `idx_expiry` (`token_expiry`),
  CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quality_education`
--

DROP TABLE IF EXISTS `quality_education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quality_education` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `content` longtext,
  `image_url` varchar(500) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `additional_images` json DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `meta_keywords` text,
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '0',
  `last_modified_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quality_education`
--

LOCK TABLES `quality_education` WRITE;
/*!40000 ALTER TABLE `quality_education` DISABLE KEYS */;
INSERT INTO `quality_education` VALUES (8,'fsdggbfdh','dfgvhtesh','fdghtrsgdhy','/uploads/our-work/quality_education/1758804580914-70200590.webp','https://youtu.be/nt5tXl9Vtug?si=DNXBKxWNobDeaF_s','[\"https://cdn-imgix.headout.com/tour/7064/TOUR-IMAGE/b2c74200-8da7-439a-95b6-9cad1aa18742-4445-dubai-img-worlds-of-adventure-tickets-02.jpeg?auto=format&w=900&h=562.5&q=90&ar=16%3A10&crop=faces%2Ccenter&fit=crop\", \"https://cdn-imgix.headout.com/tour/7064/TOUR-IMAGE/b2c74200-8da7-439a-95b6-9cad1aa18742-4445-dubai-img-worlds-of-adventure-tickets-02.jpeg?auto=format&w=900&h=562.5&q=90&ar=16%3A10&crop=faces%2Ccenter&fit=crop\"]','','','',1,1,NULL,'2025-09-25 12:49:40','2025-09-26 06:36:40','2025-11-11 04:41:32','india'),(9,'test','test','test','/uploads/our-work/quality_education/1758868396747-153030962.webp','','[]','','','',1,0,NULL,'2025-09-26 06:33:16','2025-09-26 11:52:36','2025-11-11 04:41:32','india'),(10,'sdfds','zsdfgg','szdfgsd','/uploads/our-work/quality_education/1760093859667-19335259.jpeg','https://youtu.be/CY48leb3bFk?si=Tt63bXEEQTF1fzt3','[]','','','',1,0,NULL,'2025-10-10 10:57:39','2025-10-10 10:57:39','2025-11-11 04:41:32','india'),(11,'fghhwer','fghxfdgsfdg','fgxchdsfdasdf','/uploads/our-work/quality_education/1760094139898-241247822.jpeg','https://youtu.be/CY48leb3bFk?si=Tt63bXEEQTF1fzt3','[]','','','',1,0,NULL,'2025-10-10 11:02:19','2025-11-10 10:45:32','2025-11-11 04:41:32','india'),(16,'sdfgfsd','szdfg','zsfdg','/uploads/our-work/quality_education/1762847543531-869288855.png','https://youtu.be/GxlMRrjrUFM?si=BA3nHRRjtxiuZDUi','[]','','','',1,0,1,'2025-11-11 07:52:23','2025-11-11 07:52:23','2025-11-11 07:52:23','india'),(17,'sdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','sdaf','sdfg','/uploads/our-work/quality_education/1762847774988-233402582.png','','[]','','','',1,0,1,'2025-11-11 07:56:14','2025-12-04 07:01:11','2025-12-04 07:01:11','india'),(18,'shri','shriaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','shri','/uploads/our-work/quality_education/1762848011278-199061208.png','','[]','','','',1,0,1,'2025-11-11 08:00:11','2025-11-26 12:48:05','2025-11-26 12:48:05','india'),(22,'global','global','global','/uploads/our-work/quality_education/1771661785063-330343883.jpg','','[]','','','',1,0,1,'2026-02-21 08:16:25','2026-02-21 08:16:25','2026-02-21 08:16:25','global'),(23,'india','india','adsad','/uploads/our-work/quality_education/1771663957661-407436195.jpg','','[]','','','',1,0,1,'2026-02-21 08:52:37','2026-02-21 08:52:37','2026-02-21 08:52:37','india');
/*!40000 ALTER TABLE `quality_education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registration_requests`
--

DROP TABLE IF EXISTS `registration_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registration_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile_number` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registration_requests`
--

LOCK TABLES `registration_requests` WRITE;
/*!40000 ALTER TABLE `registration_requests` DISABLE KEYS */;
INSERT INTO `registration_requests` VALUES (1,'Varad Test','test@gmail.com','9876543211','Pune','','approved','2025-08-29 14:09:15','2025-08-29 14:09:52'),(2,'Test111','test111@gmail.com','1234567890','Test111','','rejected','2025-08-30 09:10:23','2025-08-30 09:10:37'),(3,'Varad','varad@syntiaro.com','9881949635','VArad','','approved','2025-09-01 08:47:14','2025-09-01 08:47:43'),(5,'Testttt','tet@t.c','00000000000000000000','Vard','','approved','2025-09-01 08:49:59','2025-09-01 08:53:38'),(6,'shri','shri@gmail.com','9876543211','Shri\n','','approved','2025-09-01 09:12:46','2025-09-01 09:13:38'),(7,'Arjun','arjun@test.com','9876543211','Test','','approved','2025-09-01 18:00:45','2025-09-01 18:01:20'),(8,'shree','shriw87@gmail.com','7887917686','hoiiiiii','$2b$10$rHlx7G/jUEgDHCT0JAiBBuVclPgxnUUFoPECEXRGOnmVO5n9138y2','approved','2025-11-10 07:46:26','2025-11-10 07:47:27'),(9,'s','shrinivas@gmail.com','474254','at. post gortha dist. nanded, maharashtra','$2b$10$hu99QQ0N1EfQ.iYMD0ybMucx0zEEa6sl4yIPqGoPUTw9xPPnjBq3S','approved','2025-11-13 07:19:29','2025-11-13 07:21:01'),(10,'Waghmare S','waghmareshrinivas99@gmail.com','09764146195','at. post gortha dist. nanded, maharashtra','$2b$10$1U3RDyeT/UGnndhFryWgOOj4mIPbBoSbTO4XF4oF0v/5dj3ARa9ja','pending','2025-12-03 12:59:09','2025-12-03 12:59:09');
/*!40000 ALTER TABLE `registration_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `content` text,
  `last_modified_by` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `pdf` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  `is_published` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (9,'shri','sfgfesg','sdcf',NULL,'image-1758785487298.webp','pdf-1758785487300.pdf','2025-09-25 07:31:27','2025-09-25 07:31:27','2025-11-11 04:40:05','india',1),(12,'sdf','sdf','sdf',8,'image-1762860318863.png','pdf-1762860318868.pdf','2025-11-11 11:25:18','2025-11-11 11:25:18','2025-11-11 11:25:18','india',1),(13,'zsdfsdf','sdafsdafwsda','asdfsdafsdaf',8,'image-1762860354464.png','pdf-1762860354465.pdf','2025-11-11 11:25:54','2025-11-11 11:25:54','2025-11-11 11:25:54','india',1),(14,'sssssssssssssss','sssssssssssss','sssssssssssssss',1,'image-1763009568166.png','pdf-1763009568167.pdf','2025-11-13 04:52:48','2025-11-13 04:52:48','2025-11-13 04:52:48','india',1),(17,'shri','shri','shri',1,'image-1771671444317-893161957.jpg','pdf-1771671444324-685906583.pdf','2026-02-21 10:57:24','2026-02-21 10:57:24','2026-02-21 10:57:24','global',1);
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stories`
--

DROP TABLE IF EXISTS `stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `description` text,
  `image` varchar(500) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `published_date` date NOT NULL,
  `is_published` tinyint(1) DEFAULT '1',
  `last_modified_by` int DEFAULT NULL,
  `last_modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `region` varchar(20) DEFAULT 'india',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stories`
--

LOCK TABLES `stories` WRITE;
/*!40000 ALTER TABLE `stories` DISABLE KEYS */;
INSERT INTO `stories` VALUES (5,'hiuaSHSIUA','KJAFHJUDFJDKJFKJSDFASDKJIFKJBKJDkjjdkjkkjbkjifkjdkfbkjdsbvckjsdvckjds',NULL,'1758361385114-976283995.jpg','ter','2025-09-20',1,NULL,'2025-11-11 04:50:42','2025-09-20 09:43:05','2025-09-20 09:44:36','india'),(7,'sanu','fsagf',NULL,'1758785252234-851164353.webp','fge','2025-09-25',1,NULL,'2025-11-11 04:50:42','2025-09-25 07:27:32','2025-09-25 07:27:35','india'),(8,'xsdf','dzf',NULL,'1764156626552-558494056.png','Anonymous','2025-11-26',1,1,'2025-11-26 11:30:26','2025-11-26 11:30:26','2025-11-26 11:30:26','india'),(9,'zsdfx','xzfdg',NULL,'1764159414972-817998306.png','Anonymous','2025-11-26',1,1,'2025-11-26 12:16:54','2025-11-26 12:16:54','2025-11-26 12:16:54','india'),(10,'xdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','fzsxgaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',NULL,NULL,'Anonymous','2025-11-26',1,1,'2025-11-26 13:10:31','2025-11-26 12:19:25','2025-11-26 13:10:31','india'),(14,'sadf','dsaf',NULL,'1771665477514-269387423.jpg','Anonymous','2026-02-21',1,1,'2026-02-21 09:17:57','2026-02-21 09:17:57','2026-02-21 09:17:57','global'),(15,'kjadfj','jkasdfiasdbfk',NULL,'1773411341738-694327031.jpg','Anonymous','2026-03-13',1,1,'2026-03-13 14:15:41','2026-03-13 14:15:41','2026-03-13 14:15:41','global');
/*!40000 ALTER TABLE `stories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `section` varchar(100) NOT NULL,
  `sub_section` varchar(100) DEFAULT NULL,
  `can_view` tinyint(1) DEFAULT '0',
  `can_create` tinyint(1) DEFAULT '0',
  `can_edit` tinyint(1) DEFAULT '0',
  `can_delete` tinyint(1) DEFAULT '0',
  `can_publish` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_section` (`user_id`,`section`,`sub_section`),
  CONSTRAINT `fk_user_permissions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=675 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
INSERT INTO `user_permissions` VALUES (674,7,'interventions',NULL,1,1,1,1,0,'2026-02-21 11:06:23','2026-02-21 11:06:23');
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `address` text,
  `password` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','editor','viewer') DEFAULT 'viewer',
  `status` enum('pending','approved','rejected','suspended') DEFAULT 'pending',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expire` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4  ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@y4d.org',NULL,NULL,'$2b$10$ZKj0ZesIVyV5K/UmfLpeCuYCGv7CAhXnZpNnTE.hUaIP2b8Z2PF1y','super_admin','approved',NULL,'2025-08-25 07:00:06','2026-02-21 08:00:59',NULL,NULL),(2,'test','test@gmail.com','9876543211','Pune','$2b$10$9IXYPm1D7ey8CAZSJxfDXO3ZkvDX0U0VuMWG8zAuIa.hpT7/yt2Bi','editor','approved',NULL,'2025-08-29 14:09:52','2025-09-01 08:57:21',NULL,NULL),(7,'arjun','arjun@test.com','9876543211','Test','$2b$10$pYmOQFbiO5GbX45a4JM9K.4HoDKukDc4iIakqeBMcWsG6uXodxqGO','editor','approved',NULL,'2025-09-01 18:01:20','2025-09-01 18:01:20',NULL,NULL),(10,'shri','shri@gmail.com','09764146195','at. post gortha dist. nanded, maharashtra','$2b$10$TIm/h0oKn3cp7AlcYPOYl.CnMIA62sSHoqPRbWe1.mpKBs9Z0Ua8K','admin','approved',1,'2026-03-13 12:43:52','2026-03-13 12:43:52',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-21 14:39:04
