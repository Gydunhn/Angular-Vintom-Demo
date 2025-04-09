# Deployment Architecture

**This document furnishes a detailed analysis of five distinct
architectural deployment options for Vintom's personalized video
solution. It encompasses configurations that span from entirely
Vintom hosted to a complete client-side setup. This guide caters to
prospective clients and partners who are evaluating Vintom's
offerings, assisting them in comprehending the technical
prerequisites, capabilities, and data security elements of each
variant. This understanding will enable them to make a well-
informed decision tailored to their unique requirements and
limitations.**

#### VERSION 1

#### PUBLISHED 17. 04 .202 4

#### COPYRIGHT © BY VINTOM SP. Z O.O. <WWW.VINTOM> .COM

## Table of Contents

- 1 Introduction
- 2 Glossary
- 3 Deployment architecture - variants
  - 3.1 All in Vintom infrastructure
  - 3.2 Hybrid infrastructure
  - 3.3 Data in the client’s infrastructure
  - 3.4 All in the client’s infrastructure
  - 3.5 All in client’s Azure cloud
- 4 Comparative analysis of all variants

## 1 Introduction

This document describes different deployment architectural variants for the Vintom personalized
video service. The choice of variant impacts:

- Workload and complexity on the client's IT side
- Security level of data processing
- Data processing locations
- Single video delivery time
- Billing method and cost
- Creative capabilities in the video template

Given that the chosen variant impacts many business-organizational aspects, it's recommended to
carefully read this document, understand the offered variants thoroughly, and if needed, arrange a
meeting with the Vintom team who can explain the details, assist in making key decisions and help
choose the best variant.

## 2 Glossary

- **Project** : A software-defined video template that can generate any number of personalized
    videos.
- **Vintom player** : A Javascript-based video player that's essential for displaying personalized
    videos. The player operates on every modern browser, has a dedicated mobile layout and
    can be used in mobile apps via WebView. It allows fullscreen video playback, displays
    captions in configured projects, and also has the option to create 'call-to-action' elements
    displayed during video play, e.g., clickable buttons, simple surveys, etc. The basic elements of
    the player can be styled.^1

```
In some variants, the player is also responsible for calculating the appropriate video stream
and displaying user data sent to it via its API.
```

- **HTML animation** : Vintom player can display sensitive data in the form of an HTML animation
    synchronized with the audio/video stream. Using HTML animation doesn't affect video
    quality. However, the possibilities are slightly limited by the browser's capabilities, which can
    force some creative compromises, e.g., excluding 3D animations while presenting sensitive
    data. HTML animation rendering is done in the user's browser, ensuring the data isn't
    processed by Vintom.

(^1) The detailed technical specification of the player is described in the document "Vintom - Player specification"
or "Vintom - Integration specification"

- **Render** : The process of generating a unique video on the rendering farm. The video is
    generated based on a project template prepared in Adobe After Effects and our own plugin
    for personalization.
- **Video code** : Unique video identifier provided by the Vintom system when uploading data for
    rendering. The minimal code length is 8 characters, with default code length being 32
    characters.
- **Delivery time** : The maximum time in which videos will be ready for display, counting from
    the moment of uploading data to be rendered to the Vintom system. Thanks to the
    autoscaling mechanism, this time does not depend on the number of videos to be generated.
    Delivery time ranges from 1 hour to 24 hours, where 24 hours is the most cost-effective
    variant. An additional variant is the real time mode, in which the video is available
    immediately after sending a video request. Achieving this mode requires a special way of
    project preparation and may cause some design limitations.

## 3 Deployment architecture - variants

### 3.1 All in Vintom infrastructure

In this variant, all system components are maintained by Vintom as part of an existing system ready
to use and provided in the SaaS model.

This is the best architecture if:

- The project does not require the use of sensitive data. In each case, it's worth considering
    whether the use of a certain variable is necessary to achieve the project goal. For example,
    using sensitive data such as a surname may prove to be completely unnecessary, and using
    just the first name in the video and audio layer will be enough to achieve good results.
- The client does not have the capability to carry out development work in their own
    infrastructure.
- The project requires quick implementation.
- The project will be used only once, as part of a one-off delivery.
- The level of data protection applied on the Vintom platform is sufficient from the client's
    perspective.^2
