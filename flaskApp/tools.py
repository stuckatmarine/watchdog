def parse_results(data):
    string = ''

    for key, value in data.items():
        if 'time' not in key:
            string += key + ': ' + value[0]['confidence'] + '%\n'

    return string


if __name__ == '__main__':
    import json

    with open('sample.txt', 'r') as f:
        data = json.load(f)

    print(parse_results(data))
