import csv
import json

from spoonacular import search_recipes, read_json_from_file


from flask import Flask, request


# Init globals
app = Flask(__name__)
endpoint_schema = read_json_from_file('endpoint_schema.json')




@app.route('/search', methods=['POST'])
def search_for_recipes():
    """
    Search for recipes that match list of ingredients
    """
    
    # global vars
    global endpoint_schema

    # TODO: OPTIMISE THIS, CALLING THIS MANY TIMES
    # endpoint_schema = read_json_from_file('endpoint_schema.json')


    # Get json
    # print(request.json)
    req_data = request.get_json(force=True)

    query_info = {k:req_data[k] for k in req_data if k in endpoint_schema}

    # print("reqdata=", req_data)
    # print("queryinfo=", query_info)
    # print(ingredient_list)
    result = search_recipes(query_info, test=False)
    return json.dumps(result)


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