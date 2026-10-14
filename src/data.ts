export interface CastMember {
  name: string;
  emoji: string;
  title: string;
  stats: [string, number][];
  quote: string;
}

export interface Letter {
  to: string;
  text: string[];
}

export interface QuizQuestion {
  q: string;
  opts: string[];
  a: number;
  yes: string;
  no: string;
}

export interface HuntClue {
  clue: string;
  accept: string[];
  hint: string;
}

export interface Coupon {
  t: string;
  d: string;
}

export interface OpenWhenItem {
  t: string;
  m: string;
}

export const APP_DATA = {
  toName: "the Squad",
  fromName: "Zel",
  password: "atrcladies26",
  hint: "Our review season home and who we are, followed by 26 (lowercase, no spaces).",
  startDate: "2020-09-01",
  nextDate: "2026-10-17",
  nextLabel: "days until our next successful project",

  vn: [
    "Ahem. Attention, please! By imperial decree, this entire page now belongs to {to}.",
    "Six people, six letters, and far too many inside jokes. Umu, that is exactly the right amount.",
    "Open every envelope. Win every game. At the very end, there is a surprise for all of you."
  ],

  members: [
    {
      name: "Jho",
      emoji: "🦊",
      title: "The Planner",
      stats: [["Chaos", 40], ["Loyalty", 95], ["Snacks", 70]] as [string, number][],
      quote: "Okay, but what is the schedule?"
    },
    {
      name: "Suz",
      emoji: "🐺",
      title: "The Quiet Strategist",
      stats: [["Chaos", 30], ["Loyalty", 90], ["Snacks", 60]] as [string, number][],
      quote: "I have a plan. You will not like it."
    },
    {
      name: "Ja",
      emoji: "🐱",
      title: "The Wildcard",
      stats: [["Chaos", 98], ["Loyalty", 85], ["Snacks", 90]] as [string, number][],
      quote: "Trust me, it will be fine."
    },
    {
      name: "Nanno",
      emoji: "🦉",
      title: "The Night Owl",
      stats: [["Chaos", 70], ["Loyalty", 92], ["Snacks", 75]] as [string, number][],
      quote: "Want to talk until sunrise?"
    },
    {
      name: "Sunny",
      emoji: "🐻",
      title: "The Big Heart",
      stats: [["Chaos", 55], ["Loyalty", 100], ["Snacks", 99]] as [string, number][],
      quote: "Group hug. No, you cannot escape."
    },
    {
      name: "Debs",
      emoji: "🐰",
      title: "The Hype Machine",
      stats: [["Chaos", 85], ["Loyalty", 96], ["Snacks", 80]] as [string, number][],
      quote: "You are amazing. Say it back."
    }
  ] as CastMember[],

  letters: [
    {
      to: "Jho",
      text: [
        "Tbh, I was kind of scared of what would happen the first time we meet. I remember asking myself, \"would we be okay with each other?\" but I also remember na you're Jho. The Jho that first approached me sa server together with THAT GUY eme >< You're the Jho that makes sure everything's gonna be fine. And with that thought, my nerves calmed down. I never really expected or asked for anything but I'm glad that I was able to meet you throughout the review season. You made everything feel lighter and calmed me down throughout the storm. Others might say na you're the mother of the squad, but for me, you're the best food buddy, the best hilahin, pinakamadaling kausap and all. I also found a sister in you that I never really had. And that's what I'm grateful for. I hope you continue to flourish in the field you had chosen and continue to be the most genuine person I have ever met! You deserve all the happiness, the gifts, the blessings you receive because of how hardworking, how caring, how loving you are as a person. Stay strong sainyo ng jowa mo (yuck, de jk). I hope you guys are the endgame 'cause you guys are so cutesy in my eyes (imama, ipapa HAHAHAHA). Aside from those things, I also hope that you let yourself breathe sometimes. You cannot always be the one understanding. Sometimes it's okay to ask for help too :)"
      ]
    },
    {
      to: "Suz",
      text: [
        "Hello, my ex-twin BWAHAHAHAHA How are you holding up? I know you're strong and I admire that in you but I hope you know na we're here for you too! You can rant, cry, be crazy, and we won't judge you for it. You may be the youngest sainyo but I found an ate in you. Thank you for noticing when I feel off, for being there listening to whatever my thoughts are, no matter how absurd they were. Thank you for the challenges that kept me going. For the memes that made my day. For the advices that slapped me back to reality. Just thank you for being you. ATRC wouldn't be the same without you. But yk, I hope you're gentle with yourself too, just as how gentle you are with other people. I hope you treat yourself the same way as how you care for others kasi you deserve it. You don't deserve a half-assed explanation, a half-baked love. You deserve all the great things in the world and I hope you know that :)"
      ]
    },
    {
      to: "Ja",
      text: [
        "I admire how brave you are as a person. I may not know all your struggles in life, but I know that you deserve peace just as much as everyone else here on earth. You're not incapable or kulang (i forgot the English term BWAHAHAHA), you just haven't found your last piece yet. You're in it for something much greater and I know you'll succeed too! So I hope you won't be too hard on yourself. Dito lang kami lagi, walang iwanan. Thank you for entrusting me some info about your life. Thank you for all the laughter, the jokes, the lessons, the trauma dump we shared with each other HAHAHA Sana di ka magbago ka na. I, thank you!"
      ]
    },
    {
      to: "Nanno",
      text: [
        "Hello our favorite PA Wizard! First of all, I'm so so proud of what you had become (eme kala mo nanay HAHAHAHA). Yung totoo, hindi ka ba napapagod sa dami mong side quests in life? xD Pero seriously, thank you for all the lessons you had given us, for the stories, for the most random jokes ever. I believe that my journey wouldn't be complete without you guys in it. Thank you for the gifts and notes, it saved me in times when I'm spiraling and doubting myself if kaya ko pa ba.",
        "Thank you for your life! I honestly don't know what to say na kaya hanggang dito nalang siguro BWAHAHAHAHA"
      ]
    },
    {
      to: "Sunny",
      text: [
        "Hello Sunshine! You're literally the light of the squad. Being effortlessly funny makes it even cuter HAHAHAHAHA Thank you for the most random moments that became my best core memories. Thank you for the art, the letter, the random kamustahan. It kept me going, really. Those might be small gestures for other people but for me, it was something that I hold into. Meeting you was one of the things I'm really grateful for this year. And I hope you achieve all your dreams and be successful on the field that you have chosen."
      ]
    },
    {
      to: "Debs",
      text: [
        "Hello baddieee~ We probably didn't have much alone time with each other but I'm really grateful for your existence! I learned a lot from you, especially with why it is needed to connect with people HAHAHA I'm really thankful for the friendship we had built throughout this season and I hope na maging successful ka din in life, lalo na sa field na pinili mo. Kahit dito nalang no wag na muna sa lovelife BWAHAHAHAHA But seriously, I also hope na you'll find the right one na for you. The person na hindi ka imamanipulate or igagaslight. I hope you find a love so forgiving and gentle because that's what you deserve after everything you've been through. Reto nalang kita kay Santa xD"
      ]
    }
  ] as Letter[],

  reasons: [
    "We can go months without talking and pick up mid-sentence.",
    "There is always at least one of us who will say yes to a terrible idea.",
    "Nobody here ever makes me feel like too much.",
    "We celebrate each other's wins like they are our own.",
    "The group chat is chaos, and I would not trade it for anything.",
    "Every one of you has taught me something without meaning to.",
    "We show up when it is inconvenient.",
    "Our laughter has its own weather system.",
    "Silence with you is never awkward.",
    "You have made ordinary Tuesdays feel like events.",
    "We tell the truth, kindly.",
    "I would choose all six of you again."
  ],

  quiz: [
    {
      q: "Who is always the last to arrive?",
      opts: ["Jho", "Suz", "Ja", "Sunny"],
      a: 3,
      yes: "Correct! Fashionably late, as always.",
      no: "Wrong, but the real culprit knows who they are."
    },
    {
      q: "Who would survive longest in a zombie apocalypse?",
      opts: ["Nanno, with a plan", "Debs, with snacks", "Suz, with luck", "All of us, together"],
      a: 3,
      yes: "Umu! Strength in numbers.",
      no: "Nice try, but we only survive as a team."
    },
    {
      q: "What is the group chat's most used emoji?",
      opts: ["The skull", "The crying laugh", "The heart", "A question mark"],
      a: 1,
      yes: "Obviously. You know us.",
      no: "Not quite. Scroll up and check."
    },
    {
      q: "Whose idea was the trip that nearly went wrong?",
      opts: ["Jho", "Sunny", "It was a group decision", "Nobody will admit it"],
      a: 3,
      yes: "Perfect. A loyal group keeps secrets.",
      no: "A convincing guess, but nobody is talking."
    }
  ] as QuizQuestion[],

  memIcons: ["🦊", "🐺", "🐱", "🦉", "🐻", "🐰", "🌹", "👑"],

  hunt: [
    {
      clue: "Clue 1: Who always picks the movie? Type their name.",
      accept: ["jho"],
      hint: "The Planner, of course."
    },
    {
      clue: "Clue 2: What is our group's go-to takeout? (pizza, ramen, or sushi)",
      accept: ["ramen"],
      hint: "It is hot, brothy, and always shared."
    },
    {
      clue: "Clue 3: How many of us are there?",
      accept: ["6", "six"],
      hint: "Count the seals up top."
    }
  ] as HuntClue[],
  huntPrize: "You found everything. Your prize: a group outing, planned by me. Pick a weekend, and wear something comfortable.",

  coupons: [
    { t: "You pick the place", d: "Valid for one trip, any distance as long as reachable." },
    { t: "You pick the restaurant", d: "No groaning at the choice." },
    { t: "One 3 a.m. phone call", d: "I will pick up. No questions." },
    { t: "A full hype speech", d: "Delivered with unreasonable enthusiasm." },
    { t: "Winner of one argument", d: "I will concede gracefully." },
    { t: "Free group hug", d: "Redeemable at any time, mandatory participation." }
  ] as Coupon[],

  openWhen: [
    { t: "you are having a bad day", m: "Put your phone down and breathe. Then text the group chat. We will drop everything." },
    { t: "you got big news", m: "Tell us first. We will scream louder than you thought possible." },
    { t: "we have not hung out in too long", m: "Pick a date. Right now. Do not make it complicated." },
    { t: "you doubt yourself", m: "Six people think you are remarkable. That is a majority vote." },
    { t: "you cannot decide", m: "Flip a coin. If you feel disappointed, you know what you want." },
    { t: "it is 3 a.m. and you need us", m: "Call. Someone is awake. Someone is always awake." }
  ] as OpenWhenItem[],

  bucket: [
    "Take a group trip somewhere none of us has been",
    "Host a talent show nobody will win",
    "Cook a full feast together",
    "Watch a sunrise as a group",
    "Take an annual group photo, forever"
  ],

  finaleTitle: "Thank you, {to}.",
  finale: "I am so glad it is us, all six of us. Let us keep the show running. Umu!"
};
