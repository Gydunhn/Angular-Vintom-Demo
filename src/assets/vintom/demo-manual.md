# Demo project manual

#### VERSION 2. 1

#### PUBLISHED 30. 07 .202 4

#### COPYRIGHT © BY VINTOM SP. Z O.O. <WWW.VINTOM> .COM

## Table of Contents

- 1 Introduction
- 2 Data transfer to Vintom servers
  - 2.1 Sending a single data package
  - 2.2 Sending a single video request
- 3 Data transfer to Video player
- 4 Live example

## 1 Introduction

This document provides instructions for testing integration using Vintom’s demo project.

It outlines three methods of transferring personalized data to Vintom, each of which is suitable for a
specific deployment architectural variant^1. If you are unsure about which method to use, please
consult with our Customer Service:

- **Data transfer to Vintom servers** : In this asynchronous scenario, the client sends a dataset to
    Vintom's servers via the REST API. This dataset contains data for either multiple or single
    video personalization. The videos will then be rendered and ready for playback within the
    contractually agreed delivery time. This method is most relevant for the "All in Vintom
    infrastructure" deployment architecture.
- **Data transfer to Video player** : This method is particularly appropriate when the customer
    requires the highest level of data security. Here, the customer pushes data directly to the
    Vintom player API when the end user opens the webpage or application. Since all necessary
    video components are prepared prior to the campaign launch, the video is ready for
    immediate playback when the user launches the player. Notably, no personal data is
    processed on Vintom's side in this scenario. This method suits the "Data in the client’s
    infrastructure" and "All in the client’s infrastructure" deployment architectures.
- **Data transfer to both** : First, data is transferred to Vintom servers for rendering. After the
    rendering process is completed, the remaining data can be pushed directly to the Vintom
    player API. This method aligns with the "Hybrid infrastructure" deployment architecture.

(^1) More information about Vintom’s architecture options can be found in the "Vintom – Deployment
architecture" document

## 2 Data transfer to Vintom servers

Data can be sent to the Vintom servers in one of two ways: as a single data package for multiple
videos or as separate requests for each individual video.

- **Single data package** is optimal when there is a need to render a large number of videos at
    once. It also makes it easier to analyze the performance for the entire video package. In this
    variant, one request with data is sent to the API and in response you receive links to all
    videos at once.
- **Separate request** is suitable for scenarios where a video should be generated due to a
    specific event (e.g. after a purchase, upon account creation), for live scenarios, or when the
    number of videos is relatively small. Please note that this method has limitations regarding
    the number of requests that can be made.

For more detailed information, please refer to chapter 2 of the "Vintom – Integration specification".

### 2.1 Sending a single data package

**Url structure**

<https://api.vintom.com/databases>

**HTTP method**

POST

**Content type**

multipart/form-data

**Basic authentication**

username: vintomfeatures

password: demo

**Body parameters**

- projectCode - a fixed value "VINTOMFEATURESDEMO1"
- database – the file to be uploaded (required). The file contains rows with data for individual
    videos. First row should be a header with column names. Columns should have following
    order:
       o id
       o name
       o data_source
       o language
       o image
       o colour
       o percent
       o chart

- codeLength – the length of the video's unique code (32 characters by default)

**Database parameters description**

### Name Description

id Optional, id that can be used by the customer
name Required, the name will be displayed and, in the case of a name from the list (see
<https://demo.vintom.com>), also will be used in audio
data_source Required, should be provided "API" value
language Required, language for the subtitles. Can be use: ENG, ES or PL
image Required, one of the following: flower, fish, car, house or family
colour Required, one of the following: blue, yellow, green, purple or red
percent Required, the number between 0 and 100
chart Required, type of chart: "bar chart" or "pie-chart"

### 2.2 Sending a single video request

**Url structure**

<https://api.vintom.com/videos>

**HTTP method**

POST

**Content type**

application/json

**Basic authentication**

username: vintomfeatures

password: demo

**Body**

{
"projectCode":"VINTOMFEATURESDEMO1",
"id":" 1 ",
"name":"Peter",
"data_source":"API",
"language":"ENG",
"image":"fish",
"colour":"blue",
"percent":" 45 ",
"chart":"pie-chart"
}

## 3 Data transfer to Video player

The player API allows you to send the same variables as to the Vintom server, but directly to the
player. You can use a "Hybrid infrastructure" variant (still using the video code and sending only part
of the data to the video player, overwriting the data on the server) or use all the data in the "Data in
the client’s infrastructure" variant (sending all the data to the video player without any
communication with the Vintom server).

For "Hybrid infrastructure" variant set some of the following variables, for "Data in the client’s
infrastructure" set all variables from the list:

- name – only the one from the list can be used (see <https://demo.vintom.com>)
- data_source
- language
- image
- colour
- percent
- chart
- cta_url

and prepare JS object:

var personalizedData = {
"projectCode":"VINTOMFEATURESDEMO1",
"name":"Peter",
"data_source":"API",
"language":"ENG",
"image":"fish",
"colour":"blue",
"percent":" 45 ",
"chart":"pie-chart",
"cta_url":"<https://www.vintom.com>"
};

Since the input data must be validated and recalculated, an additional method prepared specifically
for this demo project must be used before initializing the player. For each project, Vintom will
prepare a different library with a validator. Add the following code to your web page:

<meta charset="UTF-8">

<script src="https://player.vintom.com/campaign-assets/VINTOMFEATURESDEMO1/preparePlayerData.min.js"></script>

var hybrid = true; //set this variable properly
var playerData = preparePlayerData(personalizedData, hybrid);

You can then embed the player using the standard method described in chapter 5.4 of the "Vintom –
Integration specification".

For the "Hybrid infrastructure" variant, you need to add the video code to the initialization code:

window.addEventListener("load", function() {
new window.vintom.Player()
.initialize("playerElementId", "3bJfdy3O")

.personalize(playerData)
.run();
});

For "Data in the client’s infrastructure" variant, you need to initialize the player without the video
code:

window.addEventListener("load", function() {
new window.vintom.Player()
.initialize("playerElementId")
.personalize(playerData)
.run();
});

## 4 Examples

You can test a live example on <https://demo.vintom.com>

Or you can download HTML with full example of the data transfer to the video player from
<https://player.vintom.com/campaign-assets/VINTOMFEATURESDEMO1/player.html>
