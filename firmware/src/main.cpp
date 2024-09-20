#include <Arduino.h>
/*
  Simple Internet Radio Demo
  esp32-i2s-simple-radio.ino
  Simple ESP32 I2S radio
  Uses MAX98357 I2S Amplifier Module
  Uses ESP32-audioI2S Library - https://github.com/schreibfaul1/ESP32-audioI2S

  DroneBot Workshop 2022
  https://dronebotworkshop.com
*/

// Include required libraries
#include <WiFiManager.h> // Include the WiFiManager library
#include "Audio.h"

// Define I2S connections
#define I2S_LRC D0
#define I2S_BCLK D1
#define I2S_DOUT D2
#define I2S_SD_OUT D3

// Create audio object
Audio audio;
WiFiManager wm;

void simpleSetup()
{
    // **Set the portal title to "Starmoon AI"**
    wm.setTitle("Starmoon AI");

    // Set the menu to only include "Configure WiFi"
    std::vector<const char *> menu = {"wifi"};
    wm.setMenu(menu);

    // **Inject custom CSS to hide unwanted elements**
    String customHead = "<title>Starmoon setup</title>"
                        "<style>"
                        "  .msg { display: none; }" /* Hide the "No AP set" message */
                        "  h2 { display: none; }"   /* Hide default heading "WiFiManager" */
                        "</style>";
    wm.setCustomHeadElement(customHead.c_str());

    // **Inject custom HTML into the page body**
    String customHTML = "<h1 style='text-align:center;'>Starmoon AI</h1>";
    wm.setCustomMenuHTML(customHTML.c_str());

    // Start the configuration portal
    bool res = wm.startConfigPortal("Starmoon device");

    if (res)
    {
        Serial.println("Connected to Wi-Fi!");
        Serial.println("IP address: ");
        Serial.println(WiFi.localIP());
    }
    else
    {
        Serial.println("Failed to connect to Wi-Fi");
        ESP.restart(); // Optionally restart or handle the failure
    }
}

void setup()
{

    // Start Serial Monitor
    Serial.begin(115200);

    // Set SD_PIN as output and initialize to HIGH (unmuted)
    pinMode(I2S_SD_OUT, OUTPUT);
    digitalWrite(I2S_SD_OUT, HIGH);

    simpleSetup();

    // Connect MAX98357 I2S Amplifier Module
    audio.setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT);

    // Set thevolume (0-100)
    audio.setVolume(90);

    // Connect to an Internet radio station (select one as desired)
    // audio.connecttohost("http://vis.media-ice.musicradio.com/CapitalMP3");
    // audio.connecttohost("mediaserv30.live-nect MAX98357 I2S Amplifier Module
    // audio.connecttohost("www.surfmusic.de/m3u/100-5-das-hitradio,4529.m3u");
    // audio.connecttohost("stream.1a-webradio.de/deutsch/mp3-128/vtuner-1a");
    // audio.connecttohost("www.antenne.de/webradio/antenne.m3u");
    audio.connecttohost("0n-80s.radionetz.de:8000/0n-70s.mp3");
}

void loop()

{
    // Run audio player
    audio.loop();
}

// Audio status functions

void audio_info(const char *info)
{
    Serial.print("info        ");
    Serial.println(info);
}
void audio_id3data(const char *info)
{ // id3 metadata
    Serial.print("id3data     ");
    Serial.println(info);
}
void audio_eof_mp3(const char *info)
{ // end of file
    Serial.print("eof_mp3     ");
    Serial.println(info);
}
void audio_showstation(const char *info)
{
    Serial.print("station     ");
    Serial.println(info);
}
void audio_showstreaminfo(const char *info)
{
    Serial.print("streaminfo  ");
    Serial.println(info);
}
void audio_showstreamtitle(const char *info)
{
    Serial.print("streamtitle ");
    Serial.println(info);
}
void audio_bitrate(const char *info)
{
    Serial.print("bitrate     ");
    Serial.println(info);
}
void audio_commercial(const char *info)
{ // duration in sec
    Serial.print("commercial  ");
    Serial.println(info);
}
void audio_icyurl(const char *info)
{ // homepage
    Serial.print("icyurl      ");
    Serial.println(info);
}
void audio_lasthost(const char *info)
{ // stream URL played
    Serial.print("lasthost    ");
    Serial.println(info);
}
void audio_eof_speech(const char *info)
{
    Serial.print("eof_speech  ");
    Serial.println(info);
}