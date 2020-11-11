import heapq
import json
import requests
import sys
import traceback

import boto3

# Put constants at the top
MAX_RECIPES_TO_QUERY = 2

# Alex's spoonacular API key, doesn't have many requests right now, probably need to create another
API_KEY = 'f494a127555c4c3b80a621fc4a6dd7b4'
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
    def extract_num_used_ingredients(recipe):
        used_ingredients = recipe['usedIngredients']
        num_used_ingredients = 0
        for used_ingredient in used_ingredients:
            used_ingredient_keywords = []

            # extract keywords for multi-worded ingredients
            # TODO: more robust way to handle plurals
            for used_ingredient_keyword in used_ingredient['name'].split(' '):
                used_ingredient_keywords.append(used_ingredient_keyword)
                if used_ingredient_keyword.endswith('s'): used_ingredient_keywords.append(used_ingredient_keyword[:-1])
                if used_ingredient_keyword.endswith('es'): used_ingredient_keywords.append(used_ingredient_keyword[:-2])
            
            for used_ingredient_keyword in used_ingredient_keywords:
                if used_ingredient_keyword in queried_ingredients_set:
                    num_used_ingredients += 1
                    continue
        return num_used_ingredients

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
    for recipe in recipe_data: id_to_recipe_map[recipe['id']] = recipe

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

    # generate endpoint
    endpoint = build_endpoint(api_key, query_info, 'https://api.spoonacular.com/recipes/findByIngredients')

    if test:
        response_json = read_json_from_file('sample/findByIngredients.json')
        num_ingredients = 5
        ingredients = [
            'Chicken', 'Parsley', 'Tomato', 'Butter', 'Carrot'
        ]
    else:
        # TODO: May have to add retrying, also better to use a session
        try:
            # send the query to spoonacular and retrieve the response
            response = requests.get(endpoint)
            response_json = json.loads(response.text)
        except Exception as ex:
            print(traceback.format_exc(ex))
            # This means unable to fetch data for some reason, front end should handle this properly
            return None

    # rank the response in order of pseudo-accuracy
    # ranked_json = rank_recipe_data(response_json, ingredients)
    ranked_json = response_json

    # result = [
    #     {
    #         'id': r['id'],
    #         'title': r['title'],
    #         'image': r['image'],
    #     } for r in ranked_json
    # ]

    # return a list of ids since informationBulk handles getting all required info

    # TODO: extract usedRecipes, internalMatchScore, etc here
    result = [r['id'] for r in ranked_json]
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
    endpoint = build_endpoint(api_key, query_info, 'https://api.spoonacular.com/recipes/informationBulk')
    if test:
        response_json = []
        # response_json = read_json_from_file('sample/findByIngredients.json')
    else:
        try:
            response = requests.get(endpoint)
            response_json = json.loads(response.text)
            print(response_json)
        except Exception as ex:
            # This means unable to fetch data for some reason, front end should handle this properly
            
            print(traceback.format_exc(ex))
            return None
    
    return response_json


def search_recipes(query_info, test=False):
    '''
    Combine results from 2 endpoints:
    - findByIngredients
    - informationBulk
    '''
    recipe_id_list = find_by_ingredients(query_info=query_info, test=test)

    recipes_query_info = {
        'RecipeIds': recipe_id_list
    }
    recipe_info = information_bulk(query_info = recipes_query_info, test=test)

    result = []
    for r in recipe_info:
        try:
            result.append(
                {
                    'id': r['id'],
                    'title': r['title'],
                    'image': r['image'],
                    'servings': r['servings'],
                    'readyInMinutes': r['readyInMinutes'],
                    'sourceUrl': r['sourceUrl'],
                    # 'usedIngredientCount': r['usedIngredientCount'],
                    # 'missedIngredientCount': r['missedIngredientCount'],
                    # 'internalMatchScore': r['internalMatchScore']
                    # 'spoonacularSourceUrl': r['spoonacularSourceUrl'],
                }
            )
        except Exception:
            print('Failed to parse recipe: id={}', r['id'])
            return None

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
    print("SEARCH_RESULTS = ", search_results)



