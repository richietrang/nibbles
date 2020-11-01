import json

from spoonacular import search_recipes, read_json_from_file


from flask import Flask, request
app = Flask(__name__)


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


@app.route('/')
def hello():
    return "Hello World!"

# variables
endpoint_schema = read_json_from_file('endpoint_schema.json')

if __name__ == '__main__':

    # read endpoint schema
    # global endpoint_schema
    
    endpoint_schema = read_json_from_file('endpoint_schema.json')

    # run app
    app.run()