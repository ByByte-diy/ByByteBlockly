/** Legacy Arduino generator fragments for Otto Ninja app blocks (from www/blocs&generateurs/otto.js). */

export const OTTO_NINJA_APP_INCLUDES =
  '#define REMOTEXY_MODE__ESP8266WIFI_LIB_POINT\n' +
  '#include <RemoteXY.h>\n' +
  '#include <Wire.h>\n' +
  '#include <Adafruit_GFX.h>\n' +
  '#include "Adafruit_LEDBackpack.h"\n' +
  '#pragma pack(push, 1) \n' +
  'uint8_t RemoteXY_CONF[] ={ 255,6,0,0,0,66,0,13,8,0,5,32,3,12,41,41,1,26,31,1,3,79,16,16,12,1,31,82,240,159,166,190,0,1,3,56,39,18,12,1,31,240,159,146,191,0,1,3,79,39,17,12,1,31,240,159,166,191,0,1,3,56,16,17,12,1,31,76,240,159,166,190,0 }; \n' +
  'struct {\n' +
  'int8_t J_x; // =-100..100 x-coordinate joystick position  \n' +
  'int8_t J_y; // =-100..100 y-coordinate joystick position  \n' +
  'uint8_t button_B; // =1 if button pressed, else =0  \n' +
  'uint8_t button_X; // =1 if button pressed, else =0  \n' +
  'uint8_t button_Y; // =1 if button pressed, else =0  \n' +
  'uint8_t button_A; // =1 if button pressed, else =0  \n' +
  'uint8_t connect_flag;  // =1 if wire connected, else =0  \n' +
  '} RemoteXY; \n' +
  '#pragma pack(pop) \n';

export const OTTO_NINJA_APP_VARIABLES =
  'int currentmillis1 = 0;\n' +
  'int currentmillis2 = 0; \n' +
  'int currentmillis3 = 0;\n' +
  'int ModeCounter = 0;\n';

export const OTTO_NINJA_APP_DEFINITIONS =
  'void NinjaStop()\n' +
  ' {\n' +
  'myservoLeftFoot.detach();\n' +
  ' myservoRightFoot.detach();  \n' +
  ' myservoLeftLeg.detach();\n' +
  ' myservoRightLeg.detach();\n' +
  '}\n' +
  'void NinjaSetWalk()\n' +
  ' {\n' +
  'myservoLeftArm.attach(ServoLeftArmPin, 544, 2400);\n' +
  '  myservoRightArm.attach(ServoRightArmPin, 544, 2400); \n' +
  '  myservoLeftArm.write(90);   \n' +
  '  myservoRightArm.write(90);  \n' +
  ' delay(200);\n' +
  ' myservoLeftArm.detach();\n' +
  ' myservoRightArm.detach();\n' +
  ' myservoLeftLeg.attach(ServoLeftLegPin, 544, 2400);\n' +
  'myservoRightLeg.attach(ServoRightLegPin, 544, 2400);\n' +
  'myservoLeftLeg.write(LA0);\n' +
  'myservoRightLeg.write(RA0); \n' +
  ' delay(300);\n' +
  ' myservoLeftLeg.detach(); \n' +
  ' myservoRightLeg.detach();\n' +
  ' myservoLeftArm.attach(ServoLeftArmPin, 544, 2400);\n' +
  ' myservoRightArm.attach(ServoRightArmPin, 544, 2400);\n' +
  ' myservoLeftArm.write(180); \n' +
  'myservoRightArm.write(0); \n' +
  ' delay(300);\n' +
  ' myservoLeftArm.detach(); \n' +
  'myservoRightArm.detach();\n' +
  '}  \n' +
  'void NinjaSetRoll()\n' +
  ' {\n' +
  'myservoLeftArm.attach(ServoLeftArmPin, 544, 2400);\n' +
  ' myservoRightArm.attach(ServoRightArmPin, 544, 2400);\n' +
  ' myservoLeftArm.write(90);\n' +
  'myservoRightArm.write(90); \n' +
  ' delay(200);\n' +
  ' myservoLeftArm.detach();\n' +
  'myservoRightArm.detach();\n' +
  ' myservoLeftLeg.attach(ServoLeftLegPin, 544, 2400);\n' +
  ' myservoRightLeg.attach(ServoRightLegPin, 544, 2400);\n' +
  'myservoLeftLeg.write(LA1); \n' +
  'myservoRightLeg.write(RA1);\n' +
  ' delay(300);\n' +
  ' myservoLeftLeg.detach();\n' +
  'myservoRightLeg.detach();\n' +
  'myservoLeftArm.attach(ServoLeftArmPin, 544, 2400);\n' +
  'myservoRightArm.attach(ServoRightArmPin, 544, 2400);\n' +
  ' myservoLeftArm.write(180);\n' +
  ' myservoRightArm.write(0);\n' +
  ' delay(300);\n' +
  ' myservoLeftArm.detach();\n' +
  ' myservoRightArm.detach();\n' +
  '}\n' +
  'void NinjaWalkStop()\n' +
  '{\n' +
  'myservoLeftFoot.write(90);\n' +
  ' myservoRightFoot.write(90); \n' +
  ' myservoLeftLeg.write(LA0); \n' +
  ' myservoRightLeg.write(RA0);}\n' +
  'void NinjaRollStop()\n' +
  ' {\n' +
  'myservoLeftFoot.write(90);\n' +
  ' myservoRightFoot.write(90); \n' +
  ' myservoLeftFoot.detach(); \n' +
  ' myservoRightFoot.detach();\n' +
  '} \n' +
  'void NinjaLeftArm()\n' +
  '{\n' +
  'myservoLeftArm.attach(ServoLeftArmPin, 544, 2400); \n' +
  'myservoLeftArm.write(90);\n' +
  '} \n' +
  'void NinjaRightArm()\n' +
  '{\n' +
  'myservoRightArm.attach(ServoRightArmPin, 544, 2400); \n' +
  'myservoRightArm.write(90);\n' +
  '}\n' +
  'void NinjaLeftArmDown()\n' +
  '{\n' +
  'myservoLeftArm.write(180);\n' +
  '} \n' +
  'void NinjaRightArmDown()\n' +
  '{\n' +
  'myservoRightArm.write(0);\n' +
  '}\n';