- The project is demanding in the context of rendering, e.g. it uses personalized photos.
- It is important to easily analyze individual user activity, without the need to build an
    additional analytics system.
- Videos must be delivered in the form of MP4 files.

You can also watch a video explaining this architecture: <https://f.io/N9kb0KV>

(^2) You can read more about the data protection measures used in the Vintom system in "Vintom - Security
whitepaper"

**Data Processing**

The data processing in the above architecture consists of the following steps:

**a) Data preparation**

The client prepares a set of personalization data for all videos in a single delivery. This data set must
meet project requirements, i.e., the correct list of variables, correct data format, considering the
mandate of data. The data can be prepared by the client in the form of an Excel or CSV file, or as
JSON format data.

**b) Data transfer**

In this architecture variant, the video preparation process is asynchronous. The client provides a data
set to the Vintom system, and in response receives generated unique video codes, which he can
immediately use to configure the video delivery to customers. However, the videos will be ready for
playback at the latest after the delivery time defined in the contract has elapsed.

Data is delivered to the Vintom system by the client using one of three available methods:^3

(^3) All data transfer methods are described in detail in the document "Vintom – integration specification"

- **API** : REST API enables the automation of the data exchange process between the client and
    Vintom. Using the API, you can send a data set for rendering in the form of an Excel or CSV
    file or a request in JSON format containing data for a single or multiple videos. The API also
    provides the ability to download a file with video codes, set up push notifications about
    completed rendering, and get analytical data of activity in delivered videos.
- **FTP** : The client can place data files for rendering (Excel or CSV) on the FTP server. Both
    Vintom FTP and the client's FTP are supported. In this case, the file with video codes is
    uploaded to the FTP server after rendering is completed.
- **Web Panel** : A web application where the client can manage their projects (view the history
    of uploaded data sets, upload more, preview the rendering status, review and download
    analytical data). Transferred data is processed by the "Data service", which optimizes the
    data for rendering and stores it in the Vintom system. The data is stored in the "Data service"
    for the duration of the video hosting (usually this is 30 days). When the video is removed
    after the hosting validity period, the personalized data is completely deleted. Only the video
    codes generated for the project for analytics purposes remain in the system.

**c) Video rendering**

The "Data service" passes the rendering task to the render farm. The render farm manages the
rendering process, scales resources to meet the delivery time rule, appropriately queues tasks
according to priority, and upload the generated files (video fragments, posters, thumbnails etc.) to
the "Video fragments storage".

When all video elements for a given data set are in the "Video fragments storage", the client can
start delivering the videos.

**d) Video delivery**

Delivering the video to the end-user is the client's responsibility. The client must prepare a method to
match a specific end-user with the appropriate video code given by Vintom. For matching purposes,
an additional user identifier assigned by the client may be added to the personalized data set.

The video can be delivered in the form of a dedicated page (landing page) hosted in Vintom, which
contains the embedded Vintom player, as well as additional elements such as the client's logo, an
incentive to watch, or a disclaimer. When using a landing page, the client sends a unique link by
email, SMS, or WhatsApp, which contains the video code as a distinction. The landing page hosted by
Vintom is by default available in the vintom.com domain. It is possible to configure a subdomain with
the client's name: client.vintom.com or delegate any domain/subdomain of the client^4. The client can
also configure a reverse proxy so that the landing page is available in their domain without the need
to transfer the SSL certificate to Vintom.

For this architecture variant, there is also the option of sending videos in the form of MP4 files, for
example, as attachments in an email. In this case, however, we lose the ability to track viewability.

(^4) Detailed information on domain configuration can be found in the document "Vintom - Landing page hosting
instruction"

The video can also be displayed within the client's system or application. In this situation, the client
must embed the Vintom player in their application.

**e) Video display**

The end user opens a site or application where the Vintom player is embedded. It is a necessary
component for the proper display of Vintom personalized videos. The exception to this are projects
prepared for generating MP4 files alone.

The player's API provides basic events such as starting to watch, watching to the end, performing a
call-to-action action. Thanks to this, it is possible to add advanced logic launched immediately after
handing the event.

During player initialization, the player communicates with the "Video service" to download the
detailed configuration of a specific video and downloads the necessary project files from
"Configuration assets storage".

During video playback, the video stream is downloaded from "Video fragments storage", and
information about the following events is sent to the analytics system:

