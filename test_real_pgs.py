import requests
tests = [
    ('Hyderabad', 'Telangana', 'Kukatpally'),
    ('Nellore', 'Andhra Pradesh', 'Gudur'),
    ('Visakhapatnam', 'Andhra Pradesh', 'Visakhapatnam'),
]
for city, state, area in tests:
    r = requests.post('http://127.0.0.1:5000/predict', json={'city': city, 'state': state, 'area': area}).json()
    print(f'=== {area}, {city} ===')
    for pg in r[:4]:
        pid = str(pg.get('pgId', ''))[:10]
        name = pg.get('pgName', '')
        pred = pg.get('isPredicted')
        print(f'  [{pid}] {name} | isPredicted={pred}')