export const OTTO_NINJA_APP_SETUP =
  'myservoLeftFoot.attach(ServoLeftFootPin, 544, 2400);\n' +
  'myservoRightFoot.attach(ServoRightFootPin, 544, 2400);  \n' +
  'myservoLeftLeg.attach(ServoLeftLegPin, 544, 2400);\n' +
  'myservoRightLeg.attach(ServoRightLegPin, 544, 2400);\n' +
  'myservoLeftArm.attach(ServoLeftArmPin, 544, 2400);\n' +
  'myservoRightArm.attach(ServoRightArmPin, 544, 2400);\n' +
  'myservoHead.attach(ServoHeadPin, 544, 2400);\n' +
  'myservoHead.write(90);   \n' +
  'myservoLeftArm.write(90);    \n' +
  'myservoRightArm.write(90);     \n' +
  'delay(300);  \n' +
  'myservoLeftFoot.write(90);   \n' +
  'myservoRightFoot.write(90);        \n' +
  'myservoLeftLeg.write(60);   \n' +
  'myservoRightLeg.write(120);     \n' +
  'delay(300);     \n' +
  'myservoLeftArm.write(180);\n' +
  'myservoRightArm.write(0); \n' +
  'delay(500);\n' +
  'myservoLeftFoot.detach();\n' +
  'myservoRightFoot.detach();  \n' +
  'myservoLeftLeg.detach();\n' +
  'myservoRightLeg.detach();\n' +
  'myservoLeftArm.detach();\n' +
  'myservoRightArm.detach();\n' +
  'myservoHead.detach();\n' +
  'RemoteXY_Init ();\n';

export const OTTO_NINJA_APP_LOOP_CODE =
  'RemoteXY_Handler (); \n' +
  'if (RemoteXY.button_X == HIGH){NinjaSetRoll(); ModeCounter = 1;} \n' +
  'if (RemoteXY.button_Y == HIGH){NinjaSetWalk(); ModeCounter = 0;}\n' +
  'if (RemoteXY.button_A == HIGH){NinjaLeftArm();} \n' +
  'if (RemoteXY.button_A == LOW) {NinjaLeftArmDown();} \n' +
  'if (RemoteXY.button_B == HIGH){NinjaRightArm();} \n' +
  'if (RemoteXY.button_B == LOW) { NinjaRightArmDown();}\n' +
  'if (ModeCounter == 0) {   \n' +
  'if ((RemoteXY.J_x >= -10)&&(RemoteXY.J_x <= 10)&&(RemoteXY.J_y >= -10)&&(RemoteXY.J_y <= 10)) { NinjaWalkStop();  } \n' +
  'if (RemoteXY.J_y > 0)  {\n' +
  'int lt= map(RemoteXY.J_x, 100, -100, 200, 700); \n' +
  'int rt= map(RemoteXY.J_x, 100, -100, 700, 200); \n' +
  'int Interval1 = 250; \n' +
  'int Interval2 = 250 + rt; \n' +
  'int Interval3 = 250 + rt + 250;\n' +
  'int Interval4 = 250 + rt + 250 + lt; \n' +
  'int Interval5 = 250 + rt + 250 + lt + 50;\n' +
  'if(millis() > currentmillis1 + Interval5){ currentmillis1 = millis();} \n' +
  'if(millis() - currentmillis1 <= Interval1) {   \n' +
  'myservoLeftLeg.attach(ServoLeftLegPin, 544, 2400);\n' +
  'myservoRightLeg.attach(ServoRightLegPin, 544, 2400);\n' +
  'myservoRightFoot.attach(ServoRightFootPin, 544, 2400);  \n' +
  'myservoLeftFoot.attach(ServoLeftFootPin, 544, 2400);  \n' +
  'myservoLeftLeg.write(LATR);  \n' +
  'myservoRightLeg.write(RATR);} \n' +
  'if((millis() - currentmillis1 >= Interval1)&&(millis() - currentmillis1 <= Interval2)){myservoRightFoot.write(90-RFFWRS);} \n' +
  'if((millis() - currentmillis1 >= Interval2)&&(millis() - currentmillis1 <= Interval3)){myservoRightFoot.detach();myservoLeftLeg.write(LATL); myservoRightLeg.write(RATL);}\n' +
  'if((millis() - currentmillis1 >= Interval3)&&(millis() - currentmillis1 <= Interval4)){myservoLeftFoot.write(90+LFFWRS);}   \n' +
  'if((millis() - currentmillis1 >= Interval4)&&(millis() - currentmillis1 <= Interval5)){myservoLeftFoot.detach();  }  }   \n' +
  'if (RemoteXY.J_y < 0){ \n' +
  'int lt= map(RemoteXY.J_x, 100, -100, 200, 700);  \n' +
  'int rt= map(RemoteXY.J_x, 100, -100, 700, 200);  \n' +
  'int Interval1 = 250; \n' +
  'int Interval2 = 250 + rt; \n' +
  'int Interval3 = 250 + rt + 250;\n' +
  'int Interval4 = 250 + rt + 250 + lt; \n' +
  'int Interval5 = 250 + rt + 250 + lt + 50;\n' +
  'if(millis() > currentmillis1 + Interval5){currentmillis1 = millis();}\n' +
  'if(millis() - currentmillis1 <= Interval1){   \n' +
  'myservoLeftLeg.attach(ServoLeftLegPin, 544, 2400);\n' +
  'myservoRightLeg.attach(ServoRightLegPin, 544, 2400);\n' +
  'myservoRightFoot.attach(ServoRightFootPin, 544, 2400);  \n' +
  'myservoLeftFoot.attach(ServoLeftFootPin, 544, 2400);  \n' +
  'myservoLeftLeg.write(LATR);  \n' +
  'myservoRightLeg.write(RATR);} \n' +
  'if((millis() - currentmillis1 >= Interval1)&&(millis() - currentmillis1 <= Interval2)){myservoRightFoot.write(90+RFBWRS);}\n' +
  'if((millis() - currentmillis1 >= Interval2)&&(millis() - currentmillis1 <= Interval3)){myservoRightFoot.detach();myservoLeftLeg.write(LATL); myservoRightLeg.write(RATL);}\n' +
  'if((millis() - currentmillis1 >= Interval3)&&(millis() - currentmillis1 <= Interval4)){myservoLeftFoot.write(90-LFFWRS);}   \n' +
  'if((millis() - currentmillis1 >= Interval4)&&(millis() - currentmillis1 <= Interval5)){myservoLeftFoot.detach();  }  }}   \n' +
  'if (ModeCounter == 1){   \n' +
  'if ((RemoteXY.J_x >= -10)&&(RemoteXY.J_x <= 10)&&(RemoteXY.J_y >= -10)&&(RemoteXY.J_y <= 10)){NinjaRollStop();} \n' +
  ' else{myservoLeftFoot.attach(ServoLeftFootPin, 544, 2400);  myservoRightFoot.attach(ServoRightFootPin, 544, 2400); \n' +
  'int LWS= map(RemoteXY.J_y, 100, -100, 135,    45);  \n' +
  'int RWS= map(RemoteXY.J_y, 100, -100,  45,   135);  \n' +
  'int LWD= map(RemoteXY.J_x, 100, -100,  45,     0);  \n' +
  'int RWD= map(RemoteXY.J_x, 100, -100,   0,   -45); \n' +
  'myservoLeftFoot.write(LWS+LWD); \n' +
  'myservoRightFoot.write(RWS+RWD); }} \n' +
  ' Serial.print("  X: ");   \n' +
  ' Serial.print(RemoteXY.J_x);\n' +
  ' Serial.print("  Y: ");  \n' +
  ' Serial.print(RemoteXY.J_y);\n' +
  ' Serial.print("  MC: ");   \n' +
  ' Serial.println(ModeCounter); \n';

