import heapq
import json
import requests
import sys
import traceback

import boto3

# Put constants at the top
MAX_RECIPES_TO_QUERY = 2

# Alex's spoonacular API key, doesn't have many requests right now, probably need to create another
# API_KEY = 'f494a127555c4c3b80a621fc4a6dd7b4'
API_KEY = '68f4923e7e354ef79bb69d8fbcb10901'
RAPID_API_KEY = 'd2a70b5910msh62b56af356b59a3p1e2900jsn2d3bf492368f'

ENDPOINT_SCHEMA_JSON_PATH = 'endpoint_schema.json'

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

    def add_authorisation_to_endpoint(endpoint, api_key):
        return endpoint + '?apiKey=' + api_key

    def add_query_data_to_endpoint(endpoint: str, query_data: dict) -> str:
        '''

        '''
        new_endpoint = endpoint + '&{}='.format(query_data['key'])
        if not query_data['islist']: new_endpoint += str(query_data['value'])
        else:

            # turn list of values into list of strs
            query_value = [str(q) for q in query_data['value']]

            # join list with joining value (sep) from schema
            new_endpoint += query_data['sep'].join(query_value)
        return new_endpoint


    # TODO: improve method of a global endpoint_schema
    from app import endpoint_schema

    # build endpoint url
    endpoint = add_authorisation_to_endpoint(original_endpoint, api_key)
    for query_key in query_info:

        # build a new query_data dictionary using the schema
        query_value = query_info[query_key]
        query_data = {k:endpoint_schema[query_key][k] for k in endpoint_schema[query_key]}
        query_data['value'] = query_info[query_key]

        # decorate endpoint
        endpoint = add_query_data_to_endpoint(endpoint, query_data)

    return endpoint

def build_list_identifier(lst):
    return '<{}>'.format('-'.join(lst))

