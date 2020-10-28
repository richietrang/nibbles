import xml.etree.ElementTree as ET

from recipe_scrapers import scrape_me
# from ingredient_parser.en import parser
import pyfathom
import nltk


knowledge = '''
/pinch/ is unit
/mls?|mL|cc|millilitres?|milliliters?/ is unit
/tsps?|t|teaspoons?/ is unit
/tbsps?|Tbsps?|T|tbl|tbs|tablespoons?/ is unit
/floz/ is unit
/fl/,/oz/ is unit
/fluid/,/ounces?/ is unit
/p|pts?|pints?/ is unit
/ls?|L|litres?|liters?/ is unit
/gals?|gallons?/ is unit
/dls?|dL|decilitre|deciliter/ is unit
/gs?|grams?|grammes?/ is unit
/oz|ounces?/ is unit
/lbs?|#|pounds?/ is unit
/kgs?|kilos?|kilograms?/ is unit
/\d+/?,/\d+\/\d+/ is number
/\d+(\.\d+)?/ is number
/\d*[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/ is number
/a/ is number-word
number,/-|–/,number is range
/cups?/ is unit
range|number|number-word,/\-/?,unit?,/\./?,/of/? is amount
amount?,/plus/?,amount?,/[a-zA-Z\-]+/+,amount? is ,,,ingredient,
'''

strs = [
  # '180g | 1 cup uncooked brown rice',
  '½ small butternut squash , cubed',
  '5½ tablespoons tahini (you can sub cashew butter)',
  'pecans 125g',
  'flat-leaf parsley a bunch, roughly chopped',
  'rocket 70g',
  'leftover marinade from the mushrooms',
  '15 oz (425 g) black beans, drained (reserve ¼ cup (60 ml) of the juice) and rinsed well',
  '1/4 teaspoon Garam Masala, for garnish',
  '2 tablespoons chopped cilantro, for garnish'
]

cls = pyfathom.classifier(knowledge)
for each_str in strs:
  classified = cls.classify(each_str)
  print(classified)
  parsed = ET.fromstring(classified)
  print(parsed)








# give the url as a string, it can be url from any site listed below
scraper = scrape_me('https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/')

title = scraper.title()
total_time = scraper.total_time()
yields = scraper.yields()
ingredients = scraper.ingredients()
instructions = scraper.instructions()
image = scraper.image()
host = scraper.host()
links = scraper.links()

for ingredient_raw in ingredients:
  ingredient_tokens = nltk.word_tokenize(ingredient_raw)  # tokenise entry
  ingredient_tagged = nltk.pos_tag(ingredient_tokens)  # part-of-speech tag
  # ingredient_entities = nltk.chunk.ne_chunk(ingredient_tagged)  
  print(ingredient_tagged)

# print(parser('4L of milk'))