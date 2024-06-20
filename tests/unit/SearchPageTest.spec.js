import { shallowMount } from '@vue/test-utils';
import SearchPage from '@/views/SucheView.vue';
import LoginComponent from '@/components/LoginComponent.vue';
import SearchComponent from '@/components/SearchComponent.vue';


describe('SucheView.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SearchPage, {
      stubs: {
        LoginComponent: true,
        SearchComponent: true,
      }
    });
  });

  it('renders LoginComponent', () => {
    expect(wrapper.findComponent(LoginComponent).exists()).toBe(true);
  });
  it('renders SearchComponent', () => {
    expect(wrapper.findComponent(SearchComponent).exists()).toBe(true);
  });

  it('renders profile and mail icons', () => {
    const profileIcon = wrapper.find('img[alt="Dein Profil"]');
    const mailIcon = wrapper.find('img[alt="Dein Postfach"]');
    expect(profileIcon.exists()).toBe(true);
    expect(mailIcon.exists()).toBe(true);
  });

  it('renders "Event erstellen" button', () => {
    const button = wrapper.find('button#new-event-button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('Event erstellen');
  });
});
