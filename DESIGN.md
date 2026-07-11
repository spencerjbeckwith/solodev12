# Idiot Mail Delivery Game

You have to build roads to help mailman find their way about town and deliver their mail. However, these deliverymen are far from ordinary and like to follow their own rules.

The player clicks on a node then drags to the next-nearest node to draw a road. The player can hit the "play" button which will then let all mailmen go about their business on the network. They can hit "stop" to go back to the beginning. They can click a road they've drawn to delete it, or they can reset the whole level at once.

The challenge is that each mailman follows different yet **deterministic** rules, and the location of the letter and mailbox on each level is designed such that getting the mail to be delivered requires deliberate chain reactions to occur by having mailmen arrive on the same node at the same time.

## Rules

- The player can start, stop, reset the level as much as they want. They can only build up to the budgeted number of roads, however.
- The mail must arrive in the mailbox for the level to be complete, at which point the player can move onto the next one.
- When more than one mailman arrives on the same node, they will hand-off the letter. The mail must pass between at least two mailmen in order to reach the target.
- When hitting play, the game advances as a series of *ticks*. Each tick is one mailman moving to their next target location.
- Mailmen passing each other, going opposite directions on the same road, still handoff mail
- A mailman who has nowhere to move to stays in their current location
- Nodes are layed out on an equally-spaced grid, and can only be connected horizontally, vertically, or diagonally
- If multiple mailmen arrive at a spot for a handoff, the mail doesn't change hands (they don't play favorites, and they're kinda greedy)
- If the mail is on a node, a mailman moving over it picks it up
- Roads may not cross each other

## Mailman Types

- Always takes the shortest path to the target
- North/South/East/Westbound: only go in one direction
- Bouncer: same as above, but reverses after reaching another mailman
- Bully: always walks towards the nearest mailman, doesn't move if on a space with one already
- Coward: runs away from the nearest mailman
- Explorer: never revisit a node already visited
