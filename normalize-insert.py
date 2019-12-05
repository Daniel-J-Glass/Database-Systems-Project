#Made by Daniel Glass

import pandas as pd
import MySQLdb
import mysql.connector
import math


def round(num, base=16):
    return base*math.ceil(num/base)

book_raw = pd.read_csv('books.csv',delimiter = "\t",encoding='UTF-8')
df = book_raw

#only Author and Publisher have null values
#print(df.isna().any())

#replacing null values
df.replace({None: '-'}, inplace = True)

#replacing troublesome characters
df.replace({r"'": r"\'"}, inplace = True)

#getting max data values for the fields to make an optimal schema
isbn_length = 10
title_length = book_raw['Title'].map(len).max()
author_length = book_raw['Author'].map(len).max()
cover_length = book_raw['Cover'].map(len).max()
publisher_length = book_raw['Publisher'].map(len).max()

#rounding numbers up to 16 bytes
title_length = round(title_length)
author_length = round(author_length)
cover_length = round(cover_length)
publisher_length = round(publisher_length)

print('Data derived values')
print('Max title length:', title_length)
print('Max author length:', author_length)
print('Max cover length:', cover_length)
print('Max publisher length:', publisher_length)

#Guesstimating max data requirements
ssn_length = 9
date_length = 24 #for ISO 8601
borrower_length = 64
address_length = 128
phone_length = 12

print('Made up values')
print('Max borrower name length:', borrower_length)
print('Max address length:', address_length)
print('Max phone length:', phone_length)

TABLES = {}
TABLES['BOOK']=(
    """
    CREATE TABLE BOOK(
        Isbn VARCHAR({}) NOT NULL UNIQUE,
        Title VARCHAR({}),
        Cover VARCHAR({}),
        Publisher VARCHAR({}),
        Pages INT NOT NULL,
        PRIMARY KEY (Isbn)
    );
    """.format(isbn_length,title_length,cover_length,publisher_length)
)
TABLES['AUTHOR']=(
    """
    CREATE TABLE AUTHOR(
        Author_id INT NOT NULL AUTO_INCREMENT,
        Name VARCHAR({}) UNIQUE,
        PRIMARY KEY (Author_id)
    );
    """.format(author_length)
)
TABLES['BOOK_AUTHOR']=(
    """
    CREATE TABLE BOOK_AUTHOR(
        Author_id INT NOT NULL,
        Isbn VARCHAR({}) NOT NULL,
        FOREIGN KEY (Author_id) REFERENCES AUTHOR(Author_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (Isbn) REFERENCES BOOK(Isbn) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY(Author_id, Isbn)
    );
    """.format(isbn_length)
)
TABLES['BORROWER']=(
    """
    CREATE TABLE BORROWER(
        Card_id INT NOT NULL AUTO_INCREMENT,
        Ssn VARCHAR({}),
        Bname VARCHAR({}),
        Address VARCHAR({}),
        Phone VARCHAR({}),
        PRIMARY KEY (Card_id)
    );
    """.format(ssn_length,borrower_length,address_length,phone_length)
)
# TABLES['BOOK_LOAN']=(
#     """
#     CREATE TABLE BOOK_LOAN(
#         Loan_id INT NOT NULL AUTO_INCREMENT,
#         Isbn VARCHAR({}) NOT NULL,
#         Card_id INT NOT NULL,
#         Date_out VARCHAR({}),
#         Due_date VARCHAR({}),
#         Date_in VARCHAR({}),
#         FOREIGN KEY (Isbn) REFERENCES BOOK(Isbn) ON DELETE CASCADE ON UPDATE CASCADE,
#         FOREIGN KEY (Card_id) REFERENCES BORROWER(Card_id) ON DELETE CASCADE ON UPDATE CASCADE,
#         PRIMARY KEY (Loan_id)
#     );
#     """.format(isbn_length,date_length,date_length,date_length)
# )

