# Integration specification

**This document describes several methods of integrating with the
Vintom system for exchanging personalization data, retrieving
statistics, and embedding the Vintom personalized video player.
The document is prepared for IT engineers.**

##### VERSION 3. 8. 2

##### PUBLISHED 27. 11 .202 4

##### COPYRIGHT © BY VINTOM SP. Z O.O. <WWW.VINTOM> .COM

## Table of Contents

- 1 Introduction
- 2 API....................................................................................................................................................
  - 2.1 General API overview
    - 2.1.1 Request and response formats
    - 2.1.2 Authorization
    - 2.1.3 Errors
    - 2.1.4 Testing
  - 2.2 Rest API: databases
    - 2.2.1 Upload the database
    - 2.2.2 Upload the database using JSON input
    - 2.2.3 Get the database
    - 2.2.4 Get the database links
    - 2.2.5 Notification of database status change
    - 2.2.6 Aggregated statistics for the database
    - 2.2.7 Statistics for each video in the database
    - 2.2.8 Viewership statistics for the database
    - 2.2.9 Aggregated statistics for all databases in the project
    - 2.2.10 Statistics for each video for all databases in the project
    - 2.2.11 Viewership statistics for all databases database in the project
  - 2.3 Rest API: databaseValidations
    - 2.3.1 Upload the database for validation
    - 2.3.2 Upload the database for validation using JSON input
    - 2.3.3 Get validation status
  - 2.4 Rest API: videos
    - 2.4.1 Creating a single video
    - 2.4.2 Get the video
    - 2.4.3 Notification of video render finished
    - 2.4.4 Statistics for a single video
    - 2.4.5 Statistics for each video in the project
- 3 FTP
  - 3.1 Vintom FTP server
    - 3.1.1 Directory structure
    - 3.1.2 Data flow..........................................................................................................................
    - 3.1.3 File structure
  - 3.2 Client FTP server
    - 3.2.1 Directory structure
    - 3.2.2 Data flow..........................................................................................................................
    - 3.2.3 File structure
- 4 Panel
- 5 Player
  - 5.1 Requirements
    - 5.1.1 Supported browsers
    - 5.1.2 Content Security Policy
  - 5.2 Features
    - 5.2.1 Basic playback
    - 5.2.2 Volume control
    - 5.2.3 Autostart
    - 5.2.4 Fullscreen
    - 5.2.5 Skinning
    - 5.2.6 Subtitles
    - 5.2.7 Poster
  - 5.3 Embedding a video player using IFRAME
  - 5.4 Embedding a video player using JavaScript hosted on Vintom side
    - 5.4.1 Configurable parameters
  - 5.5 Embedding a video player using JavaScript hosted on the client side
    - 5.5.1 Npm installation
    - 5.5.2 Installation from the zip file.............................................................................................
    - 5.5.3 Importing player in your code
    - 5.5.4 Adding player files to your site
    - 5.5.5 Initializing and configuring player....................................................................................
  - 5.6 Processing data at the client’s side
  - 5.7 Player events
    - 5.7.1 Subscribing to player events
    - 5.7.2 Calling methods on player
    - 5.7.3 Handling events for player embedded in iframe
  - 5.8 Technical details
    - 5.8.1 Third-party libraries
    - 5.8.2 Cookie
    - 5.8.3 Outgoing connections

## 1 Introduction

Before starting the integration, carefully consider which API, FTP or Panel method will be best for
you. You should in particular take into account the IT resources on your side, the expected time to
market, the frequency with which the Vintom system will be fed with your data.

The API option will be the best in scenarios with frequent data exchange (regular video requests once
a day, hourly, or in connection with some event), or if you need to update statistics frequently. In the
case of API integration, the client's IT team must implement the code that integrates with the API.

The FTP option will be the best if the client already uses this method of data exchange elsewhere in
his system or it is required by the security team. Vintom allows integration using both FTP client and
Vintom. In the case of using client’s FTP, the Vintom requires specific configuration on the server
(granting permissions and creating appropriate directories). The option of using client’s FTP is
additionally payable.

The option of using the Panel is the most convenient if the data exchange does not have to take
place too often, the client has appropriate people who will be able to use the Panel. The advantage
of using the Panel is the zero cost of integration and a wide range of ready-made functionalities.

A similar consideration applies to the use of the player. Consider whether embedding the player on
your side is necessary. When using a Landing Page hosted on the Vintom side, there is no need to
integrate with the Player.

## 2 API

This chapter describes the specification of the new, more efficient Vintom API v2. With it, you can
automate communication with Vintom and prepare your system for recurrent cooperation. Thanks
to the API, you can automate the video rendering request process, the process of listening for
changes in rendering status, downloading links to finished movies and downloading statistics of
running projects.

To use the API, your project must go through the setup stage in Vintom and be production-ready. In
order to test the integration with the API at an earlier stage of cooperation with Vintom, you can use
the Demo campaign and the document "Vintom - Demo project manual". It describes how to
integrate with Vintom API, starting with a request to generate a video, and ending with when the
video is ready and available for viewing.

The new API v2 allows you to manage projects prepared for the delivery time greater or equals 90
minutes, where data for videos is sent to the system in a batch mode. The data is sent in batches
(files or JSON object) called databases. One database can be uploaded into the system once per
minute for a specific project.

The new API v2 also allows for integration with projects with a delivery time less than 90 minutes or
in the real-time variant where one rendering request relates to only one video. The number of videos
that can be requested in the system at any given time is limited according to the tariff for a specific
project. The project must be specially configured for this variant, so please ask your Account
Manager in advance.

### 2.1 General API overview

#### 2.1.1 Request and response formats

Overall, the Vintom API v2 uses HTTP requests as specified in the REST specification with JSON
arguments and JSON responses. The responses are enhanced with the hypermedia properties, as
specified in the HATEOAS standard, which provides the user with additional information about the
available resources related to the requested entity. Authentication occurs through the Basic
Authentication standard.

**Domain**

Vintom API v2 uses a single global domain **api.vintom.com** which is only accessible using the
encrypted HTTPS protocol.

**Methods**

Vintom API v2 uses various HTTP methods according to the REST specification: GET, POST, PUT,
DELETE.

**CORS**

Cross-origin HTTP requests are enabled from any domain.

**Date format**

All dates in the API use the ISO 8601 date-time format in UTC as in the example below:
2021 - 03 - 08TT15:50:38Z

**Etag**

Vintom API v2 supports the eTag header attribute, which is available for any type of request in
databases and databaseValidations resource.

#### 2.1.2 Authorization

Authorization is based on the HTTP Basic Authentication mechanism. Currently, the only method to
obtain credentials is to contact your Account Manager.

#### 2.1.3 Errors

In case of an error, the API returns a response with the appropriate HTTP status and content in JSON
format as in the example below:

{
"path": "/databases",
"error": "Bad Request",
"message": "Required String parameter 'projectCode' is not present",
"status": 400
}

The table below lists all the possible errors types by HTTP status:

### Code Description

400 Bad Request – bad input parameter
401
Unauthorized – the credentials are incorrect or the user does not have permission to
the project
403 Forbidden – the user does not have permission to the endpoint or feature
404 Not Found – the given entity does not exist
405 Method Not Allowed – HTTP method used in the request is not supported for the
endpoint
415 Unsupported Media Type – the content type of the request is not supported
429 Too Many Requests – you are making too many requests for the project. You should
wait and try again
500 Internal Server Error – an error on the server side. We are trying to solve the
problem. If the problem persists, please contact your Account Manager
503 Service Unavailable – the service is temporarily unavailable or the request is too
heavy to process at that time

#### 2.1.4 Testing

For testing purposes, we provide a Swagger form where you can run test requests or download a
configuration file in OpenAPI v 3.0 format. The form is available at: <https://api.vintom.com/swagger->
ui.html

We also provide a test project where you can verify the API integration before your final project is
ready. For details about the test project, please contact your Account Manager.

### 2.2 Rest API: databases

This resource allows you to manage projects prepared for the delivery time greater or equals 90
minutes, where the data for the videos are sent to the system in a batch mode. The basic resource in
this communication model is the database entity, which represents a package, in the file format,
containing a video list with their personalization parameters.

The common flow looks like this:

