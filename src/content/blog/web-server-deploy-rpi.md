---
title: "Hosting a Website on a Raspberry Pi"
date: "2025-09-09"
description: "A quick and dirty guide to deploying a website off a raspberry pi."
tags: ["raspberry-pi", "web-development", "linux", "server", "tutorial"]
---

For some reason, every tutorial I have come across on the internet on setting up a basic, production ready web server for free on a raspberry pi is incredibly long, complicated, and full of microservices that people love to promote. So I decided to write one. Here's a simple, no bullshit guide on setting one up. 

## What You'll Need
- Raspberry Pi (3B+ or newer recommended)
- MicroSD card (16GB minimum, 32GB recommended)
- Stable internet connection
- MicroSD card reader & separate device

# Installing Raspberry Pi OS

This is not as complicated as the top google search results will tell you. While you could go the route of downloading the OS image, a flasher, flashing the image, adding an ssh file, and booting from there, Raspberry Pi has a great all in one OS flasher called [Raspberry Pi Imager](https://www.raspberrypi.com/software/). I'd reccomend using that.

Plug your MicroSD card into your seperate device and go through selecting your RPi device, OS (I'd reccomend the full but it doesn't really matter), and storage. Once you're done, modify the advanced settings to add in the option to ssh on network, as well as the SSID and Password to your network. While you could go through this whole process with a mouse, keyboard, and monitor attached to the RPi, I would reccomend just ssh through your network. You can use ssh on linux/MacOS easy, or PuTTY on Windows. Once you finish flashing (this will take a hot minute), plug that bad boy back into your RPi and connect to a power source. Try sshing into the the RPi using the following command:

```bash
ssh [YourUsername]@[yourRPiName(default raspberrypi.local)]
ssh yash1hi@yash-raspberrypi.local
```
Sign in with your password, and congrats! You're logged in and ready to use some bare metal.

Before we continue, run the following command:

```bash
sudo apt update && sudo apt upgrade -y
```

This ensures you have the latest security patches and software versions.

# Getting your code to the device

Next step is actually getting your code over to your RPi. This can be done in a variety of ways, but if you're a developer you can just git clone your repo it over. I'm not going to go through the exact method, but you can just sign into github here like any machine and clone it. The other popular method is the command rsync, which will copy files from the device that you're on to the ssh'd device, in this case the RPi.

I'm going to go through this with an instance of my personal website (you can do this too with my website [here](https://github.com/Yash1hi/yashthapliyal.com)!)

```bash
git clone https://github.com/Yash1hi/yashthapliyal.com
```

# Installing dependencies

My website runs on node, which is pretty easy to set up and run and I would highly reccomend. For me, I have a script set up with npm (package manager) and node, which are the 2 core services I need. To download those, we can run:

```bash
sudo apt install nodejs npm
```

Then, we can move into our working directory and install the package dependencies for the website:

```bash
cd yashthapliyal.com
npm install
```

Finally, we can build and run this website on a production build using the scripts that I have here:

```bash
npm run build
npm run start
```

Now test to see if the server is running! You should be able to access this on any device on your network using the network address from running the server.   

![RPi-Setup-Network-SC](/RPi-Setup-NetworkAddr.png)

Ok, now we have a self hosted website on an external device that's accesible to your network! You're almost there, there's a couple of steps left here. First, we need to make this accessible to the public internet, and second, we need to make sure this continues running after we disconnect from our ssh session.

# Making this publically accessible

There's 2 main methods of doing this, both with different ups/downs. First is the one that everybody under the sun will tell you about, which is port forwarding. This is essentially creating a hole in your firewall for your home network, allowing people to access this one specific service. This is fine, works well, and isn't bad to set up. However, it requires access to your home network's admin services, and creates security risks if poorly configured. Also, it's just a pain. I want everything on my device, I don't want to go to my ISP settings and deal with all that.

So I chose to go with the second option, which is using a service like ngrok. I AM NOT SPONSORED BY NGROK IT IS JUST GOATED (I wouldn't be opposed though 🙏). Ngrok acts as that tunnel across your network to the world, however just porting traffic through their server. It is also incredibly easy to set up. Here's what you do:

- Go to the ngrok website and make an account
- Install ngrok on your RPi using 
```bash
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
  && echo "deb https://ngrok-agent.s3.amazonaws.com bookworm main" \
  | sudo tee /etc/apt/sources.list.d/ngrok.list \
  && sudo apt update \
  && sudo apt install ngrok
```
- Add your auth token from the ngrok dashboard from where your set up your account, and add that auth to your ngrok cli on the RPi
```bash
ngrok config add-authtoken [token]
```
Awesome! Your ngrok config is now set up. Now I would say we should test it with the domain and running the server, and you can by opening up 2 diff terminal sessions with one running the server and the other running ngrok, but instead we will deal with the second issue and come back.

# Running the web server all the time

Ok so right now, if you're running the web server, it will end itself when you end the terminal session. That's not good.

We can fix this using a preinstalled linux service called systemd. Systemd allows you to run anything in the background that would be in your cli, allowing you to have the web server and ngrok running at the same time, and not connected to your ssh session. It also has other cool features, like starting their runtimes every time the system is rebooted (in case your house is struck by lightning). 

I have 2 different scripts running with systemd, one for the node server itself and another for ngrok to create the tunnel to the web. Here's what they look like!

```bash
# This file lives in /etc/systemd/system/yashthapliyal.com.service
# Run sudo nano /etc/systemd/system/yashthapliyal.com.service to make and edit the file
[Unit]
Description=Node.js app yashthapliyal.com
After=network.target

[Service]
User=yash1hi
Group=yashh1i
WorkingDirectory=/home/yash1hi/Desktop/yashthapliyal.com

# Absolute path to npm (check with `which npm`)
ExecStart=/usr/bin/npm run start

Restart=always
RestartSec=5
Environment=NODE_ENV=production

# Logs go to journald
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
# This file lives in /etc/systemd/system/ngrok.service
[Unit]
Description=ngrok tunnel for yashthapliyal.com
After=network.target yashthapliyal.com.service
Requires=yashthapliyal.com.service

[Service]
User=yash1hi
WorkingDirectory=/home/yash1hi
ExecStart=/usr/local/bin/ngrok http 3000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

After creating these scripts, you can run them using the following command to restart the daemon and enable the scripts!

```bash
sudo systemctl daemon-reload
sudo systemctl enable yashthapliyal.com.service ngrok.service
sudo systemctl start yashthapliyal.com.service ngrok.service
```

Check the logs of the network by using this command, and you should now see your public url!

```bash
journalctl -u ngrok.service -f
```

Now you should be done, and have a working website at your url you were assigned by ngrok. To test out the instance of my website I have set up, you can go to the website below.

[in-subcancellate-boarishly.ngrok-free.app](https://in-subcancellate-boarishly.ngrok-free.app/)