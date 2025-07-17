import vehiclesData from "@/services/mockData/vehicles.json";

class VehicleService {
  constructor() {
    this.vehicles = [...vehiclesData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.vehicles];
  }

  async getById(id) {
    await this.delay();
    const vehicle = this.vehicles.find(v => v.Id === parseInt(id));
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }
    return { ...vehicle };
  }

  async search(filters = {}) {
    await this.delay();
    let filteredVehicles = [...this.vehicles];

    if (filters.make && filters.make.length > 0) {
      filteredVehicles = filteredVehicles.filter(v => 
        filters.make.includes(v.make)
      );
    }

    if (filters.model) {
      filteredVehicles = filteredVehicles.filter(v => 
        v.model.toLowerCase().includes(filters.model.toLowerCase())
      );
    }

    if (filters.minYear) {
      filteredVehicles = filteredVehicles.filter(v => v.year >= filters.minYear);
    }

    if (filters.maxYear) {
      filteredVehicles = filteredVehicles.filter(v => v.year <= filters.maxYear);
    }

    if (filters.minPrice) {
      filteredVehicles = filteredVehicles.filter(v => v.price >= filters.minPrice);
    }

    if (filters.maxPrice) {
      filteredVehicles = filteredVehicles.filter(v => v.price <= filters.maxPrice);
    }

    if (filters.maxMileage) {
      filteredVehicles = filteredVehicles.filter(v => v.mileage <= filters.maxMileage);
    }

    if (filters.bodyType && filters.bodyType.length > 0) {
      filteredVehicles = filteredVehicles.filter(v => 
        filters.bodyType.includes(v.bodyType)
      );
    }

    if (filters.fuelType && filters.fuelType.length > 0) {
      filteredVehicles = filteredVehicles.filter(v => 
        filters.fuelType.includes(v.fuelType)
      );
    }

    if (filters.transmission && filters.transmission.length > 0) {
      filteredVehicles = filteredVehicles.filter(v => 
        filters.transmission.includes(v.transmission)
      );
}

    if (filters.condition && filters.condition.length > 0) {
      filteredVehicles = filteredVehicles.filter(v => 
        filters.condition.includes(v.condition)
      );
    }

    return filteredVehicles;
  }

  async getByIds(ids) {
    await this.delay();
    const vehicles = this.vehicles.filter(v => 
      ids.map(id => parseInt(id)).includes(v.Id)
    );
    return vehicles.map(v => ({ ...v }));
  }

  getMakes() {
    const makes = [...new Set(this.vehicles.map(v => v.make))];
    return makes.sort();
  }

  getModelsForMake(make) {
    const models = [...new Set(
      this.vehicles
        .filter(v => v.make === make)
        .map(v => v.model)
    )];
    return models.sort();
  }

  getYearRange() {
    const years = this.vehicles.map(v => v.year);
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    };
  }

  getPriceRange() {
    const prices = this.vehicles.map(v => v.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }
}

export default new VehicleService();