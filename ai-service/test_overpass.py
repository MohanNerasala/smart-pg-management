import requests

q = """
[out:json][timeout:25];
area["name"="Hyderabad"]->.a;
(
  node["name"~"PG|Paying Guest|Coliving|Colive", i](area.a);
  way["name"~"PG|Paying Guest|Coliving|Colive", i](area.a);
);
out center 10;
"""
res = requests.get('https://overpass-api.de/api/interpreter', params={'data':q})
print(len(res.json().get('elements', [])))
for el in res.json().get('elements', [])[:5]:
    print(el.get('tags', {}).get('name'))
