import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import AnmeldungView from '@/views/AnmeldungView.vue';
import LoginComponent from '@/components/LoginComponent.vue';


jest.mock('axios');

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('AnmeldungView.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(AnmeldungView, {
      stubs: ['LoginComponent']
    });
  });

  it('renders LoginComponent', () => {
    expect(wrapper.findComponent(LoginComponent).exists()).toBe(true);
  });

  it('initializes with correct elements', () => {
    expect(wrapper.find('input[name="benutzername"]').exists()).toBe(true);
    expect(wrapper.find('input[name="password"]').exists()).toBe(true);
    expect(wrapper.find('button.kontoAnlegen').exists()).toBe(true);
    expect(wrapper.find('button.weiter').exists()).toBe(true);
  });


  it('login method works correctly', async () => {
    wrapper.setData({ benutzername: 'user', password: '123456' });
    const response = { data: 'mockToken' };
    axios.post.mockResolvedValue(response);

    await wrapper.vm.login();

    expect(axios.post).toHaveBeenCalledWith('/login', {
      email: 'user',
      pass: '123456'
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'mockToken');
  });

  it('login method handles errors correctly', async () => {
    wrapper.setData({ benutzername: 'user', password: '123456' });
    const error = {
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    };
    axios.post.mockRejectedValue(error);
  
    await wrapper.vm.login();  
  
    expect(axios.post).toHaveBeenCalledWith('/login', {
      email: 'user',
      pass: '123456'
    });
    
    
  });

});
