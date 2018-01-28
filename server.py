import populartimes, datetime
from flask import Flask, render_template, request, jsonify
app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.debug = True

google_key = "AIzaSyBdUmVr5N1DbxjqBvLV1dAYNTZVl2FOi7I"

if __name__ == '__main__':
    app.run(host='0.0.0.0')

@app.route('/')
def hello_world():
	return render_template('gmaps.html')
    # return 'Hello, World!'

@app.route('/getPopularity', methods = ['POST'])
def get_popularity():
	current_day = datetime.datetime.today().weekday()
	obj = request.get_json();
	place_id = obj['place']
	place_data = populartimes.get_id(google_key, place_id)
	print(place_data)
	pop_times = place_data['populartimes']

	if (len(pop_times) >= current_day):
		return jsonify(pop_times[current_day])
	return jsonify({})