import json
from json import dump
import requests
import sys

import boto3

def get_aws_client(resource_name, aws_information):
    return boto3.client(
        resource_name,
        aws_access_key_id = aws_information['aws_access_key_id'],
        aws_secret_access_key = aws_information['aws_secret_access_key'],
        region_name = aws_information['region_name']
    )

def read_json_from_file(filepath):
    with open(filepath) as f:
        return json.loads(f.read())

def dump_json_to_filepath(dict_to_dump, filepath):
    with open(filepath, 'w') as f:
        f.write(json.dumps(dict_to_dump))


# # # # # # # # # # # #
#   ENDPOINT BUILDER  #
# # # # # # # # # # # #

def build_endpoint(api_key, query_info, original_endpoint):
    '''
    Use the decorator pattern to add information to the endpoint
    '''

    # helper methods to decorate a given endpoint
    def add_authorisation_endpoint(endpoint, api_key):
        return endpoint + '?apiKey=' + api_key

    def add_ingredients_to_endpoint(endpoint, ingredient_list):
        return endpoint + '&ingredients=' + ',+'.join(ingredient_list)

    def add_num_recipes_to_endpoint(endpoint, num_recipes):
        return endpoint + '&number=' + str(num_recipes)

    def add_query_offset_to_endpoint(endpoint, query_offset):
        return endpoint + '&offset=' + str(query_offset)

    # extract ingredients key-value from front-end
    ingredients = query_info.get('Ingredients', None)
    query_offset = query_info.get('QueryOffset', None)
    num_recipes_to_query = query_info.get('RecipesToQuery', None)

    # build endpoint url
    endpoint = add_authorisation_endpoint(original_endpoint, api_key)
    if ingredients: endpoint = add_ingredients_to_endpoint(endpoint, ingredients)
    if query_offset: endpoint = add_query_offset_to_endpoint(endpoint, query_offset)
    if num_recipes_to_query: endpoint = add_num_recipes_to_endpoint(endpoint, num_recipes_to_query)
    
    return endpoint

def build_list_identifier(lst):
    return '<{}>'.format('-'.join(lst))


def get_recipes_from_ingredients_query(api_key, query_info, aws_information):
    '''
    query_info = json file from frontend
    '''

    # extract ingredients
    ingredients = query_info['Ingredients']
    num_ingredients = len(ingredients)

    # TODO: further optimisations
    # ingredients_sorted = sorted(ingredients)
    # ingredients_str = build_list_identifier(ingredients_sorted)

    # generate endpoint
    endpoint = build_endpoint(api_key, query_info, SEARCH_BY_INGREDIENTS_ENDPOINT)

    # send the query to spoonacular and retrieve the response
    # returned_response = requests.get(endpoint)
    # returned_json = json.loads(returned_response.text)
    # dump_json_to_filepath(returned_json, 'sample/findByIngredients.json')

    # TODO: change to get real response
    returned_json = read_json_from_file('sample/findByIngredients.json')

    # parse response
    for recipe in returned_json:
        # print(recipe)
        print("used={}, unused={}, missed={}, num_ingredients={}".format(len(recipe['usedIngredients']), len(recipe['unusedIngredients']), len(recipe['missedIngredients']), num_ingredients))

        # break
        # print('recipe title = {}'.format(recipe['title']))
        # print('used ingredients = {}/{}'
        #     .format(recipe['usedIngredientCount'], len(ingredients)))

        # unused_ingredients = [i['name'] for i in recipe['missedIngredients']]
        # print('unused ingredients = {}, {}'.format(recipe['missedIngredientCount'], unused_ingredients))
        
        print("usedIngredients =", [r['name'] for r in recipe['usedIngredients']])
        print("unusedIngredients =", [r['name'] for r in recipe['unusedIngredients']])

        break
    
    for k in returned_json[0]: print(k, end=',')

    return endpoint



# # # # # # # # # # # #
#     DECLARATIONS    #
# # # # # # # # # # # #

SEARCH_BY_INGREDIENTS_ENDPOINT = 'https://api.spoonacular.com/recipes/findByIngredients'
GET_INGREDIENT_BY_ID_ENDPOINT = ''

MAX_RECIPES_TO_QUERY = 2

# # # # # # # # # # # #
#  START OF PROGRAM   #
# # # # # # # # # # # #

# read jsons
aws_information = read_json_from_file('aws_config.json')
user_input = read_json_from_file('test_input.json')
api_key = read_json_from_file('api_config.json')['ApiKey']


resp = get_recipes_from_ingredients_query(api_key, user_input, aws_information)
print(resp)