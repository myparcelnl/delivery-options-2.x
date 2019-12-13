import { prepareCarriers } from '@/config/prepareCarriers';

/**
 * @var prepareCarriersSpec
 * @link prepareCarriers
 */
describe('prepareCarriers', () => {
  test.each`
    config                                                     | expectation
    ${{}}                                                      | ${[]}
    ${{ carrierSettings: {} }}                                 | ${[]}
    ${{ carrierSettings: { postnl: {} } }}                     | ${['postnl']}
    ${{ carrierSettings: { postnl: {}, bpost: {} } }}          | ${['postnl', 'bpost']}
    ${{ carrierSettings: { postnl: {}, bpost: {}, dpd: {} } }} | ${['postnl', 'bpost', 'dpd']}
  `('carrierSettings: $config.carrierSettings returns $expectation',
  ({ config, expectation }) => {
    expect(prepareCarriers({ config })).toEqual(expectation);
  });
});
