package com.tmc.merchant.client;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.Provider;
import java.security.Security;
import java.security.Signature;
import java.security.SignatureException;
import java.util.Base64;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;

public class Main {

	static final String PRIVATE_KEY = 
			"-----BEGIN RSA PRIVATE KEY-----\r\n" + 
			"MIICXQIBAAKBgQDFfwCZ/5PdBcdRMKlaEtby9XYMwlwqQ7uTtPBx8443JDaLcfKvERc+gYj/SZCo6TbiSnYyxJCtgfkGsN4lZE8nGSZ2cuflnRN+9fDT+4tqzr3pYa02EvPl6tnhJh3y52AVjxry2HCsBMoMb4N9S3Iq8Z3R5vGTuCPitasdm0oy2wIDAQABAoGBAILDFCLilYRBzzZyga6hyrAS1ZadGWjib8/cfVb1a7QWxgaN66D+L+Wy3oIosx8jSrOJmbkDbMd0xu0nLe6T+9M73r+QfmEP4BZQt0bM8ZI+vbMkIskr8svvuZ+gGQ1XTtY4BsTOEcbMITdBPxyWgqmDQpS/Drjf08XRqUpVdeABAkEA+jb75Zj3DzZVMchUVlClkV2dz7BYBrZ0/c6GP1Fndt06x6ThiuG5yGq31c/h3cGKswoS0OI4Mxx/SZJz8/OiIQJBAMoP+kX1JxtzNxI8v88vovjwnU5FeSWPzTrLE2MQ/xJTxBVzEM1s10BKKnxOnfGoslVZdRITLlAXx6NSpSFLrXsCQAnWuab4kdZuS4FOoEpYl3oU1UzCYWO6LvV/9nVs7QWWg2YwTJIaeCSyVZI5v2bp4ltR7RV7n7waxcKN2LNiBCECQEuxLImkSiAISur0As40BBLI38SAVd9yPOj3Ra3oogRViLCYSAUL7p5QqhWixZvPG+7I8gfxU3oBTnGp9d3BIZ0CQQCwZQcasgjv8o1dp44oLkVr5Pt3c4wwjwaG8d4hUcMJK57N0+/1mn1KYm0f7klJe24if613nBk2VCBKq2ypXaRf\r\n" + 
			"-----END RSA PRIVATE KEY-----";
	
	static final String EXPECTED_SIGNATURE =
			"uEAjvXj1YqJBPp15cEjJoPQSSMxx3jWyXMK8+XaOxOT/O+DFxAVKtnXZ+Xk8D8R8z3/KJXxwsoSQeWemBfBdr6OCCvBxEyAo5BTmxdM8XsElZm88yrHzGVv3BvFVuasZyfDoX8XsHX3QBi8qG+8y9Q/pY/BWToQRn+gD1z/+fbc=";
	
	public static void main(String[] args) throws Exception {
		//long currentTimestamp = Instant.now().getEpochSecond();
		long currentTimestamp = 1646217025l;
		String paymentInfo = "{\"external_ref_id\":\"TM_0000001\",\"amount\":12.1,\"currency\":\"USD\",\"user_type\":\"CUSTOMER\",\"description\":\"UAT\",\"metadata\":{\"store_id\":\"57\",\"terminal_type\":\"POS\",\"terminal_id\":\"1\"}}";
		String payload = currentTimestamp + paymentInfo;
		PrivateKey privateKey = getKeyPair(PRIVATE_KEY).getPrivate();
		String signature = sign(payload, privateKey);
		assertEquals(EXPECTED_SIGNATURE, signature);
		System.out.println(signature);
	}
	
	static Provider getBC() {
		Provider provider = Security.getProvider("BC");
		if (provider == null) {
			provider = new BouncyCastleProvider();
			Security.addProvider(provider);
		}
		return provider;
	}
	
	static KeyPair getKeyPair(String str) throws IOException {
		Provider provider = getBC();
		StringReader stringReader = new StringReader(str);
		PEMParser pemParser = new PEMParser(stringReader);
		Object object = pemParser.readObject();
		pemParser.close();
		JcaPEMKeyConverter converter = new JcaPEMKeyConverter().setProvider(provider);
		return converter.getKeyPair((PEMKeyPair) object);
	}

	static String sign(String payload, PrivateKey privateKey) throws InvalidKeyException, NoSuchAlgorithmException, SignatureException, UnsupportedEncodingException {
		Signature privateSignature = Signature.getInstance("SHA256withRSA");
		privateSignature.initSign(privateKey);
		privateSignature.update(payload.getBytes("UTF-8"));
		byte[] signature = privateSignature.sign();
		return Base64.getEncoder().encodeToString(signature);
	}
	
}
