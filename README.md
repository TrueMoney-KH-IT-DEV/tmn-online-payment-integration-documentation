# TrueMoney Online Payment Merchant Integration Documentation

API Integration for Merchant Integration with TrueMoney Online Payment Gateway.


## Instructions

Create a step-by-step guide:

1.  Generate Access Token
    
2.  Generate Product Info Signature
    
3.  Open TrueMoney Online Payment Gateway


To start Merchant will need to obtain access token using Client ID and Secret.

**Base URL** https://local-channel-gateway-staging.dev.truemoney.com.kh

**POST** /mms-api-gateway/token


Headers:

```
Content-Type: application/x-www-form-urlencoded
client_id: (Merchant Client ID)
```

Body (x-www-form-urlencoded):

```
grant_type:client_credentials
client_id:(Merchant Client ID)
client_secret:(Merchant Client Secret)
```
Response:

```
{
    "access_token": (Access Token),
    "expires_in": 3600,
    "refresh_expires_in": 0,
    "refresh_token": (Refresh Token),
    "token_type": "bearer",
    "not-before-policy": 0,
    "session_state": (Session State),
    "scope": "create"
}
```
Save the access token safely and then make another request to get the signature for the payment transaction.

POST third-party-spi-qa/test/7-11/sign

Headers:

```
Content-Type: application/json
Timestamp: (Timestamp)
env: qa
partnerType: 711
service: retail
```

Body (JSON):

```
{
    "external_ref_id": (Reference ID),
    "amount": (Amount),
    "currency": (Currency),
    "user_type": (User Type),
    "description": (Description),
    "metadata": {
        "store_id": (Store ID),
        "terminal_type": (Terminal Type)
    }
}
```

Response:

```
{
    "status": {
        "code": "success",
        "message": "success",
        "messageKh": "success"
    },
    "traceId": (Trace ID),
    "data": {
        "signature": (Signature)
    }
}
```

Save the signature and the payment information and perform URL encoding on both of them.

Open a webview with the following information:

`https://local-channel-gateway-staging.dev.truemoney.com.kh/retail-payment/view/paymentcode`

append the following query string:

client_id: Merchant Client ID

access_token: Previously saved access token

payment_info: Payment Information (URL Encoded)

signature: "algorithm=rsa-sha256;keyVersion=1;signature=" + Previously saved signature (URL Encoded)

The webview URL should look like the following:

Webview URL

```
https://local-channel-gateway-qa.dev.truemoney.com.kh/retail-payment/view/paymentcode?client_id=(Merchant Client ID)&access_token=(Access Token)&payment_info=(Payment Info URL Encoded)&signature=algorithm=rsa-sha256;keyVersion=1;signature=(Signature URL Encoded)&timestamp=(Timestamp)
```
