# Design

**Theme: Chain Reaction**

## Brainstorming

Ideas:
- Family relationship dominos
    - One person gets killed, everyone suffers
    - Chain reaction felt through the family as events happen
- Traffic? Nah, boring...
- Food fight

### Family Relationship Dominos

The core chain reaction: bad things happening to one family member causes others to react accordingly at a family reunion.
- Grandma just got obliterated? Everyone's sad
- Rival just got killed? Yay!
- Family gossip

Fun concept, but what's the gameplay loop? What's the goal? Ideas:
- Hurt one specific family member
    - Who? Why? Why would somebody want to hurt the family?
    - Maybe: escape with your core family members intact. Destroy the others
        - This leads to a complicated web/puzzle which might not be that fun.
        - Could be difficult to program to always have a solution (and if we mess that up, it's over)
- Avoid an all-out brawl (or cause one)

Under what circumstances does this web of relationships become *fun*?
- The sheer absurdity of it. We could set this in another place, besides a family reunion...
    - Climb a mountain
    - Fight off enemies (zombies apocalypse?)
- How can we replicate the fun of a domino chain?

Chain reaction: one event causes the next, causes the next, causes the next. Like a chain of dominos. I feel like to get the same joy, the player should be setting up domino chains, knocking them down and having the satisfaction of knocking them down, while maybe being able to correct them as they fall.

Idea for family reunion: there's a small number of family members, and we have a dossier about each family member, of their relationships with everyone else. With that information, take the action that will result in everyone doing/becoming X/dying or something.

Grandma:
- Prone to heart attacks
- Jeff is favorite son

Jeff:
- Married to Linda but actually loves Susan

Susan:
- Allergic to peanuts

Objective: kill Grandma. Give peanuts to susan - she dies - makes Jeff die - gives Grandma a heart attack and she dies
Obstacle: you have your own attachments to the group. Can't let harm come to them.

Raymond:
- Is your brother

Dad:
- Raymond is favorite son

If you kill Raymond, you also die, even though it might fulfill your objective of killing Dad.

Okay, fun ideas, but would this game be *fun* or just overly complicated and confusing? I think it hits the theme. How do we balance this to be sensible and easy to figure out, while still having a finite set of mechanics and a reasonable scope? What are some types of objectives in the family reunion that might make sense?
- Kill so-and-so (too macabre?)
- Make so-and-so cry?
- Kill everyone

These are so negative... Also, where's the challenge here? You have a dossier (potentially incomplete) of every family member. Maybe we need a gossiping phase where you can learn other people's information. Then you get one shot of who to off, which should result in lots of people going down.

I like the idea a lot, but I'm not sure it'll be reasonable to make in the timeframe especially since I'm a few hours behind. Not sure the game would even really be that fun, if I was able to make it. Let's explore some other ideas.

### Army Dominos

Like the family idea, you lead an army, of which each person has specific relationships and connections with each other. You might do things like battle zombies. When certain people in your crew get hurt, it has a resounding impact (chain reaction) on everyone else.

Interesting idea, but how does this tie into the game loop? This is more an afterthought mechanic that might be kinda hard to execute. Unless it has a real bearing on how the group does in their next battle.

Another idea: when you kill an enemy (or when one of your people dies), they explode and damage people nearby. Do your attacks right to clear entire groups at once.

I think I need to find a clear gameplay mechanic, and base the univese around that.

## Mechanic Ideas

- Block ordering - detonate blocks to cause more blocks to detonate. Clear the screen.
    - This is like, every puzzle game ever...
- Every event you do leads to a new event
- Butterfly effect

---

Okay, pause. Let's talk about this a little bit more. My game must be based on a mechanic inspired by the theme, chain reaction. Let's think about mechanics now and find specifics later. I like the idea of *dominos* in some way. Dominos are the definition of a chain reaction, you set them up purely to knock them down. I want my game to be based on that... It's fun to set up, but even more fun to knock down!

I want the fun to come from either the success of, causing of, a chain. Avoiding a chain happening, on the other hand, doesn't hit the theme hard enough in my mind. We *want* the theme to be intertwined with the game, so our goal is to make these chain events a positive thing (for the player) to cause.

The **Event**: every chain-link in the chain reaction is the event. This event repeats over and over to form the whole chain. It must be a solid, discrete, observable event with a clear trigger and resolution. Each event is the trigger of the next event, and each event is in essence the same. We want the event to occur over and over again, but the player is challenged to keep their chain going as long as possible and rewarded for doing so.

The **Setup**: like putting physical dominos on their ends, the player makes the decision to set up their chain event. For dominos, the joy comes from the creativity and the wonder: "What will this look like? How long will it take to collapse?"

The **Chain**: when the player is ready, they knock over that first domino. They get to watch all their hard work come to fruition before their eyes.

I think for this game to work, *the setup and watching the chain unfold must be equally fun*. I think a lot of fun can come from uncertainty of the plan, and having to course-correct, possibly at an expense.

So what's the event? How does the player plan then execute it, and what can they do to correct it?

- Bounce game. You need to bounce/launch your avatar through the level by setting up your launch stages/trampolines
- Network game. You set up a network of connected nodes to help them communicate, but expanding the network makes it more confusing and causes more delays and confusions.
    - Connect with the traveling salesman problem in some fun way? Idiot salesman doesn't know where to go and keeps getting confused by your expanding routes, maybe?
    - We don't want the chain to be negative, though. The mailman has to use the chain events to his advantage (meeting other mailmen) to make it through

### Idiot Mailman Game

You have a network of a small number of nodes, and several idiotic mailmen who traverse the network by their given rules. When mailmen wind up in the same node, interesting things happen that lead to mail ultimately getting delivered.

Mail always starts with ONE of the idiot mailmen. When two mailmen land on the same node, they handoff the letter.

The goal is to get the mail to the mailbox. The mail can never start with a mailman who can reach the mailbox by their own rules.

The challenge is to place enough roads between nodes from the budget that allows mail to arrive. The player has to navigate an increasingly-complex node map to get mail to the destination.

Mailman rules:
- Always handoff when on the same node

Mailman types:
- The right one: always heads to toward the target.
- West/North/South/East: always head in this direction of route, if they can take it, otherwise stay in a location.
- Trailer: follows one step behind the closest mailman
- Follower: only follows the nearby mailman
- Explorer: only goes to nodes they haven't visited