1 Uploading the database file to the Vintom system (see 2.2.1 or 2.2.2).
2 Checking the database status to verify that the database has been properly processed (see
2.2.3).
3 Checking the database status to verify that the database is already rendered. Requesting the API
has sense at the earliest when 50% of the time declared in the delivery time of the project has
elapsed (see 2.2.3).
4 As an alternative to point 3, you can prepare an endpoint to which the Vintom system will send
information when the database will be rendered. Information about the database loading and
validation errors, if any, will also be sent to this endpoint (see 2.2.5).
5 Downloading the file with links to personalized videos. The file contains unique video codes
needed when embedding Vintom video player on the client's side, and unique links if these are
delivered to the end user (email, SMS, etc.) (see 2.2.4).
6 Downloading statistics after delivering video to end users (see 2.2.5 - 2.2.11).

#### 2.2.1 Upload the database

**Description**

Allows batch rendering videos. The endpoint accepts the request with an Excel, CSV or JSON file that
contains a list of videos and personalized data for them. Columns in the CSV file should be separated
by a comma or semicolon. The final file format should be provided by the Account Manager at the
project preparation stage. The order of the column and the existence or not of the header is
important and must be preserved.

Database rendering time depends on the delivery variant ordered for your specific project.

If the data of any of the videos is incorrect, the entire database will not be processed. Details of the
errors can be found when checking the database status (see 2.2.3)

This functionality has some important limits:

- The maximum number of videos that can be generated for one project for one day. For
    projects in the standard variant, it is 10.000.000, for projects in the premium variant it is
    1.000.000 videos
- Maximum number of videos in one database: 1,000,000. In the case of generating more
    videos in one day, the database should be divided into smaller ones
- The minimum time between calling a request to create a database: 1 minute

**Url structure**

<https://api.vintom.com/databases>

**HTTP method**

POST

**Content type**

multipart/form-data

**Parameters**

### Name Type Description

projectCode String Unique identifier of the project
database File File with the database in CSV, Excel or JSON format
codeLength Int Optional. The number of characters in the generated video codes. If
not given, the value will be taken from the project configuration. The
minimum value is 8

**Request example**

curl -X POST <https://api.vintom.com/databases> \

- u <login>:<password> \
- H "Content-Type: multipart/form-data" \
- FprojectCode=<projectCode> \
- Fdatabase=@<path to the database>

**Response parameters**

### Name Type Description

id Int(64) Unique identifier of the database
projectCode String Identifier of the project
fileName String Name of the uploaded database file
creator String Login of the user who requested the database upload
status String Initial database status. Always equals to VALIDATING
creationDate Date Database creation date
links List List of endpoints available for the entity. In the case of a
database created just now, only the "self" link is available (see
2.2.3)

**Response example**

{
"id": 2021031128549192,
"projectCode": "DEMO",

"fileName": "database.xlsx",
"creator": "user123",
"status": "VALIDATING",
"creationDate": " 2021 - 03 - 11T10:02:19.432Z"
"links": [{
"rel": "self",
"href": "https://api.vintom.com/databases/ 2021031128549192 "
}]
}

#### 2.2.2 Upload the database using JSON input

**Description**

Allows batch rendering videos. The endpoint accepts the request in JSON format. Request body is a
list of videos with personalized data. The final list of videos attributes should be provided by the
Account Manager at the project preparation stage.

Database rendering time depends on the delivery variant ordered for your specific project.

If the data of any of the videos is incorrect, the entire database will not be processed. Details of the
errors can be found when checking the database status (see 2.2.3)

This functionality has some important limits:

- The maximum number of videos that can be generated for one project for one day. For
    projects in the standard variant, it is 10.000.000, for projects in the premium variant it is
    1.000.000 videos
- The maximum HTTP request size is 64MB. In the case of generating more videos in one day,
    the database should be divided into smaller ones
- The minimum time between calling a request to create a videos: 1 minute

**Url structure**

<https://api.vintom.com/databases>

**HTTP method**

POST

**Content type**

application/json

**Parameters**

### Name Type Description

projectCode String Unique identifier of the project
databaseName String Optional. Name of the data set
codeLength Int Optional. The number of characters in the generated video codes. If
not given, the value will be taken from the project configuration.
The minimum value is 8

**Request example**

curl -X POST <https://api.vintom.com/databases?projectCode=><projectCode> \

- u <login>:<password> \
- H "Content-Type: application/json" \
- -data "[{\"firstName\":\"John\",\"amount\":\" 1000 \"}]"

**Response parameters**

### Name Type Description

id Int(64) Unique identifier of the database
projectCode String Identifier of the project
fileName String Name of the uploaded database file
creator String Login of the user who requested the database upload
status String Initial database status. Always equals to VALIDATING
creationDate Date Database creation date
links List List of endpoints available for the entity. In the case of a
database created just now, only the "self" link is available (see
2.2.3)

**Response example**

{
"id": 2021031128549192,
"projectCode": "DEMO",
"fileName": " 2021031128549192 .json",
"creator": "user123",
"status": "VALIDATING",
"creationDate": " 2021 - 03 - 11T10:02:19.432Z"
"links": [{
"rel": "self",
"href": "https://api.vintom.com/databases/2021031128549192"
}]
}

#### 2.2.3 Get the database

**Description**

It allows you to get the current status of the database.

**Url structure**

<https://api.vintom.com/databases/{id}>

**HTTP method**

GET

**Request example**

curl <https://api.vintom.com/databases/2021031128549192> \

- u <login>:<password>

**Response parameters**

### Name Type Description

id Int(64) Unique identifier of the database
projectCode String Identifier of the project
fileName String Name of the uploaded database file

### creator String Login of the user who requested the database upload

status String The database can be in one of the following status:

- VALIDATING – a database is being validated. It will only be
    processed if all records in the database are valid
- INVALID – some database records are invalid. The list of
    errors is available in the errors attribute
- CODES_GENERATING – the database is valid and unique
    video codes are generated
- RENDERING – the database is valid, video codes are
    generated and the database is rendering. It will be ready
    within no more than the specified delivery time
- READY – all videos in the database are rendered and
    ready for delivery to end users.
- CLOSED – the database is closed. All personal data are
    removed. Aggregated analytics data are still available

creationDate Date Database creation date
videosNumber Int Optional – available for CODES_GENERATING, RENDERING, READY
and CLOSED status. Number of videos in the database
renderProgress Int[0-100] Optional – available for RENDERING status. Rendering progress in
a percentage
errors List Optional – available for INVALID status. List of validation error
messages indicating an invalid video number
links List List of endpoints available for the entity. There is a "self" link
available for each database. For the RENDERING status, there is
also a "links" link that allows you to download a file with final
video codes and links to the personalized videos (see 2.2.4). For
the READY status, analytics links are also available (see 2.2.7)

**Example of a valid database response**

{
"id": 2021031128549192,
"projectCode": "DEMO",
"fileName": "database.xlsx",
"creator": "user123",
"status": "CODES_GENERATING",
"creationDate": " 2021 - 03 - 11T10:02:19.432Z",
"videosNumber": 15000,
"links": [{
"rel": "self",
"href": "https://api.vintom.com/databases/2021031128549192"
}]
}

**An example of a rendering database response**

{
"id": 2021031128549192,
"projectCode": "DEMO",
"fileName": "database.xlsx",
"creator": "user123",
"status": "RENDERING",
"creationDate": " 2021 - 03 - 11T10:02:19.432Z",
"videosNumber": 15000,
"renderProgress": 62,
"links": [{
"rel": "self",
"href": "https://api.vintom.com/databases/2021031128549192"
},{
"rel": "links",
"href": "https://api.vintom.com/databases/2021031128549192/links"
}]
}

**An example of a ready database response**

{
"id": 2021031128549192,
"projectCode": "DEMO",
"fileName": "database.xlsx",
"creator": "user123",
"status": "READY",
"creationDate": " 2021 - 03 - 11T10:02:19.432Z",
"videosNumber": 15000,
"links": [{
"rel": "self",
"href": "https://api.vintom.com/databases/2021031128549192"
},{
"rel": "links",
"href": "https://api.vintom.com/databases/2021031128549192/links"
},{
"rel": "stats",
"href": "https://api.vintom.com/databases/2021031128549192/stats"
},{
"rel": "statsPerVideo",
"href":
"https://api.vintom.com/databases/2021031128549192/statsPerVideo"
},{
"rel": "statsViewership",
"href":
"https://api.vintom.com/databases/2021031128549192/statsViewership"
}]
}

**An example of an invalid database response**

