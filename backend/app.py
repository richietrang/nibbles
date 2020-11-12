import csv
import json

from spoonacular import search_recipes, read_json_from_file
from flask_cors import CORS

from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)

from boto3.dynamodb.conditions import Key, Attr
import boto3

import aws_config as keys

# Init globals
app = Flask(__name__)
jwt = JWTManager(app)
CORS(app)

app.config['SECRET_KEY'] = 'secret'

endpoint_schema = read_json_from_file('endpoint_schema.json')

dynamodb = boto3.resource('dynamodb',
                    aws_access_key_id=keys.ACCESS_KEY_ID,
                    aws_secret_access_key=keys.ACCESS_SECRET_KEY,
                    region_name=keys.REGION_NAME
                    )


@app.route('/search', methods=['POST'])
def search_for_recipes():
    """
    Search for recipes that match list of ingredients
    """

    # global vars
    global endpoint_schema

    # TODO: OPTIMISE THIS, CALLING THIS MANY TIMES
    # endpoint_schema = read_json_from_file('endpoint_schema.json')


    req_data = request.get_json(force=True)

    query_info = {k:req_data[k] for k in req_data if k in endpoint_schema}

    # print("reqdata=", req_data)
    # print("queryinfo=", query_info)
    # print(ingredient_list)
    result = search_recipes(query_info, test=True)
    return jsonify(result)


@app.route('/ingredients', methods=['GET'])
def ingredients():
    ingredients = []
    with open('data/top-1k-ingredients.csv', newline='\n') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        ingredients = list(reader)

    return json.dumps(ingredients)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        form_data = request.json
        name = form_data["name"]
        password = form_data["password"]
        email = form_data["email"]

        table = dynamodb.Table('users')

        table.put_item(
            Item = {
            'name': name,
            'email': email,
            'password': password
                }
        )

    msg = 'Registration Complete. Please Login to your account!'
    return {'msg': msg}

@app.route('/login', methods=['GET', 'POST'])
def login():
    msg = 'Invalid username or password'
    result = ""
    if request.method == 'POST':
        form_data = request.json
        password = form_data["password"]
        email = form_data["email"]

        table = dynamodb.Table('users')
        response = table.query(
            KeyConditionExpression=Key('email').eq(email)
        )
        items = response['Items']
        name = items[0]['name']
        print(items[0]['password'])
        print(items[0]['name'])
        print(items[0]['email'])
        if password == items[0]['password']:
            msg = 'Login Success'
            access_token = create_access_token(identity = {'name': name})

    return jsonify({'msg': msg, 'access_token':access_token})

# Protect a view with jwt_required, which requires a valid access token
# in the request to access.
@app.route('/protected', methods=['GET'])
@jwt_required
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == '__main__':

    # read endpoint schema
    # global endpoint_schema

    # endpoint_schema = read_json_from_file('endpoint_schema.json')

    # run app
    app.run()
