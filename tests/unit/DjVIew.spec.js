import { shallowMount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import DjView from '@/views/DjView.vue';

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

describe('DjView.vue', () => {
  let wrapper;

  beforeEach(async () => {
    router.push('/');
    await router.isReady();
    wrapper = shallowMount(DjView, {
      global: {
        plugins: [router]
      },
      data() {
        return {
          name: 'Test DJ',
          sterne: 5,
          kurzbeschreibung: 'Kurzbeschreibung',
          beschreibung: 'Beschreibung',
          region: 'Test Region',
          kategorie: 'Kategorie',
          erfahrung: '10 Jahre',
          preis: '200',
          imagePreview: null,
          id: '123',
          userId: 'user123',
          reviewType: 0,
          events: [{ id: 1, name: 'Event 1' }],
          songs: [{ id: 1, songName: 'Song 1', songLength: '3:30', songYear: '2022' }],
          reviews: [],
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

  it('renders header component', () => {
    const header = wrapper.findComponent({ name: 'Header' });
    expect(header.exists()).toBe(true);
  });

  it('renders main description', () => {
    const description = wrapper.find('.description');
    expect(description.exists()).toBe(true);
    expect(description.text()).toContain('Nächste Events:');
  });

  it('renders "Event Erstellen" button with correct text', () => {
    const button = wrapper.find('#ticket');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('Event Erstellen');
  });
});
