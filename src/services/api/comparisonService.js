import comparisonsData from "@/services/mockData/comparisons.json";

class ComparisonService {
  constructor() {
    this.comparisons = [...comparisonsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.comparisons];
  }

  async getById(id) {
    await this.delay();
    const comparison = this.comparisons.find(c => c.Id === parseInt(id));
    if (!comparison) {
      throw new Error("Comparison not found");
    }
    return { ...comparison };
  }

  async create(comparisonData) {
    await this.delay();
    const newComparison = {
      Id: Math.max(...this.comparisons.map(c => c.Id)) + 1,
      ...comparisonData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.comparisons.push(newComparison);
    return { ...newComparison };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.comparisons.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comparison not found");
    }
    this.comparisons[index] = { ...this.comparisons[index], ...updateData };
    return { ...this.comparisons[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.comparisons.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comparison not found");
    }
    this.comparisons.splice(index, 1);
    return true;
  }
}

export default new ComparisonService();