{
"id": 2021031128549192,
"projectCode": "DEMO",
"fileName": "database.xlsx",
"creator": "user123",
"status": "INVALID",
"creationDate": " 2021 - 03 - 11T10:02:19.432Z",
"errors": [{
"videoNumber": 5,

"error": "Variable first_name is required but not found"
},{
"videoNumber": 7,
"error": "Value \"basic\" for variable account_type not equals
\"standard\", \"premium\" or \"expert\""
}],
"links": [{
"rel": "self",
"href": "https://api.vintom.com/databases/2021031128549192"
}]
}

#### 2.2.4 Get the database links

**Description**

It allows users to download a CSV (semicolon separated), Excel or JSON file with unique codes and
video links from the database. The output file name includes the original file name, string "_links"
and the current date. The choice of the CSV, Excel or JSON format depends on the format in which
the database was loaded into the system. You can force a format change by adding the "format"
attribute to the URL with the value csv, xlsx or json.

**Url structure**

<https://api.vintom.com/databases/{id}/links>

**HTTP method**

GET

**Request example**

curl <https://api.vintom.com/databases/2021031128549192/links> \

- u <login>:<password>

**Response CSV file columns**

### Column Description

code Unique identifier of the video
landing page url Optional column when landing page is created and hosted on the Vintom side
email poster url Optional column when email poster is rendered for the video

### ... Columns containing the rest of the personalized data for the video in the

```
same order as in the uploaded database
```

**An example of a response file**

code;landing page url;email poster url;first_name;account_type
jSvePn 3 J;<https://vintom.com/jSvePn> 3 J;<https://vintom.com/video/poster/jSvePn>
3 J.gif;Anna;Standard
kA 4 yp 8 Jh;<https://vintom.com/kA> 4 yp 8 Jh;<https://vintom.com/video/poster/kA> 4 yp 8
Jh.gif;John;Premium

#### 2.2.5 Notification of database status change

**Description**

You can prepare an endpoint for your projects to which changes of the processing database status
will be sent. The endpoint can be authenticated using the Basic Authentication standard. Currently,
the endpoint details must be provided to Vintom manually.

Vintom sends a notification when:

- database has been uploaded, validated and video codes are available (status RENDERING)
- the uploaded database is not valid (status INVALID)
- rendering the database has been completed (status READY)

The request is the same as for the “Get the database” endpoint (see 2.2.3)

Endpoint must respond with one of the HTTP 2xx statuses, otherwise the Vintom system will
consider the sending of the notification as invalid and will try to send the notification again.

**HTTP method**

POST

**Request example**

curl -X POST <https://your-api-domain> \

- u <login>:<password> \
- H "Content-Type: application/json" \
- d "{\"id\": 2021031128549192, \"projectCode\": \"DEMO\", \"filename\":
\"database.xlsx\", \"creator\": \"user123\", \"status\":
    \"RENDERING\", \"creationDate\": \" 2021 - 03 - 11T10:02:19.432Z\",
    \"videosNumber\": 15000, \"renderProgress\": 62,
    \"links\": [{ \"rel\": \"self\",
\"href\": \"https://api.vintom.com/databases/2021031128549192\"},{
\"rel\": \"links\", \"href\":
\"https://api.vintom.com/databases/2021031128549192/links\"}]}"

**Request parameters**

### Name Type Description

id Int(64) Unique identifier of the database
projectCode String Identifier of the project
fileName String Name of the uploaded database file
status String The database can be in one of the following status:

- INVALID – some database records are invalid. The list
    of errors is available in the errors attribute
- RENDERING – the database is valid, video codes are
    generated and the database is rendering. It will be
    ready within no more than the specified delivery time
- READY – all videos in the database are rendered and

```
ready for delivery to end users
```

creationDate Date Database creation date
videosNumber Int Optional – available for RENDERING and READY status.
Number of videos in the database
renderProgress Int[0-100] Optional – available for RENDERING status. Rendering
progress in a percentage
errors List Optional – available for INVALID status. List of validation error
messages indicating an invalid video number
links List List of endpoints available for the entity. There is a "self" link
available for each database. For the RENDERING status, there
is also a "links" link that allows you to download a file with
final video codes and links to the personalized videos (see
2.2.4). For the READY status, analytics links are also available
(see 2.2.7)

#### 2.2.6 Aggregated statistics for the database

**Description**

It allows getting aggregated statistics for a specific database. Statistics are refreshed once an hour.

**Url structure**

<https://api.vintom.com/databases/{id}/stats>

**HTTP method**

GET

**Request example**

curl <https://api.vintom.com/databases/2021031128549192/stats> \

- u <login>:<password>

**Response parameters**

### Name Type Description

id Int(64) Unique identifier of the database
projectCode String Identifier of the project
creationDate Date Database creation date
videosNumber Int Number of videos in the database
trackingPixelViews Int Optional – when tracking pixel is enabled. The number of
videos where the tracking pixel was displayed. Vintom
provides a tracking pixel as an animated poster that can be
embedded in mailing, SMS, social media sharing (e.g.
Facebook) etc.
playerViews Int The number of videos for which the player was displayed
startedViews Int The number of videos that have been started to watch
viewsOver25Percent Int The number of played videos min. 25 percent
viewsOver50Percent Int The number of played videos min. 50 percent
entireVideoViews Int Number of videos played from start to finish
ctaClicked Int The number of videos for which the call-to-action button was
clicked. This number also includes the video for which the call-
to-action was clicked on the landing page
desktopViews Int Number of videos played on desktop
mobileViews Int Number of videos played on mobile
totalViews Int Total video views started

**Example of response with statistics**

{
"id": 2021031128549192,
"projectCode": "DEMO",
"creationDate": " 2021 - 03 - 11T10:02:19.432Z",
"videosNumber": 15000,
"trackingPixelViews": 9342,

"playerViews": 6932,
"startedViews": 6218,
"viewsOver25Percent": 5732,
"viewsOver50Percent": 5190,
"entireVideoViews": 3923,
"ctaClicked": 681,
"desktopViews": 2890,
"mobileViews": 4377,
"totalViews": 9691
}

#### 2.2.7 Statistics for each video in the database

**Description**

It allows you to get statistics for a specific database for each video as a CSV file separated by a
semicolon. Statistics are refreshed once an hour. The output filename includes the original filename,
the string "_per_video" and the current date.

**Url structure**

<https://api.vintom.com/databases/{id}/statsPerVideo>

**HTTP method**

GET

**Request example**

curl <https://api.vintom.com/databases/2021031128549192/statsPerVideo> \

- u <login>:<password>

**Response CSV file columns**

### Column Description

code Unique identifier of the video
video creation request

### date

The date the video creation request was sent.
Date format: yyyy-MM-dd HH:mm in UTC.
tracking pixel view date Optional – when tracking pixel is enabled. The date on which the
tracking pixel was first requested. Vintom provides a tracking pixel in
the form of an animated or static poster that can be embedded in
mailings, text messages, instant messengers or used as og tags when
sharing on social media. Any first display of a video poster by a user is
stored in the analytics. If you use a tracking pixel in an email, please
note that the event will only be stored if the user has images enabled.
If the user opens a website with the Vintom player without a tracking
pixel view event stored, such an event will also be added to the
analytics.
Date-time format: yyyy-MM-dd HH:mm in UTC. The time is given with
an accuracy of the hour
player view date The date the video player was first viewed.

Date-time format: yyyy-MM-dd HH:mm in UTC. The time is given with
an accuracy of the hour
watching started Value 1 when the user clicked the play button in the player and
started watching the video. Otherwise, the value is blank
watched over 25 percent Value 1 when the user has watched more than 25% of the entire
video. Otherwise, the value is blank
watched over 50 percent Value 1 when the user has watched more than 50% of the entire
video. Otherwise, the value is blank
watched entire video Value 1 when the user has watched the entire video. Otherwise, the
value is blank
watching length Length of video watched by the user in seconds
cta clicked Value 1 when the user clicked on call-to-action button in the player or
on the landing page (if one has been created for the project).
Otherwise, the value is blank
desktop The type of desktop device on which the video player was first viewed
mobile The type of mobile device on which the video player was first viewed

**Response file example**

code;video creation request date;tracking pixel view date;player view
date;watching started;watched over 25 percent;watched over 50
percent;watched entire video;watching length;cta clicked;desktop;mobile
jSvePn3J; 2021 - 02 - 24 05:53; 2021 - 02 - 26 12:00;2021- 02 - 26
13:00;1;1;1;;45;;;SMARTPHONE iOS 14.
kA 4 yp 8 Jh; 2021 - 02 - 24 05:53; 2021 - 02 - 24 08:00;2021- 02 - 24
08:00;1;1;;;28;1;PERSONAL_COMPUTER Windows 10.0;

