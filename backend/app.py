import json

from spoonacular import search_recipes


from flask import Flask, request
app = Flask(__name__)


@app.route('/search', methods=['POST'])
def search_for_recipes():
    """
    Search for recipes that match list of ingredients
    """

    # Get json
    print(request.json)
    req_data = request.get_json(force=True)
    ingredient_list = req_data['ingredients']

    print(req_data)
    print(ingredient_list)
    result = search_recipes(ingredient_list)

    return json.dumps(result)


@app.route('/')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run()