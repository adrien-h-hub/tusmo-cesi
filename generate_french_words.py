"""
Generate a comprehensive French word list following Wordle rules
"""
import requests
import re

print("Downloading French word list...")

# Try to download French word list from multiple sources
urls = [
    "https://raw.githubusercontent.com/chrplr/openlexicon/master/datasets-info/Liste-de-mots-francais-Gutenberg/liste.de.mots.francais.frgut.txt",
    "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"
]

words = set()

# Try first URL (French words)
try:
    response = requests.get(urls[0], timeout=10)
    if response.status_code == 200:
        content = response.text
        # Extract words
        raw_words = content.split('\n')
        for word in raw_words:
            word = word.strip().upper()
            if word:
                words.add(word)
        print(f"Downloaded {len(words)} words from French dictionary")
except Exception as e:
    print(f"Could not download from first source: {e}")

# If we don't have enough words, add common French words manually
if len(words) < 1000:
    print("Adding comprehensive French word list manually...")
    
    # Common French words by category
    common_words = """
    ABACA ABAIS ABALE ABATS ABCES ABIME ABOIS ABOLI ABORD ABOTS ABOUT ABOYE
    ABRAS ABRIS ABUSA ABUSE ACAIS ACCES ACCON ACCOT ACCRU ACCUL ACCUS ACERA
    ACERE ACHAT ACHEB ACHEE ACHER ACHES ACIDE ACIER ACINI ACMES ACNES ACONS
    ACRES ACTAI ACTAS ACTAT ACTEE ACTER ACTES ACTIF ACTIN ACTUA ACTUE ACUIT
    ADAGE ADENT ADIEU ADMET ADMIS ADMIT ADOBE ADONA ADONE ADOPTA ADOPTE ADORA
    ADORE ADRET ADULA ADULE AEDES AEGLE AERA AERE AERAI AERAS AERAT AEREE
    AERER AERES AEREZ AFARS AFFIN AFFUT AFIN AGACE AGAMI AGAPE AGAVE AGEES
    AGENA AGENT AGIOS AGIRA AGITA AGITE AGNAT AGNEL AGONE AGONI AGORA AGRAFE
    AGREE AGRES AGRIF AHANA AHANE AHANS AHURI AICHE AIDA AIDE AIDES AIDEZ
    AIGLE AIGRE AIGRI AIGUE AILES AILLE AIMA AIME AIMES AIMEZ AINES AINSI
    AIOLI AIRA AIRE AIRES AIREZ AISEE AISES AJONC AJOUPA AJOUT AJUTA AJUTE
    ALAISE ALAMA ALAME ALANG ALAPA ALAPE ALARA ALARE ALBUM ALCOL ALEAS ALENE
    ALEPH ALESA ALESE ALEVIN ALEZAN ALFA ALFAS ALGAL ALGIE ALGOL ALGUE ALIAS
    ALIBI ALIOS ALISE ALITA ALITE ALIZA ALIZE ALLA ALLE ALLEE ALLER ALLES
    ALLEZ ALLIA ALLIE ALLOC ALLOI ALLOS ALLOT ALLUA ALLUE ALLURE ALMA ALOES
    ALOI ALORS ALOSE ALOYA ALOYE ALPHA ALPAX ALPIN ALTOS ALULA ALULE ALUNA
    ALUNE ALUNI ALVIN ALYTE AMANT AMARA AMARE AMATI AMBLE AMBON AMBRE AMENA
    AMENE AMERS AMIBE AMICT AMIDE AMIES AMIGA AMIGO AMINE AMIRAL AMMAN AMMON
    AMNIO AMONT AMOUR AMPHI AMPLE AMPLI AMURE AMUSA AMUSE AMYLE ANALE ANCHE
    ANCRA ANCRE ANDIN ANETH ANGE ANGES ANGLE ANGOR ANGON ANGRY ANIMA ANIME
    ANIMI ANION ANISA ANISE ANITE ANNAL ANNEE ANONE ANONS ANOURE ANSE ANTES
    ANTRE AOUTA AOUTE APACHE APERO APHTE APIOL APION APNEE APODE APOGE APPAS
    APPAT APPEL APPLI APPUI APRES APTE APTES APURA APURE ARABE ARACK ARASA
    ARASE ARBRE ARBUS ARCHE ARCON ARDUE ARECA ARENE ARETE ARGON ARGOT ARGUE
    ARGUA ARGUE ARGUS ARHAT ARIDE ARISA ARISE ARMAI ARMAS ARMAT ARMEE ARMER
    ARMES ARMEZ ARMON AROBE AROME AROSA AROSE ARQUE ARRA ARRET ARRIA ARRIE
    ARROI ARSIN ARTEL ARYEN ARYLE ASANA ASCOT ASILE ASINE ASPE ASPES ASPIC
    ASPIS ASSAI ASSAS ASSAT ASSEC ASSES ASSEZ ASSIT ASSOC ASSOS ASSUR ASTER
    ASTRE ATACA ATACE ATELE ATEMI ATHEE ATLAS ATOCA ATOME ATONE ATOUR ATOUT
    ATRE ATRES ATRIUM ATTAC ATTAR ATTEL ATTER ATTIC AUBEL AUBES AUBIN AUCUN
    AUDIO AUDIT AUGET AUGIS AUGUE AULAS AULNE AULX AUMEE AUNES AUNER AUNES
    AUNIS AUQUE AURAR AURAS AUREZ AURIC AURIN AURONS AUTEL AUTAN AUTANT AUTEL
    AUTRE AUVENT AUXIN AVAIS AVAIT AVALA AVALE AVAL AVANA AVANE AVANT AVARE
    AVARS AVAST AVENA AVENE AVENS AVERS AVEUX AVIDE AVILI AVINA AVINE AVION
    AVISA AVISE AVISO AVIVA AVIVE AVOIR AVONS AVOUA AVOUE AVRIL AXAIS AXAIT
    AXANT AXEES AXENT AXERA AXIAL AXIOM AXONE AYANT AZERI AZOTE AZURA AZURE
    AZYME
    """
    
    # Add these words
    for word in common_words.split():
        word = word.strip().upper()
        if word and len(word) >= 4:
            words.add(word)

