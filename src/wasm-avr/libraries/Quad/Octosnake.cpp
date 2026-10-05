#include "Octosnake.h"

OctosnakeOscillator::OctosnakeOscillator(){
    _period = 2000;
    _amplitude = 50;
    _phase = 0;
    _offset = 0;
    _stop = true;
    _ref_time = millis();
    _delta_time = 0;
}

float OctosnakeOscillator::update(){
    if (!_stop){
        _delta_time = (millis()-_ref_time) % _period;
        _output =   (float)_amplitude*sin(time_to_radians(_delta_time)
                    + degrees_to_radians(_phase))
                    + _offset;
    }

    return _output;
}

void OctosnakeOscillator::reset(){
    _ref_time = millis();
}

void OctosnakeOscillator::start(){
    reset();
    _stop = false;
}

void OctosnakeOscillator::start(unsigned long ref_time){
    _ref_time = ref_time;
    _stop = false;
}

void OctosnakeOscillator::stop(){
    _stop = true;
}

boolean OctosnakeOscillator::isStop() {
  return _stop;
}
void OctosnakeOscillator::setPeriod(int period){
    _period = period;
}

int OctosnakeOscillator::getPeriod(){
    return _period;
}

void OctosnakeOscillator::setAmplitude(int amplitude){
    _amplitude = amplitude;
}

void OctosnakeOscillator::setPhase(int phase){
    _phase = phase;
}

void OctosnakeOscillator::setOffset(int offset){
    _offset = offset;
}

void OctosnakeOscillator::setTime(unsigned long ref){
    _ref_time = ref;
}

float OctosnakeOscillator::getOutput(){
    return _output;
}

unsigned long OctosnakeOscillator::getTime(){
    return _ref_time;
}

float OctosnakeOscillator::getPhaseProgress(){
    return ((float)_delta_time/_period) * 360;
}

float OctosnakeOscillator::time_to_radians(double time){
    return time*2*PI/_period;
}

float OctosnakeOscillator::degrees_to_radians(float degrees){
    return degrees*2*PI/360;
}

float OctosnakeOscillator::degrees_to_time(float degrees){
    return degrees*_period/360;
}
