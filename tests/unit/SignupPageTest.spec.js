import { shallowMount } from '@vue/test-utils';
import SignupPage from '@/views/SignupView.vue';
import LoginComponent from '@/components/LoginComponent.vue';

describe('SignupView.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SignupPage, {
      stubs: {
        LoginComponent: true
      }
    });
  });

  it('renders LoginComponent', () => {
    expect(wrapper.findComponent(LoginComponent).exists()).toBe(true);
  });

  it('renders input fields correctly', () => {
    const benutzernameInput = wrapper.find('input[name="benutzername"]');
    const emailInput = wrapper.find('input[name="email"]');
    const passwordInput = wrapper.find('input[name="password"]');

    expect(benutzernameInput.exists()).toBe(true);
    expect(emailInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);

    expect(benutzernameInput.attributes('type')).toBe('text');
    expect(emailInput.attributes('type')).toBe('email');
    expect(passwordInput.attributes('type')).toBe('password');

    expect(benutzernameInput.attributes('placeholder')).toBe(' Benutzername');
    expect(emailInput.attributes('placeholder')).toBe(' E-Mail');
    expect(passwordInput.attributes('placeholder')).toBe(' Password');
  });

  it('renders buttons correctly', () => {
    const cancelButton = wrapper.find('button.abbrechen');
    const continueButton = wrapper.find('button.weiter');

    expect(cancelButton.exists()).toBe(true);
    expect(continueButton.exists()).toBe(true);

    expect(cancelButton.text()).toBe('abbrechen');
    expect(continueButton.text()).toBe('weiter');
  });

  it('renders terms and privacy policy text', () => {
    const termsText = wrapper.find('p').text();
    expect(termsText).toContain('By signing up, you agree to our Terms. See how we use your data in our Privacy Policy.');
  });
});
