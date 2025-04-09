# Player specification

**This document describes methods of embedding and using the
Vintom player for playing Vintom personalized videos.
The document is prepared for IT engineers.**

##### VERSION 2. 7. 2

##### PUBLISHED 27. 11 .202 4

##### COPYRIGHT © BY VINTOM SP. Z O.O. <WWW.VINTOM> .COM

## Table of Contents

- 1 Requirements
  - 1.1 Supported browsers
  - 1.2 Content Security Policy
    - 1.2.1 Default configuration
    - 1.2.2 Google Analytics
    - 1.2.3 HTML animations
    - 1.2.4 Premium configuration
- 2 Features
  - 2.1 Basic playback
  - 2.2 Volume control
  - 2.3 Autostart
  - 2.4 Fullscreen
  - 2.5 Skinning
  - 2.6 Subtitles
  - 2.7 Poster
- 3 Embedding a video player using IFRAME
- 4 Embedding a video player using JavaScript hosted on Vintom side
  - 4.1 Configurable parameters
- 5 Embedding a video player using JavaScript hosted on the client side
  - 5.1 Npm installation
  - 5.2 Installation from the zip file
  - 5.3 Importing player in your code..............................................................................................
  - 5.4 Adding player files to your site
  - 5.5 Initializing and configuring player
- 6 Processing data at the client’s side
- 7 Player events
  - 7.1 Subscribing to player events
  - 7.2 Calling methods on player
  - 7.3 Handling events for player embedded in iframe
- 8 Technical details
  - 8.1 Third-party libraries
  - 8.2 Cookie
  - 8.3 Outgoing connections

## 1 Requirements

### 1.1 Supported browsers

Following browsers are supported:

- Chrome 50 or later
- Firefox 50 or later
- Opera 3 6 or later
- Safari 10 or later
- Edge 1 5 or later
- Samsung 7 or later
- Android browser 4 or later
- Huawei browser 11 or later
- Miui browser 10 or later

### 1.2 Content Security Policy

#### 1.2.1 Default configuration

If the page on which the player is to be embedded defines CSP rules, it should be verified whether
they comply with the player's requirements.

Necessary project files can be hosted either on Vintom's side or the client's side. For the purposes of
understanding CSP requirements, the following variables have been defined:

- [project_assets_server_url] - this refers to the location for hosting project elements (fonts,
    images, scripts, configuration, etc). If hosted on Vintom's side it is equal to "vintom.com" and
    "*.vintom.com"
- [streaming_server_url] - this refers to the location for hosting video stream files. If hosted on
    Vintom's side it is equal to "*.blob.core.windows.net".

Below are the minimum CSP requirements for the player:

default-src 'none';
script-src 'self' [project_assets_server_url];
img-src 'self' blob: data: [project_assets_server_url];
font-src 'self' [project_assets_server_url];
style-src 'self' [project_assets_server_url];
connect-src 'self' blob: data: [project_assets_server_url]
[streaming_server_url];
worker-src 'self' blob:;
media-src 'self' blob: data: [project_assets_server_url]
[streaming_server_url];
child-src 'self' blob:

#### 1.2.2 Google Analytics

The use of additional analytics in Google Analytics (this is default player option) requires the
following additional rules:

