keylist = ("34567890-^\\","wertyuiop@[","asdfghjkl;:","_zxcvbnm,./")
note_relative = 0
# ; : , ` use keycodes when using these keys. 

s1 = """if (event.key === '"""
#w
s2 = """' && !event.repeat) {outMessage("""
#0x90 
s3 = """, note_ref + """ 
#0x3a
s4 = """, velocity);}
"""
s5 = """});"""


#keydown
out = ""
out += """document.body.addEventListener('keydown',
            event => {
"""
for row in range(4):
    for col in range(11):
        out += s1
        key = keylist[row][col]
        if key == "\\":
            key = "\\\\"
        out += key
        out += s2
        out += "0x90" #noteon
        out += s3
        out += str(note_relative + (col+1)*2 - row) #note
        out += s4
out += s5
print(out)


#keyup
out = ""
out += """document.body.addEventListener('keyup',
            event => {
"""
for row in range(4):
    for col in range(11):
        out += s1
        key = keylist[row][col]
        if key == "\\":
            key = "\\\\"
        out += key
        out += s2
        out += "0x80" #noteoff
        out += s3
        out += str(note_relative + (col+1)*2 - row) #note
        out += s4
out += s5
print(out)