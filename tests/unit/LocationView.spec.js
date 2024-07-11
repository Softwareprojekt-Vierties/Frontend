import { shallowMount } from '@vue/test-utils';
import LocationView from '@/views/LocationView.vue';
import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router';

jest.mock('axios');

describe('LocationView.vue', () => {
  let wrapper;
  let router;

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'Home',
          component: { template: '<div>Home</div>' },
        },
      ],
    });

    router.push('/');
    await router.isReady();

    axios.get.mockResolvedValue({
      data: {
        result: {
          rows: [{
            name: 'Test Location',
            kurzbeschreibung: 'Test Kurzbeschreibung',
            beschreibung: 'Test Beschreibung',
            adresse: 'Teststrasse 123, Teststadt',
            kapazitaet: '100',
            preis: '200',
            flaeche: '300',
            openair: true,
            bild: 'path/to/image.jpg',
            sterne: 5,
            favorit: true,
            id: 1
          }]
        },
        isOwner: true
      }
    });

    wrapper = shallowMount(LocationView, {
      global: {
        plugins: [router]
      }
    });
  });

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the Header component', () => {
    const header = wrapper.findComponent({ name: 'Header' });
    expect(header.exists()).toBe(true);
  });

  it('renders the LongDescription component', () => {
    const longDescription = wrapper.findComponent({ name: 'LongDescription' });
    expect(longDescription.exists()).toBe(true);
  });

  it('renders the Info component', () => {
    const info = wrapper.findComponent({ name: 'Info' });
    expect(info.exists()).toBe(true);
  });

  it('renders the DishForm component if id is present', async () => {
    await wrapper.setData({ id: 1 });
    const dishForm = wrapper.findComponent({ name: 'DishForm' });
    expect(dishForm.exists()).toBe(true);
  });

  it('toggles popup visibility when togglePopup is called', async () => {
    expect(wrapper.vm.showPopup).toBe(false);
    await wrapper.vm.togglePopup();
    expect(wrapper.vm.showPopup).toBe(true);
    await wrapper.vm.togglePopup();
    expect(wrapper.vm.showPopup).toBe(false);
  });

  it('renders the button with correct label based on ownership', async () => {
    await wrapper.setData({ isOwner: true });
    expect(wrapper.find('#ticket').text()).toBe('Edit Location');
    await wrapper.setData({ isOwner: false });
    expect(wrapper.find('#ticket').text()).toBe('Event Erstellen');
  });

  it('fetches data correctly on created hook', async () => {
    expect(axios.get).toHaveBeenCalled();
    await wrapper.vm.$nextTick(); // wait for next DOM update cycle
    expect(wrapper.vm.name).toBe('Test Location');
    expect(wrapper.vm.kurzbeschreibung).toBe('Test Kurzbeschreibung');
  });
});
