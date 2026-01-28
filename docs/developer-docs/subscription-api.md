# Subscription API

The **Subscription API** allows you to keep end users bound to the service and maintain related functionality.

This API manages:
- Subscription lifecycle
- End-user consent for application registration

The following services are covered in this documentation:

1. Register / Unregister service  
2. Subscription notification  
3. Subscription status service  
4. Query base service  

---

## Register / Unregister service

This service allows registration (opt-in) or unregistration (opt-out). You **must** use this service based on end-user consent. Failure to adhere may cause application suspension.

### Endpoint

- **URL:** `https://api.ideamart.io/subscription/send`  
- **Content-Type:** `application/json`  
- **Method:** `POST`

### Request

Sample request (register):

```json
{
  "applicationId": "APP_001807",
  "password": "cf2b9e361c13bc54b86d3c8180b0fd242",
  "version": "1.0",
  "action": "1",
  "subscriberId": "tel:***************"
}
```

Sample request (unregister):

```json
{
  "applicationId": "APP_001807",
  "password": "cf2b9e361c13bc54b86d3c8180b0fd242",
  "version": "1.0",
  "action": "0",
  "subscriberId": "tel:94771234567"
}
```

### Response

Sample response (register):

```json
{
  "version": "1.0",
  "requestId": "1374746416574",
  "statusCode": "S1000",
  "statusDetail": "SUCCESS",
  "subscriptionStatus": "REGISTERED"
}
```

Sample response (unregister):

```json
{
  "version": "1.0",
  "requestId": "1374746416574",
  "statusCode": "S1000",
  "statusDetail": "SUCCESS",
  "subscriptionStatus": "UNREGISTERED"
}
```

### Parameters

#### Register / Unregister request parameters

| Parameter Name | Description | Type | Mandatory / Optional |
|---|---|---|---|
| `applicationId` | Application ID as received when provisioned | `string` | Mandatory |
| `password` | Password as received when provisioned | `string` | Mandatory |
| `version` | API version (e.g., `1.0`, `2.0`, etc.) | `string` | Optional (if not specified, validated against the latest version) |
| `action` | Whether the subscriber should opt in or opt out | `enum` (`0` = Opt Out, `1` = Opt In) | Mandatory |
| `subscriberId` | Telephone number of the user to be subscribed. Use `tel:` for MSISDN (e.g., `tel:94771234567`). **Note:** `tel:` might be a masked number depending on the application. | `string` | Mandatory |

#### Register / Unregister response parameters

| Parameter Name | Description | Type | Mandatory / Optional |
|---|---|---|---|
| `version` | API version (e.g., `1.0`, `2.0`, etc.) | `string` | Always provided |
| `requestId` | Request ID to uniquely identify the request within the SDP | `string` | Always provided |
| `statusCode` | Status code for the entire request | `string` | Always provided |
| `statusDetail` | Status detail for the entire request | `string` | Always provided |
| `subscriptionStatus` | Subscription state (`REGISTERED`, `UNREGISTERED`, `PENDING`). `PENDING CHARGE` = subscriber is not charged yet. | `enum` | Optional |

---

## Subscription Notification Service

The **Subscription Notification Service** provides information related to a subscription when a user subscribes to the application.

This notification can be captured at the **Subscription Notification URL** configured during provisioning.

### Sample request

```json
{
  "applicationId": "APP_001807",
  "frequency": "Monthly",
  "status": "REGISTERED",
  "subscriberId": "tel:94771234567",
  "version": "1.0",
  "timeStamp": "20130402025896"
}
```

---

## Subscription Status Service

This service can be used to check the subscription status of a given MSISDN.

### Endpoint

- **URL:** `https://api.ideamart.io/subscription/getStatus`  
- **Content-Type:** `application/json`  
- **Method:** `POST`

### Request

Sample request:

```json
{
  "applicationId": "APP_001807",
  "password": "cf2b9e361c13bc54b86d3c8180b0fd242",
  "subscriberId": "tel:94771234567"
}
```

> Note: Your original text had `te:94771234567`. This is likely a typo; the standard format is `tel:`.

### Response

Sample response:

```json
{
  "version": "1.0",
  "subscriptionStatus": "REGISTERED",
  "statusCode": "S1000",
  "statusDetail": "SUCCESS"
}
```

### Parameters

#### Subscription status request parameters

| Parameter Name | Description | Type | Mandatory / Optional |
|---|---|---|---|
| `applicationId` | Application ID as received when provisioned | `string` | Mandatory |
| `password` | Password as received when provisioned | `string` | Mandatory |
| `subscriberId` | Address of the subscriber (e.g., `tel:94771234567`). **Note:** might be a masked number depending on the application. | `string` | Mandatory |

#### Subscription status response parameters

| Parameter Name | Description | Type | Mandatory / Optional |
|---|---|---|---|
| `version` | API version (e.g., `1.0`, `2.0`, etc.) | `string` | Mandatory |
| `subscriptionStatus` | `REGISTERED` / `UNREGISTERED` / `PENDING` / `CHARGE` | `string` | Optional |
| `statusCode` | Status/error code for the entire request | `string` | Mandatory |
| `statusDetail` | Status/error detail for the entire request | `string` | Mandatory |

---

## Query Base Service

This service provides the number of subscribers registered to a given application.

### Endpoint

- **URL:** `https://api.ideamart.io/subscription/query-base`  
- **Content-Type:** `application/json`  
- **Method:** `POST`

### Request

Sample request:

```json
{
  "applicationId": "APP_001807",
  "password": "cf2b9e361c13bc54b86d3c8180b0fd242"
}
```

### Response

Sample response:

```json
{
  "version": "1.0",
  "baseSize": "10",
  "statusCode": "S1000",
  "statusDetail": "SUCCESS"
}
```

### Parameters

#### Query base request parameters

| Parameter Name | Description | Type | Mandatory / Optional |
|---|---|---|---|
| `applicationId` | Application ID as received when provisioned | `string` | Mandatory |
| `password` | Password as received when provisioned | `string` | Mandatory |

#### Query base response parameters

| Parameter Name | Description | Type | Mandatory / Optional |
|---|---|---|---|
| `version` | API version (e.g., `1.0`, `2.0`, etc.) | `string` | Mandatory |
| `baseSize` | Current subscriber base size | `string` | Optional |
| `statusCode` | Status code for the entire request | `string` | Mandatory |
| `statusDetail` | Status detail for the entire request | `string` | Mandatory |
