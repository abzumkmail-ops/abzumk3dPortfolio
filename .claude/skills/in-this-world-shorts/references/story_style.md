# Story style: the "In This World" series (channel @NubiRobloxx)

This is distilled from transcripts of the channel's own Shorts ("In This World, Paintings Can Talk" and "Hugging Charges Your Battery")
and the user's direction. The series uses **one magical world rule** told by **a 5th–7th grade kid in first person**,
with blocky Roblox-style cartoon visuals. **Stories are general premises, not Roblox-gameplay topics**
(the user explicitly rejected "your Roblox avatar…" stories). A **small love subplot** runs in the background and pays off sweetly at the very end.

## Title formats
"In This World, ___" · "Every ___ Comes With ___" · "Your ___ Decides ___" · "___ Makes You ___".
Examples from the channel: Your Name Is Your Superpower · Laughing Makes You FLY · You Only Get 1,000 Words · Hugging Charges Your Battery ·
Dogs Never Stop Growing · Every House Comes With A Ghost · Borrowed Items Fly Home At Midnight · Adults Can't See Kids.

## Beat formula (about 50 s, 22–28 lines, one visual beat per line)
| Time | Beat | Signature phrasing |
|---|---|---|
| 0–3 s | **Rule hook**: the rule in one breath, shown on screen from frame 1 | "In this world, …" |
| 3–9 s | **How it works + 2 world jokes** (pets, grandma, pop stars, teachers…) | "You see, …" |
| 9–14 s | **Underdog Nubi** + nickname | "Me? I …" / "Kids call me …" |
| 14–20 s | **Inciting event / rival / stakes**, often with a countdown or goal (HUD) | "Then one day, …" |
| 20–27 s | **Tries and fails**: quick comic attempts ("Still one.") | short fragments |
| 27–30 s | **Mid-video CTA at the cliffhanger** | "Subscribe, because …" |
| 30–36 s | **Twist**: the rule backfires or turns on someone | |
| 36–44 s | **Realization**: Nubi wins by using the world's own rule in a kind or clever way | "That's when I realized something." |
| 44–52 s | **Love payoff**: the quiet crush (usually Lily) and the rule reveal they like each other | short, sweet, no kissing |
| 52–55 s | **Closing CTA + loop**: last image echoes the first | "Subscribe if …" |

## Writing rules
- Write first person, Nubi speaking. **One narrator voices everyone**: dialogue lines are short and attributed by the visuals, not by "he said".
- Keep sentences short. Every line must be drawable. If you can't picture the shot, rewrite the line.
- Escalate: each beat should be bigger or sillier than the last.
- **Logic check the rule** before finishing. Ask "does any line accidentally imply something sad or wrong?"
  (Example from the like-counter story: "my one was never Mom" implied Mom didn't like him. That was fixed by adding "family doesn't count" and making the red herring the lunch lady.)
- Keep it kid-friendly (the audience is about 9–13): no romance beyond blushing, holding hands or heart-eyes, no meanness that isn't resolved, no real brands except "Roblox" in passing.
- Don't claim real Roblox features. Everything is a fictional world rule.
- Words for TTS: spell numbers as words ("nine hundred"), avoid symbols and abbreviations, use "..." for a dramatic pause, and use phonetic spellings in the voice text if needed.

## Length budget
The default narrator (Kokoro kid voice, pitched +4 st) runs about **215 wpm including pauses**, so **185–200 words gives about 52–55 s**.
An ElevenLabs "Valf" take at 1.25x is about the same pace. If the voice comes back over 56 s, cut a world joke. Don't speed the voice up further.

## `data/script_lines.json` format
```json
[
 {"id": "L0", "text": "In this world, everyone has a number above their head."},
 {"id": "L10", "text": "Bet you can't hit ten by Friday.", "speaker": "brayden", "gap": 0.2}
]
```
`id` values are L0, L1, … in order. `speaker` is informational, for lip-sync planning. `gap` is extra silence after the line in seconds (0.2–0.35 before reveals and punchlines).

## Recurring cast (keep them consistent across episodes)
Nubi (hero, teal hoodie) · Lily (quiet crush, yellow cardigan) · Brayden (show-off rival who usually gets humbled and then redeemed) ·
kidA–kidF (classmates) · Mom, Grandma, Teacher, Lunch lady · the dog. Reuse them before inventing new people. New one-offs go in story.js.

## Premise seeds (unused)
Your Shadow Says What You're Really Thinking · Every Lie Makes Your Nose Glow · Homework Does Itself If You Compliment It ·
Your Height Shows How Brave You Are · Every Kid Gets One Wish On Their 12th Birthday · Sneezing Swaps Bodies For 1 Minute ·
Your Hair Color Changes With Your Mood · Pets Can Vote · The Weather Copies The Teacher's Mood.
