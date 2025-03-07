
# Ideamart OTP (One Time PIN)
Document Version : v1.1
API Version : 1.2

OTP (One time PIN) APaI can use to register user using Plain mobile number. In success response API return masked MSISDN that used to communitcate with other APIs

## Steps
1. Ask mobile number from user.  (app/web UI)
2. Submit OTP Request to generate PIN and dispatch OTP (API)
3. Save `referenceNo` from response (app/web backend)
4. Ask PIN from user  (web/app UI)
5. Submit PIN with `referenceNo` to `Verify PIN` API (API)
6. Save `subscriberId` for future reference (web/app backend)

> Always use backend service with Static IP to send API Call


## Submit OTP Request

When you send OTP, include correct  informations
This api used to send OTP to specific mobile number. 
	* for `Metadata`->`appCode`, iOS /Android Application code/package name or play store url  for Mobile apps 
	* for `Metadata`->`appCode`, Website url for websites
	* for `Metadata`->`appCode` , Website URL for Windows/Linux Apps
	* Also include device information to metadata. ( you can capture those data from [`UserAgent`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) Header for websites)
	* Generate unique reference (UUID) from application and sent it as `applicationHash`  for tracing.
	


When you send this request, platform will dispatch the sms with PIN
One OTP valid only `60mins` from dispatch
Application only can try `3` attempt per OTP


### URL
```
https://api.ideamart.io/subscription/otp/request 
```
or
```
https://api.dialog.lk/subscription/otp/request 
```

### Content Type
```
application/json
```


### Method
```
POST
```

### Request
Sample request for Mobile Apps.

```
{
  "applicationId": "APP_001100",
  "password": "***********************",
  "subscriberId": "tel:947771231**",
  "applicationHash": "y3b84346f63899a",
  "applicationMetaData": {
    "client": "MOBILEAPP",
    "device": "Samsung S10",
    "os": "android8",
    "appCode": "https://play.google.com/store/apps/details?id=lk.dialog.megarunlor"
  }
}
```

Sample request for WebSite.

```
{
  "applicationId": "APP_001100",
  "password": "***********************",
  "subscriberId": "tel:947771231**",
  "applicationHash": "y3b84346f63899a",
  "applicationMetaData": {
    "client": "WebSite",
    "device": "Samsung S10",
    "os": "android8",
    "appCode": "https://myappusrl/abc.html"
  }
}
```

Sample request for Desktop Apps.

```
{
  "applicationId": "APP_001100",
  "password": "***********************",
  "subscriberId": "tel:947771231**",
  "applicationHash": "y3b84346f63899a",
  "applicationMetaData": {
    "client": "DESKTOP",
    "device": "DELL G450",
    "os": "Windows 11/Ubuntu Linux",
    "appCode": "https://myappusrl/download.html"
  }
}
```

### Response - Success

```
{
  "statusCode": "S1000",
  "statusDetail": "Success",
  "referenceNo": "3b84346f63899a32ec742a676532ec74dffe4f5",
  "version": "1.0"
}
```

You need to use `referenceNo` in response to `VerifyAPI` in next Step.


### Response - Error

#### Already Registered

You will get below response for already registered users

```
{
  "statusDetail": "user already registered",
  "version": "1.0",
  "statusCode": "E1351"
}
```


## Verify PIN

### URL
```
https://api.ideamart.io/subscription/otp/verify
```
or
```
https://api.dialog.lk/subscription/otp/verify
```

### Content Type
```
application/json
```


### Method
```
POST
```

### Request
Sample request for Mobile Apps.

```
{
  "applicationId": "APP_001100",
  "password": "***********************",
  "referenceNo": "3b84346f63899a32ec742a676532ec74dffe4f5",
  "otp": "123564"
}
```

### Response - Success

If you submit correct OTP with Correct `referenceNo`, You will get success response with `subscriberId`. you need to use `subscriberId`  as masked msisdn (`destinationAddresses`,`subscriberId`) for other APIs such as Charging, SMS and Subscription.
 
```
{
  "statusCode": "S1000",
  "statusDetail": "Success",
  "subscriptionStatus": "REGISTERED",
  "version": "1.0",
  "subscriberId": "tel:hu3b84346f63899a32ec742a666503a02a4dffe4f5"
}
```

### Response - Error

#### Wront OTP

If you submit wront OTP, you will get this response. You can submit maximum 3 OTP submisions
```
{
  "statusDetail": "Invalid OTP",
  "version": "1.0",
  "statusCode": "E1850"
}
```

### OTP Expired
```
{
  "statusCode": "E1851",
  "version": "1.0",
  "statusDetail": "OTP request has being expired"
}
```

### OTP Attempt exceeded
```
{
  "statusCode": "E1852",
  "version": "1.0",
  "statusDetail": "Maximum number of OTP attempts had reached"
}
```




