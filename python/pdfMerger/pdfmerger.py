import PyPDF2
import sys
import os

merger = PyPDF2.PdfFileMerger()
combined = []
for file in os.listdir(os.curdir):
    if file.endswith(".pdf"):
        merger.append(file)
        combined.append(file.split(".")[0])
    merger.write(f'{"_".join(combined)}.pdf')