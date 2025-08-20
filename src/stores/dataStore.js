import { defineStore } from 'pinia';
import data from '../assets/data/data.json';

export const useDataStore = defineStore('data', {
  state: () => ({
    data
  }),
  getters: {
    headerNav: (state) => state.data.headerNav,
    footerLinks: (state) => state.data.footerLinks,
    customLinks: (state) => state.data.customLinks,
    meminfoLinks: (state) => state.data.meminfoLinks
  }
});
