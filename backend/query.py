import json
import requests
import sys

def read_json_from_file(filepath):
    with open(filepath) as f:
        return json.loads(f.read())

def query(api_key, user_input):
    '''
    user_input = json file from frontend
    '''

    SEARCH_ENDPOINT = 'https://api.spoonacular.com/recipes/findByIngredients'
    authorised_endpoint = SEARCH_ENDPOINT + '?apiKey=' + api_key
    ingredients = user_input['Ingredients']
    
    authorised_endpoint += '&ingredients=' + ',+'.join(ingredients)
    
    returned_response = requests.get(authorised_endpoint)
    returned_json = json.loads(returned_response.text)
    # print(returned_response.text)
    # returned_json = json.loads(str(returned_response))
    for recipe in returned_json:
        # print('Keys = ', [k for k in recipe])
        print('recipe title = {}'.format(recipe['title']))
        print('used ingredients = {}/{}'
            .format(recipe['usedIngredientCount'], len(ingredients)))

        unused_ingredients = [i['name'] for i in recipe['missedIngredients']]
        print('unused ingredients = {}, {}'.format(recipe['missedIngredientCount'], unused_ingredients))
        

        # print("Recipe = ", recipe, '\n')

    return authorised_endpoint






api_key = read_json_from_file('api_config.json')['ApiKey']
user_input = read_json_from_file('test_input.json')

print(query(api_key, user_input))