- player initialization
- video playback start
- each pause and resume of playback
- end of playback
- display of call-to-action buttons
- execution of call-to-action, e.g. button click

The analytics system stores anonymized data:

- video code
- date of the event
- type of event
- additional information about the event, e.g. playback time
- unique identifier of the user's session in the browser
- type of device

The player's communication with analytics is optional, but only if it is used is it possible for Vintom to
provide the client with project statistics.

### 3.2 Hybrid infrastructure

In this variant, the processing of sensitive data is moved from Vintom's systems directly to the end
user's browser/application.

This is the best architecture if:

- The project requires the use of sensitive data.
- Sensitive data can be displayed in the form of HTML animation.
- The client can host the player and push the data to it within their own infrastructure.
- The client's security policy does not permit the processing of sensitive data by a third-party
    provider.
- It is important to easily analyse individual user activity, without the need to build an
    additional analytics system.

It cannot be applied if:

- The client does not have the capability to carry out development work in their own
    infrastructure.
- Videos must be delivered in the form of MP4 files.

**Data Processing**

The data processing in the above architecture consists of the following steps:

**a) Data preparation**

Personalization data is divided into two sets. The first set, with non-sensitive data, is delivered to the
Vintom system in the same way as in the first variant "All in Vintom infrastructure". The system
assigns a unique video code to each video. The second set, with sensitive data, will be injected by the
client directly into the player, where the player will be embedded, when the end user starts the
player.

**b) Non-sensitive data transfer & video rendering**

The same way as in the "All in Vintom infrastructure" variant.

**c) Video delivering**

The client remains responsible for delivering the video to the end user and correctly matching the
user with the personalized video, just like in the "All in Vintom infrastructure" variant.

To maximize the protection of sensitive data in this variant, we suggest hosting the player on the
client's side. If the video will be delivered along with a dedicated landing page, it should also be
hosted by the client.

In the landing page, client's system, or mobile application, the client must implement code that will
retrieve missing sensitive data from its database via a secure connection based on the video code or
client identifier. The sensitive data will be injected directly into the player. This ensures that sensitive
data will not be processed by Vintom at all.

**d) Video display**

The end user opens a website or application where the Vintom player is embedded. This player is a
necessary component for the proper display of videos in this variant.

The client's code embedded in the player's location retrieves data and injects it into the player's API.
The detailed usage of the player's API is described in the technical documentation.

At the time of video playback, the personalized video stream is played. The video stream is
downloaded from the "Video fragments storage" in the form of anonymized video fragments.
Sensitive data is displayed in the form of HTML animation synchronized with the playing video
stream.

Thanks to loading the data set with non-sensitive data into the system, we can analyse the activity of
each end-user in the same way as in the "All in Vintom infrastructure" variant.

### 3.3 Data in the client’s infrastructure

In this variant, no personalized data is processed by Vintom. Data is transferred from the client's
systems directly to the end-user's browser/application and displayed there in the form of a
personalized video. The architecture is simplified, and the rendering of all necessary video fragments
takes place before the project launch.

This is the best architecture if:

- The project includes sensitive data.
- The client's security policy prohibits the processing of data by a third-party provider.
- The personalized video needs to be delivered within the client's systems available only for
    authenticated users (transaction system, mobile application).
- The client can host the player and push the data to it within their own infrastructure.
- Analysis of individual user activity, if needed, can be implemented by the client.
- The project has a finite number of variants in the audio/video layer, and unique data can be
    displayed in the form of HTML animation.

It cannot be applied if:

- The client does not have the capability to carry out development work in their own
    infrastructure.
- Videos must be delivered in the form of MP4 files.
- The project requires a quick launch.

In this variant, the process is significantly simplified. All video files, which in the previous variants
were generated at the "Video rendering" stage after submitting a request to the Vintom system to
render, are prepared before the project launch. For this reason, the project must have a finite
number of variants in the audio/video layer, and unique data will be displayed in the form of HTML
animation.

You can also watch a video explaining this architecture: <https://f.io/iFzRxJQk>

**Data Processing**

The data processing in the above architecture consists of the following steps:

**a) Data preparation**

The client remains responsible for delivering the video to the end user. In this variant, we do not use
the video code.

To securely protect sensitive data, the player should be hosted on the client's side. If the video will be
delivered along with a dedicated landing page, the client should also host it.