# findByIngredient_response = [
#     {
#         "id": 73420,
#         "image": "https://spoonacular.com/recipeImages/73420-312x231.jpg",
#         "imageType": "jpg",
#         "likes": 0,
#         "missedIngredientCount": 3,
#         "missedIngredients": [
#             {
#                 "aisle": "Baking",
#                 "amount": 1.0,
#                 "id": 18371,
#                 "image": "https://spoonacular.com/cdn/ingredients_100x100/white-powder.jpg",
#                 "meta": [],
#                 "name": "baking powder",
#                 "original": "1 tsp baking powder",
#                 "originalName": "baking powder",
#                 "unit": "tsp",
#                 "unitLong": "teaspoon",
#                 "unitShort": "tsp"
#             },
#             {
#                 "aisle": "Spices and Seasonings",
#                 "amount": 1.0,
#                 "id": 2010,
#                 "image": "https://spoonacular.com/cdn/ingredients_100x100/cinnamon.jpg",
#                 "meta": [],
#                 "name": "cinnamon",
#                 "original": "1 tsp cinnamon",
#                 "originalName": "cinnamon",
#                 "unit": "tsp",
#                 "unitLong": "teaspoon",
#                 "unitShort": "tsp"
#             },
#             {
#                 "aisle": "Milk, Eggs, Other Dairy",
#                 "amount": 1.0,
#                 "id": 1123,
#                 "image": "https://spoonacular.com/cdn/ingredients_100x100/egg.png",
#                 "meta": [],
#                 "name": "egg",
#                 "original": "1 egg",
#                 "originalName": "egg",
#                 "unit": "",
#                 "unitLong": "",
#                 "unitShort": ""
#             }
#         ],
#         "title": "Apple Or Peach Strudel",
#         "unusedIngredients": [],
#         "usedIngredientCount": 1,
#         "usedIngredients": [
#             {
#                 "aisle": "Produce",
#                 "amount": 6.0,
#                 "id": 9003,
#                 "image": "https://spoonacular.com/cdn/ingredients_100x100/apple.jpg",
#                 "meta": [],
#                 "name": "apples",
#                 "original": "6 large baking apples",
#                 "originalName": "baking apples",
#                 "unit": "large",
#                 "unitLong": "larges",
#                 "unitShort": "large"
#             }
#         ]
#     },
#     {
#         "id": 632660,
#         "image": "https://spoonacular.com/recipeImages/632660-312x231.jpg",
#         "imageType": "jpg",
#         "likes": 3,
#         "missedIngredientCount": 4,
#         "missedIngredients": [
#             {
#                 "aisle": "Milk, Eggs, Other Dairy",
#                 "amount": 1.5,
#                 "extendedName": "unsalted butter",
#                 "id": 1001,
#                 "image": "https://spoonacular.com/cdn/ingredients_100x100/butter-sliced.jpg",
#                 "meta": [
#                     "unsalted",
#                     "cold"
#                 ],
#                 "name": "butter",
#                 "original": "1 1/2 sticks cold unsalted butter cold unsalted butter<",
#                 "originalName": "cold unsalted butter cold unsalted butter<",
#                 "unit": "sticks",
#                 "unitLong": "sticks",
#                 "unitShort": "sticks"
#             },
#             {
#                 "aisle": "Produce",
#                 "amount": 4.0,
#                 "id": 1079003,
#                 "image": "https://spoonacular.com/cdn/ingredients_100x100/red-delicious-apples.png",
#                 "meta": [
#                     "red",
#                     " such as golden delicious, peeled, cored and cut into 1/4-inch-thick slices "
#                 ],
#                 "name": "red apples",
#                 "original": "4 larges red apples, such as Golden Delicious, peeled, cored and cut into 1/4-inch-thick slices",
#                 "originalName": "s red apples, such as Golden Delicious, peeled, cored and cut into 1/4-inch-thick slices",
#                 "unit": "large",
#                 "unitLong": "larges",
#                 "unitShort": "large"
#             },
#             {
#                 "aisle": "Spices and Seasonings",
#                 "amount": 2.0,
#                 "id": 2010,
#                 "image": "https://spoonacular.com/cdn/ingredients_100x100/cinnamon.jpg",
#                 "meta": [],
#                 "name": "cinnamon",
#                 "original": "2 teaspoons cinnamon",
#                 "originalName": "cinnamon",
#                 "unit": "teaspoons",
#                 "unitLong": "teaspoons",
#                 "unitShort": "tsp"
#             },
#             {
#                 "aisle": "Nut butters, Jams, and Honey",
#                 "amount": 2.0,
#                 "id": 19719,
#                 "image": "https://spoonacular.com/cdn/ingredients_100x100/apricot-jam.jpg",
#                 "meta": [
#                     "melted"
#                 ],
#                 "name": "apricot preserves",
#                 "original": "2 tablespoons apricot preserves, melted and strained",
#                 "originalName": "apricot preserves, melted and strained",
#                 "unit": "tablespoons",
#                 "unitLong": "tablespoons",
#                 "unitShort": "Tbsp"
#             }
#         ],
#         "title": "Apricot Glazed Apple Tart",
#         "unusedIngredients": [
#             {
#                 "aisle": "Produce",
#                 "amount": 1.0,
#                 "id": 9003,
#                 "image": "https://spoonacular.com/cdn/ingredients_100x100/apple.jpg",
#                 "meta": [],
#                 "name": "apples",
#                 "original": "apples",
#                 "originalName": "apples",
#                 "unit": "serving",
#                 "unitLong": "serving",
#                 "unitShort": "serving"
#             }
#         ],
#         "usedIngredientCount": 0,
#         "usedIngredients": []
#     }
# ]