script-src [http://www.google-analytics.com](http://www.google-analytics.com) [http://www.googletagmanager.com](http://www.googletagmanager.com)
img-src [http://www.google.com](http://www.google.com) [http://www.google-analytics.com](http://www.google-analytics.com) *.blob.core.windows.net
connect-src*.google-analytics.com stats.g.doubleclick.net

#### 1.2.3 HTML animations

The use of HTML animations needed in some projects requires an additional CSP rule. Ask your
Account Manager if your project requires this option. It requires the following additional rule:

script-src 'unsafe-eval'

#### 1.2.4 Premium configuration

There is an additional paid option to hide all communication to Azure and use Vintom proxy server.
Thanks to this, you can get the simplest version of the CSP rules:

default-src 'none';
script-src 'self' [project_assets_server_url];
img-src 'self' blob: data: [project_assets_server_url];
font-src 'self' [project_assets_server_url];
style-src 'self' [project_assets_server_url];
connect-src 'self' blob: data: [project_assets_server_url];
worker-src 'self' blob:;
media-src 'self' blob: data: [project_assets_server_url];
child-src 'self' blob:

## 2 Features

### 2.1 Basic playback

For desktop play/pause icon is available from the control bar at the bottom of the player. Clicking on
a video area when no CTA is displayed also stops the player. When the video is paused, a play icon
appears in the video area.

For mobile devices, the play icon appears in the video area when the video is not playing. The pause
icon appears after touching the screen with the player and is visible for 2 seconds. During this time,
touching the screen with the player again stops the playback. When the play or pause icon is visible
after starting the video, the controlbar is also visible.

The user can seek a video using the seekbar on the control bar at the bottom of the player. For
interactive scenarios, the seekbar is divided into parts, and next parts are not seekable until the
previous part of the scenario is completed. Seekbar is not available for some interactive scenarios
with a dynamic number of parts.

After the video has finished playing, a replay button appears on the seekbar. If there is no CTA at the
end of the video, the replay button will also appear in the video area.

### 2.2 Volume control

The volume control icon is available from the control bar at the bottom of the player for desktops
and in the upper right corner for mobiles.

For desktop devices, hovering the cursor over the icon causes the appearance of a volume slider to
set a specific volume. On mobile, the volume level is controlled from the device. For both desktop
and mobile, clicking the volume icon mutes the sound, and clicking again restores the volume to its
previous value.

### 2.3 Autostart

Modern browsers block the ability to automatically start video with sound without user interaction.
For this reason, by default, Vintom player requires the user to click the play button before starting
playback.

Alternatively, you can configure the player so that it starts playing the video automatically but
without sound, and only the user's action turns on the sound. This approach is not recommended
because the personalized video contains important content also in the first scenes.

Vintom player, on the other hand, allows you to automatically start the initial video scene without
sound in a loop. After the video fragment has been played, it will start playing again. At the same
time, the player displays the play icon. After clicking the play icon, the video starts playing from the
beginning, with sound. Such a looped scene should be selected at the creation stage so that the
moment of looping is smooth.

### 2.4 Fullscreen

The fullscreen icon is displayed in the control bar at the bottom of the player for desktops and in the
upper right corner for mobiles.

Vintom player uses Fullscreen API methods to support fullscreen functions. For devices or browsers
that does not support these methods, in particular the iPhone, the player instead imitates fullscreen
by filling the entire browser window using CSS. The player cannot use the default iPhone video player
because the Vintom video has many additional functions that must be performed in the HTML layer,
e.g. displaying CTA, displaying subtitles or collecting statistics from video watching. Due to the fact
that the player imitates the behavior of fullscreen on the iPhone, this function will not work and is
not available when embedding the player in an Iframe. If you need this function on iPhone, please
embed player via JavaScript.

### 2.5 Skinning

Vintom player allows you to configure the player's default color, which will be used in some of its
elements, such as: the played video fragment marked on the seekbar or the current playback time.

### 2.6 Subtitles

Vintom player allows you to display video subtitles. The availability of subtitles in the video must be
configured at the creation stage.

In the player, you can additionally configure whether the subtitles should appear automatically at the
start or not.

The subtitle on/off icon is located on the seekbar at the bottom of the player for desktop and in the
upper right corner for mobile.

Subtitles are displayed in the video area at the bottom. If subtitles are available, this should be
considered at the creative stage when creating the video, so as not to place other important
elements at the bottom of the video.

### 2.7 Poster

Vintom player allows you to configure a poster that will be displayed after the user displays the
player, before the video buffers and before the user starts playing the video. The poster is one of the
video frames, but not necessarily the first.

The poster must be defined at the stage of creation. If the poster is not configured, the first frame of
the video will be displayed after the video has been buffered.

## 3 Embedding a video player using IFRAME

The video should be embedded using the following HTML code:

<style>
.player-container {
max-width: [width_of_video_in_project]px;
}
.player-iframe-container {
position: relative;
height: 0;
overflow: hidden;
padding-bottom: 56.25%; /* Video aspect ratio 16x9 */
}
.player-iframe-container iframe {
position: absolute;
top:0;
left: 0;
width: 100%;
height: 100%;
}
</style>
<div class="player-container">
<div class="player-iframe-container">
<iframe src="//vintom.com/video/embed/[code]" frameborder="0"
scrolling="no" allowfullscreen></iframe>
</div>
</div>

Note, fullscreen doesn't work on iPhone when embedding via IFRAME (see 2.4). If you need this
function on iPhone, please embed player via JavaScript.

## 4 Embedding a video player using JavaScript hosted on Vintom side

Embedding a video using JavaScript hosted on Vintom side requires adding following code to the
<head> section of your HTML document:

<script src="https://player.vintom.com/player/2. 15. 2 /index.js"></script>
<link rel="stylesheet"
href="https://player.vintom.com/player/2. 15. 2 /public/css/style.css">

A <div> object with unique identifier needs to be located in proper place for the video. A <div> object
should also contain an additional class which will define its size.

<body>
<div class="playerContainer">
<div class="player" id="playerElementId"></div>
</div>
</body>

Sample script you can add on HTML page to run player (where “playerElementId” is your tag id):

window.addEventListener("load", function() {
new window.vintom.Player()
.initialize("playerElementId","[videoCode]")
.run();
})

### 4.1 Configurable parameters

You can override the following properties:

**ConfigurationOverride (all fields are optional)**

{
"autoplay": <boolean>,
"mutedStart": <boolean>, //player is muted on start
"subtitlesActiveOnStart": <boolean>, //subtitles are active on start if
enabled
"analyticsEndpoints": <array of AnalyticsEndpoint>,
"playerControls": <PlayerControls>,
"skin": <Skin>,
"playerServerUrl": <string>, //vintom server URL
"ctaStorageUrl": <string> //location of custom CTA files
}

where AnalyticsEndpoint, PlayerControls and Skin are:

**AnalyticsEndpoint**

{
"pr": <"GA>, // mandatory
"st": <string>, // Google Analytics account id
}

**PlayerControls (all fields are optional)**

{
"l": <string>, // logo url
"lv": <boolean>, // should logo be visible permanently
"se": <boolean>, // is seekbar enabled
"ce": <boolean>, // is controlbar enabled
"pe": <boolean>, // is play / pause enabled
"fe": <boolean>, // is fullscreen enabled
"soe": <boolean>, // is social share button enabled
}

**Skin**

{
"c": <string> // theme color in HEX (ie. #aa22ff)
}

**Usage example**

const localConfigurationOverride = {
"adminMode": true,
"autoplay": false,
"mutedStart": true,
"skin": {
"c": "#ce94d7" // theme color in HEX (ie. #aa22ff)
}
};

var player;
window.addEventListener("load", function() {
player = new window.vintom.Player()
.initialize("playerElementId", "yCPBzCwB")
.setup(localConfigurationOverride)
.run();
})

## 5 Embedding a video player using JavaScript hosted on the client side

The player consists of the following parts:

- JavaScript bundle
- external CSS styles file
- external woff font files
- external library for video support (video.js)
- external library for animation support (lottie-web.js)

The player can be either installed using npm / yarn or downloaded as a zip file from the Vintom
website.

### 5.1 Npm installation

1. Add this feed to your project .npmrc:
    registry=<https://registry.npmjs.org/>
    @vintom:registry=<https://pkgs.dev.azure.com/vintom2/vintom->
    player/_packaging/player-prod/npm/registry/
2. Install @vintom/vintom-player@2.15.2.

### 5.2 Installation from the zip file

The zip file can be downloaded from <https://player.vintom.com/player/2.15.2/vintom-player.zip> The
zip file contains all the artifacts needed for the player - player JavaScript source file, styles, fonts,
video.js and lottie-web in required versions.

### 5.3 Importing player in your code

In order to create the player you need to use the *Player* constructor. You can obtain the *Player*
constructor in either of two ways:

- if you are using ES6 in your project you can use ES6 import to import the constructor from
    *vintom-player*

```
import { Player } from "vintom-player";
const handle = new Player()
```

- if you prefer the *Player* constructor is also available in the global *vintom* namespace

```
const handle = new window.vintom.Player()
```

You need to remember to import the player styles as well. You can do it:

- by importing them in your project

```
import "vintom-player/vintomDist/public/css/style.css"
```

- by including the file in the HTML page

```
<link rel="stylesheet"
href="https://player.vintom.com/player/2. 15. 2 /public/css/style.css">
```

The above ways of creating the player are equivalent - it is the same constructor, so the subsequent
initialization, configuration, and interaction with the player look exactly the same in both cases.

### 5.4 Adding player files to your site

You can use the main player JavaScript bundle on your site the same way you would use any other
JavaScript library. You can bundle it with your JavaScript or you can serve it separately from any URL
on your server.

You have to add the CSS file in a similar way by adding it to an existing CSS file or just as a separate
stylesheet file on the web.

The rest of the files, however, is loaded by the player lazily, video.js is loaded only when the scenario
contains at least one element with video, lottie-web only if the scenario contains at least one
element with animation.

The player will try to load font files, video.js and lottie-web from the following locations:

- video.js: <jsAssetsUrl>*/video.js/video.min.js*
- lottie-web: <jsAssetsUrl>*/lottie-web/lottie.min.js*
- fonts: [from the 'fonts' directory at the same level as the CSS file directory]

Default value for <jsAssetsUrl> is */public*. It can be overriden in configuration json or local
configuration json. To override the location in configuration json use "jsAssetsUrl" field.

Example:

const localConfigurationOverride = {
"jsAssetsUrl": "[your location]"
};

var player;
window.addEventListener("load", function() {
player = new window.vintom.Player()
.initialize("playerElementId", "yCPBzCwB")
.setup(localConfigurationOverride)
.run();
})

Values specified in local configuration take precedence over values specified in the configuration.
Values in configuration take precedence over default values.

If you installed the player from the zip file you will find all the artifacts (video.js, lottie.min.js, styles
and fonts) inside the zip.

If you installed the player using npm you will find the artifacts in the following locations:

- video.js: *node_modules/video.js/dist/video.min.js*
- lottie-web: *node_modules/lottie-web/build/player/lottie.min.js*
- styles: *node_modules/vintom-player/dist/public/css*
- fonts: *node_modules/vintom-player/dist/public/fonts*

### 5.5 Initializing and configuring player

There are a few things you have to do when instantiating the player:

- you have to tell the player which DOM element (ie. <div id="playerElementId">) it should
    attach itself to
- you have to pass a configuration object to the player. This can either be a local JavaScript
    object or a JSON on a server (in case it's a file on a server, you can override some of the
    properties with a local object)
- if your scenario contains personalized animations you can pass an object with
    personalization data to the player
- you may optionally specify player dimensions
- once you have done all of the above you have to call *run* on the player

Sample script you can add on HTML page:

window.addEventListener("load", function() {
new window.vintom.Player()
.initialize("playerElementId", "videoCode")
.run();
})

## 6 Processing data at the client’s side

In certain projects, the requirements of the client's security policy may prohibit the processing of
sensitive or all data on Vintom's side. In such scenarios, the client has the option to push such data
straight from their system into the video player. If all data is directly fed into the player, an on-
premise deployment can be employed, eliminating the necessity for communication with external
systems. Further information about such solutions can be found in the "Vintom - Deployment
Architecture" document, specifically in the chapters detailing the architectures:

- Hybrid infrastructure
- Data in the client’s infrastructure
- All in the client’s infrastructure

To use data processing in the player, several conditions must be met:

- at the creative stage, the project must be specially prepared for the ‘data-push method’. This
    means that the data to be pushed into the video player from the client’s system must be
    precisely specified in advance
- the player must be embedded using JavaScript (see 4 or 5 )

When pushing only sensitive data (hybrid infrastructure), Vintom API generates unique video
identifiers (video code). The player initialization will look like this:

const handle = new Player()
.initialize("playerElementId", "[videoCode]")
.setup(configurationObject)
.personalize(personalizationObject)
.run();

where personalizationObject is an object containing variables to be personalized for a specific
project:

{
name: "John",
amount: "1234"
}

When pushing all data to the player, there is no video codes generated by the Vintom. The player
initialization will look like this:

const handle = new Player()
.initialize("playerElementId")
.setup(configurationObject)
.personalize(personalizationObject)
.run();

where personalizationObject is an object containing project code and variables to be personalized for
a specific project:

{
projectCode: "DEMO",
name: "John",
amount: "1234"
}

## 7 Player events

### 7.1 Subscribing to player events

Following events are fired by the player:

- Ready
    o fired once the player has finished initializing
    o no payload
- error
    o fired when an error occurs
    o payload

{
message: <string>
}

- play
    o fired when playback starts
    o payload
       {
time: <nubmer>,
playing: <boolean>,
part: <number>,
scenarioElementId: <string>
}
- pause
    o fired when playback pauses
    o payload

{
time: <nubmer>,
playing: <boolean>,
part: <number>,
scenarioElementId: <string>
}

- finish
    o fired when whole scenario ends
    o payload

{
time: <nubmer>,
playing: <boolean>,
part: <number>,
scenarioElementId: <string>
}

- action
    o fired when a CTA action is invoked
    o payload

{
time: <nubmer>,
playing: <boolean>,
part: <number>,

scenarioElementId: <string>,
ctaId: <number>,
actionId: <number>,
actionAdditionalData: <object>
}

You can subscribe to player events by using the handle returned by player initialization. There are
two ways of subscribing to events:

- using on method with the event's name

const handle = new Player()
.initialize("playerElementId")
.setup(configurationObject)
.run();

handle.on("play", function(payload){ .... });
handle.on("action", function(payload) { .... });

- using methods with names derived from the event name. For every event there is a
    corresponding method to register a callback in the shape of
    vintomPlayer{upperCasedEventName}

const handle = new Player()
.initialize("playerElementId")
.setup(configurationObject)
.run();

handle.vintomPlayerReady(function(){ .... });
handle.vintomPlayerPlay(function(payload) { .... });
handle.vintomPlayerAction(function(payload) { .... });

### 7.2 Calling methods on player

The handle obtained from player initialization exposes methods that can be used to drive scenario
playback.

Following methods are available on the handle:

- play() - starts playback
- pause() - pauses playback
- replay() – starts playback from the beginning
- move(id) - jumps to scenario element with the specified id
- action(ctaId, actionId, args) - invokes a CTA action
- getState() - returns current player state

{
time: <nubmer>,
playing: <boolean>,
part: <number>,
scenarioElementId: <string>
}

- remove() - completely removes the player from the site (clears timeouts, removes listeners
    created by the player, etc.)

Usage example:

const handle = new Player()
.initialize("playerElementId")
.setup(configurationObject)
.run();

handle.play();
handle.pause();
handle.move(2);

### 7.3 Handling events for player embedded in iframe

If iframe embedding method is used (see 3 ), then message communication should be chosen to listen
for events.

JavaScript example of listening for message event (e.data is an object):

window.addEventListener("message", function(e) {
console.log('event from inside iframe');
console.log(e.data);
}, false);

Example output:

code: "[video_code]"
playing: false
time: 5.
type: vintomPlayerPause

## 8 Technical details

### 8.1 Third-party libraries

The player uses following third-party libraries:

**Library Version**
can-autoplay 3.0.
date-fns 1.30.
dompurify 2. 4. 9
es6-shim 0.35.
fullscreen-api-polyfill 1.1.
inversify 5.0.
json-stable-stringify 1.0.
loadjs 3.5.
lottie-web 5. 12.
npm 10.5.
react-ga4 2.1.
react-inlinesvg 4.1.
reflect-metadata 0.1.
sparskon 1.3.
ts-md5 1.2.
ua-parser-js 1.0.
video.js 7.21.
vm-browserify 1.1.
whatwg-fetch 3.0.

### 8.2 Cookie

The player stores and processes the following cookies:

**Name Value Expiring Description**
videojs-vhs JSON object Local storage Current bitrate for video stream
optimization
vintomLanguage String Session User default language, for selecting
multilanguage subtitles
vintomSubtitlesDisplayed Boolean Session Whether subtitles are enabled
vintomUserIdentifier String Session User unique session id for
identifying in analytic system
vintomVolume Number Session Current volume level
_gid String 1 day Optional. Google Analytics identifier
_ga*String 1 year Optional. Google Analytics identifier
_lfa String 1 year Optional. Google Analytics identifier
_gat* Number 1 minute Optional. Google Analytics identifier

### 8.3 Outgoing connections

When using a player hosted in the Vintom infrastructure, the player makes the following requests for
external resources:

**Resource
group id**

```
Url Method Description
```

1. <https://player2.vintom.com/player/2>.
    15. 2 /public/fonts/*.woff

```
GET Font used by the player
```

1. <https://player2.vintom.com/player/2>.
    15. 2 /public/video.js/video.min.js

```
GET Video engine library
```

1. <https://player2.vintom.com/player/2>.
    15. 2 /public/lottie-web/lottie.min.js

```
GET Optional. HTML animation library
```

2. <https://player2.vintom.com/cta/>* GET Files for video CTA
2. <https://player2.vintom.com/html->
    anims/*

```
GET Files for video HTML animations
```

2. <https://player2.vintom.com/campaign>
    - assets/*

```
GET Other files for the video project e.g.
music files
```

3. <https://vintom.com/videoConfiguratio>
    n/v2/*

##### GET

##### POST

```
Get video configuration for given
video code
```

4. <https://farm*.vintom.com/>*
    https://*.blob.core.windows.net/*

```
GET Project rendered assets like: video
stream, first frame, poster, subtitles
```

5. <https://vintom.com/v2/analytics/facts> POST Sends single analytics event to
    Vintom System
5. <https://www.googletagmanager.com/>
    gtag/js

```
GET Optional. Google Analytics library
```

5. <https://www.google->
    analytics.com/analytics.js

```
GET Optional. Google Analytics library
```

5. <https://www.google->
    analytics.com/collect

```
GET Optional. Sends single analytics
event to Google Analytics
```

Individual resources can either be replaced with those hosted on the client's side or completely
removed from the configuration. This flexibility enables the realization of a fully on-premise solution,
where all player communication is contained within the client's infrastructure.

Eliminating resources from the following groups requires certain steps:

1. The method of hosting the player on the client's side, as described in Chapter 5. "Embedding
    a video player using JavaScript hosted on the client side", should be applied.
2. Static configuration files (JS, CSS, HTML), separate for each project, can be transferred and
    hosted from the client's servers. In this case, a new location for these files should be
    configured in the player.
3. This endpoint returns the configuration of video streams based on the provided video code
    (codes are assigned after passing personalization data to the Vintom's API) or a set of
    personalized data sent to the endpoint. To prevent data transfer to Vintom, you can utilize
    the method of processing data on the client's side as described in Chapter 6. "Processing
    data at the client’s side".

4. Rendered elements of the video stream, such as the first frame, poster, etc., can also be
    transferred to the client's infrastructure and hosted from their servers. However, it should be
    noted that this requires more disk space and a provision of adequate bandwidth when the
    project is launched. Detailed information is provided in the "Vintom - Deployment
    Architecture" document, specifically under the "All in the client's infrastructure"
    architecture.
5. The analytics are fully configurable. Both the transmission of data to Google Analytics and
    the Vintom analytics system can be disabled. In this case, the client needs to receive, record,
    and process data on their side, using events sent by the player (see Chapter 7. "Player
    events").
