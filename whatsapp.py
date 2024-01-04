import pywhatkit as kit
import datetime


# Send a simple message
# kit.sendwhatmsg("+233553602142", "Hello, this is an automated message!", 10, 30)

# Schedule a message for a specific time
hour = 0
minute = 1
kit.sendwhatmsg("+233553602142", "This message is scheduled!", hour, minute)