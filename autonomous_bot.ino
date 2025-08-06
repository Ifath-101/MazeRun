#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>
#include <Encoder.h>
#include <Wire.h>

// Define pins for CE and CSN
#define CE_PIN 4
#define CSN_PIN 5

#define IR_PIN 12

// Create RF24 radio object
RF24 radio(CE_PIN, CSN_PIN);
const byte address[6] = "00002";

// Pin Definitions
#define ENA 25
#define IN1 26
#define IN2 15
#define ENB 32
#define IN3 33
#define IN4 14
    
// Encoder Pins
#define ENCODER_A1 34
#define ENCODER_A2 35
#define ENCODER_B1 36
#define ENCODER_B2 39

// Constants
const float WHEEL_DIAMETER_CM = 4.0;   // Diameter of the wheels in cm
const float TICKS_PER_REV = 300.0;     // Encoder ticks per wheel revolution
const float MY_PI = 3.14159265358979;  // Rename PI to MY_PI

// Variables
volatile long encoderCountA = 0;
volatile long encoderCountB = 0;

int currentValue = 0;
int whites = 1;
int sensorValue = 4000;

void setup() {
  Serial.begin(9600);
  delay(1000);  // Give time for Serial Monitor to connect

  Serial.println("Initializing nRF24L01...");

  if (!radio.begin()) {
    Serial.println("nRF24L01 NOT detected. Check wiring!");
    while (1);  // Stop here
  }

  Serial.println("nRF24L01 initialized successfully!");

  radio.openWritingPipe(address);
  radio.openReadingPipe(0, address);
  radio.setPALevel(RF24_PA_LOW);     

  pinMode(IR_PIN, INPUT);

  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  // Encoder pins as input
  pinMode(ENCODER_A1, INPUT);
  pinMode(ENCODER_A2, INPUT);
  pinMode(ENCODER_B1, INPUT);
  pinMode(ENCODER_B2, INPUT);

  // Attach interrupts for encoders
  attachInterrupt(digitalPinToInterrupt(ENCODER_A1), countEncoderA, RISING);
  attachInterrupt(digitalPinToInterrupt(ENCODER_B1), countEncoderB, RISING);

}

void loop() {
  radio.startListening();  
  int receivedValue = 0;
  if (radio.available()) {
      radio.read(&receivedValue, sizeof(receivedValue));
      Serial.print("Received Integer: ");
      Serial.println(receivedValue);
  }

  if (receivedValue >= 1 && receivedValue <= 8) {
    currentValue = receivedValue;
  }

  if (currentValue == 1) {
    pattern1();
  } else if (currentValue == 2) {
    pattern2();
  } else if (currentValue == 3) {
    pattern3();
  } else if (currentValue == 4) {
    pattern4();
  } else if (currentValue == 5) {
    pattern5();
  } else if (currentValue == 6) {
    pattern6();
  } else if (currentValue == 7) {
    pattern7();
  } else if (currentValue == 8) {
    pattern8();
  //} else if(currentValue == 0){
    //pattern1();
  }else {
    Serial.println("Invalid input. Send a number between 0 and 8.");
  }
  delay(200);

  // int irState = digitalRead(IR_PIN);

  // if(irState == LOW){
  //   radio.stopListening();
  //   int number = 22;
  //   radio.write(&number, sizeof(number));
  //   Serial.println("IR Sensor 1 detected ");
  // }
}

void countEncoderA() {
  encoderCountA++;
}

void countEncoderB() {
  encoderCountB++;
}

void moveForward(float distance_cm) {
  long targetTicks = (distance_cm / (MY_PI * WHEEL_DIAMETER_CM)) * TICKS_PER_REV;
  encoderCountA = 0;
  encoderCountB = 0;

  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, 255);
  analogWrite(ENB, 255);

  while ((encoderCountA + encoderCountB) / 2 < targetTicks) {
    if (isDetected()) {
      while (true) {
        stopMotors();
        radio.stopListening();
        for (int i = 0; i < 40; i++) {
          radio.write(&whites, sizeof(whites));
          delay(10);  // Add a small delay between transmissions
        }
        radio.startListening();  // Switch back to listening mode
      }
      return;
    }
  }
  stopMotors();
}

