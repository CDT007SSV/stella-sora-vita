import urllib.request,io,sys,os
from PIL import Image
B="https://stellasora.miraheze.org/wiki/Special:FilePath/"
for n in ["Story_main_01_035","Story_main_01_036","Story_main_01_037"]:
    try:
        r=urllib.request.Request(B+n+".png",headers={"User-Agent":"Mozilla/5.0"})
        d=urllib.request.urlopen(r,timeout=60).read()
        im=Image.open(io.BytesIO(d));print(n,im.size,im.mode,len(d))
        im.convert("RGB").resize((480,int(480*im.size[1]/im.size[0]))).save("diag/%s.jpg"%n,quality=70)
    except Exception as e: print(n,"ERR",e)
