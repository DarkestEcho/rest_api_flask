from flask import Flask, url_for, request, jsonify
from markupsafe import escape
app = Flask(__name__)
bookList = []

@app.route('/', methods=['GET'])
def index():
    return app.send_static_file('index.html')

@app.route('/<filename>', methods=['GET'])
def src(filename=None):
    return app.send_static_file(filename)

@app.route('/books', methods=['GET'])
def get_list():
    return jsonify(bookList)

@app.route('/last-id', methods=['GET'])
def get_id():
    return str(int(bookList[len(bookList) - 1]["id"]) + 1) if len(bookList) > 0 else '0'

@app.route('/books', methods=['PUT'])
def add_book():
    obj = request.get_json()
    if 'id' in obj and 'author' in obj and 'title' in obj and 'genre' in obj and 'year' in obj:
        bookList.append(obj)
        return '',201
    return '', 400

@app.route('/books', methods=['POST'])
def edit_book():
    obj = request.get_json()
    if 'id' in obj and 'author' in obj and 'title' in obj and 'genre' in obj and 'year' in obj:
        i = 0
        while i < len(bookList):
            if bookList[i]['id'] == obj['id']:
                break
            i+=1

        if i < len(bookList):
            bookList[i]['author'] = obj['author']
            bookList[i]['title'] = obj['title']
            bookList[i]['genre'] = obj['genre']
            bookList[i]['year'] = obj['year'] 
            return '', 202
        else:
            return '', 400


@app.route('/books', methods=['DELETE'])
def delete_book():
    obj = request.get_json()
    i = 0
    while i < len(bookList):
        if str(bookList[i]['id']) in obj:
            del bookList[i]
            continue
        i+=1
    return '', 202