void turnLeft(int angle_deg) {
  long targetTicks = (angle_deg / 1600.0) * MY_PI * WHEEL_DIAMETER_CM * TICKS_PER_REV;
  encoderCountA = 0;
  encoderCountB = 0;

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, 255);
  analogWrite(ENB, 255);

  while ((encoderCountA + encoderCountB) / 2 < targetTicks) {
    if (isDetected()) {
      while (true) {
        stopMotors();
        radio.stopListening();
        for (int i = 0; i < 40; i++) {
          radio.write(&whites, sizeof(whites));
          delay(10);  // Add a small delay between transmissions
        }
        radio.startListening();  // Switch back to listening mode
      }
      return;
    }
  }
  stopMotors();
}    

void turnRight(int angle_deg) {
  long targetTicks = (angle_deg / 1600.0) * MY_PI * WHEEL_DIAMETER_CM * TICKS_PER_REV;
  encoderCountA = 0;
  encoderCountB = 0;

  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  analogWrite(ENA, 255);
  analogWrite(ENB, 255);

  while ((encoderCountA + encoderCountB) / 2 < targetTicks) {
    if (isDetected()) {
      while (true) {
        stopMotors();
        radio.stopListening();
        for (int i = 0; i < 40; i++) {
          radio.write(&whites, sizeof(whites));
          delay(10);  // Add a small delay between transmissions
        }
        radio.startListening();  // Switch back to listening mode
      }
      return;
    }
  }
  stopMotors();
}

void turnAround() {
  turnLeft(180);
}

void stopMotors() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, 0);
  analogWrite(ENB, 0);
}

bool isDetected(){
  int sensorValue = analogRead(IR_PIN);
  if(sensorValue < 2000){
    Serial.println(sensorValue); 
    return true;
  }
  else{
    Serial.println(sensorValue); 
    return false;
  }
}

void pattern8() {
  moveForward(32);
  delay(500);
  turnLeft(90);
  delay(500);
  moveForward(32);
  delay(500);
  turnAround();
  delay(500);
  moveForward(32);
  delay(500);
  turnRight(90);
  delay(500);
  moveForward(32);
  turnAround();
}

void pattern5() {
  moveForward(32);
  delay(500);
  turnRight(90);
  delay(500);
  moveForward(48);
  turnAround();
  delay(500);
  moveForward(48);
  delay(500);
  turnLeft(90);
  delay(500);
  moveForward(32);
  delay(500);
  turnAround();
}

void pattern7() {
  turnRight(90);
  delay(500);
  moveForward(48);
  delay(500);
  turnAround();
  delay(500);
  moveForward(48);
  delay(500);
  turnRight(90);
}

void pattern6() {
  turnLeft(90);
  delay(500);
  moveForward(16);
  delay(500);
  turnLeft(90);
  delay(500);
  moveForward(32);
  delay(500);
  turnAround();
  delay(500);
  moveForward(32);
  delay(500);
  turnRight(90);
  delay(500);
  moveForward(16);
  delay(500);
  turnLeft(90);
}

void pattern4() {
  turnLeft(90);
  delay(500);
  moveForward(48);
  delay(500);
  turnLeft(90);
  delay(500);
  moveForward(32);
  delay(500);
  turnAround();
  delay(500);
  moveForward(32);
  turnRight(90);
  delay(500);
  moveForward(48);
  delay(500);
  turnLeft(90);
}

void pattern3() {
  turnRight(90);
  delay(500);
  moveForward(32);
  delay(500);
  turnRight(90);
  delay(500);
  moveForward(48);
  delay(500);
  turnAround();
  moveForward(48);
  delay(500);
  turnLeft(90);
  delay(500);
  moveForward(32);
  delay(500);
  turnRight(90);
}

void pattern1() {
  turnLeft(90);
  delay(500);
  moveForward(48);
  delay(500);
  turnAround();
  delay(500);
  moveForward(48);
  delay(500);
  turnLeft(90);
}

void pattern2() {
  turnRight(90);
  delay(500);
  moveForward(32);
  delay(500);
  turnLeft(90);
  delay(500);
  moveForward(48);
  delay(500);
  turnAround();
  moveForward(48);
  delay(500);
  turnRight(90);
  delay(500);
  moveForward(32);
  delay(500);
  turnRight(90);
}