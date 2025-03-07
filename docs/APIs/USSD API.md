# USSD API

Unstructured Supplementary Service Data application.

The Ideamart platform facilitates to initiate USSD and continue sessions using a HTTP-based API.

With this API, USSD can be used to either directly provide a service by menu navigation or use the menus to support the main service by working with other APIs.

## Send Service

To send USSD messages to a mobile phone from an application. This service lets the user send USSD to one or more terminals from the application.

#### URL
```
https://api.ideamart.io/ussd/send
``` 

#### Content Type
```
application/JSON
```

#### Method
```
POST
```

#### Request

Following is a sample request for send service.

```
{ 
     "applicationId": "APP_000001",
     "password": "password",
     "message": 
     "1. Press One
     2.Press two
     3. Press three
     4. Exit",
     "sessionId": "1330929317043",
     "ussdOperation": "mt-cont",
     "destinationAddress": "tel: 5C74B588F97"
 }
 ``` 

#### 

Following are the Request parameters of send service.

| Parameter Name | Description                                                                                                                                                             | Type   | Mandatory / Optional |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|----------------------|
| applicationId  | Application ID as given when provisioned.                                                                                                                               | String | Mandatory            |
| password       | Password given when provisioned                                                                                                                                         | String | Mandatory            |
| version        | API version (shall be numbered as 1.0 etc). If not specified shall be validated against the latest version.                                                             |        |                      |
| Optional       |                                                                                                                                                                         |        |                      |
| message        | Message sent from the application.                                                                                                                                      | String | Mandatory            |
| sessionId      | Unique number that USSD Gateway assigns to the application for the duration of the session. This number will be maintained in all messages throughout a single session. | String | Mandatory            |
| ussdOperation  | USSD operation                                                                                                                                                          |        |                      |

mo-init: Ideamart to assign when a USSD session is initiated by subscriber  
  
mo-cont: Ideamart to assign for any USSD message originated from subscriber, that comes after a init.  
mt-init: App to assign when a USSD session is initiated by an application  
  
mt-cont: App to assign for any USSD message originated from application, that comes after a init  
  
mt-fin: App to assign when session ends in final message | EnumeratorData type will be string where the operation name itself will be used in the parameter value. | Mandatory |
| destinationAddress | Destination address should be a Hash Code. tel – for MSISDN tel: 5C74B588F97  
Note: tel might be a masked number depending on the type of application  
| String | Mandatory |
| encoding | Encoding scheme used in the message440 – Plain ASCII characters | Enumerated | Optional |

#### Request

Comprehensive sample request:

```
{  
     "applicationId": "APP_000001",
     "password": "password",
     "version": "1.0",
     "message": "1. Press One
     2. Press two
     3. Press three
     4. Exit",
     "sessionId": "1330929317043",
     "ussdOperation": "mt-cont",
     "destinationAddress": "tel: 5C74B588F97",
     "encoding": "440"
 }
 ``` 

#### Response

USSD-Send-Response is a response from the Ideamart to the application, which will be sent as a response to the USSD-Send-Request message.

Following are the response parameters of send service.

| Parameter Name | Description                                                    | Type   | Mandatory / Optional |
|----------------|----------------------------------------------------------------|--------|----------------------|
| version        | API version(shall be numbered as 1.0 etc)                      | String | Mandatory            |
| requestId      | MessageID to uniquely identify the request within the Ideamart | String | Mandatory            |
| timeStamp      | Processed timestamp                                            |        |                      |
| Mandatory      |                                                                |        |                      |
| statusCode     | The status code for the entire request                         | String | Mandatory            |
| statusDetail   | The status detail for the entire request                       | String | Mandatory            |

Comprehensive sample response:

```
{  
     "statusCode": "S1000",
     "timeStamp": "1203051205",
     "statusDetail": "Success",
     "requestId": "1330929317059",
     "version": "1.0"
 }
 ``` 

## Receive Service

USSD service allows Ideamart to deliver MO messages to the application using HTTP – based API.

The flow of messages is initiated by a MO request sent to an application, the Ideamart will deliver the message to the application as an acknowledgement.

Hence it could be either request-response exchange or a request-exception exchange.

Receive USSD request is a MO message which will be sent to the application through the Ideamart as a delivery request.

#### Request

Following is a sample request for receive service.

											
```
{  
     "message": "*141#",
     "ussdOperation": "mt-cont",
     "requestId": "1330933229901",
     "sessionId": "1330929317043",
     "encoding": "440",
     "sourceAddress": "tel: 5C74B588F97",
     "applicationId": "APP_000001",
     "version": "1.0"
 }
 ``` 

Following are the request parameters of deliver service.

| Parameter Name | Description                                                                                          | Type                                                                                                    | Mandatory/Optional |
|----------------|------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|--------------------|
| version        | API version (shall be numbered as 1.0 etc)                                                           | String                                                                                                  | Mandatory          |
| applicationId  | Application ID as given when provisioned                                                             | String                                                                                                  | Mandatory          |
| sessionId      | Unique number that USSD Gateway assigns to the application for the duration of the session.          | String                                                                                                  | Mandatory          |
| ussdOperation  | USSD operation                                                                                       |                                                                                                         |                    |
|                |                                                                                                      |                                                                                                         |                    |
|                | mo-init: IdeaMart to assign when a USSD session is initiated by subscriber                           |                                                                                                         |                    |
|                | mo-cont: IdeaMart to assign for any USSD message originated from subscriber, that comes after a init |                                                                                                         |                    |
|                | mt-init: App to assign when a USSD session is initiated by an application                            |                                                                                                         |                    |
|                | mt-cont: App to assign for any USSD message originated from application, that comes after a init     |                                                                                                         |                    |
|                | mt-fin: App to assign when session ends in final message                                             | EnumeratorData type will be string where the operation name itself will be used in the parameter value. | Mandatory          |
| sourceAddress  | sender addresssourceAddress: tel: 5C74B588F97                                                        | String                                                                                                  | Mandatory          |
| vlrAddress     | VLR address of the sender                                                                            | String                                                                                                  | Optional           |
| message        | Message as sent from the user                                                                        | String                                                                                                  | Mandatory          |
| encoding       | Encoding scheme used in the message440 – Plain ASCII characters                                      | Enumerated                                                                                              | Mandatory          |
| requestId      | Request ID to uniquely identify the request within the Ideamart                                      | String                                                                                                  | Mandatory          |

Comprehensive sample request:

																
```
{  
     "message": "*141#",
     "ussdOperation": "mo-init",
     "requestId": "1330933229901",
     "vlrAddress": "some vlr address",
     "sessionId": "1330929317043",
     "encoding": "440",
     "sourceAddress": "tel: 5C74B588F97",
     "applicationId": "APP_000001",
     "version": "1.0"
 }
 ``` 

#### Response

Deliver-USSD-Response should be the response given by the Application to the Ideamart as an acknowledgement on the receipt of a MO message submitted by Ideamart.

Following are the response parameters of deliver service.

| Parameter Name | Description                              | Type   | Mandatory/Optional |
|----------------|------------------------------------------|--------|--------------------|
| statusCode     | The status code for the entire request   | String | Mandatory          |
| statusDetail   | The status detail for the entire request | String | Mandatory          |

Comprehensive sample response:

																
 ```
 { 
    "statusCode": "S1000",
    "statusDetail": "Success"
 }
 ```
