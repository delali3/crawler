from flask import Flask, render_template, request
from video_checker import check_video_on_site

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    message = ''
    if request.method == 'POST':
        video_url = request.form.get('video_url')
        target_site = request.form.get('target_site')

        response = check_video_on_site(video_url, target_site)  # Direct call
        message = response or 'No response received'

    return render_template('index.html', message=message)

if __name__ == '__main__':
    app.run(debug=True)
