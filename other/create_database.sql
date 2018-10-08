-- create database
DROP DATABASE IF EXISTS pw_info3130_a3;
CREATE DATABASE pw_info3130_a3;

-- use database
USE pw_info3130_a3;

-- create tables
CREATE TABLE story(
    id              INT             AUTO_INCREMENT      UNIQUE,
    title           VARCHAR(50)     NOT NULL,
    body            VARCHAR(200)    NOT NULL,
    sendDelay       INT             NOT NULL,
    isChoice        BOOL            NOT NULL,
    toNextStory     INT,
    CONSTRAINT pk_story PRIMARY KEY (id)
);

CREATE TABLE choice(
    id              INT             AUTO_INCREMENT      UNIQUE,
    choice          VARCHAR(20)     NOT NULL,
    CONSTRAINT pk_choice PRIMARY KEY (id)
);

CREATE TABLE storyChoice(
    storyId         INT             NOT NULL,
    choiceId        INT             NOT NULL,
    toStory         INT             NOT NULL,
    CONSTRAINT pk_storyChoice PRIMARY KEY (storyId, choiceId),
    CONSTRAINT fk_storyChoice_fromStory FOREIGN KEY (storyId) REFERENCES story (id),
    CONSTRAINT fk_storyChoice_choice FOREIGN KEY (choiceId) REFERENCES choice (id),
    CONSTRAINT fk_storyChoice_toStory FOREIGN KEY (toStory) REFERENCES story (id)
);

CREATE TABLE player(
    id              INT             AUTO_INCREMENT      UNIQUE,
    name            VARCHAR(50),
    phoneNumber     VARCHAR(20)     NOT NULL,
    storyProgress   INT             NOT NULL,
    CONSTRAINT pk_player PRIMARY KEY (id),
    CONSTRAINT fk_player_story FOREIGN KEY (storyProgress) REFERENCES story (id)
);

-- insert data
INSERT INTO choice(id, choice) VALUES
(DEFAULT, 'survive'),
(DEFAULT, 'who are you'),
(DEFAULT, '%any%'),
(DEFAULT, 'yes'),
(DEFAULT, 'no'),
(DEFAULT, 'north'),
(DEFAULT, 'south'),
(DEFAULT, 'around'),
(DEFAULT, 'shrine'),
(DEFAULT, 'button'),
(DEFAULT, 'through'),
(DEFAULT, 'west'),
(DEFAULT, 'east'),
(DEFAULT, 'camp'),
(DEFAULT, 'go to'),
(DEFAULT, 'ignore'),
(DEFAULT, 'fight'),
(DEFAULT, 'run');

