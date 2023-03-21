## Documentation

### Tool Overview

The tool is capable of receiving emails and those emails are then converted to people chips in Google Sheets automatically.

### Setup

The tool is easy to setup, all you need to do is to set your email and password. Once the email and password is setup in the field, you can send a request to the endpoint with the emails and the operations will be performed. 

### Detailed information about the project and its operation.

The tool uses NodeJS for the implementation of the API. Through one of its endpoint, we can send emails in the body of the request as an array of emails and then Puppeteer is used to automatically log into a Google account and use those emails to convert the emails into people chips in Google sheets.


### What language the tool is built with

- NodeJS
- Puppeteer

### What platform does the tool supports

The tool is an API, so it can support mobile and web applications.

### Cover how it works & its main areas

The tool uses NodeJS for the implementation of the API. Through one of its endpoint, we can send emails in the body of the request as an array of emails and then Puppeteer is used to automatically log into a Google account and use those emails to convert the emails into people chips in Google sheets.


### Functions of the tool

- Receive emails
- Convert them into people chips in Google sheets.