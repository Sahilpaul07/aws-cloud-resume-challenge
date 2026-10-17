# AWS Cloud Resume Challenge — Project Documentation

**Author:** Sahil  
**Live website:** https://dui4mbolz0bgg.cloudfront.net  
**AWS Region:** Asia Pacific (Mumbai) — `ap-south-1`

## 1. Project Overview

I built a static resume/portfolio website and deployed it on AWS. I also added a serverless visitor counter that reads the current count from an API and displays it on the website.

This document records the steps I followed, the AWS services used, the problems I encountered, and how I checked the final result.

## 2. AWS Services Used

- **Amazon S3:** Stores the website files (`index.html`, `style.css`, and `script.js`).
- **Amazon CloudFront:** Serves the website through a CloudFront distribution.
- **AWS Lambda:** Increments the visitor counter.
- **Amazon API Gateway:** Exposes the Lambda function through a `/count` endpoint.
- **Amazon DynamoDB:** Stores the counter in the `VisitorCount` table.
- **AWS IAM:** Gives Lambda permission to update the DynamoDB table.

## 3. Architecture

### Website delivery

Browser → CloudFront → S3 website files

### Visitor counter

Browser (`script.js`) → API Gateway (`GET /prod/count`) → Lambda (`visitor-counter`) → DynamoDB (`VisitorCount`)

The Lambda function updates the item with key `id = "resume"` and increments the `count` attribute.

## 4. Steps I Followed

### Step 1 — Create the website files

I created the website files in VS Code:
- `index.html`
- `style.css`
- `script.js`

I added a visitor-counter element to `index.html`:

```html
<div class="visitor-counter">
    <p>👥 Total Visitors: <span id="visitor-count">Loading...</span></p>
</div>
```

### Step 2 — Upload the website to S3

I uploaded the website files to the S3 bucket:

`sahil-cloud-resume-2026`

I enabled the required website hosting/configuration for my setup.

### Step 3 — Configure CloudFront

I created a CloudFront distribution with the S3 bucket as its origin and used Origin Access Control (OAC). The distribution's default root object should be set to `index.html`.

The current CloudFront URL is:

https://dui4mbolz0bgg.cloudfront.net

CloudFront-generated domain names cannot be renamed directly. A custom domain would require domain registration and DNS configuration; I chose to keep the generated CloudFront domain.

### Step 4 — Create the DynamoDB table

I created a DynamoDB table named `VisitorCount` in `ap-south-1`, using:
- Partition key: `id`
- Key type: String

### Step 5 — Create the Lambda function

I created a Python 3.12 Lambda function named `visitor-counter`.

Environment variable:
- `TABLE_NAME = VisitorCount`

I configured the Lambda execution role with permission to perform `dynamodb:UpdateItem` on the `VisitorCount` table.

The function updates the `count` attribute by 1 and returns the updated count as JSON.

### Step 6 — Create the API Gateway endpoint

I created a REST API named `visitor-counter-api` and configured:
- Resource: `/count`
- Method: `GET`
- Integration: Lambda proxy integration with `visitor-counter`
- Stage: `prod`

The endpoint used by the website is:

`https://m7c6hzsav8.execute-api.ap-south-1.amazonaws.com/prod/count`

I also configured/checked CORS so that the browser frontend can call the API.

### Step 7 — Connect the frontend to the API

In `script.js`, I used `fetch()` to call the API, read the JSON response, and display `data.count` in the element with ID `visitor-count`.

Example pattern:

```javascript
const apiUrl = "https://m7c6hzsav8.execute-api.ap-south-1.amazonaws.com/prod/count";

async function updateVisitorCount() {
    const counterElement = document.getElementById("visitor-count");
    if (!counterElement) return;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        counterElement.textContent = data.count;
    } catch (error) {
        console.error("Visitor counter error:", error);
        counterElement.textContent = "Unavailable";
    }
}

updateVisitorCount();
```

### Step 8 — Test the counter