INSERT INTO story(id, title, body, sendDelay, isChoice, toNextStory) VALUES
(DEFAULT, 'begin 1', 'Oh thank god, someone finally found me.', 1000, 0, 2),
(DEFAULT, 'begin 2', 'Our ship crashed on some moon, it’s been weeks  since I’ve had human contact.', 1500, 0, 3),
(DEFAULT, 'begin 3', 'I have come into contact with alien life. Yes, that makes me the first human to do so. I would send you a picture of them, but my plan doesn’t include mms.', 2000, 0, 4),
(DEFAULT, 'begin choice', '[how did you survive?]\n\n[who are you?]', 0, 1, NULL),
(DEFAULT, 'survive 1', 'I ejected before the ship crashed, and no that\'s not a cowardly move.', 1000, 0, 6),
(DEFAULT, 'survive 2', 'Once I gave up trying to get my bearings, I set up a small camp for the night, but Martian nights were much colder than I expected.', 2000, 0, 7),
(DEFAULT, 'survive 3', 'It was then I met the only friendly alien species. They saw my distress and taught me a creative way to stay warm during the night.', 2000, 0, 8),
(DEFAULT, 'survive 4', 'While we didn\'t understand each other, it\'s true what they say, love knows no bounds. The aliens knew no bounds either, but at least we stayed warm.', 2000, 0, 9),
(DEFAULT, 'survive 5', 'Anyway...', 500, 0, 10),
(DEFAULT, 'who are you', 'I’m Riley! What’s your name?', 500, 1, NULL),
(DEFAULT, 'greeting 1', 'Pleasure to meet you %name%!', 1000, 0, 12),
(DEFAULT, 'greeting 2', 'I need your help, recent events have messed up my judgment. I need to get back to my ship, I think it’s still salvageable. Will you help me?', 2000, 0, 13),
(DEFAULT, 'greeting 3', '[yes]\n\n[no]', 0, 1, NULL),
(DEFAULT, 'help refused 1', 'Oh, ok, cool.', 500, 0, 15),
(DEFAULT, 'help refused 2', 'cool', 100, 0, 16),
(DEFAULT, 'help refused 3', 'cool', 100, 0, 17),
(DEFAULT, 'game over', 'Game Over, progress has been reset.', 0, 0, NULL),
(DEFAULT, 'help accepted 1', 'Great! I’m going to start my trek now. My ship is due north of my camp, but to the south there’s a high dune, I’m sure I could see for miles!', 2000, 0, 19),
(DEFAULT, 'help accepted 2', 'Wich way should I go?', 500, 0, 20),
(DEFAULT, 'help accepted 3', '[north]\n\n[south]', 0, 1, NULL),
(DEFAULT, 'north 1', 'Ok, I’m north-er. ', 3000, 0, 22),
(DEFAULT, 'north 2', 'Ahead of me I see a deep ravine, I’ll have to go around. At the edge of the ravine, there’s a shine-like thing.', 2000, 0, 23),
(DEFAULT, 'north 3', '[go around ravine]\n\n[go to shrine]', 0, 1, NULL),
(DEFAULT, 'shrine 1', 'At the shrine, it’s pretty cool, the material it’s made out of is pretty shrine-y.', 1500, 0, 25),
(DEFAULT, 'shrine 2', 'Get it? Like shiny? But it’s a shrine? Yeah you get it.', 1500, 0, 26),
(DEFAULT, 'shrine 3', 'There’s a button (an alien button of course) off to the side of the shrine, should I press it? Or just go around the ravine now.', 2000, 0, 27),
(DEFAULT, 'shrine 4', '[go around ravine]\n\n[press button]', 0, 1, NULL),
(DEFAULT, 'button 1', 'Woah. A holographic video played in front of me, it depicted a rock formation with tons of aliens fighting around it', 2000, 0, 29),
(DEFAULT, 'button 2', 'The aliens doing most of the killing looked almost like a human brain with eyes. Should probably avoid them. Anyway, I’m going to go around the ravine now.', 2500, 0, 30),
(DEFAULT, 'around ravine 1', 'On the other side. To help you keep track, my ship is still due north.', 1000, 0, 31),
(DEFAULT, 'around ravine 2', 'Ahead of me there appears to be a small patrol of not at all friendly aliens. I could go around them or right through.', 1500, 0, 32),
(DEFAULT, 'around ravine 3', '[go around]\n\n[straight through]', 0, 1, NULL),
(DEFAULT, 'around enemies 1', 'Ok good, as soon as I asked I got worried.', 1000, 0, 34),
(DEFAULT, 'around enemies 2', 'I’m around them, all limbs accounted for, yay!', 5000, 0, 38),
(DEFAULT, 'through enemies 1', 'Great, why did I even ask you. Alright, here it goes.', 500, 0, 36),
(DEFAULT, 'through enemies 2', 'I got through, I punched one of them to assert dominance, didn’t work well. I tried to give a yell, but my voice went shrill. Either way, they left after that.', 5000, 0, 37),
(DEFAULT, 'through enemies 3', 'If this ever comes up sometime, I gave a bloodcurdling war cry and they ran away in fear, ok? Ok.', 2000, 0, 38),
(DEFAULT, 'north regroup 1', 'Anyway, I see smoke in the distance, that must be my ship! ', 1500, 0, 39),
(DEFAULT, 'north regroup 2', 'Unfortunately I can’t go straight north, there’s a massively tall cliffside  that I can’t climb. East or West, up to you.', 2000, 0, 40),
(DEFAULT, 'north regroup 3', '[west]\n\n[east]', 0, 1, NULL),
(DEFAULT, 'west 1', 'I went west, I see a pod from our ship! I’m going to it.', 3000, 0, 42),
(DEFAULT, 'west 2', 'There’s a note! It’s written in English! (but in an alien-themed font!)', 2000, 0, 43),
(DEFAULT, 'west 3', '“I misjudged the scope of this storyline, going to have to do some shortcuts”\n\n- Pat', 1000, 0, 44),
(DEFAULT, 'west 4', 'Huh, wonder what that means, and who’s Pat?', 500, 0, 45),
(DEFAULT, 'west 5', 'Anyway, I’m going to go eastward now.', 500, 0, 46),
(DEFAULT, 'east 1', 'I went east, after going around the side of the cliffside a bit, there appears to be a worn path that heads more east. I’ll follow it.', 3000, 0, 47),
(DEFAULT, 'east 2', 'Oh god, I see a mangled spacesuit… it must have been a crew member. I’m going over to them.', 2000, 0, 48),
(DEFAULT, 'east 3', 'There’s no body inside the suit, but there’s a blaster sitting nearby. I’ll hang onto that.', 2000, 0, -1), -- regroup
(DEFAULT, 'south 1', 'Ok, I’m up on the dune. Looks like I was wrong! My ship is in more of a north-east direction.', 5000, 0, 50),
(DEFAULT, 'south 2', 'I can go eastward or head back to my camp, what do you think?', 1000, 0, 51),
(DEFAULT, 'south 3', '[back to camp]\n\n[east]', 0, 1, NULL),
(DEFAULT, 'back to camp', 'Ok, I’ll go to my camp then continue north a bit.', 1000, 0, 21),
(DEFAULT, 'camp east 1', 'I went east, I see something strange ahead, it looks like a chicken, but that’d be stupid.', 5000, 0, 54),
(DEFAULT, 'camp east 2', 'Should I go over to it or just ignore it?', 1000, 0, 55),
(DEFAULT, 'camp east 3', '[ignore it]\n\n[go to it]', 0, 1, NULL),
(DEFAULT, 'go to chicken 1', 'It pecked me. Then it scurried away, then came back and pecked again.', 5000, 0, 57),
(DEFAULT, 'go to chicken 2', 'That was weird, I wonder if it’ll make sense once INFO3140 Assignment 3 is complete.', 2000, 0, 59),
(DEFAULT, 'ignore chicken', 'Probably a good idea.', 500, 0, 59),
(DEFAULT, 'south regroup 1', 'I see a crate from the ship! I’m going over to it.', 1000, 0, 60),
(DEFAULT, 'south regroup 2', 'Oh cool, there’s a blaster inside! Probably useful.', 3000, 0, 61),
(DEFAULT, 'south regroup 3', 'I’m going to continue further down this path.', 1000, 0, 62),
(DEFAULT, 'all regroup 1', 'The smoke rising from the ship is much closer now, but it’s behind what looks like a massive honeycomb rock.', 5000, 0, 63),
(DEFAULT, 'all regroup 2', 'Should I approach it?', 500, 0, 64),
(DEFAULT, 'all regroup 3', '[yes]\n\n[yes]', 0, 1, NULL),
(DEFAULT, 'approach 1', 'Yeah, I guess there is no other option is there.', 1000, 0, 66),
(DEFAULT, 'approach 2', 'Oh no! In a shocking turn of events, the honeycomb rock is filled with flying aliens!', 5000, 0, 67),
(DEFAULT, 'approach 3', 'No one could have seen this coming!', 1000, 0, 68),
(DEFAULT, 'approach 4', 'Should I blast em? Or try to make a break for the ship?', 1500, 0, 69),
(DEFAULT, 'approach 5', '[fight]\n\n[run]', 0, 1, NULL),
(DEFAULT, 'run 1', 'Ok, here I go!', 500, 0, 71),
(DEFAULT, 'run 2', 'I got past them, but they’re flying after me, I’ve got to get to the ship fast.', 5000, 0, 74), -- ad
(DEFAULT, 'fight 1', 'Alright, let get blasting!', 1000, 0, 73),
(DEFAULT, 'fight 2', 'It’s over, I blasted most of them, the rest fly away in defeat.', 10000, 0, 74),
(DEFAULT, 'final 1', 'I see the ship! I’ll make my way to it.', 1500, 0, 75),
(DEFAULT, 'final 2', 'The hatch works! I’m safely inside. I can take it from here.', 5000, 0, 76),
(DEFAULT, 'final 3', 'Thanks %name%, when I get back, drinks on me.', 2000, 0, 77),
(DEFAULT, 'final 4', '\n\n\n\n\n\n\n\n', 5000, 0, 78),
(DEFAULT, 'game over', 'Congratulations! You saved Riley.\n\nYour game progress has been reset to the start.', 0, 0, NULL);

INSERT INTO storyChoice(storyId, choiceId, toStory) VALUES
(4, 1, 5),
(4, 2, 10),
(10, 3, 11),
(13, 5, 14),
(13, 4, 18),
(20, 6, 21),
(20, 7, 50),
(23, 9, 24),
(23, 8, 30),
(27, 8, 30),
(27, 10, 28),
(32, 8, 33),
(32, 11, 35),
(40, 12, 41),
(40, 13, 46),
(51, 14, 52),
(51, 13, 53),
(55, 16, 58),
(55, 15, 56),
(64, 4, 65),
(69, 18, 70),
(69, 17, 72);

INSERT INTO player(id, name, phoneNumber, storyProgress) VALUES
(DEFAULT, 'Pat', 5198076720, 1);

SELECT 'Successfully created pw_info_a3';