export const OTTO9_APP_INCLUDES =
  '#include <Servo.h>\n' +
  '#include <Oscillator.h>\n' +
  '#include <EEPROM.h>\n' +
  '#include <SerialCommand.h>\n' +
  'SoftwareSerial BTserial = SoftwareSerial(11,12);\n' +
  'SerialCommand SCmd(BTserial);\n' +
  '#include <Otto.h>\n' +
  'Otto Otto;  \n';

export const OTTO9_APP_VARIABLES =
  'const char programID[] = "Otto Bluetooth App Firmware";\n' +
  'const char name_fac = \'$\'; \n' +
  'const char name_fir = \'#\';\n' +
  'int T = 1000;  \n' +
  'int moveId = 0; \n' +
  'int moveSize = 15;\n' +
  'volatile bool buttonPushed=false; \n' +
  'unsigned long previousMillis = 0;\n' +
  'int randomDance = 0;\n' +
  'int randomSteps = 0;\n' +
  'bool obstacleDetected = false;\n' +
  'unsigned long int matrix;\n' +
  'unsigned long timerMillis = 0;\n' +
  'void receiveStop() { sendAck(); Otto.home(); sendFinalAck(); }\n' +
  'void receiveLED() { sendAck(); Otto.home(); unsigned long int matrix; char *arg; char *endstr; arg = SCmd.next(); if (arg != NULL) { matrix = strtoul(arg, &endstr, 2); Otto.putMouth(matrix, false); } else { Otto.putMouth(xMouth); delay(2000); Otto.clearMouth(); } sendFinalAck(); }\n' +
  'void recieveBuzzer() { sendAck(); Otto.home(); bool error = false; int frec; int duration; char *arg; arg = SCmd.next(); if (arg != NULL) frec = atoi(arg); else error = true; arg = SCmd.next(); if (arg != NULL) duration = atoi(arg); else error = true; if (error == true) { Otto.putMouth(xMouth); delay(2000); Otto.clearMouth(); } else Otto._tone(frec, duration, 1); sendFinalAck(); }\n' +
  'void receiveTrims() { sendAck(); Otto.home(); int trim_YL, trim_YR, trim_RL, trim_RR; bool error = false; char *arg; arg = SCmd.next(); if (arg != NULL) trim_YL = atoi(arg); else error = true; arg = SCmd.next(); if (arg != NULL) trim_YR = atoi(arg); else error = true; arg = SCmd.next(); if (arg != NULL) trim_RL = atoi(arg); else error = true; arg = SCmd.next(); if (arg != NULL) trim_RR = atoi(arg); else error = true; if (error == true) { Otto.putMouth(xMouth); delay(2000); Otto.clearMouth(); } else { Otto.setTrims(trim_YL, trim_YR, trim_RL, trim_RR); Otto.saveTrimsOnEEPROM(); } sendFinalAck(); }\n' +
  'void receiveServo() { sendAck(); moveId = 30; bool error = false; char *arg; int servo_YL, servo_YR, servo_RL, servo_RR; arg = SCmd.next(); if (arg != NULL) servo_YL = atoi(arg); else error = true; arg = SCmd.next(); if (arg != NULL) servo_YR = atoi(arg); else error = true; arg = SCmd.next(); if (arg != NULL) servo_RL = atoi(arg); else error = true; arg = SCmd.next(); if (arg != NULL) { servo_RR = atoi(arg); } else error = true; if (error == true) { Otto.putMouth(xMouth); delay(2000); Otto.clearMouth(); } else { int servoPos[4] = {servo_YL, servo_YR, servo_RL, servo_RR}; Otto._moveServos(200, servoPos); } sendFinalAck(); }\n' +
  'void receiveMovement() { sendAck(); if (Otto.getRestState() == true) Otto.setRestState(false); char *arg; arg = SCmd.next(); if (arg != NULL) moveId = atoi(arg); else { Otto.putMouth(xMouth); delay(2000); Otto.clearMouth(); moveId = 0; } arg = SCmd.next(); if (arg != NULL) T = atoi(arg); else T = 1000; arg = SCmd.next(); if (arg != NULL) moveSize = atoi(arg); else moveSize = 15; }\n' +
  'void move(int moveId) { bool manualMode = false; switch (moveId) { case 0: Otto.home(); break; case 1: Otto.walk(1, T, 1); break; case 2: Otto.walk(1, T, -1); break; case 3: Otto.turn(1, T, 1); break; case 4: Otto.turn(1, T, -1); break; case 5: Otto.updown(1, T, moveSize); break; case 6: Otto.moonwalker(1, T, moveSize, 1); break; case 7: Otto.moonwalker(1, T, moveSize, -1); break; case 8: Otto.swing(1, T, moveSize); break; case 9: Otto.crusaito(1, T, moveSize, 1); break; case 10: Otto.crusaito(1, T, moveSize, -1); break; case 11: Otto.jump(1, T); break; case 12: Otto.flapping(1, T, moveSize, 1); break; case 13: Otto.flapping(1, T, moveSize, -1); break; case 14: Otto.tiptoeSwing(1, T, moveSize); break; case 15: Otto.bend(1, T, 1); break; case 16: Otto.bend(1, T, -1); break; case 17: Otto.shakeLeg(1, T, 1); break; case 18: Otto.shakeLeg(1, T, -1); break; case 19: Otto.jitter(1, T, moveSize); break; case 20: Otto.ascendingTurn(1, T, moveSize); break; default: manualMode = true; break; } if (!manualMode) sendFinalAck(); } \n' +
  'void receiveGesture() { sendAck(); Otto.home();  int gesture = 0; char *arg; arg = SCmd.next(); if (arg != NULL) gesture = atoi(arg); else     delay(2000); switch (gesture) { case 1: Otto.playGesture(OttoHappy); break; case 2: Otto.playGesture(OttoSuperHappy); break; case 3: Otto.playGesture(OttoSad); break; case 4: Otto.playGesture(OttoSleeping); break; case 5: Otto.playGesture(OttoFart); break; case 6: Otto.playGesture(OttoConfused); break; case 7: Otto.playGesture(OttoLove); break; case 8: Otto.playGesture(OttoAngry); break; case 9: Otto.playGesture(OttoFretful); break; case 10: Otto.playGesture(OttoMagic); break; case 11: Otto.playGesture(OttoWave); break; case 12: Otto.playGesture(OttoVictory); break; case 13: Otto.playGesture(OttoFail); break; default: break; } sendFinalAck(); }\n' +
  'void receiveSing() { sendAck(); Otto.home(); int sing = 0; char *arg; arg = SCmd.next(); if (arg != NULL) sing = atoi(arg); else     delay(2000); switch (sing) { case 1: Otto.sing(S_connection); break; case 2: Otto.sing(S_disconnection); break; case 3: Otto.sing(S_surprise); break; case 4: Otto.sing(S_OhOoh); break; case 5: Otto.sing(S_OhOoh2); break; case 6: Otto.sing(S_cuddly); break; case 7: Otto.sing(S_sleeping); break; case 8: Otto.sing(S_happy); break; case 9: Otto.sing(S_superHappy); break; case 10: Otto.sing(S_happy_short); break; case 11: Otto.sing(S_sad); break; case 12: Otto.sing(S_confused); break; case 13: Otto.sing(S_fart1); break; case 14: Otto.sing(S_fart2); break; case 15: Otto.sing(S_fart3); break; case 16: Otto.sing(S_mode1); break; case 17: Otto.sing(S_mode2); break; case 18: Otto.sing(S_mode3); break; case 19: Otto.sing(S_buttonPushed); break; default: break; } sendFinalAck(); }\n' +
  'void receiveName() { sendAck(); Otto.home(); char newOttoName[11] = ""; int eeAddress = 5; char *arg; arg = SCmd.next(); if (arg != NULL) { int k = 0; while ((*arg) && (k < 11)) { newOttoName[k] = *arg++; k++; } EEPROM.put(eeAddress, newOttoName); } else { delay(2000); } sendFinalAck(); }\n' +
  'void requestName() { Otto.home(); char actualOttoName[11] = ""; int eeAddress = 5; EEPROM.get(eeAddress, actualOttoName); Serial.print(F("&&")); Serial.print(F("E ")); Serial.print(actualOttoName); Serial.println(F("%%")); Serial.flush(); }\n' +
  'void requestProgramId() { Otto.home(); Serial.print(F("&&")); Serial.print(F("I ")); Serial.print(programID); Serial.println(F("%%")); Serial.flush(); }\n' +
  'void sendAck() { delay(30); Serial.print(F("&&")); Serial.print(F("A")); Serial.println(F("%%")); Serial.flush(); }\n' +
  'void sendFinalAck() { delay(30); Serial.print(F("&&")); Serial.print(F("F")); Serial.println(F("%%")); Serial.flush(); }\n' +
  'void ButtonPushed(){ if(!buttonPushed){ buttonPushed=true; Otto.putMouth(smallSurprise); } } \n';