#### 2.2.8 Viewership statistics for the database

**Description**

It allows you to get viewership statistics for a specific database in the form of a CSV file separated by
a semicolon. Statistics show how many videos have been watched for a certain percentage of the
time (related to the time of the entire video). Statistics are refreshed once an hour. The output
filename includes the original filename, the string "_viewership" and the current date.

**Url structure**

<https://api.vintom.com/databases/{id}/statsViewership>

**HTTP method**

GET

**Request example**

curl <https://api.vintom.com/databases/2021031128549192/statsViewership> \

- u <login>:<password>

**Response CSV file columns**

### Column Description

time (%) Percentage of video watched
videos number The number of unique videos that have been watched for more than a
certain percentage of the time

**Part of the response file example**

time (%);videos number
0;
1;
2;
3;

#### 2.2.9 Aggregated statistics for all databases in the project

**Description**

It allows getting aggregated statistics for all databases in a specific project. Statistics are refreshed
once an hour.

**Url structure**

<https://api.vintom.com/databases/stats>

**Url parameters**

### Name Description

projectCode Required. Identifier of the project
dateFrom Optional. This parameter will filter the results only to those databases that
were uploaded after the specified date. The date should be provided in the
ISO 8601 standard
dateTo Optional. This parameter will filter the results only to those databases that
were uploaded before the specified date. The date should be provided in the
ISO 8601 standard

**HTTP method**

GET

**Request example**

curl <https://api.vintom.com/databases/stats?projectCode=DEMO> \
&dateFrom=2021- 02 - 20T12:30:00.000Z \

- u <login>:<password>

**Response parameters**

### Name Type Description

projectCode String Identifier of the project

### projectCreationDate Date Project creation date

videosNumber Int Number of videos in the database
trackingPixelViews Int Optional – when tracking pixel is enabled. The number of
videos where the tracking pixel was displayed. Vintom
provides a tracking pixel as an animated poster that can be
embedded in mailing, SMS, social media sharing (e.g.
Facebook), etc.
playerViews Int The number of videos for which the player was displayed
startedViews Int The number of videos that have been started to watch
viewsOver25Percent Int The number of played videos min. 25 percent
viewsOver50Percent Int The number of played videos min. 50 percent
entireVideoViews Int Number of videos played from start to finish
ctaClicked Int The number of videos for which the call-to-action button was
clicked. This number also includes the video for which the
call-to-action was clicked on the landing page
desktopViews Int Number of videos played on desktop
mobileViews Int Number of videos played on mobile
totalViews Int Total video views started

**Example of response with statistics**

{
"projectCode": "DEMO",
"videosNumber": 15000,
"trackingPixelViews": 9342,
"playerViews": 6932,
"startedViews": 6218,
"viewsOver25Percent": 5732,
"viewsOver50Percent": 5190,
"entireVideoViews": 3923,
"ctaClicked": 681,
"desktopViews": 2890,
"mobileViews": 4377,
"totalViews": 9691
}

#### 2.2.10 Statistics for each video for all databases in the project

**Description**

It allows you to get statistics for all databases in the project for each video as a CSV file separated by
a semicolon. Statistics are refreshed once an hour. The output filename includes the project code,
the string "_per_video" and the current date.

**Url structure**

<https://api.vintom.com/databases/statsPerVideo>

**HTTP method**

##### GET

**Url parameters**

### Name Description

projectCode Required. Identifier of the project
dateFrom Optional. This parameter will filter the results only to those databases that
were uploaded after the specified date. The date should be provided in the
ISO 8601 standard
dateTo Optional. This parameter will filter the results only to those databases that
were uploaded before the specified date. The date should be provided in the
ISO 8601 standard

**Request example**

curl <https://api.vintom.com/databases/statsPerVideo?projectCode=DEMO> \
&dateFrom=2021- 02 - 20T12:30:00.000Z \

- u <login>:<password>

**Response CSV file columns**

### Column Description

code Unique identifier of the video
video creation request

### date

The date the video creation request was sent.
Date format: yyyy-MM-dd HH:mm in UTC.
tracking pixel view date Optional – when tracking pixel is enabled. The date on which the
tracking pixel was first requested. Vintom provides a tracking pixel in
the form of an animated or static poster that can be embedded in
mailings, text messages, instant messengers or used as og tags when
sharing on social media. Any first display of a video poster by a user is
stored in the analytics. If you use a tracking pixel in an email, please
note that the event will only be stored if the user has images enabled.
If the user opens a website with the Vintom player without a tracking
pixel view event stored, such an event will also be added to the
analytics.
Date format: yyyy-MM-dd HH:mm in UTC. The time is given with an
accuracy of the hour
player view date The date the video player was first viewed.
Date format: yyyy-MM-dd HH:mm in UTC. The time is given with an
accuracy of the hour
watching started Value 1 when the user clicked the play button in the player and
started watching the video. Otherwise, the value is blank
watched over 25 percent Value 1 when the user has watched more than 25% of the entire
video. Otherwise, the value is blank
watched over 50 percent Value 1 when the user has watched more than 50% of the entire
video. Otherwise, the value is blank
watched entire video Value 1 when the user has watched the entire video. Otherwise, the
value is blank
watching length Length of video watched by the user in seconds
cta clicked Value 1 when the user clicked on call-to-action button in the player or
on the landing page (if one has been created for the project).
Otherwise, the value is blank

desktop The type of desktop device on which the video player was first viewed
mobile The type of mobile device on which the video player was first viewed

**Response file example**

code; video creation request date;tracking pixel view date;player view
date;watching started;watched over 25 percent;watched over 50
percent;watched entire video;cta clicked;desktop;mobile
jSvePn3J; 2021 - 02 - 24 05:53; 2021 - 02 - 26 12:00;2021- 02 - 26
13:00;1;1;1;;45;;;SMARTPHONE iOS 14.4
kA 4 yp 8 Jh;2021- 02 - 24 05:53;2021- 02 - 24 08:00;2021- 02 - 24
08:00;1;1;;;28;1;PERSONAL_COMPUTER Windows 10.0;

#### 2.2.11 Viewership statistics for all databases database in the project

**Description**

It allows you to get viewership statistics for all databases in the project in the form of a CSV file
separated by a semicolon. Statistics show how many videos have been watched for a certain
percentage of the time (related to the time of the entire video). Statistics are refreshed once an hour.
The output filename includes the project code, the string "_viewership" and the current date.

**Url structure**

<https://api.vintom.com/databases/statsViewership>

**HTTP method**

GET

**Request example**

curl <https://api.vintom.com/databases/statsViewership?projectCode=DEMO> \
&dateFrom=2021- 02 - 20T12:30:00.000Z \

- u <login>:<password>

**Response CSV file columns**

### Column Description

time (%) Percentage of video watched
videos number The number of unique videos that have been watched for more than a
certain percentage of the time

**Part of the response file example**

time (%);videos number
0;2732
1;2718
2;2709
3;2699

### 2.3 Rest API: databaseValidations

This resource allows you to validate a database without starting database processing. Thanks to this,
you can make sure that the database content is ok and start the database processing at another time
(see 2.2.1 or 2.2.2)

The common flow looks like this:

1 Uploading the database file to the Vintom system for validation (see 2.3.1 or 2.3.2).
2 Checking the database status to verify the database validity (see 2.3.3).

#### 2.3.1 Upload the database for validation

**Description**

It allows you to upload the database for validation. Endpoint accepts the request with an Excel, CSV
or JSON file that contains a list of videos and personalized data for them. Columns in the CSV file
should be separated by a comma or semicolon. The final file format should be provided by the
Account Manager at the project preparation stage. The order of the column and the existence or not
of the header is important and must be preserved.

Status of database validation can be obtained by getting validation status (see 2.3.3).

The maximum number of videos in one file is 1.000.000.

Database validation results are automatically removed from the system after 24 hours.

**Url structure**

<https://api.vintom.com/databaseValidations>

**HTTP method**

POST

**Content type**

multipart/form-data

**Parameters**

### Name Type Description

projectCode String Unique identifier of the project
database File File with the database in CSV, Excel or JSON format

**Request example**

curl -X POST <https://api.vintom.com/databaseValidations> \

- u <login>:<password> \
- H "Content-Type: multipart/form-data" \
- FprojectCode=<projectCode> \
- Fdatabase=@<path to the database>

