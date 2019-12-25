/*
 Navicat Premium Data Transfer

 Source Server         : assignment2
 Source Server Type    : MySQL
 Source Server Version : 80018
 Source Host           : localhost:3306
 Source Schema         : online_testing_project

 Target Server Type    : MySQL
 Target Server Version : 80018
 File Encoding         : 65001

 Date: 25/12/2019 08:32:16
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for answers
-- ----------------------------
DROP TABLE IF EXISTS `answers`;
CREATE TABLE `answers`  (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `questionid` int(11) NOT NULL,
  `correct` tinyint(1) NOT NULL,
  PRIMARY KEY (`aid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 92 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for assignedanswers
-- ----------------------------
DROP TABLE IF EXISTS `assignedanswers`;
CREATE TABLE `assignedanswers`  (
  `assigned_exam_id` int(11) NOT NULL,
  `assigned_question_id` int(11) NOT NULL,
  `answer_id` int(11) NOT NULL,
  `text` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for assignedexams
-- ----------------------------
DROP TABLE IF EXISTS `assignedexams`;
CREATE TABLE `assignedexams`  (
  `ca_exam_id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_id` int(11) NOT NULL,
  `cand_id` int(11) NOT NULL,
  `score` int(3) NULL DEFAULT NULL,
  `deadline` int(11) NOT NULL,
  `completed` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`ca_exam_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for assignedquestions
-- ----------------------------
DROP TABLE IF EXISTS `assignedquestions`;
CREATE TABLE `assignedquestions`  (
  `assigned_exam_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `user_answer_id` int(11) NULL DEFAULT NULL,
  `saved` tinyint(1) NOT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for exams
-- ----------------------------
DROP TABLE IF EXISTS `exams`;
CREATE TABLE `exams`  (
  `examid` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`examid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for positions
-- ----------------------------
DROP TABLE IF EXISTS `positions`;
CREATE TABLE `positions`  (
  `pos_id` int(2) NOT NULL AUTO_INCREMENT,
  `text` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`pos_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of positions
-- ----------------------------
INSERT INTO `positions` VALUES (1, 'JOB 1');
INSERT INTO `positions` VALUES (2, 'JOB 2');
INSERT INTO `positions` VALUES (3, 'JOB 3');
INSERT INTO `positions` VALUES (4, 'JOB 4');
INSERT INTO `positions` VALUES (5, 'JOB 5');

-- ----------------------------
-- Table structure for questions
-- ----------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions`  (
  `qid` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `examid` int(11) NOT NULL,
  PRIMARY KEY (`qid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of questions
-- ----------------------------
INSERT INTO `questions` VALUES (19, 'Question 1 for Exam 1', 25);
INSERT INTO `questions` VALUES (20, 'Question 2 for Exam 1', 25);
INSERT INTO `questions` VALUES (21, 'Question 3 for Exam 1', 25);
INSERT INTO `questions` VALUES (22, 'Question 4 For Exam 1', 25);
INSERT INTO `questions` VALUES (23, 'Question 5 for Exam 1', 25);
INSERT INTO `questions` VALUES (24, 'Question 6 for Exam 1', 25);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `phone_Number` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `position` int(255) NULL DEFAULT NULL,
  `approved` tinyint(1) NULL DEFAULT NULL,
  `type` int(1) NULL DEFAULT NULL,
  `cvname` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`uid`, `email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
