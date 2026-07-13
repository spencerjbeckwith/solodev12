# solodev #12 entry - Mailhem

Play on [itch.io](https://mcwequiesk.itch.io/mailhem)!

This was my entry for the [Solo Jam Dev #12](https://itch.io/jam/solo-dev-jam-12).

## Running locally

This was built using my own [super game engine](https://github.com/spencerjbeckwith/super).

```bash
npm install
npm run atlas
npm run build
npm run serve
```

```bash
npm run build -- --watch
```

You have to run `npm run atlas` whenever any sprites are updated.

Then open [localhost](http://localhost:3000) in your browser.

### Running tests

```bash
npm test
```

## Tasks

- [x] Carrier sprites
- [x] Parcel/Destination sprites
- [x] Implement Carrier
- [x] Implement Destination
- [x] Carrier tick logic/base Carrier types
- [x] Level completion
- [x] Save/Load Level
- [x] Design levels (24's enough, right?)
- [x] Itch page and deploy

### Stretch Goals

- [x] Background (good enough)
- [x] Music
- [x] Title Screen
- [x] Tutorial
- [x] Completion Screen
- [ ] Cutesy Sounds (missed opportunity...)
- [ ] Indicator if multiple Carriers are on node

Music: pre-existing cc0 from [opengameart](https://opengameart.org/content/two-left-socks)