In the landing page, client's system, or mobile application, the client must implement a mechanism
that will use the client's identifier to retrieve all personalized data from its database via a secure
connection. This data will be injected directly into the player. As a result, sensitive data will not be
processed by Vintom at all.

**b) Video display**

The mechanism for displaying data to the end user is similar to the "Hybrid infrastructure" variant.
The difference is that instead of using the "Video service", the player determines the appropriate
video configuration itself.

In analytics, no customer data is sent to the Vintom system, except for the data needed by the billing
system. To analyse user activity data, the client must prepare an analytics system on their side. It can
collect data for later analysis, or perform programmed actions when a specific event occurs in the
player, for example, the user watched the video to a certain point of the video, the player's API sends
an event about this fact, and the client's system handles this event and performs specific action.

### 3.4 All in the client’s infrastructure

In this variant, all system components are located on the client's side. The architecture remains
simplified and the rendering of all necessary video fragments takes place before the project launch.
The difference from the "Data in the client’s infrastructure" is that the storage hosting the
anonymized video fragments, "Video fragments storage", is also located in the client's infrastructure.
The client must provide its adequate size, bandwidth, and performance.

This is the best architecture if:

- The project includes sensitive data.
- The client's security policy requires the use of on-premises solutions only.
- The personalized video needs to be delivered within the client's systems available only for
    authenticated users (transaction system, mobile application).
- The client can implement the entire Vintom solution within their own infrastructure.
- Analysis of individual user activity, if needed, can be programmed on the client's side.
- The project has a finite number of variants in the audio/video layer, and unique data can be
    displayed in the form of HTML animation.

It cannot be applied if:

- The client does not have the capability to carry out development work in their own
    infrastructure.
- Videos must be delivered in the form of MP4 files.
- The project requires a quick launch.

The data processing in the above architecture is the same as in the "Data in the client’s
infrastructure" variant.

"Video fragments storage" is a key component of the solution. It must allow for storing a large
amount of data and be optimized for high throughput and low latency. A single project requires
space from tens of GB to even tens of TB. In terms of bandwidth, it should be assumed that a single

user needs throughput of around 1-2 Mbps for an HD variant video and 2-4 Mbps for a full HD variant

### video

### 3.5 All in client’s Azure cloud

Vintom offers an additional deployment variant in which the client receives full system functionality
while all client data remains in their infrastructure. The basic SaaS model service operates in
Microsoft Azure's cloud. Vintom has the ability to copy and run its entire infrastructure on the client's
Azure subscription. Vintom is responsible for the entire installation and service launch procedure.

Ongoing infrastructure maintenance (security updates, patches, monitoring) should remain on
Vintom's side. It is possible to configure the services in such a way that Vintom's maintenance team
does not have access to the client's data.

Once set up, the system enables the launch of many personalized video projects.

This is the best architecture if:

- The project includes sensitive data.
- The client's security policy requires the use of solutions operating within the client's
    infrastructure only.
- The client has their own Microsoft Azure subscription.
- The client does not want to engage their own IT team.
- The project is demanding in terms of rendering, e.g. uses personalized photos.
- It's important to easily analyse individual user activity, without the need to build an
    additional analytics system.
- Videos must be delivered in the form of MP4 files.
- The project does not require a quick launch.

The architecture and the entire video rendering and delivery process to end users will proceed
similarly to the "All in Vintom infrastructure" variant.

## 4 Comparative analysis of all variants

**All in**^ **Vintom**^
**infrastructure**

```
Hybrid
infrastructure
```

```
Data in the
client’s
infrastructure
```

```
All in the
client’s
infrastructure
```

```
All in client’s
Azure cloud
Workload on
the client's IT
side
```

```
Low Medium High High Low
```

```
Sensitive data
in Vintom Yes^ No^ No^ No^ No^
```

```
Any data in
Vintom Yes^ Yes^ No^ No^ No^
```

```
Possible
creative
limitations
```

```
No Yes Yes Yes No
```

```
Ready-made
analytics
module
```

```
Yes Yes No No Yes
```

```
Realtime
render Optional^ Optional^ Yes^ Yes^ Optional^
```

```
On-premises No No No Yes Yes
```

```
Ability to
deliver MP
only
```

```
Yes No No No Yes
```
