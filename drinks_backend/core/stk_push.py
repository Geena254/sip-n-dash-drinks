import requests
from datetime import datetime
import base64
import os
from dotenv import load_dotenv

load_dotenv()

CONSUMER_KEY = os.getenv('DARJA_CONSUMER_KEY')
CONSUMER_SECRET = os.getenv('DARJA_CONSUMER_SECRET')
PASSKEY = os.getenv('DARJA_PASSKEY')
SHORTCODE = os.getenv('DARJA_SHORTCODE')
CALLBACK_URL = 'https://webhook.site/your-id'


def get_access_token():
    response = requests.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        auth=(CONSUMER_KEY, CONSUMER_SECRET)
    )
    return response.json()['access_token']

def initiate_stk_push(phone, amount):
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode(f"{SHORTCODE}{PASSKEY}{timestamp}".encode()).decode()

    payload = {
        "BusinessShortCode": SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": str(int(float(amount))),
        "PartyA": phone,
        "PartyB": SHORTCODE,
        "PhoneNumber": phone,
        "CallBackURL": CALLBACK_URL,
        "AccountReference": "SipNDash",
        "TransactionDesc": "Order payment"
    }

    headers = {
        "Authorization": f"Bearer {get_access_token()}",
        "Content-Type": "application/json"
    }

    res = requests.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
                        headers=headers, json=payload)

    return res.json()