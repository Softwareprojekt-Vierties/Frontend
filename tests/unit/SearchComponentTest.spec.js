import { shallowMount } from '@vue/test-utils';
import SearchComponent from '@/components/SearchComponent.vue';
import CardComponent from '@/components/CardComponent.vue';

describe('SearchComponent.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(SearchComponent, {
            stubs: {
                CardComponent: true,
            }
        });
    });

    it('renders search bar and icons', () => {
        const searchBar = wrapper.find('input#searchbar');
        const filterIcon = wrapper.find('img[alt="Filter"]');
        const magnifyingGlassIcon = wrapper.find('img[alt="Magnifying Glass"]');
        expect(searchBar.exists()).toBe(true);
        expect(filterIcon.exists()).toBe(true);
        expect(magnifyingGlassIcon.exists()).toBe(true);
    });
});
