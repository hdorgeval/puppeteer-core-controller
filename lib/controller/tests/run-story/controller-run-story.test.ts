import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
import * as path from 'path';

describe('Puppeteer Controller', (): void => {
  let pptc: SUT.PuppeteerController;
  beforeEach((): void => {
    jest.setTimeout(30000);
    pptc = new SUT.PuppeteerController();
  });
  afterEach(
    async (): Promise<void> => {
      await pptc.close();
    },
  );

  test('should select an existing option', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const customSelect = 'select#exampleCustomSelect';
    const option = 'Value 3';
    const openApplication: SUT.Story = async (pptc) => {
      // prettier-ignore
      await pptc
        .initWith(launchOptions)
        .navigateTo(url);
    };

    const fillForm: SUT.Story = async (pptc) => {
      await pptc
        .click(customSelect)
        .select(option)
        .in(customSelect);
    };

    // When
    // prettier-ignore
    await pptc
      .runStory(openApplication)
      .runStory(fillForm);

    // Then
    const selectedOption = await pptc.getSelectedOptionOf(customSelect);
    expect(selectedOption?.label).toBe(option);
    expect(pptc.lastError).toBe(undefined);
  });

  test('parameterized story', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';

    interface StartOptions {
      launchOptions: LaunchOptions;
      url: string;
    }
    const customSelect = 'select#exampleCustomSelect';
    const option = 'Value 3';
    const params: StartOptions = { launchOptions, url };

    const openApplication: SUT.StoryWithProps<StartOptions> = async (pptc, props) => {
      // prettier-ignore
      await pptc
        .initWith(props.launchOptions)
        .navigateTo(props.url);
    };

    const fillForm: SUT.Story = async (pptc) => {
      await pptc
        .click(customSelect)
        .select(option)
        .in(customSelect);
    };

    // When
    // prettier-ignore
    await pptc
      .runStory(openApplication, params)
      .runStory(fillForm);

    // Then
    const selectedOption = await pptc.getSelectedOptionOf(customSelect);
    expect(selectedOption?.label).toBe(option);
    expect(pptc.lastError).toBe(undefined);
  });

  test('parameterized story of type string with empty value', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-run-story.test.html')}`;

    interface StartOptions {
      launchOptions: LaunchOptions;
      url: string;
    }
    const customSelect = 'select#selectWithBlankOption';
    const params: StartOptions = { launchOptions, url };

    const openApplication: SUT.StoryWithProps<StartOptions> = async (pptc, props) => {
      // prettier-ignore
      await pptc
        .initWith(props.launchOptions)
        .navigateTo(props.url);
    };

    const selectOption: SUT.StoryWithProps<string> = async (pptc, optionToBeSelected) => {
      await pptc
        .expectThat(customSelect)
        .isVisible()
        .expectThat(customSelect)
        .isEnabled()
        .hover(customSelect)
        .click(customSelect)
        .select(optionToBeSelected)
        .in(customSelect);
    };

    // When
    // prettier-ignore
    await pptc
      .runStory(openApplication, params)
      .runStory(selectOption, '');

    // Then
    const selectedOption = await pptc.getSelectedOptionOf(customSelect);
    expect(selectedOption?.label).toBe('');
    expect(pptc.lastError).toBe(undefined);
  });
});
