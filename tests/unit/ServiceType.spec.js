import { shallowMount } from '@vue/test-utils';
import ServiceTypeView from '@/views/ServiceTypeView.vue'


describe('ServiceTypeView.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ServiceTypeView);
  });

  it('should render LoginComponent correctly', () => {
    expect(wrapper.findComponent({ name: 'LoginComponent' }).exists()).toBe(true);
  });

  it('should render the "DJ/Bands" button', () => {
    expect(wrapper.find('button.buttonPerson').exists()).toBe(true);
  });

  it('should render the "Caterer" button', () => {
    expect(wrapper.find('button.buttonDienst').exists()).toBe(true);
  });

  it('should render the terms and conditions text', () => {
    expect(wrapper.find('p').text()).toBe('By signing up, you agree to our Terms. See how we use your data in our Privacy Policy.');
  });
});
