# Welcome to TrueMoney Pay Integration Documentation

You will find all the necessary information and references here to help you enable TrueMoney wallet as one of your payment methods on your website and/mobile applications.

TrueMoney offers a secure testing environment which mimics the Live Production enviornment, which allows you to test your integration without any impact of financial loss or anything else.

# Getting Started

## 1. Register for a Merchant Profile
You will need to provide the following information to TrueMoney so that they set up a merchant profile for you:

### Basic Information
- Short Name
- Name
- Phone number
- Email (optional)
- Address (optional)
- Latitude & Longitude (optional)

### Business Nature
- Business Type: { _Individual | Corporate_ }
- Business Category:
- Commercial Registered Name (optional)
- Commercial Registration Number (optional)
- Payment Currency { _USD | KHR | Both_ }

### Bank Details
- Bank Account Type: { _Current | Savings_ } Account (optional)
- Bank Name (optional)
- Bank Account Number (optional)
- Bank Account Name (optional)

After you provide all the information above, TrueMoney team will set up the merchant profile for you and they will provide you the following credentials (necessary for step [2.Technical Integration](https://github.com/TrueMoney-KH-IT-DEV/tmn-online-payment-integration-documentation/edit/main/README.md#2-technical-integration)):

- _Merchant Client Id_
- _Merchant Client Secret_
- _Private Key_


## 2. Technical Integration
Use the test credentials provided to you above and start integrating and testing from your application.

### 2.1. Access Token Generation

In order to access TrueMoney's Online Payment service, first you need to obtain access token. To get it, you will have call the following API:

- Base URL: `https://local-channel-gateway-staging.dev.truemoney.com.kh`

- Request:
	- POST `/mms-api-gateway/merchants/token`
	- Headers:
	
		```
		Content-Type: application/x-www-form-urlencoded
		client_id: (Merchant Client ID)
		```
	- Body (x-www-form-urlencoded):

		```
		grant_type:client_credentials
		client_id:(Merchant Client ID)
		client_secret:(Merchant Client Secret)
		```
- Response:

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
Save the access token safely.

### 2.2. Signature Generation

Then you will need to generate a signature for the payment information using the provided private key.

To generate the signature:

 1. Prepare the content in following format: 	
	 ```(timestamp_in_epoch_time_in_second){"external_ref_id":(Reference ID),"amount":(Amount),"currency":(Currency),"user_type":(User Type),"description":(Description),"metadata":{"store_id":(Store ID),"terminal_type":(Terminal Type)}}``` all in a single line with no space
	 
 2. Hash the content with RSA-SHA256 using the private key
	 ```RSA-SHA256(content)```
	 
 3. Covert hashed content to Base64
	 ```Base64(hashed content)```
	 
 4. Add hashing algorithm and version
	 ```algorithm=rsa-sha256;keyVersion=1;signature=(base64 of hased content)```

Save the signature and the payment information and perform URL encoding on both of them.

Open a webview with the following information:

```https://local-channel-gateway-staging.dev.truemoney.com.kh/retail-payment/view/paymentcode```

append the following query string:

client_id: (Merchant Client ID)

access_token: (Access Token)

payment_info: Payment Information (URL Encoded)
For example given the following payment information:
```
{
	"external_ref_id":(Reference ID),
	"amount":(Amount),
	"currency":(Currency),
	"user_type":(User Type),
	"description":(Description),
	"metadata": {
		"store_id":(Store ID),
		"terminal_type":(Terminal Type)
	}
}
```
payment_info should be encoded to:
```%7B%22external_ref_id%22%3A%28Reference%20ID%29%2C%22amount%22%3A%28Amount%29%2C%22currency%22%3A%28Currency%29%2C%22user_type%22%3A%28User%20Type%29%2C%22description%22%3A%28Description%29%2C%22metadata%22%3A%7B%22store_id%22%3A%28Store%20ID%29%2C%22terminal_type%22%3A%28Terminal%20Type%29%7D%7D```

signature:  signature (URL Encoded)
For example given the following signature:
```algorithm=rsa-sha256;keyVersion=1;signature=M5nfPIFSQjS1Ccn4JIA0FznGXRzbszolCvB3MG92H1RYKbQ97mN7croScH+4NUTL5j0CFByNBvJ7g1Dyf7KbcVRqwaEtQ4w5sR/k15Wd2hNMSasYN2tlp97aR+I/NB/P85KSdHguQdqOjb4OKxYiJG5BMOOMbtPEXOMV1utH+8Q=```

signature should be encoded to:
```algorithm%3Drsa-sha256%3BkeyVersion%3D1%3Bsignature%3DM5nfPIFSQjS1Ccn4JIA0FznGXRzbszolCvB3MG92H1RYKbQ97mN7croScH%2B4NUTL5j0CFByNBvJ7g1Dyf7KbcVRqwaEtQ4w5sR%2Fk15Wd2hNMSasYN2tlp97aR%2BI%2FNB%2FP85KSdHguQdqOjb4OKxYiJG5BMOOMbtPEXOMV1utH%2B8Q%3D```


The webview URL should look like the following:

TrueMoney payment service webview

```
https://local-channel-gateway-staging.dev.truemoney.com.kh/retail-payment/view/paymentcode?client_id=(Merchant Client ID)&access_token=(Access Token)&payment_info=(Payment Info URL Encoded)&signature=(Signature URL Encoded)&timestamp=(Timestamp used to generate Signature)
```

## Error Appendix

| **HTTP Code** | **status** | **status_message** |  **Applicable for** | **Remark** |
|--|--|--|--|--|
| 200| 000001  | Success | ALL APIs |  |
| 500| 000002  | Any error occur | ALL APIs |  |
| 400| 020004 | Authorization is missing in the request header | API : Merchant Authentication | |
| 400| 020005 | Authorization in the request header is invalid format | API : Merchant Authentication | |
| 400| 020006 | Access token is invalid | API : Merchant Authentication | | 
| 400| 020007 | Access token has been expired | API : Merchant Authentication | | 
| 400| 020008 | User has no permission to call this API | API : Merchant Authentication | |
| 400| 020009 | Timestamp is missing in the request header | API : Merchant Authentication | |
| 400| 020010 | Timestamp in the request header is invalid format | API : Merchant Authentication | |
| 400| 020011 | Client-Id is missing in the request header | API : Merchant Authentication | |
| 400| 020012 | Signature is missing in the request header | API : Merchant Authentication | |
| 400| 020013 | Signature algorithm is invalid | API : Merchant Authentication | |
| 400| 020014 | Signature in the request header is invalid | API : Merchant Authentication | |
| 400| 020015 | Access token belongs to another client | API : Merchant Authentication | |