export const OTTO9_APP_DEFINITIONS =
  '#define N_SERVOS 4\n' +
  '#define LeftLeg 2 \n' +
  '#define RightLeg 3 \n' +
  '#define LeftFoot 4 \n' +
  '#define RightFoot 5 \n' +
  '#define Buzzer  13 \n' +
  '#define DIN_PIN    A3 \n' +
  '#define CS_PIN     A2 \n' +
  '#define CLK_PIN    A1 \n' +
  '#define LED_DIRECTION  1 \n' +
  '#define PIN_Button   A0 \n' +
  '#define PIN_ASSEMBLY    7\n';

export const OTTO9_APP_SETUP =
  'Serial.begin(9600);\n' +
  'BTserial.begin(9600);\n' +
  'Otto.init(LeftLeg, RightLeg, LeftFoot, RightFoot, true, Buzzer);\n' +
  'Otto.initMATRIX(DIN_PIN, CS_PIN, CLK_PIN, LED_DIRECTION);\n' +
  'Otto.matrixIntensity(1);\n' +
  'pinMode(PIN_ASSEMBLY, INPUT_PULLUP);\n' +
  'pinMode(PIN_Button, INPUT);\n' +
  'SCmd.addCommand("S", receiveStop);    \n' +
  'SCmd.addCommand("L", receiveLED);     \n' +
  'SCmd.addCommand("T", recieveBuzzer);    \n' +
  'SCmd.addCommand("M", receiveMovement);   \n' +
  'SCmd.addCommand("H", receiveGesture);    \n' +
  'SCmd.addCommand("K", receiveSing);       \n' +
  'SCmd.addCommand("C", receiveTrims);      \n' +
  'SCmd.addCommand("G", receiveServo);      \n' +
  'SCmd.addCommand("R", receiveName);       \n' +
  'SCmd.addCommand("E", requestName);\n' +
  'SCmd.addCommand("I", requestProgramId);\n' +
  'SCmd.addDefaultHandler(receiveStop);\n' +
  'Otto.sing(S_connection);\n' +
  'Otto.home();\n' +
  'for (int i = 0; i < 2; i++) {\n' +
  'for (int i = 0; i < 8; i++) {\n' +
  'Otto.putAnimationMouth(littleUuh, i);\n' +
  'delay(150);\n' +
  '}\n' +
  '}\n' +
  '//Smile for a happy Otto :)\n' +
  'Otto.putMouth(smile);\n' +
  'Otto.sing(S_happy);\n' +
  'delay(200);\n' +
  'if (EEPROM.read(5) == name_fir) {\n' +
  'Otto.jump(1, 700);\n' +
  'delay(200);\n' +
  'Otto.shakeLeg(1, T, 1);\n' +
  'Otto.putMouth(smallSurprise);\n' +
  'Otto.swing(2, 800, 20);\n' +
  'Otto.home();\n' +
  '}\n' +
  'Otto.putMouth(happyOpen);\n' +
  'previousMillis = millis();\n' +
  'while (digitalRead(PIN_ASSEMBLY) == LOW) {\n' +
  'Otto.home();\n' +
  'Otto.sing(S_happy_short);   // sing every 5 seconds so we know OTTO is still working\n' +
  'delay(5000);}\n';

export const OTTO9_APP_LOOP_CODE =
  'SCmd.readSerial();     if (Otto.getRestState()==false){ move(moveId); }  \n';

export const OTTO9_SMOOTH_INCLUDES =
  '#include <Servo.h>\n' +
  '#include <Oscillator.h>\n' +
  '#include <EEPROM.h>\n' +
  '#define N_SERVOS 4';

export const OTTO9_SMOOTH_VARIABLES =
  'void goingUp(int tempo);\n' +
  'void drunk (int tempo);\n' +
  'void noGravity(int tempo);\n' +
  'void kickLeft(int tempo);\n' +
  'void kickRight(int tempo);\n' +
  'void run(int steps, int T=500);\n' +
  'void walk(int steps, int T=1000);\n' +
  'void backyard(int steps, int T=3000);\n' +
  'void backyardSlow(int steps, int T=5000);\n' +
  'void turnLeft(int steps, int T=3000);\n' +
  'void turnRight(int steps, int T=3000);\n' +
  'void moonWalkLeft(int steps, int T=1000);\n' +
  'void moonWalkRight(int steps, int T=1000);\n' +
  'void crusaito(int steps, int T=1000);\n' +
  'void swing(int steps, int T=1000);\n' +
  'void upDown(int steps, int T=1000);\n' +
  'void flapping(int steps, int T=1000);\n' +
  'int t=495; // TEMPO: 121 BPM\n' +
  'double pause=0;';