I tested the Lambda function and API endpoint. The API returned JSON such as:

```json
{"count": 13}
```

The frontend displayed the counter successfully, and the latest value I reported on the live website was **24**. The count can increase when the API is called, including during my own testing and page refreshes; it does not necessarily represent 24 unique people.

### Step 9 — Add the portfolio link

I added a “My AWS Cloud Portfolio” / “Visit My Cloud Portfolio” link in `index.html` and updated its `href` to the CloudFront URL.

Note: If this link points to the same CloudFront website, clicking it simply opens the same site again. For a separate portfolio page, use a different page or website URL.

### Step 10 — Upload changes and invalidate the cache

After editing `index.html` and `script.js`, I saved the files, uploaded the updated files to S3, and created a CloudFront invalidation using:

`/*`

I learned that repeated invalidations are not normally the cause of an `AccessDenied` response. After troubleshooting, the website loaded successfully and the portfolio link was visible.

## 5. Problems I Encountered and What I Learned

### Problem 1 — CloudFront showed `AccessDenied`

**What I saw:** An XML response with `AccessDenied`.

**Checks and fixes to try if it happens again:**
1. Confirm that `index.html` exists in the S3 bucket and its spelling/case is exact.
2. In CloudFront distribution settings, set the default root object to `index.html`.
3. Verify that the origin points to the correct S3 bucket.
4. If using OAC, verify that the bucket policy allows the correct CloudFront distribution to perform `s3:GetObject`.
5. After correcting the configuration, create an invalidation for `/*` and wait for it to complete.

Do not make the bucket public just to bypass the error; keep access restricted through OAC where possible.

### Problem 2 — The website still showed the old content

**What I learned:** Saving a file in VS Code does not update the deployed website by itself.

**Process:** Save the file → upload/replace it in S3 → create CloudFront invalidation (`/*`) → wait for completion → hard-refresh the browser with `Ctrl + F5`.

### Problem 3 — Confusion about changing the CloudFront domain

**What I learned:** The generated CloudFront domain (`dui4mbolz0bgg.cloudfront.net`) cannot be renamed directly. Editing an `href` in HTML only changes the link destination; it does not rename the distribution domain.

**Decision:** I kept the free CloudFront domain instead of buying a custom domain or using Route 53.

### Problem 4 — Portfolio link was not showing the expected destination

**What I learned:** I needed to replace placeholder text such as `YOUR-CLOUDFRONT-DOMAIN` with the actual domain, save the file, upload the updated HTML to S3, and invalidate CloudFront.

If the link points back to the same website, it is not a separate portfolio site; it just opens the same website again.

### Problem 5 — Understanding visitor counts

The counter increments whenever the API is called. Repeated tests and refreshes can increase it. The displayed number is therefore a total API-call counter, not necessarily a unique-visitor count.

## 6. Final Verification Checklist

- [ ] Live CloudFront URL opens.
- [ ] Resume/portfolio content appears correctly.
- [ ] Visitor counter displays a number.
- [ ] API endpoint returns JSON.
- [ ] S3 has the latest `index.html`, `style.css`, and `script.js`.
- [ ] CloudFront invalidation status is `Completed`.
- [ ] `lambda_function.py` matches the deployed Lambda logic.
- [ ] `README.md` contains the correct live URL and architecture.
- [ ] No AWS access keys, secret keys, passwords, or `.env` files are committed to GitHub.

## 7. GitHub Repository Files

Suggested repository structure:

```text
aws-cloud-resume-challenge/
├── index.html
├── style.css
├── script.js
├── lambda_function.py
└── README.md
```

## 8. Important Notes

- Keep the S3 bucket private when using CloudFront Origin Access Control (OAC).
- Never upload AWS credentials to a public repository.
- Confirm that the `lambda_function.py` file reflects the code currently deployed in AWS before publishing it.
- This project demonstrates static website hosting, CDN configuration, a serverless API, database updates, and basic IAM permissions.
