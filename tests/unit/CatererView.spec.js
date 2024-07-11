import { shallowMount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import CatererView from '@/views/CatererView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: { template: '<div>Home</div>' }
  },
  {
    path: '/createEvent',
    name: 'CreateEvent',
    component: { template: '<div>Create Event</div>' }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

describe('CatererView.vue', () => {
  let wrapper;

  beforeEach(async () => {
    router.push('/');
    await router.isReady();
    wrapper = shallowMount(CatererView, {
      global: {
        plugins: [router]
      },
      data() {
        return {
          name: 'Test Name',
          sterne: 0,
          kurzbeschreibung: 'Kurzbeschreibung',
          beschreibung: 'Beschreibung',
          region: 'Test Region',
          kategorie: 'Kategorie',
          erfahrung: '5',
          preis: '100',
          imagePreview: null,
          id: '123',
          userId: 'user123',
          reviewType: 0,
          events: [],
          idSent: '123',
          isOwner: false,
          hasBookmark: false,
          kindOfReview: 'user',
          showPopup: false
        };
      }
    });
  });

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders "Event erstellen" button', () => {
    const button = wrapper.find('#ticket');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('Event Erstellen');
  });
});
