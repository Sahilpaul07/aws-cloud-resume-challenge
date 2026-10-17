
# AWS Cloud Resume Challenge

## Project Overview
I built a cloud-based resume website using AWS services.
The website displays a visitor counter using a serverless backend.

## AWS Services Used
- Amazon S3 – Stores website files
- Amazon CloudFront – Delivers the website
- AWS Lambda – Updates the visitor count
- Amazon API Gateway – Provides the API endpoint
- Amazon DynamoDB – Stores the visitor count
- AWS IAM – Manages permissions

## Architecture
Visitor → CloudFront → S3 (Website)

Visitor Counter:
Website JavaScript → API Gateway → Lambda → DynamoDB

## Features
- Static resume website
- CloudFront distribution
- Serverless visitor counter
- DynamoDB visitor count storage
- API integration using JavaScript

## Live Website
https://dui4mbolz0bgg.cloudfront.net

## What I Learned
- Hosting a static website on Amazon S3
- Configuring CloudFront
- Building a serverless API
- Connecting Lambda with DynamoDB
- Managing AWS IAM permissions

## Author
Sahil
