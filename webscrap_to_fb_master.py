from bs4 import BeautifulSoup
import urllib.request as request
from firebase import firebase

FBConn = firebase.FirebaseApplication('https://test1bayst.firebaseio.com/', None)

print(FBConn)



class scrap:
    def __init__(self, data, scrap2, i):
        #Basic scrap
        '''
        name
        date
        views
        about
        '''
        temp = data[i]
        details = temp.findAll('header')
        date = details[0].findAll('span', attrs={'class' : 'date'})
        views = details[0].findAll('span', attrs={'class' : 'views'})
        self.date = date[0].text
        #self.views = views[0].text        
        discription = temp.findAll('p')
        self.about = discription[0].text
        heading4 = temp.findAll('h4')
        self.name = heading4[0].findChild().text

        #Detail (benifits) scrap
        '''
        aAbout
        aDiscription
        benifits
        specs
        '''
        self.aAbout = scrap2[0].text
        self.aDiscription = scrap2[1].text
        self.benifits = scrap2[2].text
        self.specs = scrap2[4].text
        #self.specs = list(scrap2[4].text)
        
        


def display(i, t):
    print(t[i].name)
    print(t[i].date)
    #print(t[i].views)
    print("\n")
    print(t[i].about)
    print("\n")
    print(t[i].aAbout)
    print("\n")
    print(t[i].aDiscription)
    print("\n")
    print(t[i].benifits)
    print("\n")
    print(t[i].specs)
    print("\n")
    print("\n")
    
def uploadToFB(i, t, k):
    global numCounter
    
    with open('yeet.txt', 'w') as h:
        h.write(str(t[i].specs))
    
    tempList = list('')
    
    with open('yeet.txt', 'r') as f:
        for line in f:
            specsTemp = (line)
            #print(specsTemp)
            #FBConn.post('/Houses2/%s/%s/specs' %(str(k), str(i+1)), specsTemp)
            #print(specsTemp)
            tempList.append(specsTemp)

        #print(specsTemp)
        if(len(tempList) > 8):
            numCounter += 1
            FBConn.post('/Houses2/%s/%s/specs' %(str(k), str(numCounter)), tempList)
        else:
            return 0
    
    FBConn.post('/Houses2/%s/%s/name/' %(str(k), str(numCounter)), t[i].name)
    FBConn.post('/Houses2/%s/%s/date/' %(str(k), str(numCounter)), t[i].date)
    #FBConn.post('/Houses/%s/views/' %str(i), t[i].views)
    FBConn.post('/Houses2/%s/%s/about/' %(str(k), str(numCounter)), t[i].about)
    FBConn.post('/Houses2/%s/%s/aAbout' %(str(k), str(numCounter)), t[i].aAbout)
    FBConn.post('/Houses2/%s/%s/aDiscription' %(str(k), str(numCounter)), t[i].aDiscription)
    FBConn.post('/Houses2/%s/%s/benifits' %(str(k), str(numCounter)), t[i].benifits)
    
#    FBConn.post('/Houses/%s/%s/specs' %(str(k), str(i+1)), t[i].specs)

def realScrap(data, i, t):
    temp = data[i]
    tempLink = temp.find('a')
    detailLink = tempLink.get("href")


    responce2 = request.urlopen(detailLink)
    soup2 = BeautifulSoup(responce2, 'html.parser')
    data2 = soup2.findAll('div', attrs={'class': 'entry-content'})

    scrap2 = data2[0].findAll('p')
        

    t.append(scrap(data, scrap2, i))




def mainScrap(URL, k):
    global count
    global numCounter

    responce = request.urlopen(URL)
    soup = BeautifulSoup(responce, 'html.parser')
    '''
    one_half = soup.findAll('div', attrs={'class': 'one-half'})
    one_half_col_last = soup.findAll('div', attrs={'class': 'one-half col-last'})
    '''
    data = soup.findAll('article')
    data_length = len(data)
    print("Number of condos: " + str(data_length))

    print("\n")

    '''
    x = scrap(data, 0)
    print(x.date)
    print(x.views)

    print(x.about)
    '''

    t = list('')

    numCounter = 0
    for i in range (data_length):
        
        try:
            realScrap(data, i, t)
            #display(i, t)
            uploadToFB(i, t, k)
        except:
            print("\tError:")
            print("\t\tIndex: " + str(k) + "\n" + "\t\tNumber: " + str(i+1))
            print("\n")
            count += 1
            print("count: " + str(count))
            print("\n")

    numCounter = 0            
    #display(5, t)

global count
global numCounter


count = 0
houseNum = 1
numCounter = 0

for k in range (1, 167):
    URL = 'https://www.condopromo.com/category/area/toronto-condos/page/%s/' %str(k)
    print("INDEX: " + str(k))
    mainScrap(URL, k)
    
print("count: " + str(count))
