import asyncio

import websockets

port = 5000

async def handler(websocket):
    while True:
        try:
            message = await websocket.recv()
        except Exception as e:
            print("Disconnected")
            break
        if message.startswith("play"):
            print("Playing")
        elif message.startswith("stop"):
            print("Stopping")
            await websocket.close()
            try:
                exit()
            except:
                pass

async def main():
    async with websockets.serve(handler, "", port):
        print(f"==========<Connected On Port {port}>==========")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())