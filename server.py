import populartimes, datetime,json
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.debug = True
CORS(app)

google_key = "AIzaSyBdUmVr5N1DbxjqBvLV1dAYNTZVl2FOi7I"

if __name__ == '__main__':
    app.run(host='0.0.0.0')

@app.route('/')
def hello_world():
	return render_template('gmaps.html')
    # return 'Hello, World!'

@app.route('/getPopularity', methods = ['POST'])
def get_popularity():
	# print("hey")
	current_day = datetime.datetime.today().weekday()
	obj = request.get_json();
	try:
		place_id = obj['place']
		print("got it")
		place_data = populartimes.get_id(google_key, place_id)
		pop_times = place_data['populartimes']
		return jsonify(pop_times[current_day])
		# if (len(pop_times) >= current_day):
			# print("got it")
			# return jsonify(pop_times[current_day])
	except:
		print("could not get id")

	# place_id = json.loads(obj)['place']
	# place_id = obj['place']
	# place_data = populartimes.get_id(google_key, place_id)
	# print(place_data)
	# pop_times = place_data['populartimes']

	# if (len(pop_times) >= current_day):
	# 	return jsonify(pop_times[current_day])
	# return jsonify({})

	return jsonify({"1":"a"})