def rank_recipe_data(recipe_data, queried_ingredients):
    '''
  
    '''
    def extract_used_ingredients(recipe, queried_ingredients_set):
        used_ingredients = [rused['name'].lower() for rused in recipe['usedIngredients']]

        # handle plurality
        for index, used_ingredient in enumerate(used_ingredients):
            if used_ingredient[-2:] == 'es':
                if used_ingredient[-3:] == 'ies':
                    used_ingredients[index] = used_ingredients[:-3] + 'y'
                elif used_ingredient[-4:] == 'aves':
                    used_ingredients[index] = used_ingredients[:-3] + 'f'
                elif used_ingredient[-3:] == 'oes':
                    used_ingredients[index] = used_ingredients[:-2]
                else:
                    used_ingredients[index] = used_ingredients[:-1]
            elif used_ingredient[-1:] == 's':
                used_ingredients[index] = used_ingredients[:-1]
                
        used_ingredients_set = set()

        for queried_ingredient in queried_ingredients_set:
            for used_ingredient in used_ingredients:
                if queried_ingredient in used_ingredient:
                    used_ingredients_set.add(queried_ingredient)
        
        return list(used_ingredients_set)

            
        # print(used_ingredients, queried_ingredients)
        # num_used_ingredients = 0
        # for used_ingredient in used_ingredients:
        #     used_ingredient_keywords = []

        #     # extract keywords for multi-worded ingredients
        #     # TODO: more robust way to handle plurals
        #     for used_ingredient_keyword in used_ingredient['name'].split(' '):
        #         used_ingredient_keywords.append(used_ingredient_keyword)
        #         if used_ingredient_keyword.endswith('s'): used_ingredient_keywords.append(used_ingredient_keyword[:-1])
        #         if used_ingredient_keyword.endswith('es'): used_ingredient_keywords.append(used_ingredient_keyword[:-2])
            
        #     for used_ingredient_keyword in used_ingredient_keywords:
        #         if used_ingredient_keyword in queried_ingredients_set:
        #             num_used_ingredients += 1
        #             continue
        # return num_used_ingredients

    def calculate_match_score(num_used_ingredients, num_unused_ingredients, num_missed_ingredients):
        # match_accuracy_score = num_used_ingredients / (num_queried_ingredients + num_unused_ingredients + num_missed_ingredients)
        return USED_WEIGHTING * num_used_ingredients - \
            (UNUSED_WEIGHTING * num_unused_ingredients + MISSED_WEIGHTING * num_missed_ingredients)

    # declarations of weightings used to rank importance of used, unused and missed ingredients
    USED_WEIGHTING = 1
    UNUSED_WEIGHTING = 0.8
    MISSED_WEIGHTING = 1.2

    # extraction
    num_queried_ingredients = len(queried_ingredients)
    queried_ingredients_set = set([w.lower() for w in queried_ingredients])
    


    to_return = []

    # dict to map a recipe's id to itself
    id_to_recipe_map = {}
    for recipe in recipe_data:
        print("recipekeys=", [r for r in recipe])

        # used_ingredients = extract_used_ingredients(recipe, queried_ingredients_set)
        # unused_ingredients = {q for q in queried_ingredients_set if q not in set(used_ingredients)}
        # recipe['usedIngredients'] = used_ingredients
        # recipe['unusedIngredients'] = list(unused_ingredients)
        # recipe['missedIngredients'] = [r['name'] for r in recipe['missedIngredients']]

        recipe['usedIngredients'] = list(set([r['name'] for r in recipe['usedIngredients']]))
        recipe['unusedIngredients'] = list(set([r['name'] for r in recipe['unusedIngredients']]))
        recipe['missedIngredients'] = list(set([r['name'] for r in recipe['missedIngredients']]))
        id_to_recipe_map[recipe['id']] = recipe

    # sort data using a heap
    sorting_heap = []

    # extract matched data and calculate an accuracy score
    for index, recipe in enumerate(recipe_data):

        # extract used ingredients
        # num_used_ingredients = extract_num_used_ingredients(recipe)
        num_used_ingredients = recipe['usedIngredientCount']
        num_unused_ingredients = num_queried_ingredients - num_used_ingredients
        num_missed_ingredients = len(recipe['missedIngredients'])
        match_accuracy_score = calculate_match_score(num_used_ingredients, num_unused_ingredients, num_missed_ingredients)
        
        # insert into heap with stability using insertion order
        heapq.heappush(sorting_heap, (-match_accuracy_score, index, recipe['id']))

    # append to heap in decreasing order of calculated match score
    while len(sorting_heap) > 0:
        heap_tup = heapq.heappop(sorting_heap)
        mapped_recipe_score = heap_tup[0]
        mapped_recipe_id = heap_tup[2]
        mapped_recipe = id_to_recipe_map[mapped_recipe_id]
        mapped_recipe['internalMatchScore'] = mapped_recipe_score
        to_return.append(mapped_recipe)

    return to_return


def get_headers():
    return {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    }

# I don't think it should be required to pass in aws_info here
# Also renamed function for consistency (match API endpoint)
def find_by_ingredients(query_info, api_key=API_KEY, test=False):
    '''
    query_info = json file from frontend
    '''

    # extract ingredients
    ingredients = query_info['IngredientsList']
    num_ingredients = len(ingredients)

    # TODO: further optimisations
    # ingredients_sorted = sorted(ingredients)
    # ingredients_str = build_list_identifier(ingredients_sorted)

    url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients"

    if test:
        response_json = read_json_from_file('sample/findByIngredients.json')
        num_ingredients = 2
        ingredients = [
            'apple', 'chicken'
        ]
    else:
        # TODO: May have to add retrying, also better to use a session
        try:
            # send the query to spoonacular and retrieve the response
            headers = get_headers()
            querystring = {
                'ingredients': ','.join(ingredients)
            }
            response = requests.request("GET", url, headers=headers, params=querystring)
            response_json = json.loads(response.text)

            # dump_json_to_filepath(response_json, 'sample/findByIngredients.json')
        except Exception as ex:
            print(traceback.format_exc(ex))
            # This means unable to fetch data for some reason, front end should handle this properly
            return None
    
    print(response_json)


    # rank the response in order of pseudo-accuracy
    ranked_json = rank_recipe_data(response_json, ingredients)
    # ranked_json = response_json

    # result = [
    #     {
    #         'id': r['id'],
    #         'title': r['title'],
    #         'image': r['image'],
    #     } for r in ranked_json
    # ]

    # return a list of ids since informationBulk handles getting all required info

    # TODO: extract usedRecipes, internalMatchScore, etc here
    # result = [r['id'] for r in ranked_json]
    result = ranked_json
    return result    

    # dump_json_to_filepath(returned_json, 'sample/findByIngredients.json')

    # parse response
    # for recipe in returned_json:
    #     # print(recipe)
    #     print("used={}, unused={}, missed={}, num_ingredients={}".format(len(recipe['usedIngredients']), len(recipe['unusedIngredients']), len(recipe['missedIngredients']), num_ingredients))

    #     # break
    #     # print('recipe title = {}'.format(recipe['title']))
    #     # print('used ingredients = {}/{}'
    #     #     .format(recipe['usedIngredientCount'], len(ingredients)))

    #     # unused_ingredients = [i['name'] for i in recipe['missedIngredients']]
    #     # print('unused ingredients = {}, {}'.format(recipe['missedIngredientCount'], unused_ingredients))
        
    #     print("usedIngredients =", [r['name'] for r in recipe['usedIngredients']])
    #     print("unusedIngredients =", [r['name'] for r in recipe['unusedIngredients']])

    #     break

    # for k in returned_json[0]: print(k, end=',')
    # return endpoint


