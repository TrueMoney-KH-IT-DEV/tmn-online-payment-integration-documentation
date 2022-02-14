// Copyright 2019 The Flutter team. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:provider_shopper/models/cart.dart';
import 'package:url_launcher/url_launcher.dart';

class MyCart extends StatelessWidget {
  const MyCart({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text('Cart', style: Theme.of(context).textTheme.headline1)),
      body: Container(
        color: Colors.white,
        child: Column(
          children: [
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: _CartList(),
              ),
            ),
            const Divider(height: 4, color: Colors.black),
            _CartTotal()
          ],
        ),
      ),
    );
  }
}

class _CartList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var itemNameStyle = Theme.of(context).textTheme.headline6;
    // This gets the current state of CartModel and also tells Flutter
    // to rebuild this widget when CartModel notifies listeners (in other words,
    // when it changes).
    var cart = context.watch<CartModel>();

    return ListView.builder(
      itemCount: cart.items.length,
      itemBuilder: (context, index) => ListTile(
        leading: const Icon(Icons.done),
        trailing: IconButton(
          icon: const Icon(Icons.remove_circle_outline),
          onPressed: () {
            cart.remove(cart.items[index]);
          },
        ),
        title: Text(
          cart.items[index].name,
          style: itemNameStyle,
        ),
      ),
    );
  }
}

class Album {
  final String token;

  Album({required this.token});

  factory Album.fromJson(Map<String, dynamic> json) {
    return Album(
      token: json['access_token'].toString(),
    );
  }
}

class _CartTotal extends StatelessWidget {
  void requestToken(BuildContext context) {
    // Uri url = Uri.parse('https://local-channel-gateway-qa.dev.truemoney.com.kh/mms-api-gateway/token'); //QA
    Uri url = Uri.parse(
        'https://local-channel-gateway-staging.dev.truemoney.com.kh/mms-api-gateway/merchants/token'); //Staging

    http
        .post(url,
            body: {
              "grant_type": "client_credentials",
              "client_id": "merchant-nham24",
              "client_secret": "1bfa772f-0807-4eba-83b0-4e4432c8cd61"
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'client_id': 'merchant-client-id'
            },
            encoding: Encoding.getByName("utf-8"))
        .then((response) {
      dynamic s = json.decode(response.body);
      var token = s['access_token'].toString();
      openWebView(token);
      // Navigator.pushNamed(context, '/webViewQR');
    });
  }

  // ignore: avoid_void_async
  void openWebView(String token) async {
    var url =
        "https://local-channel-gateway-staging.dev.truemoney.com.kh/retail-payment/view/paymentcode?client_id=merchant-nham24&access_token=$token&payment_info=%7B%22merchant_id%22%3A%224%22%2C%22external_ref_id%22%3A%22G000009%22%2C%22amount%22%3A10%2C%22currency%22%3A%22USD%22%2C%22user_type%22%3A%22CUSTOMER%22%2C%22description%22%3A%22rLPbR%22%2C%22metadata%22%3A%7B%22store_id%22%3A%221%22%2C%22terminal_type%22%3A%22POS%22%7D%7D&signature=algorithm%3Drsa-sha256%3BkeyVersion%3D1%3Bsignature%3DpXtq0jsEBaokDi9AjaImK2eoW70%2FtbWxIA87%2FpRI9GTSqPAEvfztFtfEbfavhlr%2FSHRJW6VtWWmnZ4GDyBcKTMPqMf5ncrWAqRj0BVHzNsFHxOaO%2BTldLMuQSgLLXowmxlYTSkPv6nfqs4lbZwA1uDitdijUgTelWqCy5nGAJmc%3D&timestamp=1644303276";
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }

  @override
  Widget build(BuildContext context) {
    var hugeStyle =
        Theme.of(context).textTheme.headline6!.copyWith(fontSize: 48);
    return SizedBox(
      height: 200,
      child: Center(
          child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Another way to listen to a model's change is to include
              // the Consumer widget. This widget will automatically listen
              // to CartModel and rerun its builder on every change.
              //
              // The important thing is that it will not rebuild
              // the rest of the widgets in this build method.

              Consumer<CartModel>(
                  builder: (context, cart, child) =>
                      Text('\$${cart.totalPrice}', style: hugeStyle)),
              const SizedBox(width: 24),
              TextButton(
                // onPressed: () => Navigator.pushNamed(context, '/webViewQR'),
                onPressed: () {
                  // openMap();
                  requestToken(context);
                },
                style: TextButton.styleFrom(primary: Colors.deepOrange),
                child: const Text('PAY WITH TRUEMONEY'),
              ),
            ],
          ),
        ],
      )),
    );
  }
}
