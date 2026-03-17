import { Car } from "../navigation/car";
import { AdvancedFilters } from "../components/AdvancedSearchModal";

/**
 * Utilitário para Filtros Avançados
 *
 * Aplica todos os filtros complexos nos carros
 */

export class AdvancedFilterHelper {
  /**
   * Aplica todos os filtros avançados
   */
  static applyFilters(
    cars: Car[],
    filters: AdvancedFilters,
    searchQuery: string = "",
  ): Car[] {
    let filtered = [...cars];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (car) =>
          car.name.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query) ||
          car.carModel.toLowerCase().includes(query),
      );
    }

    filtered = filtered.filter(
      (car) =>
        car.price >= filters.priceRange.min &&
        car.price <= filters.priceRange.max,
    );

    filtered = filtered.filter(
      (car) =>
        car.horsepower >= filters.horsepowerRange.min &&
        car.horsepower <= filters.horsepowerRange.max,
    );

    filtered = filtered.filter(
      (car) =>
        car.maxSpeed >= filters.maxSpeedRange.min &&
        car.maxSpeed <= filters.maxSpeedRange.max,
    );

    filtered = filtered.filter(
      (car) =>
        car.year >= filters.yearRange.min && car.year <= filters.yearRange.max,
    );

    if (filters.brands.length > 0) {
      filtered = filtered.filter((car) => filters.brands.includes(car.brand));
    }

    if (filters.fuelTypes.length > 0) {
      filtered = filtered.filter((car) =>
        filters.fuelTypes.includes(car.fuelType),
      );
    }

    if (filters.transmissions.length > 0) {
      filtered = filtered.filter((car) =>
        filters.transmissions.includes(car.transmission),
      );
    }

    if (filters.drivetrains.length > 0) {
      filtered = filtered.filter((car) =>
        filters.drivetrains.includes(car.drivetrain),
      );
    }

    return filtered;
  }

  /**
   * Conta quantos filtros estão ativos
   */
  static countActiveFilters(
    filters: AdvancedFilters,
    defaults: AdvancedFilters,
  ): number {
    let count = 0;

    if (
      filters.priceRange.min !== defaults.priceRange.min ||
      filters.priceRange.max !== defaults.priceRange.max
    )
      count++;

    if (
      filters.horsepowerRange.min !== defaults.horsepowerRange.min ||
      filters.horsepowerRange.max !== defaults.horsepowerRange.max
    )
      count++;

    if (
      filters.maxSpeedRange.min !== defaults.maxSpeedRange.min ||
      filters.maxSpeedRange.max !== defaults.maxSpeedRange.max
    )
      count++;

    if (
      filters.yearRange.min !== defaults.yearRange.min ||
      filters.yearRange.max !== defaults.yearRange.max
    )
      count++;

    if (filters.brands.length > 0) count++;
    if (filters.fuelTypes.length > 0) count++;
    if (filters.transmissions.length > 0) count++;
    if (filters.drivetrains.length > 0) count++;

    return count;
  }

  /**
   * Verifica se há filtros ativos
   */
  static hasActiveFilters(
    filters: AdvancedFilters,
    defaults: AdvancedFilters,
  ): boolean {
    return this.countActiveFilters(filters, defaults) > 0;
  }

  /**
   * Retorna resumo dos filtros ativos
   */
  static getFiltersSummary(
    filters: AdvancedFilters,
    defaults: AdvancedFilters,
  ): string[] {
    const summary: string[] = [];

    if (
      filters.priceRange.min !== defaults.priceRange.min ||
      filters.priceRange.max !== defaults.priceRange.max
    ) {
      const minM = (filters.priceRange.min / 1000000).toFixed(1);
      const maxM = (filters.priceRange.max / 1000000).toFixed(1);
      summary.push(`Preço: R$ ${minM}M - ${maxM}M`);
    }

    if (
      filters.horsepowerRange.min !== defaults.horsepowerRange.min ||
      filters.horsepowerRange.max !== defaults.horsepowerRange.max
    ) {
      summary.push(
        `Potência: ${filters.horsepowerRange.min}-${filters.horsepowerRange.max} cv`,
      );
    }

    if (
      filters.maxSpeedRange.min !== defaults.maxSpeedRange.min ||
      filters.maxSpeedRange.max !== defaults.maxSpeedRange.max
    ) {
      summary.push(
        `Velocidade: ${filters.maxSpeedRange.min}-${filters.maxSpeedRange.max} km/h`,
      );
    }

    if (
      filters.yearRange.min !== defaults.yearRange.min ||
      filters.yearRange.max !== defaults.yearRange.max
    ) {
      summary.push(`Ano: ${filters.yearRange.min}-${filters.yearRange.max}`);
    }

    if (filters.brands.length > 0) {
      if (filters.brands.length === 1) {
        summary.push(`Marca: ${filters.brands[0]}`);
      } else {
        summary.push(`${filters.brands.length} marcas`);
      }
    }

    if (filters.fuelTypes.length > 0) {
      if (filters.fuelTypes.length === 1) {
        summary.push(`Combustível: ${filters.fuelTypes[0]}`);
      } else {
        summary.push(`${filters.fuelTypes.length} combustíveis`);
      }
    }

    if (filters.transmissions.length > 0) {
      if (filters.transmissions.length === 1) {
        summary.push(`Transmissão: ${filters.transmissions[0]}`);
      } else {
        summary.push(`${filters.transmissions.length} transmissões`);
      }
    }

    if (filters.drivetrains.length > 0) {
      if (filters.drivetrains.length === 1) {
        summary.push(`Tração: ${filters.drivetrains[0]}`);
      } else {
        summary.push(`${filters.drivetrains.length} trações`);
      }
    }

    return summary;
  }

  /**
   * Cria filtros padrão (sem filtros aplicados)
   */
  static createDefaultFilters(): AdvancedFilters {
    return {
      priceRange: { min: 0, max: 50000000 },
      horsepowerRange: { min: 0, max: 1500 },
      maxSpeedRange: { min: 0, max: 500 },
      yearRange: { min: 1950, max: new Date().getFullYear() + 1 },
      brands: [],
      fuelTypes: [],
      transmissions: [],
      drivetrains: [],
    };
  }

  /**
   * Extrai marcas únicas dos carros
   */
  static extractUniqueBrands(cars: Car[]): string[] {
    const brands = new Set(cars.map((car) => car.brand));
    return Array.from(brands).sort();
  }

  /**
   * Extrai tipos de combustível únicos
   */
  static extractUniqueFuelTypes(cars: Car[]): string[] {
    const fuelTypes = new Set(cars.map((car) => car.fuelType));
    return Array.from(fuelTypes).sort();
  }

  /**
   * Extrai transmissões únicas
   */
  static extractUniqueTransmissions(cars: Car[]): string[] {
    const transmissions = new Set(cars.map((car) => car.transmission));
    return Array.from(transmissions).sort();
  }

  /**
   * Extrai trações únicas
   */
  static extractUniqueDrivetrains(cars: Car[]): string[] {
    const drivetrains = new Set(cars.map((car) => car.drivetrain));
    return Array.from(drivetrains).sort();
  }
}