from pytube import YouTube
from sys import argv
path = '/d/Downloads'
link = argv[1]
progress= 0
progress_func = lambda :progress + 5
complete_func = lambda : print("Download complete")
yt = YouTube(link, on_progress_callback=f"{progress_func}%",
        on_complete_callback=complete_func,
        )

print(f"Title: {yt.title}")
print(f"View: {yt.views}")

yd = yt.streams.get_highest_resolution()
yd.download(path)