export const OTTO9_SMOOTH_DEFINITIONS =
  '#define N_SERVOS 4\n' +
  '#define PIN_YL 2 // left leg, servo[0]\n' +
  '#define PIN_YR 3 // right leg, servo[1]\n' +
  '#define PIN_RL 4 // left foot, servo[2]\n' +
  '#define PIN_RR 5 // right foot, servo[3]\n' +
  '#define INTERVALTIME 10.0\n' +
  'Oscillator servo[N_SERVOS];';

export const OTTO9_SMOOTH_SETUP =
  '  servo[0].attach(PIN_RR);\n' +
  'servo[1].attach(PIN_RL);\n' +
  'servo[2].attach(PIN_YR);\n' +
  'servo[3].attach(PIN_YL);\n' +
  'for(int i=0;i<4;i++) servo[i].SetPosition(90);\n';

export const OTTO9_SMOOTH_LOOP_CODE =
  'dance();}\n' +
  'void dance(){ primera_parte(); segunda_parte(); moonWalkLeft(4,t*2); moonWalkRight(4,t*2); moonWalkLeft(4,t*2); moonWalkRight(4,t*2); primera_parte();  crusaito(1,t*8); crusaito(1,t*7);\n' +
  'for (int i=0; i<16; i++){   flapping(1,t/4);   delay(3*t/4); }  moonWalkRight(4,t*2); moonWalkLeft(4,t*2);  moonWalkRight(4,t*2);  moonWalkLeft(4,t*2);  drunk(t*4);drunk(t*4);  drunk(t*4);  drunk(t*4);\n' +
  'kickLeft(t);  kickRight(t);  drunk(t*8);  drunk(t*4);drunk(t/2);  delay(t*4);   drunk(t/2);  delay(t*4);   walk(2,t*2);  backyard(2,t*2);  goingUp(t*2);  goingUp(t*1);  noGravity(t*2); crusaito(1,t*2);  crusaito(1,t*8); crusaito(1,t*2); crusaito(1,t*8); crusaito(1,t*2); crusaito(1,t*3);\n' +
  'delay(t);  primera_parte();    for (int i=0; i<32; i++){   flapping(1,t/2);  delay(t/2); }   for(int i=0;i<4;i++) servo[i].SetPosition(90);} \n' +
  'void oscillate(int A[N_SERVOS], int O[N_SERVOS], int T, double phase_diff[N_SERVOS]){  for (int i=0; i<4; i++) {   servo[i].SetO(O[i]); servo[i].SetA(A[i]); servo[i].SetT(T); servo[i].SetPh(phase_diff[i]); }  double ref=millis(); for (double x=ref; x<T+ref; x=millis()){ for (int i=0; i<4; i++){ servo[i].refresh(); }}}\n' +
  'unsigned long final_time; unsigned long interval_time;int oneTime;int iteration;float increment[N_SERVOS];  int oldPosition[]={90,90,90,90}; \n' +
  'void moveNServos(int time, int  newPosition[]){\n' +
  'for(int i=0;i<N_SERVOS;i++)	increment[i] = ((newPosition[i])-oldPosition[i])/(time/INTERVALTIME);  final_time =  millis() + time;  iteration = 1; \n' +
  'while(millis() < final_time){ interval_time = millis()+INTERVALTIME;   oneTime=0;      while(millis()<interval_time){	 if(oneTime<1){ for(int i=0;i<N_SERVOS;i++){  servo[i].SetPosition(oldPosition[i] + (iteration * increment[i])); }	iteration++;oneTime++; } } }  \n' +
  'for(int i=0;i<N_SERVOS;i++){	 oldPosition[i] = newPosition[i]; }   }\n' +
  'void goingUp(int tempo){\n' +
  'pause=millis(); for(int i=0;i<4;i++) servo[i].SetPosition(90);\n' +
  'delay(tempo);servo[0].SetPosition(80);servo[1].SetPosition(100);delay(tempo);servo[0].SetPosition(70); servo[1].SetPosition(110); delay(tempo); servo[0].SetPosition(60); servo[1].SetPosition(120); delay(tempo); servo[0].SetPosition(50); servo[1].SetPosition(130); delay(tempo); servo[0].SetPosition(40); servo[1].SetPosition(140); delay(tempo); servo[0].SetPosition(30); servo[1].SetPosition(150);delay(tempo); servo[0].SetPosition(20); servo[1].SetPosition(160); delay(tempo); while(millis()<pause+8*t);}\n' +
  'void primera_parte(){\n' +
  'int move1[4] = {60,120,90,90}; int move2[4] = {90,90,90,90}; int move3[4] = {40,140,90,90}; for(int x=0; x<3; x++){ for(int i=0; i<3; i++){  lateral_fuerte(1,t/2);  lateral_fuerte(0,t/4); lateral_fuerte(1,t/4);  delay(t);  } pause=millis(); for(int i=0;i<4;i++) servo[i].SetPosition(90); moveNServos(t*0.4,move1); moveNServos(t*0.4,move2); while(millis()<(pause+t*2)); }for(int i=0; i<2; i++){ lateral_fuerte(1,t/2); lateral_fuerte(0,t/4); lateral_fuerte(1,t/4); delay(t); } pause=millis(); for(int i=0;i<4;i++) servo[i].SetPosition(90);crusaito(1,t*1.4); moveNServos(t*1,move3); for(int i=0;i<4;i++) servo[i].SetPosition(90); while(millis()<(pause+t*4)); }\n' +
  'void segunda_parte(){\n' +
  'int move1[4] = {90,90,80,100};int move2[4] = {90,90,100,80};int move3[4] = {90,90,80,100};int move4[4] = {90,90,100,80};   int move5[4] = {40,140,80,100};int move6[4] = {40,140,100,80};int move7[4] = {90,90,80,100};int move8[4] = {90,90,100,80}; int move9[4] = {40,140,80,100}; int move10[4] = {40,140,100,80}; int move11[4] = {90,90,80,100};int move12[4] = {90,90,100,80};\n' +
  'for(int x=0; x<7; x++){ for(int i=0; i<3; i++){ pause=millis(); moveNServos(t*0.15,move1); moveNServos(t*0.15,move2); moveNServos(t*0.15,move3); moveNServos(t*0.15,move4);  while(millis()<(pause+t)); }pause=millis(); moveNServos(t*0.15,move5); moveNServos(t*0.15,move6); moveNServos(t*0.15,move7); moveNServos(t*0.15,move8);  while(millis()<(pause+t));  }\n' +
  'for(int i=0; i<3; i++){ pause=millis();moveNServos(t*0.15,move9);moveNServos(t*0.15,move10);moveNServos(t*0.15,move11); moveNServos(t*0.15,move12);while(millis()<(pause+t));}}\n' +
  'void lateral_fuerte(boolean side, int tempo){\n' +
  'for(int i=0;i<4;i++) servo[i].SetPosition(90);if (side) servo[0].SetPosition(40);else servo[1].SetPosition(140);delay(tempo/2);servo[0].SetPosition(90);servo[1].SetPosition(90);delay(tempo/2);}\n' +
  'void drunk (int tempo){\n' +
  'pause=millis();int move1[] = {60,70,90,90};int move2[] = {110,120,90,90};int move3[] = {60,70,90,90};int move4[] = {110,120,90,90};moveNServos(tempo*0.235,move1);  moveNServos(tempo*0.235,move2);moveNServos(tempo*0.235,move3);moveNServos(tempo*0.235,move4);while(millis()<(pause+tempo));}\n' +
  'void noGravity(int tempo){int move1[4] = {120,140,90,90};int move2[4] = {140,140,90,90};int move3[4] = {120,140,90,90};int move4[4] = {90,90,90,90};for(int i=0;i<4;i++) servo[i].SetPosition(90);for(int i=0;i<N_SERVOS;i++) oldPosition[i]=90;moveNServos(tempo*2,move1);moveNServos(tempo*2,move2);delay(tempo*2);moveNServos(tempo*2,move3);moveNServos(tempo*2,move4);}\n' +
  'void kickLeft(int tempo){\n' +
  'for(int i=0;i<4;i++) servo[i].SetPosition(90);delay(tempo);servo[0].SetPosition(50); servo[1].SetPosition(70);delay(tempo);servo[0].SetPosition(80); servo[1].SetPosition(70); delay(tempo/4);servo[0].SetPosition(30); servo[1].SetPosition(70);delay(tempo/4);servo[0].SetPosition(80);servo[1].SetPosition(70); delay(tempo/4);servo[0].SetPosition(30); servo[1].SetPosition(70); delay(tempo/4);servo[0].SetPosition(80);servo[1].SetPosition(70); delay(tempo); }\n' +
  'void kickRight(int tempo){\n' +
  'for(int i=0;i<4;i++) servo[i].SetPosition(90);delay(tempo);servo[0].SetPosition(110);servo[1].SetPosition(130); delay(tempo);servo[0].SetPosition(110); servo[1].SetPosition(100); delay(tempo/4);servo[0].SetPosition(110); servo[1].SetPosition(150); delay(tempo/4);servo[0].SetPosition(110); servo[1].SetPosition(80); delay(tempo/4);servo[0].SetPosition(110); servo[1].SetPosition(150); delay(tempo/4);servo[0].SetPosition(110); servo[1].SetPosition(100); delay(tempo);}\n' +
  'void walk(int steps, int T){int A[4]= {15, 15, 30, 30};int O[4] = {0, 0, 0, 0};double phase_diff[4] = {DEG2RAD(0), DEG2RAD(0), DEG2RAD(90), DEG2RAD(90)};for(int i=0;i<steps;i++)oscillate(A,O, T, phase_diff); }\n' +
  'void run(int steps, int T){int A[4]= {10, 10, 10, 10};int O[4] = {0, 0, 0, 0};double phase_diff[4] = {DEG2RAD(0), DEG2RAD(0), DEG2RAD(90), DEG2RAD(90)};  for(int i=0;i<steps;i++)oscillate(A,O, T, phase_diff); }\n' +
  'void backyard(int steps, int T){int A[4]= {15, 15, 30, 30};int O[4] = {0, 0, 0, 0};double phase_diff[4] = {DEG2RAD(0), DEG2RAD(0), DEG2RAD(-90), DEG2RAD(-90)}; for(int i=0;i<steps;i++)oscillate(A,O, T, phase_diff);}\n' +
  'void backyardSlow(int steps, int T){int A[4]= {15, 15, 30, 30};int O[4] = {0, 0, 0, 0};double phase_diff[4] = {DEG2RAD(0), DEG2RAD(0), DEG2RAD(-90), DEG2RAD(-90)}; for(int i=0;i<steps;i++)oscillate(A,O, T, phase_diff);}\n' +
  'void turnLeft(int steps, int T){int A[4]= {20, 20, 10, 30};int O[4] = {0, 0, 0, 0};double phase_diff[4] = {DEG2RAD(0), DEG2RAD(0), DEG2RAD(90), DEG2RAD(90)};  for(int i=0;i<steps;i++)oscillate(A,O, T, phase_diff);}\n' +
  'void turnRight(int steps, int T){int A[4]= {20, 20, 30, 10};int O[4] = {0, 0, 0, 0};double phase_diff[4] = {DEG2RAD(0), DEG2RAD(0), DEG2RAD(90), DEG2RAD(90)}; for(int i=0;i<steps;i++)oscillate(A,O, T, phase_diff);}\n' +
  'void moonWalkRight(int steps, int T){int A[4]= {25, 25, 0, 0};int O[4] = {-15 ,15, 0, 0};double phase_diff[4] = {DEG2RAD(0), DEG2RAD(180 + 120), DEG2RAD(90), DEG2RAD(90)}; for(int i=0;i<steps;i++)oscillate(A,O, T, phase_diff);}\n' +
  'void moonWalkLeft(int steps, int T){int A[4]= {25, 25, 0, 0};int O[4] = {-15, 15, 0, 0};double phase_diff[4] = {DEG2RAD(0), DEG2RAD(180 - 120), DEG2RAD(90), DEG2RAD(90)}; for(int i=0;i<steps;i++)oscillate(A,O, T, phase_diff);}\n' +
  'void crusaito(int steps, int T){int A[4]= {25, 25, 30, 30};int O[4] = {- 15, 15, 0, 0};double phase_diff[4] = {DEG2RAD(0), DEG2RAD(180 + 120), DEG2RAD(90), DEG2RAD(90)}; for(int i=0;i<steps;i++)oscillate(A,O, T, phase_diff);}\n' +
  'void swing(int steps, int T){int A[4]= {25, 25, 0, 0};int O[4] = {-15, 15, 0, 0};double phase_diff[4] = {DEG2RAD(0), DEG2RAD(0), DEG2RAD(90), DEG2RAD(90)};  for(int i=0;i<steps;i++)oscillate(A,O, T, phase_diff);}\n' +
  'void upDown(int steps, int T){int A[4]= {25, 25, 0, 0};int O[4] = {-15, 15, 0, 0};double phase_diff[4] = {DEG2RAD(180), DEG2RAD(0), DEG2RAD(270), DEG2RAD(270)}; for(int i=0;i<steps;i++)oscillate(A,O, T, phase_diff);}\n' +
  'void flapping(int steps, int T){int A[4]= {15, 15, 8, 8};int O[4] = {-A[0], A[1], 0, 0};double phase_diff[4] = {DEG2RAD(0), DEG2RAD(180), DEG2RAD(90), DEG2RAD(-90)};for(int i=0;i<steps;i++)oscillate(A,O, T, phase_diff);}\n' +
  'void test(int steps, int T){int A[4]= {15, 15, 8, 8};int O[4] = {-A[0] + 10, A[1] - 10, 0, 0};double phase_diff[4] = {DEG2RAD(0), DEG2RAD(180), DEG2RAD(90), DEG2RAD(-90)};for(int i=0;i<steps;i++)oscillate(A,O, T, phase_diff);\n';

