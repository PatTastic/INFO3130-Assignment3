-- get choices
SELECT c.choice, sc.toStory FROM storyChoice sc JOIN choice c ON sc.choiceId = c.id WHERE sc.storyId = 69;

-- get next story
SELECT s.title, s.body, s.sendDelay, s.isChoice, s.toNextStory FROM story s WHERE s.id = 70;

-- get user info
SELECT p.name, p.phoneNumber, p.storyProgress FROM player p WHERE p.phoneNumber = '5198076720';
