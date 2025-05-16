---
title: "Coffee Tracker Project Writeup"
date: "2025-05-16"
description: "Taking my addiction to coffee and turning it into something cooler in less than a day."
tags: ["computer science", "hobbyist", "AI"]
---


**TLDR**: I built a website to host data I've collected on coffee shops I like in a few hours. View it [here](https://www.yashthapliyal.com/coffee-tracker).

*[https://www.yashthapliyal.com/coffee-tracker](https://www.yashthapliyal.com/coffee-tracker)*

# **You ever want to just make something exist?**

I drink a lot of coffee, probably a bit too much. One of the novel joys I have in my life is exploring new coffee shops near me. Naturally, as a developer, I wanted a cool way to display this facet of my life that I really enjoy. Coincidentally, I also wanted to try building out a website focused on design and frontend. My current strengths are in backend/algorithmic development, so taking the other side felt like a good thing to work on.

The challenge was: how fast could I get something up and running? The answer: a few hours.

---

# **Learning is really fun**

On theme with learning new tech, I wanted to start my build using v0, Vercel's fullstack website AI agent. I typically use Lovable for these small projects, but I have used Vercel for a long time previously. One of the big differences between the services that I found was the code editing. v0's code editor was **much cleaner**, and really only showed the code that mattered to frontend development. After cloning the repository over to my own machine, I was able to see a lot of the code that was hidden on their web interface. This is fantastic for vibe coders and hobby developers, but I personally like full control of my applications. Either way, a basic web interface was set up very, very easily with map integration using Leaflet!

After getting a demo site, I mainly tweaked a script for importing my data seamlessly. I store everything on a Google Sheet, so I wanted to be able to copy this over and just have it work. As such, I developed a Python script to turn this tab-separated data into JSON, with geocoding using GeoPY (side note: why do all map libraries require lat/long points? I just want to have my address map easily (side project time)). Either way, building this out was easy and helps a ton for me.

The final aspect that I wanted to implement was some custom animations. I found the GSAP library for this, which looks like a lot of fun to use with SVGs. I opened Illustrator and got to work making some sprites for myself. Then used the library *-- to be updated --*.

---

# **In Summary**

Overall, very fun, quick side project. Couple of things I need to add:

• Sorting by different qualities

• Sorting by location/autoclustering for locations. Maybe just buttons for my cities.

• Backend integration with users so people other than me can make accounts.

• Generated/stored/web scraped images to add to each of the coffee shops.

• Maybe some new styling? I like the look but I could make this more unique/better.

Looking forward to sending this to people when they ask for recommendations from me, and possibly making it better for others!
