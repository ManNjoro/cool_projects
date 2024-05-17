from pytube import YouTube
from sys import argv
path = '/d/Downloads'
link = argv[1]
def on_progress(stream, chunk, bytes_remaining):
    """Callback function"""
    total_size = stream.filesize
    bytes_downloaded = total_size - bytes_remaining
    pct_completed = bytes_downloaded / total_size * 100
    print(f"Status: {round(pct_completed, 2)} %")

complete_func = lambda out : print(f"Download complete: {out}")

yt = YouTube(link, on_progress_callback=on_progress
        )

print(f"Title: {yt.title}")
print(f"View: {yt.views}")

yd = yt.streams.filter(progressive=True, file_extension='mp4')\
    .order_by('resolution')\
    .desc()\
    .first()\
    .download(path)
# yd.download(path)
complete_func(yd)