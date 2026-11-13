# SMS API

The SMS REST Service provides operations for sending an SMS to the Ideamart platform and receiving an SMS from the platform.

The SMS interface allows applications to send and receive SMS messages using an HTTP-based API.

## Supported Services

- **Send Service:** Sends messages from a mobile application to subscribed users. Also known as MT (Mobile Terminated).
- **Receive Service:** Receives SMS messages sent to the application by users.
- **Status Report Service:** Sends delivery status reports to the application when requested.

## API Endpoint

| Property | Value |
| --- | --- |
| URL | `https://api.ideamart.io/sms/send` |
| Content Type | `application/json` |
| Method | `POST` |

## Send Service

This service lets an application send SMS messages to one or more terminals (phones or any SMS-enabled device). An application wishing to initiate an MT SMS message should use this operation.

### Request

Sample send-service request:

```json
{
  "message": "Hello",
  "destinationAddresses": ["tel:*************"],
  "password": "YOUR_PASSWORD",
  "applicationId": "YOUR_APPLICATION_ID"
}
```

### Response

```json
{
  "statusCode": "S1000",
  "statusDetail": "Success",
  "messageId": "MSG_000111",
  "version": "1.0"
}
```

### Send Request Parameters

| Parameter | Description | Type | Requirement |
| --- | --- | --- | --- |
| `applicationId` | Application ID given during provisioning. | String | Mandatory |
| `password` | Password given during provisioning. | String | Mandatory |
| `version` | API version (e.g., `1.0`, `2.0`). If omitted, the latest version is used for validation. | String | Optional |
| `destinationAddresses` | List of destination addresses, e.g., `tel:5C74B588F97`. `tel:all` addresses the application's subscribed base. Addresses may be masked depending on application type. | List of strings | At least one required |
| `message` | Message to be sent. Messages exceeding the limit are split. | String | Mandatory |
| `sourceAddress` | Sender address displayed to users; must be one of the provisioned aliases. | String | Optional |
| `deliveryStatusRequest` | `0`: delivery report not required; `1`: delivery report required. Defaults to no delivery report. | Enumerated | Optional |
| `encoding` | `0`: text; `240`: flash SMS; `245`: binary SMS. Defaults to text. Binary message content is hex-encoded. | Enumerated | Optional |
| `chargingAmount` | Charging amount for variable-charging applications, in system currency with two decimal places (e.g., `78.05`). | Number | Optional |
| `binaryHeader` | Binary header for advanced messages. | Hexadecimal string | Optional |

### Comprehensive Send Request

```json
{
  "message": "Hello",
  "password": "YOUR_PASSWORD",
  "sourceAddress": "77000",
  "deliveryStatusRequest": "1",
  "chargingAmount": "15.75",
  "destinationAddresses": ["tel:*************"],
  "applicationId": "YOUR_APPLICATION_ID",
  "encoding": "245",
  "version": "1.0",
  "binaryHeader": "526574697265206170706c69636174696f6e20616e642072656c6561736520524b7320696620666f756e642065787069726564"
}
```

### Send Response Parameters

| Parameter | Description | Type | Requirement |
| --- | --- | --- | --- |
| `version` | API version; matches the request version if specified, otherwise uses the latest version. | String | Mandatory |
| `requestId` | Unique identifier for the request within Ideamart. | String | Mandatory |
| `statusCode` | Status code for the overall request. | String | Mandatory |
| `statusDetail` | Status details for the overall request. | String | Mandatory |
| `destinationResponses` | Results for each destination, including address, processing timestamp, message ID, status code, and status details. | Collection | Mandatory |

### Sample Send Response

```json
{
  "destinationResponses": [
    {
      "timeStamp": "20190807100523",
      "address": "tel:MASKED_SUBSCRIBER_ID",
      "messageId": "MSG_000111",
      "statusDetail": "Request was successfully processed.",
      "statusCode": "S1000"
    }
  ],
  "requestId": "REQ_000111",
  "statusDetail": "Request was successfully processed.",
  "version": "1.0",
  "statusCode": "S1000"
}
```

