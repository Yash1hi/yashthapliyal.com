---
title: "Hackbubu 2025 - Clean with Sqeebles"
date: "2025-10-11"
description: "A full project writeup for an AI powered Tomagachi room cleaning app built in 2 hours"
tags: ["computer science", "write-up", "hackathon"]
---

![Sqeeble Front View](/Squeeble_Front.png "Sqeeble Front View|medium")


[Project Link: https://github.com/Yash1hi/Clean-With-Sqeeble](https://github.com/Yash1hi/Clean-With-Sqeeble)

[Demo Video](https://drive.google.com/file/d/1Wdrad8z62Vg446nY6C1ZNAcxDYPiBc_i/view?usp=sharing)


Yo! Recently had the oppurtunity to participate and win 1st place ([LinkedIn Post](https://www.linkedin.com/feed/update/urn:li:activity:7382848362250866688/)) at Hackbubu during SF tech week 2025, one of the funniest things I have done to date. Incredibly grateful to [Sakshi Deshmukh](https://www.linkedin.com/in/sakshi-d14/) for my partner and lead product designer on this project. During the brainstorming and team finding phase, my new friend [Shania](https://www.linkedin.com/in/shania-chacon/) tossed the idea of a AI powered room cleaning app, but ended up chosing a different path to purse this hackathon. Me and Sakshi picked up the idea, expanding on it to a gamified version, and built our product.


**Clean with Sqeebles** is a gamified room cleaning application that uses AI-powered computer vision to make cleaning more fun (or at least stressful). On load, you get your very own "Sqeeble", whose happiness depends on your cleaning success measured by a live camera feed of your room.

![Sqeeble screenshot 1](/Sqeeble_SC.png "inline")
![Sqeeble screenshot 2](/Sqeeble_SC2.png "inline") 


## Core Concept

When brainstorming, I think the first thing that came to mind was **"how do we make this interesting."** The first idea was a timer, which gave you a nerve-wracking countdown and kept you accountable with the camera. The second was the pet, where I was able to reuse one of my favorite characters from a very old project with [Gabo](https://www.linkedin.com/in/gabriel-page-segura-86895824b/), my good friend and favorite graphic designer.

## Technical Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI Framework:** shadcn-ui + Tailwind CSS (retro-styled design)
- **AI Integration:** Google Gemini 2.5 Flash Image model
- **Routing:** React Router v6
- **State Management:** React hooks + localStorage for persistence
- **Camera API:** MediaStream API (getUserMedia)

I don't think a lot of explanation is needed here, it's my most comfortable stack. MediaStream API worked perfectly for camera interaction alongside MacOS's inbuilt functionality to connect to your phone camera

## Key Features

### 1. AI-Powered Item Detection
*Location: `src/pages/Index.tsx:40-190`*

- Uses Google Gemini AI to analyze room images
- Identifies up to 3 items that need cleaning
- Returns structured JSON
- Performs before/after comparison to verify cleaning completion

### 2. Dual-Photo Capture System
*Location: `src/components/CameraStream.tsx`*

- Real-time camera stream with device selection
- Two-phase capture workflow:
  1. Initial capture: Identifies items to clean
  2. Verification capture: Confirms which items were cleaned
- Variable countdown between photos
- PNG image capture

### 3. Dynamic Quest System
*Location: `src/components/NotesArea.tsx`*

- Auto-generates cleaning "quests" from AI-detected items
- Context-aware emoji assignment (e.g., 👕 for clothes, 🗑️ for trash)
- localStorage persistence

### 4. Virtual Pet Companion
*Location: `src/components/PetDisplay.tsx`*

**Squeeble:** Animated sprite character with multiple states
- **Pending:** Idle happy animation (alternates between 2 frames)
- **Success:** Celebration animation with 10 hearts
- **Failure:** "Death" state with 0 hearts (dramatic consequence)
- Sprite-based animation system (500ms frame interval)
- Dynamic messaging based on cleaning results

### 5. Timer Component
*Location: `src/components/Timer.tsx`*

- Countdown timer with visual progress bar

### 6. Landing Page
*Location: `src/pages/Landing.tsx`*

## AI Integration Details

- **Model:** `gemini-2.5-flash-image`
- **Prompt Engineering:**
  - First photo: Structured JSON extraction for items
  - Second photo: Boolean comparison logic with remaining items array
- **Response Parsing:** Regex-based JSON extraction from markdown-wrapped responses
- **Error Handling:** Comprehensive try-catch with user-friendly toast notifications

## Design System

- **Aesthetic:** Retro/pixel art game style
- **Color Scheme:** Green-based palette (`hsl(101,28%,70%)`)
- **Responsive:** Two-column desktop layout, stacked mobile layout

## Data Structures

```typescript
interface CleaningItem {
  item_name: string;
  item_description: string;
  item_location: string;
}

interface CapturedImageData {
  imageData: string;
  items: CleaningItem[];
  isAnalyzing: boolean;
}
```

## **Technical Highlights**

- Zero external dependencies for camera/canvas manipulation
- Efficient re-renders with proper React hooks
- Type-safe TypeScript throughout
- Clean separation of concerns (camera, AI, display, quests)
- Graceful error handling at every integration point

---

**Built with:** React, TypeScript, Google Gemini AI, shadcn-ui, Tailwind CSS


Had a super fun time building this project, and while at the moment it remains an MVP, I would love to build it out if there's some more interest. As always, if you're interested in my work shoot me a message, always great to hear from people!
