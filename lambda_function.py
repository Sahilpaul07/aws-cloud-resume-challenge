
import json
import boto3
import os

# Connect to DynamoDB
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])


def lambda_handler(event, context):
    try:
        # Increment visitor count in DynamoDB
        response = table.update_item(
            Key={"id": "resume"},
            UpdateExpression="ADD #count :inc",
            ExpressionAttributeNames={
                "#count": "count"
            },
            ExpressionAttributeValues={
                ":inc": 1
            },
            ReturnValues="UPDATED_NEW"
        )

        count = int(response["Attributes"]["count"])

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,OPTIONS"
            },
            "body": json.dumps({
                "count": count
            })
        }

    except Exception as error:
        print(f"Error updating visitor count: {error}")

        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Unable to update visitor count"
            })
        }
