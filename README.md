# Implementation of Embedded eSignature via SignNow API with Node.js
This repository provides a comprehensive guide and code examples for implementing an embedded eSignature workflow using the [SignNow](https://www.signnow.com/) API and Node.js. With this integration, you can facilitate the signing of documents within your Node.js application, making it easier than ever to manage electronic signatures.

## Overview
Electronic signatures have become a vital component of modern business processes. The SignNow API allows you to seamlessly integrate eSignatures into your Node.js applications, enhancing document management and compliance. This repository demonstrates how to:

* Authenticate with SignNow: Obtain access tokens to interact with the SignNow API securely.
* Create an Embedded Signing Link: Generate unique signing links for your users within your Node.js application.
* Pre-populate Fields: Pre-fill form fields within documents to streamline the signing process.
* Specify Signers: Define multiple signers (invitees).

Here is the link to full [SignNow API documentation](https://docs.signnow.com/docs/signnow/welcome).

## Pre-requirements
1. Register an account on [SignNow website](https://app.signnow.com/rctapp/login).
2. Create **Basic Authorithation token**. Go to API page -> Applications and Keys -> Add Application. This token is needed to create access token for all other requests.
3. Create a **Template** in your SignNow account. Go to Templates page and click Create Template button. You can upload any pdf file you want and just set some text fields and signature fields. In current example there are two text fields **DealerName** and **LenderName** and two signature fields: one for Dealer to sign and one for Lender. Please copy a template Id, it will be needed further in the flow.
4. Add `axios` module to your NodeJS application with the following comamnd: `npm i axios` since this tutotial uses axios for making http requests.

## Getting Started

1. Get access token using this API endpoint: `https://api.signnow.com/oauth2/token`.

2. Create a document from template using `https://api.signnow.com/template/{templateId}/copy`. Access token should be provided as `Authorization header: Bearer your-access-token`. Url contains a templateId - it's should be your templateId that you created earlier.

3. If some text fields in the document should be pre-populated then use this endpoint to prefill them: `https://api.signnow.com/v2/documents/{documentId}/prefill-texts`. DocumentId is an ID of the document created in the previous step from template.

4. When creating an embedded signature we need to specify roles that should sign this document. To get all roles, their names and IDs avaialble for the document we need to get document details: `https://api.signnow.com/document/{documentId}`. Roles information will be available in `roles` property of the document.

5. Create embedded sign invites using: `https://api.signnow.com/v2/documents/{documentId}/embedded-invites`. This action will create invites inside SignMow platform, but will not send emails to users because it's embedded signature. Roles information from previous request should be used in the request body. Note: each invite should be created for unique email address.

6. Create embedded signing links for each signer: `https://api.signnow.com/v2/documents/{documentId}/embedded-invites/{inviteId}/link/`. Invite ids should be taken from the previous request when invites were created. Link expiration time can be specified in the request body.

7. Sign document. Copy the signature link and paste it to the `src` attribute of `iframe` tag on [this website](https://www.w3schools.com/html/tryit.asp?filename=tryhtml_iframe_height_width).

8. If you need to create a webhook for signing events you can use `https://api.signnow.com/api/v2/events` endpoint. Here is a [link to Webhook documentation](https://docs.signnow.com/docs/signnow/reference%2Foperations%2Fcreate-a-api-v-2-event). Webhook functionality is not covered in this repository.
