import savedSearchesData from "@/services/mockData/savedSearches.json";

class SavedSearchService {
  constructor() {
    this.savedSearches = [...savedSearchesData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.savedSearches];
  }

  async getById(id) {
    await this.delay();
    const search = this.savedSearches.find(s => s.Id === parseInt(id));
    if (!search) {
      throw new Error("Saved search not found");
    }
    return { ...search };
  }

  async create(searchData) {
    await this.delay();
    const newSearch = {
      Id: Math.max(...this.savedSearches.map(s => s.Id)) + 1,
      ...searchData,
      createdAt: new Date().toISOString().split('T')[0],
      lastRun: new Date().toISOString().split('T')[0]
    };
    this.savedSearches.push(newSearch);
    return { ...newSearch };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.savedSearches.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Saved search not found");
    }
    this.savedSearches[index] = { ...this.savedSearches[index], ...updateData };
    return { ...this.savedSearches[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.savedSearches.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Saved search not found");
    }
    this.savedSearches.splice(index, 1);
    return true;
  }
}

export default new SavedSearchService();