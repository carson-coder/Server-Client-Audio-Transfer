import asyncio

import websockets

port = 5000

async def handler(websocket):
    await connect(websocket)
    while True:
        try:
            message = await websocket.recv()
        except Exception as e:
            print("Disconnected")
            break
        if message.startswith("play"):
            print("Playing")
            await playing(websocket)
        elif message.startswith("stop"):
            print("Stopping")
            await stopping(websocket)

async def main():
    async with websockets.serve(handler, "", port):
        print(f"==========<Connected On Port {port}>==========")
        await asyncio.Future()  # run forever

global playing
global connect
global stopping
playing = None
stopping = None
connect = None

def run(play, stop, connect_func):
    global playing
    global stopping
    global connect
    playing = play
    stopping = stop
    connect = connect_func
    asyncio.run(main())