**Response parameters**

### Name Type Description

id Int(64) Unique identifier of the database validation
projectCode String Identifier of the project
fileName String Name of the uploaded database file

### creator String Login of the user who requested the database upload

status String Initial database validation status. Always equals to
VALIDATING
creationDate Date Validation creation date
links List List of endpoints available for the entity. In this case, only the
"self" link is available (see 2.3.3)

**Response example**

{
"id": 2021031128549192,
"projectCode": "DEMO",
"fileName": "database.xlsx",
"creator": "user123",
"status": "VALIDATING",
"creationDate": " 2021 - 03 - 11T10:02:19.432Z"
"links": [{
"rel": "self",
"href": "https://api.vintom.com/databaseValidations/2021031128549192"
}]
}

#### 2.3.2 Upload the database for validation using JSON input

**Description**

It allows you to upload the database for validation. The endpoint accepts the request in JSON format.
Request body is a list of videos with personalized data. The final list of videos attributes should be
provided by the Account Manager at the project preparation stage.

Status of database validation can be obtained by getting validation status (see 2.3.3).

The maximum HTTP request size is 64MB.

The minimum time between calling a request to create a database validation is 1 minute.

Database validation results are automatically removed from the system after 24 hours.

**Url structure**

<https://api.vintom.com/databaseValidations>

**HTTP method**

##### POST

**Content type**

application/json

**Parameters**

### Name Type Description

projectCode String Unique identifier of the project

**Request example**

curl -X POST
<https://api.vintom.com/databaseValidations?projectCode=><projectCode> \

- u <login>:<password> \
- H "Content-Type: application/json" \
--data "[{\"firstName\":\"John\",\"amount\":\" 1000 \"}]"

**Response parameters**

### Name Type Description

id Int(64) Unique identifier of the database validation
projectCode String Identifier of the project
fileName String Name of the uploaded database file

### creator String Login of the user who requested the database upload

status String Initial database validation status. Always equals to
VALIDATING
creationDate Date Validation creation date
links List List of endpoints available for the entity. In this case, only the
"self" link is available (see 2.3.3)

**Response example**

{
"id": 2021031128549192,
"projectCode": "DEMO",
"fileName": "2021031128549192.json",
"creator": "user123",
"status": "VALIDATING",
"creationDate": " 2021 - 03 - 11T10:02:19.432Z"
"links": [{
"rel": "self",
"href": "https://api.vintom.com/databaseValidations/2021031128549192"
}]
}

#### 2.3.3 Get validation status

**Description**

It allows you to get the current status of database validation.

**Url structure**

<https://api.vintom.com/databaseValidations/{id}>

**HTTP method**

GET

**Request example**

curl <https://api.vintom.com/databaseValidations/2021031128549192> \

- u <login>:<password>

**Response parameters**

### Name Type Description

id Int(64) Unique identifier of the database validation
projectCode String Identifier of the project
fileName String Name of the uploaded database file

### creator String Login of the user who requested the database upload

status String The database validation can be in one of the following status:

- VALIDATING – the database is still validating
- INVALID – some database records are invalid. The list of
    errors is available in the errors attribute
- VALID – all database records are valid. It can be uploaded
    to the system (see 2.2.1 or 2.2.2)

creationDate Date Validation creation date
videosNumber Int Optional – available for VALID status. Number of videos in the
database
errors List Optional – available for INVALID status. List of validation error
messages indicating an invalid video number
links List List of endpoints available for the entity. In this case, only the
"self" link is available (see 2.3.3)

**Example of a valid database response**

{
"id": 2021031128549192,
"projectCode": "DEMO",
"fileName": "database.xlsx",
"creator": "user123",
"status": "VALID ",
"creationDate": " 2021 - 03 - 11T10:02:19.432Z",
"videosNumber": 15000,
"links": [{
"rel": "self",
"href": "https://api.vintom.com/databaseValidations/2021031128549192"
}]
}

**An example of an invalid database response**

{

"id": 2021031128549192,
"projectCode": "DEMO",
"fileName": "database.xlsx",
"creator": "user123",
"status": "INVALID",
"creationDate": " 2021 - 03 - 11T10:02:19.432Z",
"errors": [{
"videoNumber": 5,
"error": "Variable first_name is required but not found"
},{
"videoNumber": 7,
"error": "Value \"basic\" for variable account_type not equals
\"standard\", \"premium\" or \"expert\""
}],
"links": [{
"rel": "self",
"href": "https://api.vintom.com/databaseValidations/2021031128549192"
}]
}

### 2.4 Rest API: videos

This resource allows you to manage projects with a delivery time of 15m or with a real-time variant
where one rendering request relates to only one video. The basic resource in this communication
model is the video entity, which represents a single personalized video.

The common flow looks like this:

1 Sending a video render request to the Vintom system (see 2.4.1).
2 Checking the video status in response. For real-time projects, the status may be READY as soon
as the request is sent. If it is READY, you can make the video available to the end user right
away.
3 If the video status is RENDERING, check the status to verify when the video will be rendered.
Sending a request to the API makes sense at the earliest when 50% of the time declared in the
delivery time of the project has elapsed (see 2.4.2).
4 As a better alternative to point 3, you can prepare an endpoint where Vintom system will send
information when the video is rendered (see 2.4.3).

#### 2.4.1 Creating a single video

**Description**

Allows rendering of a single personalized video. The endpoint accepts the request with a JSON object
that contains data for the video. Acceptable attribute names are different for different projects and
should be provided by the Account Manager at the project preparation stage.

If the input variables are incorrect (no required variables, incorrect variable name, values contain
incorrect format), the HTTP response will be returned with the Bad Request status and detailed
information, what is incorrect.

Video rendering time depends on the delivery variant ordered for a specific project.

There are several important limitations to creating a single video:

- The maximum number of video requests that can be processed in one hour is 10,000 for the
    standard variant and 1,000 for the premium variant
- The maximum number of video requests that can be processed in one day is 100,000 for the
    standard variant and 1 0 ,000 for the premium variant

**Url structure**

<https://api.vintom.com/videos>

**HTTP method**

POST

**Content type**

application/json

**Parameters**

### Name Type Description

projectCode String Unique identifier of the project
attr1..attrN String Various personalized variables defined for a specific project

**Request example**

curl -X POST <https://api.vintom.com/videos> \

- u <login>:<password> \
- H "Content-Type: application/json" \
- d "{\"projectCode\":\"<projectCode>\", \
    \"name\":\"John\", \
    \"amount\":\" 100 \"}"

**Response parameters**

### Name Type Description

code String Unique identifier of the video
projectCode String Identifier of the project
status String Initial video status. The status can be:

- RENDERING, when a video request has been passed
    to the render farm and the user has to wait until the
    video is ready to watch.
- READY, when the video is ready to watch as soon as
    the API request is processed. It can happen for real-
    live projects

creationDate Date Video creation date
videoUrl String The URL of the personalized video where the video can be
played after rendering is complete. The URL can be a landing
page with a video player or it can be a blank video player.
emailPosterUrl String Optional. It is available if a separate image has been defined
in the project. It can be used as a poster in an e-mail, SMS or
during social media sharing.
attr1..attrN String Various personalized variables defined for a specific project. If
one of the variables is a URL address of external
photos/videos on external hosting, such a URL must return
the correct content-type consistent with the type of the
resource. The maximum size of an external photo/video is
100MB.
links List List of endpoints available for the entity. In the case of a
video, the "self" link is available (see 2.4.2) and also "stats"
for videos in READY status.

**Response example**

{
"code": "c52fsL5B",
"projectCode": "DEMO",
"status": "RENDERING",
"creationDate": " 2021 - 03 - 11T10:02:19.432Z",
"videoUrl": "<https://vintom.com/c52fsL5B>",
"emailPosterUrl": "<https://vintom.com/video/poster/c52fsL5B>",
"name": "John",

"amount": " 100 ",
"links": [{
"rel": "self",
"href": "https://api.vintom.com/videos/c52fsL5B"
}]
}

**Response example of bad request**

{
"path": "/videos",
"error": "Bad Request",
"message": "Value for variable name is required but not found",
"status": 400
}

#### 2.4.2 Get the video

**Description**

It allows you to get the current status of the video.

**Url structure**

<https://api.vintom.com/videos/{code}>

**HTTP method**

GET

**Request example**

curl <https://api.vintom.com/videos/c52fsL5B> - u <login>:<password>

