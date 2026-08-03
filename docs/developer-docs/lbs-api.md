# 5. LBS API

The LBS API enables applications on Ideamart to find a user's location in real time, including users with feature phones. It allows applications to send and receive location requests through a REST-based API and build location-aware, real-time services.

The API request enables a Service Provider application to request the location of a specific mobile number. Ideamart then returns the available location information in the API response.

**Example:** A third-party application requests the location of a particular MSISDN through the LBS API and receives the location of the requested MSISDN in the response.

## Method

`POST`

## Get Location

The Get Location service consists of a location request and a location response.

| Environment | Endpoint |
|---|---|
| Simulator | [http://localhost:7000/lbs/locate](http://localhost:7000/lbs/locate) |
| Production | [https://api.dialog.lk/lbs/locate](https://api.dialog.lk/lbs/locate) |

## 5.1 Request

### Sample request with mandatory and optional parameters

```json
{
  "applicationId": "APP_001768",
  "password": "729fdf8ea178cdea9857eeb9a059fd6e",
  "subscriberId": "tel:94771234567",
  "serviceType": "IMMEDIATE",
  "responseTime": "NO_DELAY",
  "freshness": "HIGH",
  "horizontalAccuracy": "1500",
  "version": "2.0"
}
```

### Mandatory request parameters

The following parameters must appear in every LBS request:

- `applicationId`
- `password`
- `subscriberId`
- `serviceType`

### Sample request with mandatory parameters only

```json
{
  "applicationId": "APP_001764",
  "password": "39ca9208fbb1171f027e8d24fe5e275e",
  "subscriberId": "tel:94771234567",
  "serviceType": "IMMEDIATE"
}
```

### Request parameters

| Parameter name | Description | Type | Mandatory/Optional |
|---|---|---|---|
| `applicationId` | Application ID assigned during provisioning. | String | Mandatory |
| `password` | Password assigned during provisioning. | String | Mandatory |
| `version` | API version, such as `1.0` or `2.0`. | String | Optional.<br><br>If omitted, the request is validated against the latest API version. |
| `subscriberId` | MSISDN of the subscriber whose location is requested. This is a unique identifier.<br><br>The MSISDN may be masked depending on the application type. | String | Mandatory.<br><br>Only one subscriber value can be sent in a request. |
| `serviceType` | Required MLP service type.<br><br>Currently supported value: `IMMEDIATE`. | ENUM | Mandatory |
| `responseTime` | QoS parameter defining the accepted delay for the response.<br><br>Accepted values, in precedence order:<br><br>1. `NO_DELAY`<br>2. `LOW_DELAY`<br>3. `DELAY_TOLERANCE`<br><br>`NO_DELAY` has the highest precedence.<br><br>For example, an application provisioned with `LOW_DELAY` cannot initiate a request using `NO_DELAY`, but it can use `LOW_DELAY` or `DELAY_TOLERANCE`. | ENUM | Optional.<br><br>If omitted, the value is validated against the application's LBS NCS configuration. |
| `horizontalAccuracy` | QoS parameter defining the required horizontal accuracy of the location update.<br><br>Accepted values, in precedence order:<br><br>1. `100`<br>2. `500`<br>3. `1000`<br>4. `1500`<br><br>The minimum value, `100`, has the highest precedence.<br><br>For example, an application provisioned with `1000` cannot initiate a request using `100` or `500`, but it can use `1000` or `1500`. | ENUM | Optional.<br><br>If omitted, the value is validated against the application's LBS NCS configuration. |
| `freshness` | QoS parameter defining the required freshness of the location update.<br><br>Accepted values, in precedence order:<br><br>1. `HIGH_LOW`<br>2. `LOW_HIGH`<br>3. `HIGH`<br>4. `LOW`<br><br>`HIGH_LOW` has the highest precedence.<br><br>For example, an application provisioned with `LOW_HIGH` cannot initiate a request using `HIGH_LOW`, but it can use `LOW_HIGH`, `HIGH`, or `LOW`. | ENUM | Optional.<br><br>If omitted, the value is validated against the application's LBS NCS configuration. |

## 5.2 Response

### Sample response with mandatory and optional parameters

```json
{
  "statusCode": "S1000",
  "timeStamp": "20130405181744",
  "subscriberState": true,
  "statusDetail": "Success",
  "horizontalAccuracy": "-7.0",
  "longitude": "6.707778",
  "freshness": "8.0",
  "latitude": "79.948944",
  "messageId": "101304051246360081",
  "version": "1.0"
}
```

### Mandatory response parameters

The following parameters must appear in every LBS response:

- `statusCode`
- `statusDetail`
- `messageId`
- `version`

### Sample response with mandatory parameters only

```json
{
  "statusCode": "E1303",
  "statusDetail": "IP address, which the request originates from, is not listed within the allowed-host-address list",
  "messageId": "101304051248020083",
  "version": "1.0"
}
```

### Response parameters

| Parameter name | Description | Type | Mandatory/Optional |
|---|---|---|---|
| `version` | API version, such as `1.0` or `2.0`. | String | Mandatory |
| `messageId` | Message ID that uniquely identifies the request within the SDP. | String | Always specified |
| `latitude` | Latitude coordinate of the subscriber's location. | String | Mandatory for successful requests.<br><br>Not available for failed requests. |
| `longitude` | Longitude coordinate of the subscriber's location. | String | Mandatory for successful requests.<br><br>Not available for failed requests. |
| `freshness` | Actual freshness of the returned location update, in minutes. | Integer | Mandatory |
| `horizontalAccuracy` | Actual horizontal accuracy of the returned location update, in metres. | Integer | Mandatory |
| `subscriberState` | Power state of the target subscriber's mobile phone.<br><br>`true`: powered on<br><br>`false`: powered off | Boolean | Optional |
| `timeStamp` | System date and time of the successful or failed transaction. | Date time | Mandatory for successful requests.<br><br>Not available for failed requests. |
| `statusCode` | Status or error code for the request. | String | Mandatory |
| `statusDetail` | Status or error details for the request. | String | Mandatory |