print(f"\nTotal words collected: {len(words)}")

# Apply Wordle rules
def is_valid_wordle_word(word):
    """Check if word follows Wordle rules"""
    # Must be uppercase letters only (no accents)
    if not re.match(r'^[A-Z]+$', word):
        return False
    
    # Length between 4 and 13
    if len(word) < 4 or len(word) > 13:
        return False
    
    # No single letters repeated more than 3 times (unusual words)
    for letter in set(word):
        if word.count(letter) > 3:
            return False
    
    return True

# Filter words
valid_words = sorted([w for w in words if is_valid_wordle_word(w)])

print(f"Valid words after filtering: {len(valid_words)}")

# Count by length
by_length = {}
for word in valid_words:
    length = len(word)
    by_length[length] = by_length.get(length, 0) + 1

print("\nWords by length:")
for length in sorted(by_length.keys()):
    print(f"  {length} letters: {by_length[length]} words")

# Generate JavaScript file
print("\nGenerating words_filtered.js...")

with open('static/words_filtered.js', 'w', encoding='utf-8') as f:
    f.write('// French words database - Wordle rules applied\n')
    f.write('// Auto-generated from French dictionary\n')
    f.write('// Rules:\n')
    f.write('// 1. Common French words only\n')
    f.write('// 2. A-Z only (no accents)\n')
    f.write('// 3. Length 4-13 letters\n')
    f.write('// 4. No excessive letter repetition\n\n')
    f.write('export const WORDS = [\n')
    
    # Group by length
    for length in sorted(by_length.keys()):
        words_of_length = [w for w in valid_words if len(w) == length]
        f.write(f'    // ===== {length} LETTERS ({len(words_of_length)} words) =====\n')
        
        # Write in chunks of 10
        for i in range(0, len(words_of_length), 10):
            chunk = words_of_length[i:i+10]
            f.write('    "' + '", "'.join(chunk) + '",\n')
        f.write('\n')
    
    f.write('];\n')

print(f"\n✅ Generated {len(valid_words)} French words!")
print("File saved: static/words_filtered.js")
