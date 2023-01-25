from communitcate import run as start_server
from read_audio import read_audio, Get_Chunks
import threading
import simpleaudio as sa
import websockets
import json
import gc
import time

CHUNK_LENGTH = 1 # In Seconds. the length of a chunk.
CHUNK_OFFSET = 0.23 # In Seconds. How early before the chuck end to send next chunk

global exit_now
exit_now = False

# Delay is min CHUNK_LENGTH + CHUNK_OFFSET

# 
# Start Server
# Get Connection
# Wait for play signal
# Send Audio Info
# Wait for ready signal
# Read Chunk Of Audio
# Send Chunk
# 

async def connect(sock):
    await sock.send("Settings " + json.dumps(
        {
            "sample_rate": SR,
            "length": CHUNK_LENGTH,
            "channels": Audio_Obj.channels
        }
    ))

async def play(sock): 
    # Audio_Wave_Obj.play()
    for i in Chunks:
        Chunks_Obj = sa.WaveObject(i, Audio_Obj.channels, 2, SR)
        
        # a = Chunks_Obj.play()
        print(Audio, i)
        await sock.send("Chunk "+json.dumps(i.tolist()))
        
        time.sleep(CHUNK_LENGTH - CHUNK_OFFSET)
        del Chunks_Obj
        gc.collect()

async def stop(sock): 
    sa.stop_all()
server = threading.Thread(target=start_server, args=(play, stop, connect), daemon=True)
server.start()
print("Server Staring.\nReading Audio")

Audio, SR, Audio_Obj = read_audio()
Audio_Wave_Obj = sa.WaveObject(Audio, Audio_Obj.channels, 2, SR)
Chunks = Get_Chunks(CHUNK_LENGTH*SR, Audio)

print("Read Audio")



print("End of main.py. Running infinite loop")
while not exit_now:
    pass