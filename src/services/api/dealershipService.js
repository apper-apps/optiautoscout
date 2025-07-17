import dealershipsData from "@/services/mockData/dealerships.json";

class DealershipService {
  constructor() {
    this.dealerships = [...dealershipsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.dealerships];
  }

  async getById(id) {
    await this.delay();
    const dealership = this.dealerships.find(d => d.Id === parseInt(id));
    if (!dealership) {
      throw new Error("Dealership not found");
    }
    return { ...dealership };
  }
}

export default new DealershipService();