export const NINJA_WALK_DEFINITIONS =
  'void NinjaWalkForward()\n' +
  '{\n' +
  'myservoLeftLeg.attach(ServoLeftLegPin, 544, 2400);\n' +
  'myservoRightLeg.attach(ServoRightLegPin, 544, 2400);\n' +
  'myservoLeftLeg.write(LATR); \n' +
  'myservoRightLeg.write(RATR);\n' +
  ' delay(300);\n' +
  ' myservoRightFoot.attach(ServoRightFootPin, 544, 2400);  \n' +
  'myservoRightFoot.write(90-RFFWRS); \n' +
  ' delay(300);\n' +
  ' myservoRightFoot.detach();\n' +
  ' delay(100);\n' +
  'myservoLeftLeg.write(LATL); \n' +
  'myservoRightLeg.write(RATL); \n' +
  ' delay(300);\n' +
  'myservoLeftFoot.attach(ServoLeftFootPin, 544, 2400); \n' +
  'myservoLeftFoot.write(90+LFFWRS);  \n' +
  ' delay(300);\n' +
  ' myservoLeftFoot.detach();\n' +
  ' delay(100);\n' +
  '} \n' +
  'void NinjaWalkBackward()\n' +
  '{\n' +
  'myservoLeftLeg.attach(ServoLeftLegPin, 544, 2400);\n' +
  'myservoRightLeg.attach(ServoRightLegPin, 544, 2400);\n' +
  'myservoLeftLeg.write(LATR); \n' +
  'myservoRightLeg.write(RATR);\n' +
  ' delay(300);\n' +
  ' myservoRightFoot.attach(ServoRightFootPin, 544, 2400); \n' +
  ' myservoRightFoot.write(90+RFFWRS); \n' +
  ' delay(300);\n' +
  ' myservoRightFoot.detach();\n' +
  ' delay(100);\n' +
  'myservoLeftLeg.write(LATL); \n' +
  'myservoRightLeg.write(RATL); \n' +
  ' delay(300);\n' +
  'myservoLeftFoot.attach(ServoLeftFootPin, 544, 2400); \n' +
  'myservoLeftFoot.write(90-LFFWRS);  \n' +
  ' delay(300);\n' +
  ' myservoLeftFoot.detach();\n' +
  ' delay(100);\n' +
  '} \n' +
  'void NinjaWalkLeft()\n' +
  '{\n' +
  'myservoLeftLeg.attach(ServoLeftLegPin, 544, 2400);\n' +
  'myservoRightLeg.attach(ServoRightLegPin, 544, 2400);\n' +
  'myservoLeftLeg.write(LATR); \n' +
  'myservoRightLeg.write(RATR);\n' +
  ' delay(300);\n' +
  ' myservoRightFoot.attach(ServoRightFootPin, 544, 2400); \n' +
  ' myservoRightFoot.write(90-RFFWRS); \n' +
  ' delay(50);\n' +
  ' myservoRightFoot.detach();\n' +
  ' delay(100);\n' +
  'myservoLeftLeg.write(LATL); \n' +
  'myservoRightLeg.write(RATL); \n' +
  ' delay(300);\n' +
  'myservoLeftFoot.attach(ServoLeftFootPin, 544, 2400); \n' +
  'myservoLeftFoot.write(90+LFFWRS);  \n' +
  ' delay(300);\n' +
  ' myservoLeftFoot.detach();\n' +
  ' delay(100);\n' +
  '} \n' +
  'void NinjaWalkRight()\n' +
  '{\n' +
  'myservoLeftLeg.attach(ServoLeftLegPin, 544, 2400);\n' +
  'myservoRightLeg.attach(ServoRightLegPin, 544, 2400);\n' +
  'myservoLeftLeg.write(LATR); \n' +
  'myservoRightLeg.write(RATR);\n' +
  ' delay(300);\n' +
  ' myservoRightFoot.attach(ServoRightFootPin, 544, 2400);  \n' +
  'myservoRightFoot.write(90-RFFWRS); \n' +
  ' delay(300);\n' +
  ' myservoRightFoot.detach();\n' +
  ' delay(100);\n' +
  'myservoLeftLeg.write(LATL); \n' +
  'myservoRightLeg.write(RATL); \n' +
  ' delay(300);\n' +
  'myservoLeftFoot.attach(ServoLeftFootPin, 544, 2400); \n' +
  'myservoLeftFoot.write(90+LFFWRS);  \n' +
  ' delay(50);\n' +
  ' myservoLeftFoot.detach();\n' +
  ' delay(100);\n' +
  '} ';

