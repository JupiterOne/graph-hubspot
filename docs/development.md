# Development

This integration focuses on Hubspot and is using
[Hubspot API](https://developers.hubspot.com/docs/api/overview) for interacting
with the Hubspot resources.

## Prerequisites

In this integration, we use OAuth to authenticate requests to the Hubspot API.
We have to use `./oauth-server` to generate the required access token.

## Provider account setup

1. First, We need to create the necessary accounts in Hubspot. The following
   requirements are lifted from Hubspot's
   [OAuth Quickstart Guide](https://developers.hubspot.com/docs/api/oauth-quickstart-guide)

> In Hubspot you first need to have:
>
> - A developer account
> - An app associated with your developer account
> - A Hubspot account to install your app in

2. Take note of your application's authentication information. They can be seen
   by following these steps

   1. In Hubspot, login using your developer account
   2. In the Hubspot accounts page, select your test account. This is not to be
      confused with the account you made to install the app in.
   3. Once in the 'Developer Home' page, click on 'Manage Apps' > Select your
      app > 'Auth' tab
   4. Take note of the information displayed in the page as this will be
      required in both the `./oauth-server` and this app's `.env` files.

3. After which, we have to provide the information to the `./oauth-server`
   through the `.env` file. You can refer to the `./oauth-server`'s
   `.env.example` as reference.

4. Once the `.env` has been provided, we can run the `./oauth-server` and get
   the OAuth key for the Hubspot account you made in the first step (the one
   that is not your test account).

5. Provide the application information in this integration's `.env` together
   with the generated OAuth key by the OAuth server. Use `.env.example` as
   reference.

## Authentication

Authentication is done by providing the OAuth key to every request's
`Authentication` header as a `Bearer` token. As long as the access token
provided in the `.env` is valid, you can continue to use this integration.