TABLES['BOOK_LOAN']=(
    """
    CREATE TABLE BOOK_LOAN(
        Loan_id INT NOT NULL AUTO_INCREMENT,
        Isbn VARCHAR({}) NOT NULL,
        Card_id INT NOT NULL,
        Date_out VARCHAR({}),
        Due_date VARCHAR({}),
        Date_in VARCHAR({}),
        FOREIGN KEY (Isbn) REFERENCES BOOK(Isbn) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (Loan_id)
    );
    """.format(isbn_length,date_length,date_length,date_length)
)
TABLES['FINES']=(
    """
    CREATE TABLE FINES(
        Loan_id INT NOT NULL,
        Fine_amt FLOAT NOT NULL,
        Paid INT NOT NULL,
        PRIMARY KEY (Loan_id),
        FOREIGN KEY (Loan_id) REFERENCES BOOK_LOAN(Loan_id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    """
)

host_in = input("Enter your MySQL Workbench Host address (press enter if it's the default) ")
usr_in = input('Enter your MySQL Workbench Username (probably root) ')
pwd_in = input('Enter your MySQL Workbench Password ')

if not host_in:
    host_in = "localhost"
    
#connecting to database
db = MySQLdb.connect(
    host=host_in,
    user=usr_in,
    passwd=pwd_in,
    auth_plugin='mysql_native_password',
    charset = "utf8mb4"
)
cur = db.cursor()

cur.execute("DROP DATABASE IF EXISTS Library; CREATE DATABASE Library; USE Library;")
# cur.execute("SELECT default_character_set_name FROM information_schema.SCHEMATA S WHERE schema_name = 'Library';")
# print(cur.fetchall())
#Setting encoding of 
cur.execute('SET NAMES utf8mb4')
cur.execute("SET CHARACTER SET utf8mb4")
cur.execute("SET character_set_connection=utf8mb4")

#Creating tables
for table_name in TABLES:
    table_description = TABLES[table_name]
    print("Creating table",table_name)
    cur.execute(table_description)

#Insert in this order: Book, Author, Book_Author, Borrower, Book_Loans, Fines
#Filling tables
i = 0
for index, row in df.iterrows():
    isbn10 = row['ISBN10']
    
    #fixing insert conflicts with ' character
    #split author into list using comma separated
    author_list = row['Author']
    author_list = str(author_list).replace(r"'",r"''").split(',')
    author_list = map(str.strip, author_list)
    
    title = row['Title']
    title = str(title).replace(r"'",r"''")
    cover = row['Cover']
    cover = str(cover).replace(r"'",r"''")
    publisher = row['Publisher']
    publisher = str(publisher).replace(r"'",r"''")
    pages = row['Pages']
    
    cur.execute("""
                INSERT IGNORE INTO BOOK VALUES ('{}','{}','{}','{}','{}');
                """.format(isbn10, title, cover, publisher, pages))
    #Adding each other to the book and author list
    for author in author_list:
        cur.execute("""
                    INSERT IGNORE INTO AUTHOR(Name) VALUES ('{}');
                    """.format(author))
        cur.execute("INSERT IGNORE INTO BOOK_AUTHOR VALUE ((SELECT Author_id FROM AUTHOR WHERE Name='{}'),'{}');".format(author,isbn10))

cur.execute("SELECT COUNT(*) FROM BOOK;")
print("Inserted {} books.".format(cur.fetchall()))
db.commit()
cur.close()
db.close()
    # These are populated dynamically
    # cur.execute("INSERT INTO BORROWER VALUE({},{});".format(row['ISBN10'],row['Title']))
    # cur.execute("INSERT INTO BOOK_LOANS VALUE({},{});".format(row['ISBN10'],row['Title']))
    # cur.execute("INSERT INTO FINES VALUE({},{});".format(row['ISBN10'],row['Title']))
    
 
#print(book_raw.loc[79])
# for index,row in book_raw.iterrows():
#     print(row)