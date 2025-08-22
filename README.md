# Dynamic Maze Game with Joystick controlled player bot and Autonomous Ghost Bot 🎮🤖

## 📌 Project Overview
This project is a **hardware-based interactive maze game** integrating **Arduino, ESP32, RF communication, servo motors, IR sensors, and sound & light effects**.  
The system includes:
1. **Dynamic Maze** with moving walls and player tracking.
2. **Player Bot** controlled via a wireless joystick.
3. **Autonomous Ghost Bot** that moves on patterns and detects the player.
4. **Light & Sound Setup** for immersive gameplay.
5. **Web Interface** for player registration and timer display.

---

## 🔧 Hardware Components
- **Arduino Mega 2560** → Controls maze walls (8 servo motors), IR sensors (10), LEDs, RF module.  
- **Arduino Nano (x2)** → One for the joystick controller, one for the player bot.  
- **ESP32 DevKit v1** → Ghost bot control with PID, IR sensor, and RF module.  
- **Arduino Uno** → Light & sound system (programmable LED strip + MP3 module).  
- **Other Components:**  
  - 8x Servo motors  
  - 10x IR sensors + 1x player detection IR sensor  
  - NRF24L01 RF modules (for 2-way communication)  
  - Gear motors + L298N motor driver modules  
  - Programmable LED strip  
  - MP3 module + speaker  
  - Power supplies, wiring, connectors
  - Joystick module
  - 3.7v AA rechargable batteries

---

## 🎮 Features
- **Dynamic Maze Walls:** Servo-driven wall movement for unpredictable paths.  
- **Player Tracking:** 10 IR sensors detect and transmit the player bot’s position.  
- **Escape Points:** LEDs guide the player to the exit door.  
- **Joystick Player Bot:** Wireless joystick control for navigation.  
- **Autonomous Ghost Bot:** ESP32-based with movement patterns and player detection.  
- **Two-Way RF Communication:** Maze ↔ Ghost Bot signal exchange.  
- **Light & Sound Effects:** LED strip animations + sound effects with MP3 module.  
- **Web Interface:** Start game, enter player name, and track timer synced with Arduino.  

---

## 🔄 System Flow
1. **Player Bot** moves inside the maze via joystick.  
2. **Maze IR sensors** track movement → Arduino Mega converts to zone IDs (1–8).  
3. **RF Module (Maze → Ghost Bot)** sends zone data.  
4. **Ghost Bot** moves according to patterns, detects player with IR sensor.  
5. **Ghost Bot (via RF)** sends “caught” signal to maze.  
6. **Maze LEDs** and logic handle win/lose states.  
7. **Light & Sound System** creates immersive feedback.  
8. **Web Interface** displays player name and game timer.  

---

## 🏗️ System Architecture
- **Maze (Arduino Mega 2560)** → IR sensors + servo motors + RF transmitter + LEDs  
- **Player Bot (Arduino Nano)** → Motor driver + RF receiver  
- **Joystick Controller (Arduino Nano)** → Joystick module + RF transmitter  
- **Ghost Bot (ESP32 DevKit v1)** → Motors + IR sensor + RF transceiver  
- **Light & Sound (Arduino Uno)** → LED strip + MP3 module  

---

## 👥 Team Members
- **Ifath** – Group Leader, Maze design, Servo/IR integration, Game logic.
- **Lahiru** – Ghost bot circuit & PID tuning.
- **Hesanka** – RF communication & hardware setup with sound setup 
- **Gemini** – Joystick system, LED animations.  
- **Yoonus** – Player bot programming & Web interface integration.  

---

## ✨ Conclusion
The **Dynamic Maze Game with Autonomous Ghost Bot** demonstrates how embedded systems can be combined into a **real-time gaming platform**. By integrating **multiple microcontrollers, sensors, and communication modules**, this project blends **robotics, automation, and entertainment** into one cohesive system.  

---