# getRecipesInfoBulk_response = [
#     {
#         "id": 716429,
#         "title": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
#         "image": "https://spoonacular.com/recipeImages/716429-556x370.jpg",
#         "imageType": "jpg",
#         "servings": 2,
#         "readyInMinutes": 45,
#         "license": "CC BY-SA 3.0",
#         "sourceName": "Full Belly Sisters",
#         "sourceUrl": "http://fullbellysisters.blogspot.com/2012/06/pasta-with-garlic-scallions-cauliflower.html",
#         "spoonacularSourceUrl": "https://spoonacular.com/pasta-with-garlic-scallions-cauliflower-breadcrumbs-716429",
#         "aggregateLikes": 209,
#         "healthScore": 19.0,
#         "spoonacularScore": 83.0,
#         "pricePerServing": 163.15,
#         "analyzedInstructions": [],
#         "cheap": false,
#         "creditsText": "Full Belly Sisters",
#         "cuisines": [],
#         "dairyFree": false,
#         "diets": [],
#         "gaps": "no",
#         "glutenFree": false,
#         "instructions": "",
#         "ketogenic": false,
#         "lowFodmap": false,
#         "occasions": [],
#         "sustainable": false,
#         "vegan": false,
#         "vegetarian": false,
#         "veryHealthy": false,
#         "veryPopular": false,
#         "whole30": false,
#         "weightWatcherSmartPoints": 17,
#         "dishTypes": [
#             "lunch",
#             "main course",
#             "main dish",
#             "dinner"
#         ],
#         "extendedIngredients": [
#             {
#                 "aisle": "Milk, Eggs, Other Dairy",
#                 "amount": 1.0,
#                 "consitency": "solid",
#                 "id": 1001,
#                 "image": "butter-sliced.jpg",
#                 "measures": {
#                     "metric": {
#                         "amount": 1.0,
#                         "unitLong": "Tbsp",
#                         "unitShort": "Tbsp"
#                     },
#                     "us": {
#                         "amount": 1.0,
#                         "unitLong": "Tbsp",
#                         "unitShort": "Tbsp"
#                     }
#                 },
#                 "meta": [],
#                 "name": "butter",
#                 "original": "1 tbsp butter",
#                 "originalName": "butter",
#                 "unit": "tbsp"
#             },
#             {
#                 "aisle": "Produce",
#                 "amount": 2.0,
#                 "consitency": "solid",
#                 "id": 10011135,
#                 "image": "cauliflower.jpg",
#                 "measures": {
#                     "metric": {
#                         "amount": 473.176,
#                         "unitLong": "milliliters",
#                         "unitShort": "ml"
#                     },
#                     "us": {
#                         "amount": 2.0,
#                         "unitLong": "cups",
#                         "unitShort": "cups"
#                     }
#                 },
#                 "meta": [
#                     "frozen",
#                     "thawed",
#                     "cut into bite-sized pieces"
#                 ],
#                 "name": "cauliflower florets",
#                 "original": "about 2 cups frozen cauliflower florets, thawed, cut into bite-sized pieces",
#                 "originalName": "about frozen cauliflower florets, thawed, cut into bite-sized pieces",
#                 "unit": "cups"
#             },
#             {
#                 "aisle": "Cheese",
#                 "amount": 2.0,
#                 "consitency": "solid",
#                 "id": 1041009,
#                 "image": "cheddar-cheese.png",
#                 "measures": {
#                     "metric": {
#                         "amount": 2.0,
#                         "unitLong": "Tbsps",
#                         "unitShort": "Tbsps"
#                     },
#                     "us": {
#                         "amount": 2.0,
#                         "unitLong": "Tbsps",
#                         "unitShort": "Tbsps"
#                     }
#                 },
#                 "meta": [
#                     "grated",
#                     "(I used romano)"
#                 ],
#                 "name": "cheese",
#                 "original": "2 tbsp grated cheese (I used romano)",
#                 "originalName": "grated cheese (I used romano)",
#                 "unit": "tbsp"
#             },
#             {
#                 "aisle": "Oil, Vinegar, Salad Dressing",
#                 "amount": 1.0,
#                 "consitency": "liquid",
#                 "id": 1034053,
#                 "image": "olive-oil.jpg",
#                 "measures": {
#                     "metric": {
#                         "amount": 1.0,
#                         "unitLong": "Tbsp",
#                         "unitShort": "Tbsp"
#                     },
#                     "us": {
#                         "amount": 1.0,
#                         "unitLong": "Tbsp",
#                         "unitShort": "Tbsp"
#                     }
#                 },
#                 "meta": [],
#                 "name": "extra virgin olive oil",
#                 "original": "1-2 tbsp extra virgin olive oil",
#                 "originalName": "extra virgin olive oil",
#                 "unit": "tbsp"
#             },
#             {
#                 "aisle": "Produce",
#                 "amount": 5.0,
#                 "consitency": "solid",
#                 "id": 11215,
#                 "image": "garlic.jpg",
#                 "measures": {
#                     "metric": {
#                         "amount": 5.0,
#                         "unitLong": "cloves",
#                         "unitShort": "cloves"
#                     },
#                     "us": {
#                         "amount": 5.0,
#                         "unitLong": "cloves",
#                         "unitShort": "cloves"
#                     }
#                 },
#                 "meta": [],
#                 "name": "garlic",
#                 "original": "5-6 cloves garlic",
#                 "originalName": "garlic",
#                 "unit": "cloves"
#             },
#             {
#                 "aisle": "Pasta and Rice",
#                 "amount": 6.0,
#                 "consitency": "solid",
#                 "id": 20420,
#                 "image": "fusilli.jpg",
#                 "measures": {
#                     "metric": {
#                         "amount": 170.097,
#                         "unitLong": "grams",
#                         "unitShort": "g"
#                     },
#                     "us": {
#                         "amount": 6.0,
#                         "unitLong": "ounces",
#                         "unitShort": "oz"
#                     }
#                 },
#                 "meta": [
#                     "(I used linguine)"
#                 ],
#                 "name": "pasta",
#                 "original": "6-8 ounces pasta (I used linguine)",
#                 "originalName": "pasta (I used linguine)",
#                 "unit": "ounces"
#             },
#             {
#                 "aisle": "Spices and Seasonings",
#                 "amount": 2.0,
#                 "consitency": "solid",
#                 "id": 1032009,
#                 "image": "red-pepper-flakes.jpg",
#                 "measures": {
#                     "metric": {
#                         "amount": 2.0,
#                         "unitLong": "pinches",
#                         "unitShort": "pinches"
#                     },
#                     "us": {
#                         "amount": 2.0,
#                         "unitLong": "pinches",
#                         "unitShort": "pinches"
#                     }
#                 },
#                 "meta": [
#                     "red"
#                 ],
#                 "name": "red pepper flakes",
#                 "original": "couple of pinches red pepper flakes, optional",
#                 "originalName": "couple of red pepper flakes, optional",
#                 "unit": "pinches"
#             },
#             {
#                 "aisle": "Spices and Seasonings",
#                 "amount": 2.0,
#                 "consitency": "solid",
#                 "id": 1102047,
#                 "image": "salt-and-pepper.jpg",
#                 "measures": {
#                     "metric": {
#                         "amount": 2.0,
#                         "unitLong": "servings",
#                         "unitShort": "servings"
#                     },
#                     "us": {
#                         "amount": 2.0,
#                         "unitLong": "servings",
#                         "unitShort": "servings"
#                     }
#                 },
#                 "meta": [
#                     "to taste"
#                 ],
#                 "name": "salt and pepper",
#                 "original": "salt and pepper, to taste",
#                 "originalName": "salt and pepper, to taste",
#                 "unit": "servings"
#             },
#             {
#                 "aisle": "Produce",
#                 "amount": 3.0,
#                 "consitency": "solid",
#                 "id": 11291,
#                 "image": "spring-onions.jpg",
#                 "measures": {
#                     "metric": {
#                         "amount": 3.0,
#                         "unitLong": "",
#                         "unitShort": ""
#                     },
#                     "us": {
#                         "amount": 3.0,
#                         "unitLong": "",
#                         "unitShort": ""
#                     }
#                 },
#                 "meta": [
#                     "white",
#                     "green",
#                     "separated",
#                     "chopped"
#                 ],
#                 "name": "scallions",
#                 "original": "3 scallions, chopped, white and green parts separated",
#                 "originalName": "scallions, chopped, white and green parts separated",
#                 "unit": ""
#             },
#             {
#                 "aisle": "Alcoholic Beverages",
#                 "amount": 2.0,
#                 "consitency": "liquid",
#                 "id": 14106,
#                 "image": "white-wine.jpg",
#                 "measures": {
#                     "metric": {
#                         "amount": 2.0,
#                         "unitLong": "Tbsps",
#                         "unitShort": "Tbsps"
#                     },
#                     "us": {
#                         "amount": 2.0,
#                         "unitLong": "Tbsps",
#                         "unitShort": "Tbsps"
#                     }
#                 },
#                 "meta": [
#                     "white"
#                 ],
#                 "name": "white wine",
#                 "original": "2-3 tbsp white wine",
#                 "originalName": "white wine",
#                 "unit": "tbsp"
#             },
#             {
#                 "aisle": "Pasta and Rice",
#                 "amount": 0.25,
#                 "consitency": "solid",
#                 "id": 99025,
#                 "image": "breadcrumbs.jpg",
#                 "measures": {
#                     "metric": {
#                         "amount": 59.147,
#                         "unitLong": "milliliters",
#                         "unitShort": "ml"
#                     },
#                     "us": {
#                         "amount": 0.25,
#                         "unitLong": "cups",
#                         "unitShort": "cups"
#                     }
#                 },
#                 "meta": [
#                     "whole wheat",
#                     "(I used panko)"
#                 ],
#                 "name": "whole wheat bread crumbs",
#                 "original": "1/4 cup whole wheat bread crumbs (I used panko)",
#                 "originalName": "whole wheat bread crumbs (I used panko)",
#                 "unit": "cup"
#             }
#         ],
#         "summary": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs might be a good recipe to expand your main course repertoire. One portion of this dish contains approximately <b>19g of protein </b>,  <b>20g of fat </b>, and a total of  <b>584 calories </b>. For  <b>$1.63 per serving </b>, this recipe  <b>covers 23% </b> of your daily requirements of vitamins and minerals. This recipe serves 2. It is brought to you by fullbellysisters.blogspot.com. 209 people were glad they tried this recipe. A mixture of scallions, salt and pepper, white wine, and a handful of other ingredients are all it takes to make this recipe so scrumptious. From preparation to the plate, this recipe takes approximately  <b>45 minutes </b>. All things considered, we decided this recipe  <b>deserves a spoonacular score of 83% </b>. This score is awesome. If you like this recipe, take a look at these similar recipes: <a href=\"https://spoonacular.com/recipes/cauliflower-gratin-with-garlic-breadcrumbs-318375\">Cauliflower Gratin with Garlic Breadcrumbs</a>, < href=\"https://spoonacular.com/recipes/pasta-with-cauliflower-sausage-breadcrumbs-30437\">Pasta With Cauliflower, Sausage, & Breadcrumbs</a>, and <a href=\"https://spoonacular.com/recipes/pasta-with-roasted-cauliflower-parsley-and-breadcrumbs-30738\">Pasta With Roasted Cauliflower, Parsley, And Breadcrumbs</a>.",
#         "winePairing": {
#             "pairedWines": [
#                 "chardonnay",
#                 "gruener veltliner",
#                 "sauvignon blanc"
#             ],
#             "pairingText": "Chardonnay, Gruener Veltliner, and Sauvignon Blanc are great choices for Pasta. Sauvignon Blanc and Gruner Veltliner both have herby notes that complement salads with enough acid to match tart vinaigrettes, while a Chardonnay can be a good pick for creamy salad dressings. The Buddha Kat Winery Chardonnay with a 4 out of 5 star rating seems like a good match. It costs about 25 dollars per bottle.",
#             "productMatches": [
#                 {
#                     "id": 469199,
#                     "title": "Buddha Kat Winery Chardonnay",
#                     "description": "We barrel ferment our Chardonnay and age it in a mix of Oak and Stainless. Giving this light bodied wine modest oak character, a delicate floral aroma, and a warming finish.",
#                     "price": "$25.0",
#                     "imageUrl": "https://spoonacular.com/productImages/469199-312x231.jpg",
#                     "averageRating": 0.8,
#                     "ratingCount": 1.0,
#                     "score": 0.55,
#                     "link": "https://www.amazon.com/2015-Buddha-Kat-Winery-Chardonnay/dp/B00OSAVVM4?tag=spoonacular-20"
#                 }
#             ]
#         },
#     }
# ]