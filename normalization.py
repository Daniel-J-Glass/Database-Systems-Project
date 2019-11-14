import pandas as pd
import sql

book_raw = pd.read_csv('books.csv',delimiter = "\t",encoding = "ISO 8859-1")

print(book_raw[book_raw.isnull().any(axis=1)])
#print(book_raw.loc[79])
# for index,row in book_raw.iterrows():
#     print(row)