export const NINJA_ROLL_DEFINITIONS = [
  'void NinjaRollForward(int speed)',
  '{',
  '  myservoLeftFoot.attach(ServoLeftFootPin, 544, 2400);',
  '  myservoRightFoot.attach(ServoRightFootPin, 544, 2400);',
  '  myservoLeftFoot.write(90 + speed);',
  '  myservoRightFoot.write(90 - speed);',
  '}',
  'void NinjaRollBackward(int speed)',
  '{',
  '  myservoLeftFoot.attach(ServoLeftFootPin, 544, 2400);',
  '  myservoRightFoot.attach(ServoRightFootPin, 544, 2400);',
  '  myservoLeftFoot.write(90 - speed);',
  '  myservoRightFoot.write(90 + speed);',
  '}',
  'void NinjaRollLeft(int speed)',
  '{',
  '  myservoLeftFoot.attach(ServoLeftFootPin, 544, 2400);',
  '  myservoRightFoot.attach(ServoRightFootPin, 544, 2400);',
  '  myservoLeftFoot.write(90 - speed);',
  '  myservoRightFoot.write(90 - speed);',
  '}',
  'void NinjaRollRight(int speed)',
  '{',
  '  myservoLeftFoot.attach(ServoLeftFootPin, 544, 2400);',
  '  myservoRightFoot.attach(ServoRightFootPin, 544, 2400);',
  '  myservoLeftFoot.write(90 + speed);',
  '  myservoRightFoot.write(90 + speed);',
  '}',
].join('\n');

