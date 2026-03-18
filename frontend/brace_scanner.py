with open("c:/Users/CHAKRI/OneDrive/Desktop/smart pg management/frontend/src/pages/AdminDashboard.jsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines):
    idx = i + 1
    # Count opening vs closing on this line
    open_curly = line.count('{')
    close_curly = line.count('}')
    open_paren = line.count('(')
    close_paren = line.count(')')
    
    if open_curly > close_curly:
        stack.append(f"Line {idx} curly")
    elif close_curly > open_curly:
        if stack: stack.pop()
print("Dangling structures left in stack:", stack)