### Comprehensive Destination Response

```json
{
  "destinationResponses": [
    {
      "timeStamp": "20190807100523",
      "address": "tel:*********************",
      "messageId": "21908071005227014",
      "statusDetail": "Request was successfully processed.",
      "statusCode": "S1000"
    }
  ],
  "requestId": "21908071005227014",
  "statusDetail": "Request was successfully processed.",
  "version": "1.0",
  "statusCode": "S1000"
}
```

## Receive Service

This service receives messages sent by users to the application. As described in the source documentation, each invocation returns SMS messages since the previous invocation.

### Request

Sample receive-service request:

```json
{
  "message": "my testing message",
  "sourceAddress": "tel:***************",
  "requestId": "APP_000001",
  "encoding": "0",
  "version": "1.0"
}
```

### Response

Sample receive-service response:

```json
{
  "statusCode": "E1308",
  "statusDetail": "Error during the charging operation"
}
```

### Receive Request Parameters

| Parameter | Description | Type | Requirement |
| --- | --- | --- | --- |
| `version` | API version (e.g., `1.0`, `2.0`). | String | Mandatory |
| `applicationId` | Application ID given during provisioning. | String | Mandatory |
| `sourceAddress` | Source address (masked number). | String | At least one specified |
| `message` | Message sent by the user. | String | Mandatory |
| `requestId` | Request identifier within Ideamart. | String | Mandatory |
| `encoding` | `0`: text; `240`: flash; `245`: binary. Binary content is hex-encoded. | Enumerated | Mandatory |

### Comprehensive Receive Request

```json
{
  "message": "my testing message from app1",
  "sourceAddress": "tel:**************",
  "requestId": "APP_000001",
  "encoding": "0",
  "version": "1.0"
}
```

### Receive Response Parameters

| Parameter | Description | Type | Requirement |
| --- | --- | --- | --- |
| `statusCode` | Error code for the overall request. | String | Mandatory |
| `statusDetail` | Error details for the overall request. | String | Mandatory |

## Delivery Status Report Service

When an application requests a delivery response during a Send SMS operation, Ideamart initiates the Delivery Status Report service to forward the response from the Message Centre. The `requestId` matches the MT response to the delivery report.

### Request

```json
{
  "destinationAddress": "tel:************",
  "timeStamp": "20120113082110",
  "requestId": "MSG_000111",
  "deliveryStatus": "DELIVERED"
}
```

### Response

```json
{
  "statusCode": "S1000",
  "statusDetail": "Success"
}
```

### Delivery Status Request Parameters

| Parameter | Description | Type | Requirement |
| --- | --- | --- | --- |
| `destinationAddress` | Subscriber address (e.g., `tel:5C74B588F97`). | String | Mandatory |
| `timeStamp` | Timestamp sent from SMS. Source describes the format as `yyMMddHHmm`, with `yy` (year), `MM` (month), `dd` (day), `HH` (hour), and `mm` (minute). | String | Mandatory |
| `requestId` | Unique identifier for the request within Ideamart. | String | Mandatory |
| `deliveryStatus` | SMPP values: `DELIVRD`, `EXPIRED`, `DELETED`, `UNDELIV`, `ACCEPTD`, `UNKNOWN`, `REJECTD`. Ideamart values: `DELIVERED`, `EXPIRED`, `DELETED`, `UNDELIVERABLE`, `ACCEPTED`, `UNKNOWN`, `REJECTED`. | String | Mandatory |

### Comprehensive Delivery Status Request

```json
{
  "destinationAddress": "tel:****************",
  "timeStamp": "20120113082110",
  "requestId": "MSG_000111",
  "deliveryStatus": "DELIVERED"
}
```

### Delivery Status Response Parameters

| Parameter | Description | Type | Requirement |
| --- | --- | --- | --- |
| `statusCode` | Status code for the overall request. | String | Mandatory |
| `statusDetail` | Status details for the overall request. | String | Mandatory |
