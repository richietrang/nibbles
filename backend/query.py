import json
import requests
import sys

import boto3

def read_json_from_file(filepath):
    with open(filepath) as f:
        return json.loads(f.read())

def authorise_endpoint(endpoint, api_key):
    return endpoint + '?apiKey=' + api_key

def add_ingredients_to_endpoint(endpoint, ingredient_list):
    return endpoint + '&ingredients=' + ',+'.join(ingredient_list)

def get_aws_client(resource_name, aws_information):
    return boto3.client(
        resource_name,
        aws_access_key_id = aws_information['aws_access_key_id'],
        aws_secret_access_key = aws_information['aws_secret_access_key'],
        region_name = aws_information['region_name']
    )

def get_recipes_query(api_key, user_input, aws_information):
    '''
    user_input = json file from frontend
    '''

    authorised_endpoint = authorise_endpoint(SEARCH_BY_INGREDIENTS_ENDPOINT, api_key)
    ingredients = user_input['Ingredients']
    authorised_endpoint = add_ingredients_to_endpoint(authorised_endpoint, ingredients)
    
    # send the query and retrieve the response
    returned_response = requests.get(authorised_endpoint)

    # parse response
    returned_json = json.loads(returned_response.text)
    for recipe in returned_json:
        print('recipe title = {}'.format(recipe['title']))
        print('used ingredients = {}/{}'
            .format(recipe['usedIngredientCount'], len(ingredients)))

        unused_ingredients = [i['name'] for i in recipe['missedIngredients']]
        print('unused ingredients = {}, {}'.format(recipe['missedIngredientCount'], unused_ingredients))
        

    return authorised_endpoint



SEARCH_BY_INGREDIENTS_ENDPOINT = 'https://api.spoonacular.com/recipes/findByIngredients'
GET_INGREDIENT_BY_ID_ENDPOINT = ''

aws_information = read_json_from_file('aws_config.json')
user_input = read_json_from_file('test_input.json')
api_key = read_json_from_file('api_config.json')['ApiKey']

print(get_recipes_query(api_key, user_input, aws_information))