from pytube import YouTube
from sys import argv
path = '/d/Downloads'
link = argv[1]
yt = YouTube(link, on_progress_callback=progress_func,
        on_complete_callback=complete_func,
        proxies=my_proxies,
        )

print(f"Title: {yt.title}")
print(f"View: {yt.views}")

yd = yt.streams.get_highest_resolution()
yd.download(path)