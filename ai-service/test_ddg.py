import sys
import codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())

from duckduckgo_search import DDGS

def test():
    query = "Boys PG OR Girls PG OR Coliving in Madhapur Hyderabad"
    print(f"Searching for: {query}")
    results = DDGS().maps(query, place="Hyderabad, India", max_results=10)
    
    if not results:
        print("No results found.")
        return
        
    for r in results:
        name = r.get("title", "")
        addr = r.get("address", "")
        lat = r.get("latitude")
        lon = r.get("longitude")
        print(f"- {name} ({addr}) [Lat: {lat}, Lon: {lon}]")

if __name__ == "__main__":
    test()
