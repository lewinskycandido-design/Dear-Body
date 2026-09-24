const assert = require('node:assert/strict');
const { tags, normalize, rank, poolFor, questionsFor } = require('../theme/assets/sj-finder.js');
const { loadDefaultProfiles } = require('./finder-eligibility-qa.cjs');
async function run() {
  let scenarios = 0;
  const test = (name, action) => { action(); scenarios++; console.log(`PASS ${name}`); };
  // Render native Liquid defaults rather than duplicating the six traits here.
  const profiles = await loadDefaultProfiles();
  test('Normalization supports native list and text metafield formats', () => {
    assert.deepEqual(tags('Warm, Smoky; Sweet\nWarm|WOODY'), ['Warm', 'Smoky', 'Sweet', 'WOODY']);
    assert.deepEqual(tags(['Fresh', 'fresh', ' Floral ']), ['fresh', 'Floral']);
    assert.deepEqual(tags(null), []); assert.deepEqual(tags({ value: 'wrong' }), []);
    assert.equal(normalize('  BOLD    & BRIGHT '), 'bold & bright');
    assert.equal(normalize('Ｓｏｆｔ'), 'soft');
  });
  test('Five questions derive from the six real starter profiles', () => {
    const questions = questionsFor(profiles);
    assert.deepEqual(questions.map(question => question.key), ['collection', 'mood', 'character', 'occasion', 'intensity']);
    assert.deepEqual(questions[0].options, ['Women', 'Men']);
    assert(questions.every(question => question.options.length && question.skip));
    assert.equal(new Set(profiles.map(profile => profile.handle)).size, 6);
  });
  test('Collection hard filter normalizes values and allows an open-browsing skip', () => {
    assert.deepEqual(poolFor(profiles, { collection: ' women ' }).map(profile => profile.handle).sort(),
      ['mojito-metallique', 'amber-oud-silk', 'mistened-narcissus'].sort());
    assert.deepEqual(poolFor(profiles, { collection: 'MEN' }).map(profile => profile.handle).sort(),
      ['oud-mirage', 'charme-envoutant', 'rtulle-satin'].sort());
    assert.equal(poolFor(profiles, { collection: '' }).length, 6);
    assert.equal(poolFor(profiles, {}).length, 6);
    assert.deepEqual(poolFor(profiles, { collection: 'Unknown collection' }), []);
    const results = rank(profiles, { collection: 'Women', mood: 'Dark & bold', character: 'Rose & woods', occasion: 'Evenings out', intensity: 'Rich & deep' });
    assert(results.length > 0);
    assert(results.every(result => result.profile.collection === 'Women'), 'A strong style match cannot leak across collection choice');
  });
  test('Later choices narrow to the selected collection while collection options stay available', () => {
    const women = questionsFor(profiles, { collection: 'Women' });
    assert.deepEqual(women.find(question => question.key === 'collection').options, ['Women', 'Men']);
    const styles = women.find(question => question.key === 'character').options;
    assert(styles.includes('Creamy & fruity'));
    assert(!styles.includes('Rose & woods')); assert(!styles.includes('Airy sweetness'));
    assert(questionsFor(profiles, { collection: '' }).find(question => question.key === 'character').options.includes('Rose & woods'));
  });
  test('Style has highest individual weight and outranks combined occasion and feel', () => {
    const questions = questionsFor(profiles);
    const styleWeight = questions.find(question => question.key === 'character').weight;
    for (const question of questions.filter(question => question.key !== 'character')) assert(styleWeight > question.weight);
    const candidates = [{ id: 'style', character: 'My style' }, { id: 'mood', mood: 'My mood' },
      { id: 'moment-and-feel', occasion: 'My plans', intensity: 'My feel' }];
    const ranked = rank(candidates, { character: 'My style', mood: 'My mood', occasion: 'My plans', intensity: 'My feel' });
    assert.deepEqual(ranked.map(result => result.profile.id), ['style', 'mood', 'moment-and-feel']);
    assert(ranked[0].score > ranked[2].score);
  });
  test('Skipped choices never manufacture matches or scores', () => {
    const skips = { collection: '', mood: '', character: '', occasion: '', intensity: '' };
    assert.deepEqual(rank(profiles, skips), []); assert.deepEqual(rank(profiles, {}), []);
    assert.deepEqual(rank(profiles, { collection: 'Men' }), []);
    assert.equal(poolFor(profiles, { ...skips, collection: 'Men' }).length, 3);
    const partial = rank(profiles, { ...skips, character: 'Juicy berries' });
    assert.deepEqual(partial.map(result => result.profile.handle), ['mistened-narcissus']);
    assert.deepEqual(partial[0].matches, ['Juicy berries']);
    assert.deepEqual(rank(profiles, { mood: 'Not a configured trait' }), []);
  });
  test('Ties remain stable and repeated matching labels are explained once', () => {
    const repeated = [{ id: 1, mood: 'Warm', character: 'Warm' }, { id: 2, mood: 'warm', character: 'Warm' }];
    const results = rank(repeated, { mood: 'Warm', character: 'Warm' });
    assert.deepEqual(results.map(result => result.profile.id), [1, 2]);
    assert.deepEqual(results[0].matches, ['Warm']);
  });
  for (const profile of profiles) test(`${profile.handle} is reachable as top match with its own traits`, () => {
    let combinations = [{}];
    for (const key of ['mood', 'character', 'occasion', 'intensity']) {
      combinations = combinations.flatMap(answer => tags(profile[key]).map(value => ({ ...answer, [key]: value })));
    }
    assert(combinations.length > 0);
    // Reverse catalog order so reaching a scent cannot depend on its normal index.
    const winning = combinations.find(answer => rank([...profiles].reverse(), { ...answer, collection: profile.collection })[0]?.profile.handle === profile.handle);
    assert(winning, `${profile.handle} is unreachable as top result with its configured traits`);
    const results = rank([...profiles].reverse(), { ...winning, collection: profile.collection });
    assert.equal(results[0].profile.handle, profile.handle);
    assert.equal(results[0].score, questionsFor(profiles).reduce((sum, question) => sum + question.weight, 0));
    assert(results.every(result => result.profile.collection === profile.collection));
  });
  console.log(`Finder scoring QA: ${scenarios} scenarios passed, including all six native-profile top-match paths.`);
}
run().catch(error => { console.error(error); process.exitCode = 1; });
