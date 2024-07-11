import { shallowMount } from '@vue/test-utils';
import EventurePostfach from '@/views/EmailView.vue';

describe('EventurePostfach.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(EventurePostfach, {
      data() {
        return {
          isDarkMode: false,
          mailList: [
            {
              id: 1,
              sendername: 'John Doe',
              anfragetyp: 'INFO',
              senderprofilbild: 'path/to/image.jpg',
              gelesen: false,
              angenommen: null,
            },
          ],
          searchQuery: '',
          selectedMailId: null,
          showInnerContent: false,
          formattedText: '',
          mailHeadline: '',
          buttonsDisabled: false,
        };
      },
    });
  });

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the HomeButton component', () => {
    const homeButton = wrapper.findComponent({ name: 'HomeButton' });
    expect(homeButton.exists()).toBe(true);
  });

  it('renders the Eventure logo', () => {
    const logo = wrapper.find('#logo');
    expect(logo.exists()).toBe(true);
    expect(logo.attributes('alt')).toBe('Eventure Logo');
  });

  it('renders the search input', () => {
    const searchInput = wrapper.find('input[placeholder="suchen"]');
    expect(searchInput.exists()).toBe(true);
  });

  it('renders the DishForm component for each mail', () => {
    const dishForms = wrapper.findAllComponents({ name: 'DishForm' });
    expect(dishForms.length).toBe(wrapper.vm.mailList.length);
  });

  it('renders mail headline and formatted text when showInnerContent is true', async () => {
    await wrapper.setData({ showInnerContent: true, mailHeadline: 'Test Headline', formattedText: 'Test Text' });
    const mailHeadline = wrapper.find('#mail-headline');
    const formattedText = wrapper.find('#formatted-text');
    expect(mailHeadline.exists()).toBe(true);
    expect(mailHeadline.text()).toBe('Test Headline');
    expect(formattedText.exists()).toBe(true);
    expect(formattedText.text()).toBe('Test Text');
  });

  it('renders accept and decline buttons', async () => {
    await wrapper.setData({ showInnerContent: true });
    const acceptButton = wrapper.find('#annehmen');
    const declineButton = wrapper.find('#ablehnen');
    expect(acceptButton.exists()).toBe(true);
    expect(declineButton.exists()).toBe(true);
  });
});
