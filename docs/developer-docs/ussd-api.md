# USSD API

Unstructured Supplementary Service Data (USSD) application.

The Ideamart platform facilitates initiating USSD sessions and continuing them using an HTTP-based API.

With this API, USSD can directly provide a service through menu navigation or support a main service by working with other APIs.

## Send Service

The Send Service allows an application to send USSD messages to one or more mobile terminals.

### Endpoint

| Property | Value |
| --- | --- |
| URL | `https://api.ideamart.io/ussd/send` |
| Content Type | `application/json` |
| Method | `POST` |

### Request

The following is a sample Send Service request:

```json
{
  "applicationId": "YOUR_APPLICATION_ID",
  "password": "YOUR_PASSWORD",
  "message": "1. Press One\n2. Press Two\n3. Press Three\n4. Exit",
  "sessionId": "1330929317043",
  "ussdOperation": "mt-cont",
  "destinationAddress": "tel:MASKED_SUBSCRIBER_ID"
}
```

#### Request parameters

| Parameter | Description | Type | Requirement |
| --- | --- | --- | --- |
| `applicationId` | Application ID provided during provisioning. | String | Mandatory |
| `password` | Password provided during provisioning. | String | Mandatory |
| `version` | API version (for example, `1.0`). If omitted, the request is validated against the latest version. | String | Optional |
| `message` | Message sent from the application. | String | Mandatory |
| `sessionId` | Unique number assigned by the USSD Gateway for the duration of the session. It is maintained throughout the session. | String | Mandatory |
| `ussdOperation` | USSD operation type. See [USSD operation values](#ussd-operation-values). | String (enumerated) | Mandatory |
| `destinationAddress` | Destination address as a hash code, e.g. `tel:5C74B588F97`. The `tel:` value may be a masked number depending on the application type. | String | Mandatory |
| `encoding` | Message encoding scheme. `440` indicates plain ASCII characters. | Enumerated | Optional |

#### Comprehensive request example

```json
{
  "applicationId": "YOUR_APPLICATION_ID",
  "password": "YOUR_PASSWORD",
  "version": "1.0",
  "message": "1. Press One\n2. Press Two\n3. Press Three\n4. Exit",
  "sessionId": "1330929317043",
  "ussdOperation": "mt-cont",
  "destinationAddress": "tel:MASKED_SUBSCRIBER_ID",
  "encoding": "440"
}
```

### Response

The USSD Send Response is returned by Ideamart to the application in response to a USSD Send Request.

#### Response parameters

| Parameter | Description | Type | Requirement |
| --- | --- | --- | --- |
| `version` | API version (for example, `1.0`). | String | Mandatory |
| `requestId` | Message ID that uniquely identifies the request within Ideamart. | String | Mandatory |
| `timeStamp` | Processed timestamp. | Not specified | Mandatory |
| `statusCode` | Status code for the entire request. | String | Mandatory |
| `statusDetail` | Status description for the entire request. | String | Mandatory |

#### Comprehensive response example

```json
{
  "statusCode": "S1000",
  "timeStamp": "1203051205",
  "statusDetail": "Success",
  "requestId": "1330929317059",
  "version": "1.0"
}
```

## Receive Service

The Receive Service allows Ideamart to deliver mobile-originated (MO) USSD messages to an application through an HTTP-based API.

The flow begins with an MO request directed to the application. Ideamart delivers this message to the application, which acknowledges receipt. The exchange may be a request–response or request–exception exchange.

### Request

The following is a sample Receive Service request (operation value retained from the supplied example):

```json
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

#### Request parameters

| Parameter | Description | Type | Requirement |
| --- | --- | --- | --- |
| `version` | API version (for example, `1.0`). | String | Mandatory |
| `applicationId` | Application ID provided during provisioning. | String | Mandatory |
| `sessionId` | Unique number assigned by the USSD Gateway for the duration of the session. | String | Mandatory |
| `ussdOperation` | USSD operation type. See [USSD operation values](#ussd-operation-values). | String (enumerated) | Mandatory |
| `sourceAddress` | Sender's address, for example `tel: 5C74B588F97`. | String | Mandatory |
| `vlrAddress` | VLR address of the sender. | String | Optional |
| `message` | Message sent by the user. | String | Mandatory |
| `encoding` | Message encoding scheme. `440` indicates plain ASCII characters. | Enumerated | Mandatory |
| `requestId` | Request ID that uniquely identifies the request within Ideamart. | String | Mandatory |

#### Comprehensive request example

```json
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

### Response

The application returns a Deliver USSD Response to Ideamart to acknowledge receipt of the MO message.

#### Response parameters

| Parameter | Description | Type | Requirement |
| --- | --- | --- | --- |
| `statusCode` | Status code for the entire request. | String | Mandatory |
| `statusDetail` | Status description for the entire request. | String | Mandatory |

#### Comprehensive response example

```json
{
  "statusCode": "S1000",
  "statusDetail": "Success"
}
```

## USSD operation values

These values are used in the `ussdOperation` parameter:

| Value | Description | Assigned by |
| --- | --- | --- |
| `mo-init` | A subscriber initiates a USSD session. | Ideamart |
| `mo-cont` | A subscriber sends a subsequent message during an existing session. | Ideamart |
| `mt-init` | An application initiates a USSD session. | Application |
| `mt-cont` | An application sends a subsequent message during an existing session. | Application |
| `mt-fin` | An application sends the final message and ends the session. | Application |
