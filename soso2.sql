CREATE DATABASE  IF NOT EXISTS `soso` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `soso`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 34.158.197.202    Database: soso
-- ------------------------------------------------------
-- Server version	5.5.5-10.11.14-MariaDB-0+deb12u2

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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `account_seq` bigint(20) NOT NULL AUTO_INCREMENT,
  `store_seq` bigint(20) NOT NULL,
  `bank_name` varchar(50) NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `account_name` varchar(50) NOT NULL,
  `billing_key` varchar(255) DEFAULT NULL,
  `is_active` char(1) DEFAULT 'Y',
  `created_at` datetime DEFAULT current_timestamp(),
  `test_balance` int(11) DEFAULT 1000000,
  PRIMARY KEY (`account_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `auto_payment_schedule`
--

DROP TABLE IF EXISTS `auto_payment_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auto_payment_schedule` (
  `schedule_seq` bigint(20) NOT NULL AUTO_INCREMENT,
  `store_seq` bigint(20) NOT NULL,
  `partner_seq` bigint(20) NOT NULL,
  `account_seq` bigint(20) NOT NULL,
  `payment_day` int(11) NOT NULL,
  `is_active` char(1) DEFAULT 'Y',
  `start_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`schedule_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `boards`
--

DROP TABLE IF EXISTS `boards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boards` (
  `board_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '게시글 고유 번호 PK',
  `user_seq` int(11) NOT NULL COMMENT '작성자 user_id',
  `board_type` enum('HR','TIP','QNA','CS','NOTICE') NOT NULL COMMENT '게시판 종류 구분',
  `cs_type` enum('PAY','SERVICE','ACCOUNT','BUG') DEFAULT NULL COMMENT 'CS 문의 세부 유형 (결제/서비스/계정/오류)',
  `title` varchar(200) NOT NULL COMMENT '글 제목',
  `content` text NOT NULL COMMENT '글 내용',
  `views` int(11) DEFAULT 0 COMMENT '조회수',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '작성일수',
  PRIMARY KEY (`board_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_seq` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL,
  PRIMARY KEY (`category_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chat_logs`
--

DROP TABLE IF EXISTS `chat_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_logs` (
  `chat_seq` int(11) NOT NULL COMMENT '채팅 메시지 고유 번호 PK',
  `user_seq` int(11) NOT NULL COMMENT '대화에 참여 중인 사용자 ID',
  `room_seq` varchar(50) DEFAULT NULL COMMENT '어떤 채팅방인지 구분하기 위한 룸 아이디',
  `message` text NOT NULL COMMENT '주고받은 메시지 내용',
  `sender_type` enum('USER','BOT','SYSTEM') NOT NULL COMMENT '보낸 주체 (일반유저, 챗봇AI, 시스템알림)',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '메시지 전송 일시',
  PRIMARY KEY (`chat_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `employee_seq` int(11) NOT NULL COMMENT '직원 고유 번호 (PK)',
  `business_seq` int(11) NOT NULL COMMENT '어느 가게 소속인지 구분용 (User연동)',
  `emp_name` varchar(50) NOT NULL COMMENT '직원 이름',
  `phone` varchar(20) DEFAULT NULL COMMENT '직원 연락처',
  `work_start_time` time DEFAULT NULL COMMENT '출근 시간',
  `work_end_time` time DEFAULT NULL COMMENT '퇴근 시간',
  `status` enum('WORK','LEAVE','REST','정상근무') DEFAULT 'WORK' COMMENT '현재 근무 상태',
  PRIMARY KEY (`employee_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

CREATE TABLE `attendance_history` (
      `attendance_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '이력 PK',
      `employee_seq` int(11) NOT NULL COMMENT '직원 FK',
      `work_date` date NOT NULL COMMENT '근무 일자 (YYYY-MM-DD)',
      `actual_start_time` time DEFAULT NULL COMMENT '실제 출근 시각',
      `actual_end_time` time DEFAULT NULL COMMENT '실제 퇴근 시각',
      `attendance_status` enum('정상','지각','조퇴','결근','휴가') DEFAULT '정상',
      `memo` varchar(255) DEFAULT NULL COMMENT '지각 조퇴 사유 등',
      `created_at` timestamp DEFAULT current_timestamp(),
      PRIMARY KEY (`attendance_seq`),
      FOREIGN KEY (`employee_seq`) REFERENCES `employees` (`employee_seq`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `expense_category`
--

DROP TABLE IF EXISTS `expense_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense_category` (
  `category_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '비용 카테고리 고유번호',
  `category_name` varchar(50) NOT NULL COMMENT '비용 카테고리명 예: 식자재비, 임대료',
  `color` varchar(30) DEFAULT NULL COMMENT '화면 표시용 색상값 예: emerald, blue',
  `sort_order` int(11) DEFAULT NULL COMMENT '카테고리 화면 표시 순서',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT '등록일시',
  PRIMARY KEY (`category_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='비용 카테고리 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `expense_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '지출 내역 고유번호',
  `store_seq` int(11) NOT NULL COMMENT '매장 고유번호 FK',
  `category_seq` int(11) NOT NULL COMMENT '비용 카테고리 고유번호 FK',
  `expense_date` date NOT NULL COMMENT '지출 일자',
  `title` varchar(100) NOT NULL COMMENT '지출 내역 제목 예: 6월 임대료 납부',
  `amount` int(11) NOT NULL COMMENT '지출 금액',
  `memo` varchar(150) DEFAULT NULL COMMENT '지출 메모, 최대 150자',
  `payment_method` varchar(30) DEFAULT NULL COMMENT '결제 수단 예: card, transfer, cash',
  `supplier_name` varchar(100) DEFAULT NULL COMMENT '거래처명 또는 구입처명',
  `ref_type` varchar(30) DEFAULT NULL COMMENT '연결 유형 예: ORDER, GROUP_ORDER, DIRECT',
  `ref_seq` int(11) DEFAULT NULL COMMENT '연결된 원본 번호 예: 발주번호, 공동구매번호, 자동결제번호',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT '등록일시',
  PRIMARY KEY (`expense_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='지출 내역 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `files_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '파일 고유 번호',
  `user_seq` int(11) DEFAULT NULL COMMENT '파일을 올린 유저 ID',
  `board_seq` int(11) DEFAULT NULL COMMENT '게시판 연동용',
  `file_category` enum('STORE_IMAGE','BOARD_ATTACH','BUSINESS_LICENSE') DEFAULT NULL COMMENT '파일 카테고리',
  `oriname` varchar(100) DEFAULT NULL COMMENT '사용자가 올린 실제 파일명',
  `sysname` varchar(300) DEFAULT NULL COMMENT '서버 내부 고유 파일명',
  `file_size` bigint(20) DEFAULT NULL COMMENT '파일 사이즈',
  `file_type` varchar(50) DEFAULT NULL COMMENT '파일 확장자',
  PRIMARY KEY (`files_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finances`
--

DROP TABLE IF EXISTS `finances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finances` (
  `finance_seq` int(11) NOT NULL COMMENT '장부 기록 고유 번호',
  `user_seq` int(11) NOT NULL COMMENT '장부 주인 seq',
  `type` enum('INCOME','EXPENSE') NOT NULL COMMENT '매출, 지출 구분',
  `amount` int(11) NOT NULL COMMENT '거래 금액',
  `category` varchar(50) DEFAULT NULL COMMENT '비용 카테고리',
  `description` varchar(255) DEFAULT NULL COMMENT '거래 상세 내용',
  `target_date` date NOT NULL COMMENT '매출/지출 날짜',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '데이터 입력 일시',
  PRIMARY KEY (`finance_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group_buy_participants`
--

DROP TABLE IF EXISTS `group_buy_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_buy_participants` (
  `participant_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '참여 고유 번호 (PK)',
  `group_buy_seq` int(11) NOT NULL COMMENT '참여한 공동구매 그룹 번호 (FK)',
  `user_seq` int(11) NOT NULL COMMENT '참여한 사업자의 유저 고유번호 (FK)',
  `payment_status` enum('PENDING','COMPLETED','CANCELED') DEFAULT 'PENDING' COMMENT '결제 상태 (대기/완료/취소)',
  `delivery_status` enum('PENDING','DELIVERED') DEFAULT 'PENDING' COMMENT '개별 사업장 배송/픽업 수령 상태 (대기/완료)',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT '참여(신청) 일시',
  PRIMARY KEY (`participant_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='공동구매 참여자 및 결제/수령 상태 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group_buys`
--

DROP TABLE IF EXISTS `group_buys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_buys` (
  `group_buy_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '공동구매 고유 번호 (PK)',
  `user_seq` int(11) NOT NULL COMMENT '공구를 개설한 사람(사업자 또는 거래처)의 유저 고유번호',
  `item_seq` int(11) NOT NULL COMMENT '대상 품목 고유 번호',
  `group_name` varchar(150) NOT NULL COMMENT '그룹명 (예: 5월 한우 등심 공동 구매)',
  `description` text DEFAULT NULL COMMENT '그룹 소개 (참여자에게 안내할 내용)',
  `target_participants` int(11) NOT NULL COMMENT '모집 인원 (최소/최대 통일된 고정값)',
  `current_participants` int(11) DEFAULT 0 COMMENT '현재 참여 완료된 인원',
  `quantity` int(11) NOT NULL COMMENT '제공 수량 (예: 10kg 단위의 10)',
  `total_amount` int(11) NOT NULL COMMENT '총 결제 금액 (1인당 금액 대체)',
  `end_date` datetime NOT NULL COMMENT '모집 마감일',
  `delivery_method` varchar(50) DEFAULT NULL COMMENT '배송/픽업 방식 (예: 거래처 직배송, 직접 픽업 등)',
  `delivery_date` date DEFAULT NULL COMMENT '배송 예정일 또는 픽업 일자',
  `delivery_notice` text DEFAULT NULL COMMENT '배송/픽업 유의사항 (기존 픽업 주소 대체)',
  `status` enum('RECRUITING','PREPARING','SHIPPING','DELIVERED','CANCELED') DEFAULT 'RECRUITING' COMMENT '모집중, 발주/출하준비, 배송/픽업출발, 완료, 취소',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT '그룹 생성 일시',
  PRIMARY KEY (`group_buy_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='공동구매 그룹 마스터 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `item_seq` int(11) NOT NULL AUTO_INCREMENT,
  `user_seq` int(11) DEFAULT NULL,
  `category_seq` int(11) NOT NULL,
  `item_code` varchar(50) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `spec` varchar(100) DEFAULT NULL,
  `unit_price` int(11) DEFAULT 0,
  `item_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`item_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notification_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '알림 고유 번호',
  `user_seq` int(11) NOT NULL COMMENT '대상 사용자 번호',
  `store_seq` int(11) DEFAULT NULL COMMENT '매장 고유 번호',
  `store_name` varchar(100) DEFAULT NULL COMMENT '매장명',
  `type` varchar(20) NOT NULL COMMENT '알림 타입 (STOCK, EXPIRY, ORDER 등)',
  `title` varchar(200) NOT NULL COMMENT '알림 제목',
  `message` text NOT NULL COMMENT '알림 상세 내용',
  `is_read` tinyint(1) DEFAULT 0 COMMENT '읽음 상태 (0: 안읽음, 1: 읽음)',
  `created_at` datetime DEFAULT current_timestamp() COMMENT '생성 일시',
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_seq` int(11) NOT NULL AUTO_INCREMENT,
  `store_seq` int(11) NOT NULL,
  `type` varchar(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `is_read` char(1) DEFAULT 'N',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`notification_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `order_detail_seq` int(11) NOT NULL COMMENT '발주 상세 고유 번호PK',
  `order_seq` int(11) NOT NULL COMMENT '발주 번호',
  `item_seq` int(11) NOT NULL COMMENT '주문 한 품목 ID',
  `quantity` int(11) NOT NULL COMMENT '주문 수량',
  `price` int(11) NOT NULL COMMENT '주문 당시의 개당 단가',
  PRIMARY KEY (`order_detail_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '발주 품목 PK',
  `order_seq` int(11) NOT NULL COMMENT '발주번호 FK',
  `item_seq` int(11) DEFAULT NULL COMMENT '품목번호',
  `item_name` varchar(100) NOT NULL COMMENT '품목명',
  `category_name` varchar(50) DEFAULT NULL COMMENT '카테고리명',
  `quantity` int(11) NOT NULL COMMENT '수량',
  `spec` varchar(100) DEFAULT NULL COMMENT '규격',
  `unit_price` int(11) NOT NULL COMMENT '단가',
  `total_price` int(11) NOT NULL COMMENT '합계',
  PRIMARY KEY (`order_item_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_seq` int(11) NOT NULL AUTO_INCREMENT,
  `order_no` varchar(30) DEFAULT NULL,
  `zonecode` varchar(10) DEFAULT NULL COMMENT '우편번호',
  `address1` varchar(100) DEFAULT NULL COMMENT '기본주소',
  `address2` varchar(100) DEFAULT NULL COMMENT '상세주소',
  `order_memo` varchar(255) DEFAULT NULL COMMENT '배송 요청 사항',
  `buyer_seq` int(11) NOT NULL COMMENT '주문자의 user_id',
  `seller_seq` int(11) NOT NULL COMMENT '공급자의 user_id',
  `total_amount` int(11) DEFAULT 0 COMMENT '발주 총 금액',
  `status` enum('REQUESTED','ACCEPTED','PREPARING','SHIPPING','DELIVERED') NOT NULL DEFAULT 'REQUESTED',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '발주 일시',
  PRIMARY KEY (`order_seq`),
  UNIQUE KEY `order_no` (`order_no`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partner_payment_settings`
--

DROP TABLE IF EXISTS `partner_payment_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partner_payment_settings` (
  `setting_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '자동결제 설정 고유 번호',
  `store_seq` int(11) NOT NULL COMMENT '사업장 고유 번호 FK',
  `partner_seq` int(11) NOT NULL COMMENT '거래처 고유 번호 FK',
  `card_seq` int(11) NOT NULL COMMENT '자동결제에 사용할 카드 고유 번호 FK',
  `payment_day` int(11) NOT NULL COMMENT '매월 자동결제일 1~31',
  `auto_pay_yn` char(1) DEFAULT 'Y' COMMENT '자동결제 사용 여부 Y: 사용, N: 미사용',
  `is_active` char(1) DEFAULT 'Y' COMMENT '설정 사용 여부 Y: 사용, N: 삭제 또는 비활성화',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT '자동결제 설정 등록일',
  PRIMARY KEY (`setting_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partner_relations`
--

DROP TABLE IF EXISTS `partner_relations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partner_relations` (
  `relation_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '관계 고유 번호',
  `business_seq` int(11) NOT NULL COMMENT '소상공인 가게 ID',
  `partner_seq` int(11) NOT NULL COMMENT '등록된 거래처 ID',
  `memo` varchar(255) DEFAULT NULL COMMENT '해당 거래처에 대한 메모',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '등록된 날짜',
  PRIMARY KEY (`relation_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_cards`
--

DROP TABLE IF EXISTS `payment_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_cards` (
  `card_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '카드 고유 번호',
  `user_seq` int(11) DEFAULT NULL,
  `store_seq` int(11) NOT NULL COMMENT '카드가 연결된 사업장 고유 번호 FK',
  `billing_key` varchar(255) NOT NULL COMMENT '실제 자동 카드결제 요청 시 사용',
  `card_company` varchar(50) DEFAULT NULL COMMENT '카드사명',
  `card_number_masked` varchar(50) DEFAULT NULL COMMENT '마스킹된 카드번호',
  `card_type` varchar(30) DEFAULT NULL COMMENT '카드 유형 (CREDIT, CHECK)',
  `card_name` varchar(100) DEFAULT NULL COMMENT '사용자가 구분하기 위한 카드 별칭',
  `is_default` char(1) DEFAULT 'N' COMMENT '대표 카드 여부 Y: 대표 카드, N: 일반 카드',
  `is_active` char(1) DEFAULT 'Y' COMMENT '카드 사용 여부 Y: 사용, N: 삭제 또는 비활성화',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT '카드 등록일',
  PRIMARY KEY (`card_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_history`
--

DROP TABLE IF EXISTS `payment_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_history` (
  `history_seq` bigint(20) NOT NULL AUTO_INCREMENT,
  `store_seq` bigint(20) NOT NULL,
  `schedule_seq` bigint(20) NOT NULL,
  `account_seq` bigint(20) NOT NULL,
  `partner_seq` bigint(20) NOT NULL,
  `pg_tid` varchar(100) DEFAULT NULL,
  `requested_amount` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `result_code` varchar(50) DEFAULT NULL,
  `error_message` varchar(255) DEFAULT NULL,
  `requested_at` datetime DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`history_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_order_map`
--

DROP TABLE IF EXISTS `payment_order_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_order_map` (
  `map_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '결제-발주 연결 고유 번호',
  `payment_seq` int(11) NOT NULL COMMENT '결제 고유 번호 FK',
  `order_seq` int(11) NOT NULL COMMENT '발주 고유 번호 FK',
  `amount` int(11) NOT NULL COMMENT '해당 발주가 이번 결제에 포함된 금액',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT '연결 데이터 생성일',
  PRIMARY KEY (`map_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '결제 고유 번호',
  `store_seq` int(11) NOT NULL COMMENT '사업장 고유 번호 FK',
  `partner_seq` int(11) NOT NULL COMMENT '거래처 고유 번호 FK',
  `card_seq` int(11) NOT NULL COMMENT '결제에 사용된 카드 고유 번호 FK',
  `payment_id` varchar(100) NOT NULL COMMENT '포트원 결제 고유 ID. 결제 요청 시 생성해서 포트원에 전달',
  `total_amount` int(11) NOT NULL COMMENT '총 결제 금액. 해당 거래처의 미결제 발주 합계',
  `status` varchar(30) DEFAULT 'READY' COMMENT '결제 상태(READY, PAID, FAILED, CANCELED, REFUNDED)',
  `paid_at` timestamp NULL DEFAULT NULL COMMENT '결제 성공 시간',
  `failed_reason` varchar(255) DEFAULT NULL COMMENT '결제 실패 사유',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT '결제 내역 생성일',
  PRIMARY KEY (`payment_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reply`
--

DROP TABLE IF EXISTS `reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reply` (
  `comment_seq` int(11) NOT NULL COMMENT '댓글 고유 번호 PK',
  `board_seq` int(11) NOT NULL COMMENT '댓글이 달린 상위 게시글 ID',
  `user_seq` int(11) NOT NULL COMMENT '댓글 작성자 user_id',
  `comment` varchar(100) NOT NULL COMMENT '댓글 내용',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '댓글 작성 일시',
  `re_reply` varchar(100) DEFAULT NULL COMMENT '대댓글',
  PRIMARY KEY (`comment_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stock_batches`
--

DROP TABLE IF EXISTS `stock_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_batches` (
  `batch_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '재고 배치 고유 번호 (자동 증가 PK)',
  `stock_seq` int(11) NOT NULL COMMENT '연관 품목 고유 번호 (stocks.stock_seq FK)',
  `store_seq` int(11) NOT NULL COMMENT '매장 고유 번호 (데이터 격리용)',
  `lot_number` varchar(50) NOT NULL COMMENT '로트 번호 - 입고 시 시스템 자동생성 (예: LOT-20240320-001)',
  `detail_stock_name` varchar(150) NOT NULL COMMENT '상세 품목명 - 납품사/원산지 포함 (예: A유통 국내산 냉동 삼겹살)',
  `initial_quantity` int(11) NOT NULL COMMENT '최초 입고 수량 - 변경 불가, 원본 기록용',
  `current_quantity` int(11) NOT NULL COMMENT '현재 남은 수량 - 출고/조정 시 차감',
  `incoming_price` int(11) NOT NULL COMMENT '입고 단가 (원) - 해당 배치 구매 단가',
  `expiration_date` date NOT NULL COMMENT '유통기한 - 임박 알림 및 FIFO 출고 기준',
  `incoming_date` date NOT NULL DEFAULT curdate() COMMENT '실제 입고일 - 기본값 오늘',
  PRIMARY KEY (`batch_seq`),
  UNIQUE KEY `lot_number` (`lot_number`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='실물 재고 배치 테이블 - 입고 단위(로트)별 수량/단가/유통기한을 개별 관리, FIFO 출고에 활용';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stock_history`
--

DROP TABLE IF EXISTS `stock_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_history` (
  `history_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '이력 고유 번호 (자동 증가 PK)',
  `store_seq` int(11) NOT NULL COMMENT '매장 고유 번호 (데이터 격리용)',
  `stock_seq` int(11) NOT NULL COMMENT '대상 품목 고유 번호 (stocks.stock_seq FK)',
  `batch_seq` int(11) DEFAULT NULL COMMENT '연관 배치 번호 (stock_batches.batch_seq FK) - 입고·출고 시 필수, 조정 시 NULL 가능',
  `transaction_type` enum('INCOMING','OUTBOUND','ADJUST','ALERT') NOT NULL COMMENT '변동 구분 - INCOMING(입고) / OUTBOUND(출고) / ADJUST(조정) / ALERT(상태경고)',
  `change_quantity` int(11) NOT NULL COMMENT '변동 수량 - 입고: 양수(+20), 출고·조정: 음수(-10) 또는 양수',
  `current_total_stock` int(11) NOT NULL COMMENT '변동 직후 장부상 총 재고 - stocks.current_stock 과 항상 일치해야 함',
  `detail_stock_name` varchar(150) DEFAULT '-' COMMENT '이력 표시용 상세 품목명 - 입고 시 배치의 detail_stock_name 복사, 출고/조정은 "-"',
  `price` int(11) DEFAULT 0 COMMENT '당시 단가 (원) - 입고 시 입고 단가, 출고/조정은 0',
  `expiration_date` date DEFAULT NULL COMMENT '당시 유통기한 - 입고 시 기록, 출고/조정은 NULL',
  `reason` varchar(250) DEFAULT NULL COMMENT '변동 사유 (예: 정기 입고, 주방 소진, 파손 폐기, 실사 보정)',
  `memo` varchar(500) DEFAULT NULL COMMENT '추가 메모 - 선택 입력',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '이력 등록 일시 - 수정 불가',
  PRIMARY KEY (`history_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='재고 변동 이력 테이블 - 모든 입고/출고/조정 내역을 시계열로 기록, 삭제·수정 금지';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stocks`
--

DROP TABLE IF EXISTS `stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stocks` (
  `stock_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '품목 고유 번호 (자동 증가 PK)',
  `store_seq` int(11) NOT NULL COMMENT '매장 고유 번호 (데이터 격리용)',
  `stock_name` varchar(100) NOT NULL COMMENT '품목명 (예: 냉동 삼겹살)',
  `category` varchar(50) NOT NULL COMMENT '카테고리 (예: 육류, 채소, 소스/오일)',
  `unit` varchar(20) NOT NULL COMMENT '수량 단위 (예: 팩, 단, 병, 통)',
  `safety_stock` int(11) DEFAULT 0 COMMENT '안전 재고 수량 - 이 수치 이하면 재고부족 경고',
  `default_expiry_days` int(11) DEFAULT 0 COMMENT '기본 소비기한 일수 - 입고 시 유통기한 자동계산에 사용',
  `current_stock` int(11) DEFAULT 0 COMMENT '현재 총 재고 수량 (캐시) - stock_history INSERT 시 함께 UPDATE',
  `created_at` datetime DEFAULT current_timestamp() COMMENT '품목 최초 등록 일시',
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '품목 정보 최종 수정 일시',
  PRIMARY KEY (`stock_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='품목 마스터 테이블 - 재고 관리 대상 품목의 기본 정보를 관리';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stocks_mappings`
--

DROP TABLE IF EXISTS `stocks_mappings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stocks_mappings` (
  `mapping_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '매핑 고유 번호 (PK)',
  `store_item_id` int(11) NOT NULL COMMENT '사장님의 통합 자재 ID',
  `item_id` int(11) NOT NULL COMMENT '거래처의 판매 상품 ID',
  PRIMARY KEY (`mapping_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `store_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '매장 고유 번호 (PK)',
  `user_seq` int(11) NOT NULL COMMENT '이 매장을 소유한 사장님의 고유 번호 (users.user_seq 참조)',
  `biz_number` varchar(20) NOT NULL COMMENT '사업자/거래처 등록 번호',
  `company_name` varchar(100) DEFAULT NULL COMMENT '상호명 또는 업체명',
  `ceo_name` varchar(50) NOT NULL COMMENT '대표자 성명 (국세청 검증용)',
  `opening_date` date DEFAULT NULL COMMENT '개업 일자',
  `zonecode` int(10) DEFAULT NULL COMMENT '우편번호',
  `address1` varchar(100) DEFAULT NULL COMMENT '세부주소1',
  `address2` varchar(100) DEFAULT NULL COMMENT '세부주소2',
  PRIMARY KEY (`store_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_sanctions`
--

DROP TABLE IF EXISTS `user_sanctions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sanctions` (
  `sanction_seq` int(11) NOT NULL COMMENT '제재 기록 고유 번호',
  `user_seq` int(11) NOT NULL COMMENT '사용자 ID',
  `penalty_score` int(11) DEFAULT 0 COMMENT '누적된 횟수',
  `reason` varchar(255) DEFAULT NULL COMMENT '제재 사유',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '날짜',
  PRIMARY KEY (`sanction_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT '회원 고유 번호 (PK)',
  `user_id` varchar(50) NOT NULL COMMENT '로그인용 유저 아이디',
  `password` varchar(255) NOT NULL COMMENT '암호화된 비밀번호',
  `name` varchar(50) NOT NULL COMMENT '이름',
  `nickname` varchar(50) DEFAULT NULL COMMENT '서비스 내에서 표시될 닉네임',
  `email` varchar(100) DEFAULT NULL COMMENT '이메일 인증 및 비밀번호 찾기용',
  `phone` varchar(20) DEFAULT NULL COMMENT '휴대폰 번호',
  `user_type` enum('BUSINESS','PARTNER','ADMIN') NOT NULL COMMENT '회원 구분 (소상공인, 거래처, 관리자)',
  `status` enum('ACTIVE','WITHDRAWN') NOT NULL DEFAULT 'ACTIVE' COMMENT '회원 상태 (활동중, 탈퇴)',
  `withdraw_reason` varchar(255) DEFAULT NULL COMMENT '탈퇴 사유',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT '계정 생성 일시',
  PRIMARY KEY (`user_seq`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-19 12:26:08
