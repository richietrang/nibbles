import csv
import json
import boto3

from spoonacular import search_recipes, read_json_from_file
from flask_cors import CORS


from flask import Flask, request, jsonify


# Init globals
app = Flask(__name__)
CORS(app)
endpoint_schema = read_json_from_file('endpoint_schema.json')
SAVED_RECIPES_TABLE_NAME = 'savedRecipes'
SAVED_RECIPES_TABLE_KEY = 'userEmail'

READ_IN_CONFIG = True

AWS_CONFIG = None
try: AWS_CONFIG = read_json_from_file('aws_config.json')
except: AWS_CONFIG = None

dynamodb_client = None
if READ_IN_CONFIG and AWS_CONFIG:
    dynamodb_client = boto3.client(
        'dynamodb',
        aws_access_key_id = AWS_CONFIG['aws_access_key_id'],
        aws_secret_access_key = AWS_CONFIG['aws_secret_access_key'],
        region_name = AWS_CONFIG['aws_region_name']
    )
else:
    dynamodb_client = boto3.client('dynamodb')


def query_dynamodb_table(table_name, key, value):

    global dynamodb_client

    queried_response = dynamodb_client.get_item(
      TableName = table_name,
      Key = { key : {'S': value}}
    )['Item']

    to_return = {}
    for k in queried_response:
        to_return[k] = queried_response[k]['S']
    
    return to_return

def put_dynamodb_table(table_name, entry):
    
    global dynamodb_client

    dynamodb_items = {}

    # extract all key-value pairs
    for key in entry:
        value = entry[key]
        if type(value) is list: value = ','.join(value)
        dynamodb_items[key] = {'S': value}

    # put item
    dynamodb_client.put_item(TableName=table_name, Item=dynamodb_items)
    


@app.route('/addrecipe', methods=['POST'])
def add_saved_recipe():
    """
    add a given recipeId from dynamodb given a userEmail
    """

    global dynamodb_client
    global SAVED_RECIPES_TABLE_NAME
    global SAVED_RECIPES_TABLE_KEY

    req_data = request.get_json(force=True)
    userEmail = req_data['userEmail']
    recipeId = req_data['recipeId']

    try:
        queried_response = query_dynamodb_table(
            SAVED_RECIPES_TABLE_NAME,
            SAVED_RECIPES_TABLE_KEY,
            userEmail
        )

        # get current list of recipes
        recipes_str = queried_response['savedRecipes']
        recipes_list = recipes_str.split(',')

        print(recipeId, recipes_list)
        if recipeId in recipes_list:
            return {
                "success": False
            }


        # add new item to list
        recipes_list.append(recipeId)
        new_recipes_str = ','.join(recipes_list)

        
        # update dynamodb
        queried_response['savedRecipes'] = new_recipes_str
        put_dynamodb_table(SAVED_RECIPES_TABLE_NAME, queried_response)

        return {
            "success": True
        }


    except Exception as e:
        return {
            "success": False
        }


@app.route('/deleterecipe', methods=['POST'])
def delete_saved_recipe():
    """
    delete a given recipeId from dynamodb given a userEmail
    """

    global dynamodb_client
    global SAVED_RECIPES_TABLE_NAME
    global SAVED_RECIPES_TABLE_KEY

    req_data = request.get_json(force=True)
    userEmail = req_data['userEmail']
    recipeId = req_data['recipeId']

    try:
        queried_response = query_dynamodb_table(
            SAVED_RECIPES_TABLE_NAME,
            SAVED_RECIPES_TABLE_KEY,
            userEmail
        )

        # get current list of recipes
        recipes_str = queried_response['savedRecipes']
        recipes_list = recipes_str.split(',')
        if recipeId not in recipes_list:
            return {
                "success": False
            }


        # remove item from list
        index_to_remove = None
        for index, recipe_str in enumerate(recipes_list):
            if recipe_str == recipeId:
                index_to_remove = index
                break

        recipes_list.pop(index_to_remove)
        new_recipes_str = ','.join(recipes_list)

        
        # update dynamodb
        queried_response['savedRecipes'] = new_recipes_str
        put_dynamodb_table(SAVED_RECIPES_TABLE_NAME, queried_response)

        return {
            "success": True
        }


    except Exception as e:
        return {
            "success": False
        }


@app.route('/getrecipes', methods=['POST'])
def get_saved_recipe():
    """
    retrieve list of saved recipes from dynamodb
    """

    global dynamodb_client
    global SAVED_RECIPES_TABLE_NAME
    global SAVED_RECIPES_TABLE_KEY

    req_data = request.get_json(force=True)
    userEmail = req_data['userEmail']
    recipeId = req_data['recipeId']

    try:
        queried_response = query_dynamodb_table(
            SAVED_RECIPES_TABLE_NAME,
            SAVED_RECIPES_TABLE_KEY,
            userEmail
        )

        # get current list of recipes
        recipes_str = queried_response['savedRecipes']
        recipes_list = recipes_str.split(',')
        
        return {
            "success": True,
            "savedRecipes": recipes_list
        }


    except Exception as e:
        return {
            "success": False,
            "exception": str(e)
        }









@app.route('/search', methods=['POST'])
def search_for_recipes():
    """
    Search for recipes that match list of ingredients
    """
    
    # global vars
    global endpoint_schema

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

if __name__ == '__main__':

    # read endpoint schema
    # global endpoint_schema
    
    # endpoint_schema = read_json_from_file('endpoint_schema.json')

    # run app
    app.run()