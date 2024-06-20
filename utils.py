from typing import List
import boto3
import os

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION_NAME = os.getenv('AWS_REGION_NAME')
AWS_BUCKET_NAME = os.getenv('AWS_BUCKET_NAME')
    

def get_s3_client():
    return boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION_NAME
    )


def _generate_presigned_url(url: str):
    """Generate presigned urls.

    Args:
        url (list): urls to be presigned

    Returns:
        list: presigned urls
    """
    s3_client = get_s3_client()
    s3_client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': AWS_BUCKET_NAME,
            'Key': url
        },
        ExpiresIn=3600
    )


def get_bucket_objects(bucket_name):
    bucket = boto3.resource('s3').Bucket(AWS_BUCKET_NAME)
    return bucket.objects.all()


def get_signed_urls_for_bucket(bucket_name: str) -> List[str]:
    keys = [
        obj.key for obj in get_bucket_objects(AWS_BUCKET_NAME)
    ]
    s3_client = get_s3_client()
    return [
        get_signed_url_from_key(key)
        for key in keys
    ]


def get_signed_url_from_key(key: str) -> str:
    s3_client = get_s3_client()
    return s3_client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': AWS_BUCKET_NAME,
            'Key': key
        },
        ExpiresIn=3600
    )