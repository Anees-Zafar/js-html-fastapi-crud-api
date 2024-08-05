from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List

app = FastAPI()

class Item(BaseModel):
    id: int
    title: str
    content: str

items = []

app.mount("/static", StaticFiles(directory="static"), name="static")
#  response_class=HTMLResponse
@app.get("/")
async def read_index():
    with open("static/index.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)

@app.get("/items")
def get_items():
    return {"pages": items}  # Return a dictionary with a "pages" key



next_id = 1
# , response_model=Item

@app.post("/items")
def create_item(item: Item):
    # database[next_id] = data
    global next_id
    # itemid = next_id
    item.id=next_id
    items.append(item)
    next_id += 1
    print(item.id)
    return item

# response_model=Item
@app.put("/items/{item_id}")
def update_item(item_id: int, updated_item: Item):
    for i, item in enumerate(items):
        if item.id == item_id:
            items[i] = updated_item
            return updated_item
    raise HTTPException(status_code=404, detail="Item not found")

# , response_model=Item

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    for i, item in enumerate(items):
        if item.id == item_id:
            deleted_item = items.pop(i)
            return deleted_item
    raise HTTPException(status_code=404, detail="Item not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
