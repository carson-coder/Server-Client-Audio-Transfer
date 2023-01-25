import soundfile as sf
import simpleaudio as sa
import numpy

def read_audio(file="music.wav"):
    with sf.SoundFile(file, 'r') as f:
        sig = f.read(f.frames, "int32")
        samplerate = f.samplerate
        return(sig, samplerate, f)
    
def Get_Chunks(CHUNK_BYTES, Audio_Array):
    # Split into chunks of chunk_bytes size
    
    #Division
    if min(CHUNK_BYTES, len(Audio_Array)) == len(Audio_Array): return(Audio_Array)
    Remainder = len(Audio_Array) % CHUNK_BYTES
    Total = (len(Audio_Array) - Remainder) // CHUNK_BYTES
    if Remainder == 0: Total -= 1
    a = list(range(CHUNK_BYTES, Total*CHUNK_BYTES+1, CHUNK_BYTES))
    out = numpy.split(Audio_Array, a)
    return(out)