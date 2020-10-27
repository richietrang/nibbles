from spoonacular import *

from flask import Flask
app = Flask(__name__)


@app.route('/search', methods=['GET'])
def search_for_recipes():
    """
    Search for recipes that match list of ingredients
    """

    # Use some test JSON
    response = findByIngredient_response

    # Should probably fetch all recipe information at the same time before returning as we need
    # the URL for the original recipe when displaying results
    result = []
    for r in response:
        result.append({
            'id': r['id'],
            'recipe_name': r['title'],
            'image_link': r['image'],
        })

    return result


@app.route('/')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run()