**Response parameters**

### Name Type Description

code String Unique identifier of the video
projectCode String Identifier of the project
status String Initial video status. The status can be:

- RENDERING, when a video request has been passed to
    the render farm and the user has to wait until the video
    is ready to watch.
- READY, when the video is already rendered and ready to
    watch.

### creationDate Date Video creation date

videoUrl String The URL of the personalized video where the video can be played
after rendering is complete. The URL can be a landing page with a
video player or it can be a blank video player.
emailPosterUrl String Optional. It is available if a separate image has been defined in
the project. It can be used as a poster in an e-mail, SMS or during
social media sharing.
attr1..attrN String Various personalized variables defined for a specific project
links List List of endpoints available for the entity. In the case of a video,
the "self" link is available (see 2.4.2) and also "stats" for videos in
READY status.

**Example of a rendered video response**

{
"code": "c52fsL5B",
"projectCode": "DEMO",
"status": "RENDERING",
"creationDate": " 2021 - 03 - 11T10:02:19.432Z",
"videoUrl": "<https://vintom.com/c52fsL5B>",
"emailPosterUrl": "<https://vintom.com/video/poster/c52fsL5B>",
"name": "John",
"amount": " 100 ",
"links": [{
"rel": "self",
"href": "https://api.vintom.com/videos/c52fsL5B"
},{
"rel": "stats",
"href": "https://api.vintom.com/videos/c52fsL5B/stats"
}]
}

#### 2.4.3 Notification of video render finished

**Description**

You can prepare an endpoint for your projects to which render finished events will be sent. The
endpoint can be authenticated using the Basic Authentication standard. Currently, the endpoint
details must be provided to Vintom manually.

The request is the same as for the “Get the video” endpoint (see 2.4.2).

Endpoint must respond with one of the HTTP 2xx statuses, otherwise the Vintom system will
consider the sending of the notification as invalid and will try to send the notification again.

Information about changing the status to READY will not be sent if, in response to creating a video,
the API immediately returns the READY status.

**HTTP method**

POST

**Request example**

curl -X POST <https://your-api-domain> \

- u <login>:<password> \
- H "Content-Type: application/json" \
- d "{\"code\": \"c52fsL5B\", \"projectCode\": \"DEMO\", \"status\":
    \"RENDERING\", \"creationDate\": \" 2021 - 03 - 11T10:02:19.432Z\",
    \"videoUrl\": \"<https://vintom.com/c52fsL5B\>", \"emailPosterUrl\":
    \"<https://vintom.com/video/poster/c52fsL5B\>", \"name\": \"John\",
\"amount\": \" 100 \",
    \"links\": [{ \"rel\": \"self\",
\"href\": \"https://api.vintom.com/videos/c52fsL5B\"},{
\"rel\": \"links\", \"href\":
\"https://api.vintom.com/videos/c52fsL5B/links\"}]}"

**Request parameters**

### Name Type Description

code String Unique identifier of the video
projectCode String Identifier of the project
status String Initial video status. The status can be:

- RENDERING, when a video request has been passed
    to the render farm and the user has to wait until the
    video is ready to watch.
READY, when the video is already rendered and ready to
watch.

creationDate Date (^) • Video creation date
videoUrl String The URL of the personalized video where the video can be
played after rendering is complete. The URL can be a landing
page with a video player or it can be a blank video player.
emailPosterUrl String Optional. It is available if a separate image has been defined in
the project. It can be used as a poster in an e-mail, SMS or
during social media sharing.
attr1..attrN String Various personalized variables defined for a specific project
links List List of endpoints available for the entity. In the case of a
video, the "self" link is available (see 2.4.2) and also "stats" for
videos in READY status.

#### 2.4.4 Statistics for a single video

**Description**

It allows you to get statistics for a given video which was created using the "singe video" method. The
statistics are always up to date.

**Url structure**

<https://api.vintom.com/videos/{code}/stats>

**HTTP method**

##### GET

**Request example**

curl <https://api.vintom.com/videos/c52fsL5B/stats> \

- u <login>:<password>

**Response parameters**

### Name Type Description

code String Unique identifier of the video

### creationDate Date Video creation date

trackingPixelView Boolean True if the tracking pixel has been displayed at least once.
Vintom provides a tracking pixel as an animated poster that
can be embedded in mailing, SMS, social media sharing (e.g.
Facebook), etc.
playerView Boolean True if the player has been displayed at least once
startedView Boolean True if the video has started to be watched at least once
viewOver25Percent Boolean True if the video was watched for min. 25 percent of its
length at least once
viewOver50Percent Boolean True if the video was watched for min. 50 percent of its
length at least once
entireVideoView Boolean True if the video has been watched from start to finish at
least once
ctaClicked Boolean True if the call-to-action button was clicked at least once. It is
also true if the call-to-action on the landing page was clicked
desktopView Boolean True if the video has been played at least once on desktop
mobileView Boolean True if the video has been played at least once on mobile
totalViews Int Total video views started
totalViewsOver10s Int Total number of views of the video from the beginning for a
minimum of 10 seconds. Playing a video again without
reloading the player counts as one watch
totalDownloads Int The total number of downloads of MP4 file with the video or
downloads of manifest file for a stream in HLS or MPEG-
DASH format. Feature only available for selected projects

**Example of response with statistics**

{
"code": "c52fsL5B",
"creationDate": " 2021 - 10 - 21T23:35.02.492Z",
"trackingPixelView": false,
"playerView": true,
"startedView": true,
"viewOver25Percent": true,
"viewOver50Percent": true,
"entireVideoView": false,
"ctaClicked": true,
"desktopView": false,
"mobileView": true,
"totalViews": 3,
"totalViewsOver10s": 2,
"totalDownloads": 0
}

#### 2.4.5 Statistics for each video in the project

**Description**

It allows you to get statistics for each video that was created using the "singe video" method as a CSV
file separated by a semicolon. Statistics are refreshed once an hour. The output filename includes the
project code, the string "_per_video" and the current date.

**Url structure**

<https://api.vintom.com/videos/statsPerVideo>

**HTTP method**

GET

**Url parameters**

### Name Description

projectCode Required. Identifier of the project
dateFrom Optional. This parameter will filter the results only to those databases that
were uploaded after the specified date. The date should be provided in the
ISO 8601 standard
dateTo Optional. This parameter will filter the results only to those databases that
were uploaded before the specified date. The date should be provided in the
ISO 8601 standard

**Request example**

curl <https://api.vintom.com/videos/statsPerVideo?projectCode=DEMO> \
&dateFrom=2021- 02 - 20T12:30:00.000Z \

- u <login>:<password>

**Response CSV file columns**

### Column Description

code Unique identifier of the video
video creation request
date

The date the video creation request was sent.
Date format: yyyy-MM-dd HH:mm in UTC.
tracking pixel view date Optional – when tracking pixel is enabled. The date on which the
tracking pixel was first requested. Vintom provides a tracking pixel in
the form of an animated or static poster that can be embedded in
mailings, text messages, instant messengers or used as og tags when
sharing on social media. Any first display of a video poster by a user is
stored in the analytics. If you use a tracking pixel in an email, please
note that the event will only be stored if the user has images enabled.
If the user opens a website with the Vintom player without a tracking
pixel view event stored, such an event will also be added to the
analytics.
Date format: yyyy-MM-dd HH:mm in UTC. The time is given with an
accuracy of the hour

player view date The date the video player was first viewed.
Date format: yyyy-MM-dd HH:mm in UTC. The time is given with an
accuracy of the hour
watching started Value 1 when the user clicked the play button in the player and
started watching the video. Otherwise, the value is blank
watched over 25 percent Value 1 when the user has watched more than 25% of the entire
video. Otherwise, the value is blank
watched over 50 percent Value 1 when the user has watched more than 50% of the entire
video. Otherwise, the value is blank
watched entire video Value 1 when the user has watched the entire video. Otherwise, the
value is blank
watching length Length of video watched by the user in seconds
cta clicked Value 1 when the user clicked on call-to-action button in the player or
on the landing page (if one has been created for the project).
Otherwise, the value is blank
desktop The type of desktop device on which the video player was first viewed
mobile The type of mobile device on which the video player was first viewed

**Response file example**