export const NINJA_HOME_DEFINITION =
  'void NinjaHome()\n' +
  '{ \n' +
  'myservoLeftFoot.attach(ServoLeftFootPin, 544, 2400);\n' +
  'myservoRightFoot.attach(ServoRightFootPin, 544, 2400); \n' +
  'myservoLeftLeg.attach(ServoLeftLegPin, 544, 2400); \n' +
  'myservoRightLeg.attach(ServoRightLegPin, 544, 2400); \n' +
  'myservoHead.attach(ServoHeadPin, 544, 2400); \n' +
  'myservoLeftArm.write(180); \n' +
  'myservoRightArm.write(0);\n' +
  'myservoHead.write(90); \n' +
  'delay(400); \n' +
  'myservoLeftFoot.write(90); \n' +
  'myservoRightFoot.write(90);  \n' +
  'myservoLeftLeg.write(60); \n' +
  'myservoRightLeg.write(120); \n' +
  'delay(400);\n' +
  'myservoLeftLeg.detach();\n' +
  'myservoRightLeg.detach();\n' +
  'myservoLeftArm.detach();\n' +
  'myservoRightArm.detach();\n' +
  'myservoHead.detach();\n' +
  '}';

export const NINJA_SETWALK_DEFINITION =
  'void NinjaSetWalk()\n' +
  ' {\n' +
  'myservoLeftArm.attach(ServoLeftArmPin, 544, 2400);\n' +
  '  myservoRightArm.attach(ServoRightArmPin, 544, 2400); \n' +
  '  myservoLeftArm.write(90);   \n' +
  '  myservoRightArm.write(90);  \n' +
  ' delay(200);\n' +
  ' myservoLeftArm.detach();\n' +
  ' myservoRightArm.detach();\n' +
  ' myservoLeftLeg.attach(ServoLeftLegPin, 544, 2400);\n' +
  'myservoRightLeg.attach(ServoRightLegPin, 544, 2400);\n' +
  'myservoLeftLeg.write(LA0);\n' +
  'myservoRightLeg.write(RA0); \n' +
  ' delay(300);\n' +
  ' myservoLeftLeg.detach(); \n' +
  'myservoRightLeg.detach();\n' +
  ' myservoLeftArm.attach(ServoLeftArmPin, 544, 2400);\n' +
  ' myservoRightArm.attach(ServoRightArmPin, 544, 2400);\n' +
  ' myservoLeftArm.write(180); \n' +
  'myservoRightArm.write(0); \n' +
  ' delay(300);\n' +
  ' myservoLeftArm.detach(); \n' +
  'myservoRightArm.detach();\n' +
  '}  \n';

export const NINJA_SETROLL_DEFINITION =
  'void NinjaSetRoll()\n' +
  ' {myservoLeftArm.attach(ServoLeftArmPin, 544, 2400);\n' +
  'myservoRightArm.attach(ServoRightArmPin, 544, 2400);\n' +
  'myservoLeftArm.write(90);myservoRightArm.write(90); \n' +
  ' delay(200);\n' +
  ' myservoLeftArm.detach();myservoRightArm.detach();\n' +
  'myservoLeftLeg.attach(ServoLeftLegPin, 544, 2400);\n' +
  'myservoRightLeg.attach(ServoRightLegPin, 544, 2400);   \n' +
  'myservoLeftLeg.write(LA1); \n' +
  'myservoRightLeg.write(RA1);\n' +
  ' delay(300);\n' +
  ' myservoLeftLeg.detach();myservoRightLeg.detach();\n' +
  'myservoLeftArm.attach(ServoLeftArmPin, 544, 2400);\n' +
  'myservoRightArm.attach(ServoRightArmPin, 544, 2400);\n' +
  ' myservoLeftArm.write(180);myservoRightArm.write(0);\n' +
  ' delay(300);\n' +
  ' myservoLeftArm.detach();myservoRightArm.detach();}\n';

export const NINJA_WALKSTOP_DEFINITION =
  'void NinjaWalkStop()\n' +
  ' {myservoLeftFoot.write(90);\n' +
  ' myservoRightFoot.write(90); \n' +
  ' myservoLeftLeg.write(LA0); \n' +
  ' myservoRightLeg.write(RA0);}\n';

export const NINJA_ROLLSTOP_DEFINITION =
  'void NinjaRollStop()\n' +
  '{myservoLeftFoot.write(90);\n' +
  'myservoRightFoot.write(90); \n' +
  'myservoLeftFoot.detach(); \n' +
  'myservoRightFoot.detach();} \n';

export function buildNinjaCalibrationDefinitions(
  valuela: string,
  valuera: string,
  valuerlatl: string,
  valuerratl: string,
  valuerlatr: string,
  valuerratr: string
): string {
  return (
    'int LA0= 60 +' +
    valuela +
    '; // Left Leg standing Position; 0 = Full Tilt Right   180 = Full Tilt Left    Default = 60\n' +
    'int RA0= 120 +' +
    valuera +
    ';// Right Leg standing position; 0 = Full Tilt Right   180 = Full Tilt Left    Default = 120 \n' +
    'int LA1= 180; // Left Leg roll Position; 0 = Full Tilt Right   180 = Full Tilt Left    Default = 170\n' +
    'int RA1= 0;  // Right Leg roll position,0 = Full Tilt Right   180 = Full Tilt Left     Default = 10\n' +
    'int LATL= LA0 +' +
    valuerlatl +
    ';  // Left Leg tilt left walking position,0 = Full Tilt Right   180 = Full Tilt Left    Default = 90  \n' +
    'int RATL= RA0 +' +
    valuerratl +
    ';  // Right Leg tilt left walking position,0 = Full Tilt Right   180 = Full Tilt Left    Default = 180   \n' +
    'int LATR= LA0 -' +
    valuerlatr +
    ';  // Left Leg tilt right walking position,0 = Full Tilt Right   180 = Full Tilt Left     Default = 0   \n' +
    'int RATR= RA0 -' +
    valuerratr +
    ';  // Right Leg tilt right walking position,0 = Full Tilt Right   180 = Full Tilt Left     Default = 90  \n'
  );
}

export function buildNinjaInitDefinitions(
  pinLl: string,
  pinRl: string,
  pinLf: string,
  pinRf: string,
  pinLa: string,
  pinRa: string,
  pinH: string
): string {
  return (
    'const uint8_t ServoLeftLegPin =' +
    pinLl +
    '; // D8 or 15 \n' +
    'const uint8_t ServoRightLegPin=' +
    pinRl +
    '; // D4 or 2 \n' +
    'const uint8_t ServoLeftFootPin  =' +
    pinLf +
    '; // D7 or 13 \n' +
    'const uint8_t ServoRightFootPin =' +
    pinRf +
    '; // D3 or 0 \n' +
    'const uint8_t ServoLeftArmPin =' +
    pinLa +
    '; // D0 or 16 \n' +
    'const uint8_t ServoRightArmPin =' +
    pinRa +
    '; // RX or 3 \n' +
    'const uint8_t ServoHeadPin   =' +
    pinH +
    '; // TX or 1 \n' +
    'Servo myservoLeftLeg;\n' +
    'Servo myservoLeftFoot;\n' +
    'Servo myservoRightFoot;\n' +
    'Servo myservoRightLeg;\n' +
    'Servo myservoLeftArm;\n' +
    'Servo myservoRightArm;\n' +
    'Servo myservoHead;\n'
  );
}
