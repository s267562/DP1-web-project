-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Giu 20, 2019 alle 16:34
-- Versione del server: 10.3.15-MariaDB
-- Versione PHP: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `s267562`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE `reservations` (
  `seatID` int(4) NOT NULL,
  `email` varchar(64) NOT NULL,
  `status` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `reservations`
--

INSERT INTO `reservations` (`seatID`, `email`, `status`) VALUES
(8, 'u2@p.it', 'purchased'),
(14, 'u2@p.it', 'purchased'),
(19, 'u1@p.it', 'booked'),
(20, 'u2@p.it', 'purchased'),
(22, 'u1@p.it', 'booked'),
(24, 'u2@p.it', 'booked');

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `email` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `salt` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`email`, `password`, `salt`) VALUES
('u1@p.it', 'fe0d27a393f3dc3669f575b0c680860e', 'mp†Â¾³Ø'),
('u2@p.it', '92579dc536a4b8ae488e05898c475fbb', '/eRÎÙ%œ_ô');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`seatID`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
