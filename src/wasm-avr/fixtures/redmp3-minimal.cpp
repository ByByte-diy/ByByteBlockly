#include <Arduino.h>
#include <SoftwareSerial.h>
#include <RedMP3.h>

MP3 mp3(10, 11);

void setup() {
  mp3.begin();
  mp3.play();
}

void loop() {}
