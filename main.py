from flask import Flask, request, jsonify
from scipy import stats
from flask_cors import CORS  # 导入CORS

app = Flask(__name__)
CORS(app, resources={r"/kruskal_wallis": {"origins": "http://127.0.0.1:8080",
                                          "methods": ["POST"],
                                          "allow_headers": ["Content-Type"]
                                          },
                     r"/rank_sums": {"origins": "http://127.0.0.1:8080",
                                     "methods": ["POST"],
                                     "allow_headers": ["Content-Type"]
                                     }
                     })  # 启用CORS


@app.route('/kruskal_wallis', methods=['POST'])
def kruskal_wallis():
    data = request.json
    if 'allData' in data:
        samples = data['allData']
        try:
            _, p_value = stats.kruskal(*samples)
            result = {
                "p_value": p_value
            }
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)})
    else:
        return jsonify({"error": "样本数据未提供"})


@app.route('/rank_sums', methods=['POST'])
def rankSums():
    data = request.json
    if 'allData' in data:
        samples = data['allData']
        try:
            _, p_value = stats.ranksums(*samples)
            result = {
                "p_value": p_value
            }
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)})
    else:
        return jsonify({"error": "样本数据未提供"})


if __name__ == '__main__':
    app.run(debug=True, port=8080)
