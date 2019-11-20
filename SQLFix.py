import re

f = open('LibraryDump (With Extra).sql', encoding='UTF-8')

regex_search = r"(\')([a-z])"
output = re.sub(regex_search,r"\1,'",f.read())

f.close()

f = open('LibraryDump(Fixed1).sql', "w", encoding='UTF-8')
f.write(output)
f.close