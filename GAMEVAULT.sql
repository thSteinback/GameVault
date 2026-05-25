-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: gamevault
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administradores`
--

DROP TABLE IF EXISTS `administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `administradores` (
  `ADM_COD` int(11) NOT NULL AUTO_INCREMENT,
  `ADM_NOME` varchar(50) NOT NULL,
  `ADM_EMAIL` varchar(100) NOT NULL,
  `ADM_SENHA` varchar(255) NOT NULL,
  `ADM_DATA_CRIACAO` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`ADM_COD`),
  UNIQUE KEY `ADM_EMAIL` (`ADM_EMAIL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administradores`
--

LOCK TABLES `administradores` WRITE;
/*!40000 ALTER TABLE `administradores` DISABLE KEYS */;
/*!40000 ALTER TABLE `administradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avaliacoes`
--

DROP TABLE IF EXISTS `avaliacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `avaliacoes` (
  `AVL_COD` int(11) NOT NULL AUTO_INCREMENT,
  `USU_COD` int(11) DEFAULT NULL,
  `JOG_COD` int(11) DEFAULT NULL,
  `AVL_NOTA` int(11) DEFAULT NULL CHECK (`AVL_NOTA` between 1 and 10),
  `AVL_TEXTO` text DEFAULT NULL,
  `AVL_DATA` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`AVL_COD`),
  KEY `USU_COD` (`USU_COD`),
  KEY `JOG_COD` (`JOG_COD`),
  CONSTRAINT `avaliacoes_ibfk_1` FOREIGN KEY (`USU_COD`) REFERENCES `usuarios` (`USU_COD`) ON DELETE CASCADE,
  CONSTRAINT `avaliacoes_ibfk_2` FOREIGN KEY (`JOG_COD`) REFERENCES `jogos` (`JOG_COD`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacoes`
--

LOCK TABLES `avaliacoes` WRITE;
/*!40000 ALTER TABLE `avaliacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `avaliacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias` (
  `CAT_COD` int(11) NOT NULL AUTO_INCREMENT,
  `CAT_NOME` varchar(50) NOT NULL,
  PRIMARY KEY (`CAT_COD`),
  UNIQUE KEY `CAT_NOME` (`CAT_NOME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comentarios` (
  `COM_COD` int(11) NOT NULL AUTO_INCREMENT,
  `USU_COD` int(11) DEFAULT NULL,
  `JOG_COD` int(11) DEFAULT NULL,
  `COM_TEXTO` text DEFAULT NULL,
  `COM_DATA` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`COM_COD`),
  KEY `USU_COD` (`USU_COD`),
  KEY `JOG_COD` (`JOG_COD`),
  CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`USU_COD`) REFERENCES `usuarios` (`USU_COD`) ON DELETE CASCADE,
  CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`JOG_COD`) REFERENCES `jogos` (`JOG_COD`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarios`
--

LOCK TABLES `comentarios` WRITE;
/*!40000 ALTER TABLE `comentarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `comentarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favoritos` (
  `USU_COD` int(11) NOT NULL,
  `JOG_COD` int(11) NOT NULL,
  PRIMARY KEY (`USU_COD`,`JOG_COD`),
  KEY `JOG_COD` (`JOG_COD`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`USU_COD`) REFERENCES `usuarios` (`USU_COD`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`JOG_COD`) REFERENCES `jogos` (`JOG_COD`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jogos`
--

DROP TABLE IF EXISTS `jogos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jogos` (
  `JOG_COD` int(11) NOT NULL AUTO_INCREMENT,
  `JOG_NOME` varchar(100) NOT NULL,
  `JOG_DESC` text DEFAULT NULL,
  `JOG_IMG` varchar(255) DEFAULT NULL,
  `JOG_DATA_CADASTRO` datetime DEFAULT current_timestamp(),
  `JOG_ATIVO` tinyint(4) DEFAULT 1,
  `JOG_DATA_ATUALIZACAO` datetime DEFAULT NULL,
  PRIMARY KEY (`JOG_COD`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jogos`
--

LOCK TABLES `jogos` WRITE;
/*!40000 ALTER TABLE `jogos` DISABLE KEYS */;
/*!40000 ALTER TABLE `jogos` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_jogos_update_data
BEFORE UPDATE ON jogos
FOR EACH ROW
BEGIN
SET NEW.JOG_DATA_ATUALIZACAO = NOW();
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `jogoscategorias`
--

DROP TABLE IF EXISTS `jogoscategorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jogoscategorias` (
  `JOG_COD` int(11) NOT NULL,
  `CAT_COD` int(11) NOT NULL,
  PRIMARY KEY (`JOG_COD`,`CAT_COD`),
  KEY `CAT_COD` (`CAT_COD`),
  CONSTRAINT `jogoscategorias_ibfk_1` FOREIGN KEY (`JOG_COD`) REFERENCES `jogos` (`JOG_COD`) ON DELETE CASCADE,
  CONSTRAINT `jogoscategorias_ibfk_2` FOREIGN KEY (`CAT_COD`) REFERENCES `categorias` (`CAT_COD`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jogoscategorias`
--

LOCK TABLES `jogoscategorias` WRITE;
/*!40000 ALTER TABLE `jogoscategorias` DISABLE KEYS */;
/*!40000 ALTER TABLE `jogoscategorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logsacoes`
--

DROP TABLE IF EXISTS `logsacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logsacoes` (
  `LOG_COD` int(11) NOT NULL AUTO_INCREMENT,
  `ADM_COD` int(11) DEFAULT NULL,
  `USU_COD` int(11) DEFAULT NULL,
  `LOG_ACAO` varchar(255) DEFAULT NULL,
  `LOG_DATA` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`LOG_COD`),
  KEY `ADM_COD` (`ADM_COD`),
  KEY `USU_COD` (`USU_COD`),
  CONSTRAINT `logsacoes_ibfk_1` FOREIGN KEY (`ADM_COD`) REFERENCES `administradores` (`ADM_COD`),
  CONSTRAINT `logsacoes_ibfk_2` FOREIGN KEY (`USU_COD`) REFERENCES `usuarios` (`USU_COD`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logsacoes`
--

LOCK TABLES `logsacoes` WRITE;
/*!40000 ALTER TABLE `logsacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `logsacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissoesusuarios`
--

DROP TABLE IF EXISTS `permissoesusuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissoesusuarios` (
  `USU_COD` int(11) NOT NULL,
  `PERM_BANIDO` tinyint(4) DEFAULT 0,
  `PERM_AVALIAR` tinyint(4) DEFAULT 1,
  `PERM_COMENTAR` tinyint(4) DEFAULT 1,
  `PERM_DATA_ATUALIZACAO` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`USU_COD`),
  CONSTRAINT `permissoesusuarios_ibfk_1` FOREIGN KEY (`USU_COD`) REFERENCES `usuarios` (`USU_COD`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissoesusuarios`
--

LOCK TABLES `permissoesusuarios` WRITE;
/*!40000 ALTER TABLE `permissoesusuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissoesusuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `USU_COD` int(11) NOT NULL AUTO_INCREMENT,
  `USU_NOME` varchar(50) NOT NULL,
  `USU_EMAIL` varchar(100) NOT NULL,
  `USU_SENHA` varchar(255) NOT NULL,
  `USU_AVATAR` varchar(255) DEFAULT NULL,
  `USU_BANNER` varchar(255) DEFAULT NULL,
  `USU_DATA_CRIACAO` datetime DEFAULT current_timestamp(),
  `USU_BG` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`USU_COD`),
  UNIQUE KEY `USU_NOME` (`USU_NOME`),
  UNIQUE KEY `USU_EMAIL` (`USU_EMAIL`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Stein','thomas@gmail.com','$2b$10$.4OUW12muez.vbjAsQ0go.z6HZs4UiaWdJPNVNkGjw.DGwY28LsYq','1748189095220.png','1749294769081.jpg','2025-05-24 23:41:00',NULL),(2,'Barp','bianca@gmail.com','$2b$10$wJf//EMwI9gziA0lj8/MM.NcOadNoloZ3CcU/PidUyo1Ij6ADuZ4i','1748183577427.jpg',NULL,'2025-05-24 23:48:38',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `vw_jogos_categorias`
--

DROP TABLE IF EXISTS `vw_jogos_categorias`;
/*!50001 DROP VIEW IF EXISTS `vw_jogos_categorias`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `vw_jogos_categorias` AS SELECT
 1 AS `JOG_COD`,
  1 AS `JOG_NOME`,
  1 AS `JOG_DESC`,
  1 AS `JOG_ATIVO`,
  1 AS `CAT_NOME` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `vw_usuarios_avaliacoes`
--

DROP TABLE IF EXISTS `vw_usuarios_avaliacoes`;
/*!50001 DROP VIEW IF EXISTS `vw_usuarios_avaliacoes`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `vw_usuarios_avaliacoes` AS SELECT
 1 AS `USU_COD`,
  1 AS `USU_NOME`,
  1 AS `TOTAL_AVALIACOES` */;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_jogos_categorias`
--

/*!50001 DROP VIEW IF EXISTS `vw_jogos_categorias`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_jogos_categorias` AS select `j`.`JOG_COD` AS `JOG_COD`,`j`.`JOG_NOME` AS `JOG_NOME`,`j`.`JOG_DESC` AS `JOG_DESC`,`j`.`JOG_ATIVO` AS `JOG_ATIVO`,`c`.`CAT_NOME` AS `CAT_NOME` from ((`jogos` `j` join `jogoscategorias` `jc` on(`j`.`JOG_COD` = `jc`.`JOG_COD`)) join `categorias` `c` on(`jc`.`CAT_COD` = `c`.`CAT_COD`)) where `j`.`JOG_ATIVO` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_usuarios_avaliacoes`
--

/*!50001 DROP VIEW IF EXISTS `vw_usuarios_avaliacoes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_usuarios_avaliacoes` AS select `u`.`USU_COD` AS `USU_COD`,`u`.`USU_NOME` AS `USU_NOME`,count(`a`.`AVL_COD`) AS `TOTAL_AVALIACOES` from (`usuarios` `u` left join `avaliacoes` `a` on(`u`.`USU_COD` = `a`.`USU_COD`)) group by `u`.`USU_COD` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-25 12:05:16