code; video creation request date;tracking pixel view date;player view
date;watching started;watched over 25 percent;watched over 50
percent;watched entire video;cta clicked;desktop;mobile
jSvePn3J; 2021 - 02 - 24 05:53; 2021 - 02 - 26 12:00;2021- 02 - 26
13:00;1;1;1;;45;;;SMARTPHONE iOS 14.4
kA 4 yp 8 Jh;2021- 02 - 24 05:53;2021- 02 - 24 08:00;2021- 02 - 24
08:00;1;1;;;28;1;PERSONAL_COMPUTER Windows 10.0;

## 3 FTP

Vintom supports the method of data exchange via its own FTP server or via the client's FTP server. In
the case of using the client's server, Vintom requires that the directory structure be prepared on the
client's server in accordance with the specification, and that appropriate permissions have been
granted.

The method of integration via FTP allows only the exchange of databases for the rendering of
personalized videos and the retrieval of databases with links to these videos. Project statistics must
be obtained by using of a different integration method.

### 3.1 Vintom FTP server

Vintom's FTP server uses the secure SFTP protocol and is available at ftp.vintom.com and port 22.
The client must ensure that he can connect to the Vintom FTP server from his corporate network.

For this type of integration, the customer receives single credentials from Vintom for all his projects.
At the highest level of the directory structure, there are projects identified by their unique codes.

#### 3.1.1 Directory structure

The directory structure in each project is identical and consists of the following folders:

- **in** - directory where the customer puts the databases - files with data for personalization in
    CSV (with a semicolon separator) or XLSX format. The file structure must comply with the
    previously defined format for the project data. The file will be removed from this directory as
    soon as Vintom successfully take it and starts processing it
- **out** – directory where Vintom system will put databases with links to videos after rendering
    is finished
- **errors** – directory where the Vintom system will put files with the error list in case the
    inserted database does not comply with the established format for this project. When any
    row in the database is invalid, Vintom will not start rendering any video and will not put the
    database with links in the "out" directory
- **BACKUP** – directory where backup files are stored for diagnostic purposes

Sample directory structure on Vintom FTP server:

#### 3.1.2 Data flow

The data exchange is as follows:

#### 3.1.3 File structure

**Structure of the file with links (in the “out” directory)**

The file is in CSV (semicolon separator), Excel or JSON format. The choice of the CSV, Excel or JSON
format depends on the format in which the database was loaded into the system. The name of the
file consists of the name of the input file, the ID of the database generated by the Vintom system and
the text "_out":

[file name]_[database id]_out.csv

For example:

customer_data_10_20211103847392_out.csv

Database ID is necessary to acquire statistics using API. The output file consists of the following
columns:

### Column Description

code Unique identifier of the video
landing page url Optional column when landing page is created and hosted on the Vintom side
email poster url Optional column when email poster is rendered for the video

### ... Columns containing the rest of the personalized data for the video in the

```
same order as in the uploaded database
```

**An example of a file**

code;landing page url;email poster url;first_name;account_type
jSvePn 3 J;<https://vintom.com/jSvePn> 3 J;<https://vintom.com/video/poster/jSvePn>
3 J.gif;Anna;Standard
kA 4 yp 8 Jh;<https://vintom.com/kA> 4 yp 8 Jh;<https://vintom.com/video/poster/kA> 4 yp 8
Jh.gif;John;Premium

**The structure of the file with errors (in the “errors” directory)**

The file is in CSV format with a semicolon separator. The name of the file consists of the name of the
input file, the ID of the database generated by the Vintom system and the text "_errors":

[file name]_[database id]_errors.csv

For example:

customer_data_10_20211103847392_errors.csv

The error file consists of the following columns:

### Column Description

element number Number of the video from the input file
error message All errors related to a specific video

**An example of a file**

element number;error message
2 ;Variable first_name is required but not found

49;Value "basic" for variable account_type not equals "standard", "premium"
or "expert"

### 3.2 Client FTP server

The client from the Vintom system will connect to the client's FTP server periodically every 5 minutes
and check if there is a new file for rendering. If the file exists, it will be downloaded to Vintom,
processed, and the file with video links sent back to the client's FTP. The Vintom system requires the
following configuration on the client side:

- the possibility of access from the IP address 40.118.85.9
- the possibility of logging in using the user and password (in this case, the rule for its
    periodical expiration cannot exist for the password) or the authorization key
- existence of appropriate directories on the client side (described below) and permissions to
    read and write to them

#### 3.2.1 Directory structure

Each project should have a separate set of directories. Directories can be created in any parent
directory that Vintom has access to. For example, the name of the parent directory might be the
same as the project code. Three directories at the same level should be created for each project:

- **in** - directory where the customer puts the databases - files with data for personalization in
    CSV (with a semicolon separator) or XLSX format. The file structure must comply with the
    previously defined format for the project data. The file will be removed from this directory as
    soon as Vintom successfully take it and starts processing it
- **out** – directory where Vintom system will put databases with links to videos after rendering
    is finished
- **errors** – directory where the Vintom system will put files with the error list in case the
    inserted database does not comply with the established format for this project. When any
    row in the database is invalid, Vintom will not start rendering any video and will not put the
    database with links in the "out" directory

Sample directory structure on client’s FTP server:

#### 3.2.2 Data flow

The data exchange is as follows:

#### 3.2.3 File structure

**Structure of the file with links (in the “out” directory)**

The file is in CSV (semicolon separator), Excel or JSON format. The choice of the CSV, Excel or JSON
format depends on the format in which the database was loaded into the system. The name of the
file consists of the name of the input file, the ID of the database generated by the Vintom system and
the text "_out":

[file name]_[database id]_out.csv

For example:

customer_data_10_20211103847392_out.csv

Database ID is necessary to acquire statistics using API. The output file consists of the following
columns:

### Column Description

code Unique identifier of the video
landing page url Optional column when landing page is created and hosted on the Vintom side
email poster url Optional column when email poster is rendered for the video

### ... Columns containing the rest of the personalized data for the video in the

```
same order as in the uploaded database
```

**An example of a file**

code;landing page url;email poster url;first_name;account_type
jSvePn 3 J;<https://vintom.com/jSvePn> 3 J;<https://vintom.com/video/poster/jSvePn>
3 J.gif;Anna;Standard
kA 4 yp 8 Jh;<https://vintom.com/kA> 4 yp 8 Jh;<https://vintom.com/video/poster/kA> 4 yp 8
Jh.gif;John;Premium

**The structure of the file with errors (in the “errors” directory)**

The file is in CSV format with a semicolon separator. The name of the file consists of the name of the
input file, the ID of the database generated by the Vintom system and the text "_errors":

[file name]_[database id]_errors.csv

For example:

customer_data_10_20211103847392_errors.csv

The error file consists of the following columns:

### Column Description

element number Number of the video from the input file
error message All errors related to a specific video

**An example of a file**

element number;error message
2 ;Variable first_name is required but not found

49;Value "basic" for variable account_type not equals "standard", "premium"
or "expert"

## 4 Panel

Panel is a web application available at <https://panel.vintom.com>, where the user has access to
projects assigned to his account. Authorization is done using Azure Active Directory. To gain access,
register the user by clicking on the "Sign up now" link, and after completing the procedure report to
the Account Manager in order to assign appropriate projects to the newly created user.

In the Panel, the user has access to the following capabilities:

- viewing the list of databases (files) with data for rendering
- downloading a file with video links
- validation of the database file in terms of compliance with the project requirements
- loading the file with the rendering data and tracking the rendering progress
- viewing aggregated analytical data for the project or selected databases from the project
- downloading a file with statistics for individual videos for the project or selected databases
- downloading a file with viewership statistics for the project or selected databases
- changing some project settings

## 5 Player

The use of the Vintom player is recommended in order to obtain all the functionalities offered by the
Vintom system, such as analytical or call-to-action boards. In some projects, e.g. with interactivity or
those whit live generated videos, a player must be used to be able to properly deliver the video to
the end user.

If you have doubts about this topic, it is best to consult your Account Manager.

### 5.1 Requirements

#### 5.1.1 Supported browsers

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

#### 5.1.2 Content Security Policy

**Default configuration**

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

**Google Analytics**

The use of additional analytics in Google Analytics (this is default player option) requires the
following additional rules:

script-src [http://www.google-analytics.com](http://www.google-analytics.com) [http://www.googletagmanager.com](http://www.googletagmanager.com)
img-src [http://www.google.com](http://www.google.com) [http://www.google-analytics.com](http://www.google-analytics.com) *.blob.core.windows.net
connect-src*.google-analytics.com stats.g.doubleclick.net

**HTML animations**

The use of HTML animations needed in some projects requires an additional CSP rule. Ask your
Project Manager if your project requires this option. It requires the following additional rule:

script-src 'unsafe-eval'

**Premium configuration**

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

### 5.2 Features

#### 5.2.1 Basic playback

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

#### 5.2.2 Volume control

The volume control icon is available from the control bar at the bottom of the player for desktops
and in the upper right corner for mobiles.

For desktop devices, hovering the cursor over the icon causes the appearance of a volume slider to
set a specific volume. On mobile, the volume level is controlled from the device. For both desktop
and mobile, clicking the volume icon mutes the sound, and clicking again restores the volume to its
previous value.

#### 5.2.3 Autostart

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

#### 5.2.4 Fullscreen

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

#### 5.2.5 Skinning

Vintom player allows you to configure the player's default color, which will be used in some of its
elements, such as: the played video fragment marked on the seekbar or the current playback time.

#### 5.2.6 Subtitles

Vintom player allows you to display video subtitles. The availability of subtitles in the video must be
configured at the creation stage.

In the player, you can additionally configure whether the subtitles should appear automatically at the
start or not.

The subtitle on/off icon is located on the seekbar at the bottom of the player for desktop and in the
upper right corner for mobile.

Subtitles are displayed in the video area at the bottom. If subtitles are available, this should be
considered at the creative stage when creating the video, so as not to place other important
elements at the bottom of the video.

#### 5.2.7 Poster

Vintom player allows you to configure a poster that will be displayed after the user displays the
player, before the video buffers and before the user starts playing the video. The poster is one of the
video frames, but not necessarily the first.

The poster must be defined at the stage of creation. If the poster is not configured, the first frame of
the video will be displayed after the video has been buffered.

### 5.3 Embedding a video player using IFRAME

The video should be embedded using the following HTML code:

<style>
.player-container {
max-width: [width_of_video_in_campaign]px;
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

### 5.4 Embedding a video player using JavaScript hosted on Vintom side

Embedding a video using JavaScript hosted on Vintom side requires adding following code to the
<head> section of your HTML document:

<script src="https://player.vintom.com/player/2. 15. 2 /index.js"></script>
<link rel="stylesheet" href="
https://player.vintom.com/player/2. 15. 2 /public/css/style.css">

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

#### 5.4.1 Configurable parameters

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

### 5.5 Embedding a video player using JavaScript hosted on the client side

The player consists of the following parts:

- JavaScript bundle
- external CSS styles file
- external woff font files
- external library for video support (video.js)
- external library for animation support (lottie-web.js)

The player can be either installed using npm / yarn or downloaded as a zip file from the Vintom
website.

#### 5.5.1 Npm installation

1. Add this feed to your project .npmrc:
    registry=<https://registry.npmjs.org/>
    @vintom:registry=<https://pkgs.dev.azure.com/vintom2/vintom->
    player/_packaging/player-prod/npm/registry/
2. Install @vintom/vintom-player@2.15.2.

#### 5.5.2 Installation from the zip file

The zip file can be downloaded from <https://player.vintom.com/player/2.15.2/vintom-player.zip> The
zip file contains all the artifacts needed for the player - player JavaScript source file, styles, fonts,
video.js and lottie-web in required versions.

#### 5.5.3 Importing player in your code

In order to create the player you need to use the *Player* constructor. You can obtain the *Player*
constructor in either of two ways:

- if you are using ES6 in your project you can use ES6 import to import the constructor from
    *vintom-player*

```
import { Player } from "vintom-player";
```

```
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

#### 5.5.4 Adding player files to your site

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

#### 5.5.5 Initializing and configuring player

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

### 5.6 Processing data at the client’s side

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
- the player must be embedded using JavaScript (see 5.4 or 5.5)

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

### 5.7 Player events

#### 5.7.1 Subscribing to player events

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

#### 5.7.2 Calling methods on player

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

#### 5.7.3 Handling events for player embedded in iframe

If iframe embedding method is used (see 5.3), then message communication should be chosen to
listen for events.

JavaScript example of listening for message event (e.data is an object):

window.addEventListener("message", function(e) {
console.log('event from inside iframe');
console.log(e.data);
}, false);

Example output:

code: "[video_code]"
playing: false
time: 5.426868
type: vintomPlayerPause

### 5.8 Technical details

#### 5.8.1 Third-party libraries

The player uses following third-party libraries:

### Library Version

can-autoplay 3.0.0
date-fns 1.30.1
dompurify 2.4.9
es6-shim 0.35.4
fullscreen-api-polyfill 1.1.2
inversify 5.0.1
json-stable-stringify 1.0.1
loadjs 3.5.5
lottie-web 5. 12 .1
npm 10.5.2
react-ga4 2.1.0
react-inlinesvg 4.1.0
reflect-metadata 0.1.13
sparskon 1.3.5

ts-md5 1.2.4
ua-parser-js 1.0.33
video.js 7. 2 1.4
vm-browserify 1.1.2
whatwg-fetch 3.0.0

#### 5.8.2 Cookie

The player stores and processes the following cookies:

### Name Value Expired Description

videojs-vhs JSON object Local storage Current bitrate for video stream
optimization
vintomLanguage String Session User default language, for selecting
multilanguage subtitles
vintomSubtitlesDisplayed Boolean Session Whether subtitles are enabled
vintomUserIdentifier String Session User unique session id for identifying
in analytic system

### vintomVolume Number Session Current volume level

_gid String 1 day Optional. Google Analytics identifier
_ga*String 1 year Optional. Google Analytics identifier
_lfa String 1 year Optional. Google Analytics identifier
_gat* Number 1 minute Optional. Google Analytics identifier

#### 5.8.3 Outgoing connections

When using a player hosted in the Vintom infrastructure, the player makes the following requests for
external resources:

### Resource

### group id

### Url

### Meth

### od

### Description

1. <https://player2.vintom.com/player/2>.
    15.2/public/fonts/*.woff

```
GET Font used by the player
```

1. <https://player2.vintom.com/player/2>.
    15.2/public/video.js/video.min.js

```
GET Video engine library
```

1. <https://player2.vintom.com/player/2>.
    15.2/public/lottie-web/lottie.min.js

```
GET Optional. HTML animation library
```

2. <https://player2.vintom.com/cta/>*
    GET Files for video CTA
2. <https://player2.vintom.com/html->
    anims/*

```
GET Files for video HTML animations
```

2. <https://player2.vintom.com/campaig>
    n-assets/*

```
GET Other files for the video campaign e.g.
music files
```

3. <https://vintom.com/videoConfigurati>
    on/v2/*

##### GET

##### POST

```
Get video configuration for given video
code
```

4. <https://farm*.vintom.com/>*
    https://*.blob.core.windows.net/*

```
GET Campaign rendered assets like: video
stream, first frame, poster, subtitles
```

5. <https://vintom.com/v2/analytics/fact>
    s

```
POST Sends single analytics event to Vintom
System
```

5. <https://www.googletagmanager.com>
    /gtag/js

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
GET Optional. Sends single analytics event
to Google Analytics
```

Individual resources can either be replaced with those hosted on the client's side or completely
removed from the configuration. This flexibility enables the realization of a fully on-premise solution,
where all player communication is contained within the client's infrastructure.

Eliminating resources from the following groups requires certain steps:

1. The method of hosting the player on the client's side, as described in Chapter 5.5.
    "Embedding a video player using JavaScript hosted on the client side", should be applied.
2. Static configuration files (JS, CSS, HTML), separate for each project, can be transferred and
    hosted from the client's servers. In this case, a new location for these files should be
    configured in the player.
3. This endpoint returns the configuration of video streams based on the provided video code
    (codes are assigned after passing personalization data to the Vintom's API) or a set of
    personalized data sent to the endpoint. To prevent data transfer to Vintom, you can utilize
    the method of processing data on the client's side as described in Chapter 5.6. "Processing
    data at the client’s side".
4. Rendered elements of the video stream, such as the first frame, poster, etc., can also be
    transferred to the client's infrastructure and hosted from their servers. However, it should be
    noted that this requires more disk space and a provision of adequate bandwidth when the
    project is launched. Detailed information is provided in the "Vintom - Deployment
    Architecture" document, specifically under the "All in the client's infrastructure"
    architecture.
5. The analytics are fully configurable. Both the transmission of data to Google Analytics and
    the Vintom analytics system can be disabled. In this case, the client needs to receive, record,
    and process data on their side, using events sent by the player (see Chapter 5.7. "Player
    events").
