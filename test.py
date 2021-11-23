knowPython = input("Hello user, if you know Python say \"Yes\" but if you don't know Python say \"No\"")
if knowPython == "Yes":
    print("We shall continue")
    f = open("TBCW.txt", "w+")
    f.write("""We will be using Python in order to do this. We will be using Python in order to do this.

    Make sure you have all the things listed:
        1. A window's laptop
        2. V.S.Code as your text editor
        3. The Extinsion Python downloaded
        4. Google is installed.
        5. Visit W3 schools. (We will need it)
    After you have everything, you will have to say "Yes" or "No"
    In this case you will have to be serious okay?
    You can never visit this again if you do not say either "Yes" or "No"
    You will also have to have to be tested for your age (~9 - 1855555)

    """)
    f.close()
    g = open("TBCW.txt", "r")
    if g.mode == "r":
        h = g.read()
        print(h)
    # f = open("guru99.txt","w+")
elif knowPython == "No":
    print("We shall NOT continue")
elif knowPython != "Yes" or "No":
    print("You have to be serious")