# This should really be a class but I'm lazy and we're only implementing 2 endpoints
def information_bulk(query_info, api_key=API_KEY, test=False):
    # endpoint = build_endpoint(api_key, query_info, 'https://api.spoonacular.com/recipes/informationBulk')
    url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk'
    if test:
        # response_json = []
        response_json = read_json_from_file('sample/infoBulk.json')
    else:
        try:
            headers = get_headers()
            querystring = {
                'ids': ','.join(str(x) for x in query_info['RecipeIds'])
            }
            response = requests.request("GET", url, headers=headers, params=querystring)
            response_json = json.loads(response.text)


            # dump_json_to_filepath(response_json, 'sample/infoBulk.json')
        except Exception as ex:
            # This means unable to fetch data for some reason, front end should handle this properly
            
            print(traceback.format_exc(ex))
            return None
    
    print(response_json)
    
    return response_json


def search_recipes(query_info, test=False):
    '''
    Combine results from 2 endpoints:
    - findByIngredients
    - informationBulk
    '''
    find_by_ingredients_info = find_by_ingredients(query_info=query_info, test=test)
    recipe_id_list = [r['id'] for r in find_by_ingredients_info]

    recipes_query_info = {
        'RecipeIds': recipe_id_list
    }
    recipe_info = information_bulk(query_info = recipes_query_info, test=test)
    # print(find_by_ingredients_info)
    result = []

    print(len(recipe_info), len(find_by_ingredients_info))
    for index, r in enumerate(recipe_info):

        r_info = find_by_ingredients_info[index]

        try:
            # recipe_dict_by_id = find_by_ingredients_info[r['id']]
            # print(r['id'], recipe_dict_by_id)

            result.append(
                {
                    'id': r['id'],
                    'title': r['title'],
                    # 'image': r['image'],
                    # 'servings': r['servings'],
                    'cookTimeInMins': r['readyInMinutes'],
                    'recipeLink': r['sourceUrl'],
                    'primaryPhotoUrl': r['image'],
                    'matchingIngredients': r_info['usedIngredients'],
                    'nonMatchingIngredients': r_info['unusedIngredients'],
                    'missingIngredients': r_info['missedIngredients']
                }
            )
        except Exception:
            print('Failed to parse recipe: id={}', r['id'])
            return None

    print("result is ", result)
    return result


# This is typically how you specify start of program FYI
if __name__ == '__main__':
    # read jsons

    # ## WARNING: I don't have this config file right now
    # aws_information = read_json_from_file('aws_config.json')

    # # Comment: this is unnecessary to read from file
    # user_input = read_json_from_file('test_input.json')

    # # easier to just store in the code (it's not secure and wise for production but don't really care if someone steals)
    # api_key = read_json_from_file('api_config.json')['ApiKey']

    ingredients = [
        "Chicken",
        "Parsley",
        "Tomato",
        "Butter",
        "Carrot"
    ]
    num_recipes = 3
    query_offset = 0

    # given from front-end
    raw_query_info = {
        'IngredientsList': ingredients,
        'NumRecipes': num_recipes,
        'QueryOffset': query_offset
    }    
    search_results = search_recipes(raw_query_info)