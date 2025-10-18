import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  /**
   * Helper function to apply a consistent factor to a numeric value
   * @param baseValue - The original value
   * @param factor - The multiplication factor to apply (e.g., 0.8 = -20%, 1.2 = +20%)
   */
  private applyFactor(baseValue: number, factor: number): number {
    return Math.round(baseValue * factor);
  }

  /**
   * Base dummy analytics data structure
   * This is the template that will be randomized on each request
   */
  private readonly baseDummyAnalyticsData = {
    resumen: {
      totalEnPeriodo: 53261,
    },
    tramitesPorTipo: [
      { nombre: 'Adhesión a Tarifa Social', valor: 6870 },
      { nombre: 'Baja del servicio', valor: 5375 },
      { nombre: 'Baja de Suministro T1-R', valor: 5375 },
      { nombre: 'Adhesión a factura digital', valor: 4950 },
      { nombre: 'Actualización de datos impositivos', valor: 3255 },
      { nombre: 'Actualización de condición de A...', valor: 2715 },
      { nombre: 'Otros', valor: 24721 },
    ],
    tramitesPorFecha: [
      {
        fecha: '08/07/2020',
        total: 1789,
        'Actualización de datos': 883,
        'Baja del servicio': 545,
        'Adhesión a Tarifa Social': 361,
      },
      {
        fecha: '15/07/2020',
        total: 2018,
        'Actualización de datos': 1005,
        'Baja del servicio': 650,
        'Adhesión a Tarifa Social': 363,
      },
      {
        fecha: '28/07/2020',
        total: 2225,
        'Actualización de datos': 1100,
        'Baja del servicio': 800,
        'Adhesión a Tarifa Social': 325,
      },
    ],
  };

  /**
   * Get analytics data with randomized values
   * Returns the same structure but with all values adjusted by the same percentage
   * Ensures that sums remain consistent (tramitesPorTipo sum = totalEnPeriodo, etc.)
   */
  getAnalyticsData() {
    // Generate a single random factor between 0.7 and 1.3 (±30%)
    const minFactor = 0.7; // -30%
    const maxFactor = 1.3; // +30%
    const globalFactor = minFactor + Math.random() * (maxFactor - minFactor);

    // Apply the same factor to all tramitesPorTipo values
    const tramitesPorTipo = this.baseDummyAnalyticsData.tramitesPorTipo.map(
      (item) => ({
        nombre: item.nombre,
        valor: this.applyFactor(item.valor, globalFactor),
      }),
    );

    // Calculate totalEnPeriodo as the sum of all tramitesPorTipo values
    const totalEnPeriodo = tramitesPorTipo.reduce(
      (sum, item) => sum + item.valor,
      0,
    );

    // Apply the same factor to tramitesPorFecha
    const tramitesPorFecha = this.baseDummyAnalyticsData.tramitesPorFecha.map(
      (item) => {
        const actualizacionDatos = this.applyFactor(
          item['Actualización de datos'],
          globalFactor,
        );
        const bajaServicio = this.applyFactor(
          item['Baja del servicio'],
          globalFactor,
        );
        const adhesionTarifa = this.applyFactor(
          item['Adhesión a Tarifa Social'],
          globalFactor,
        );

        // Calculate total as the sum of the three fields
        const total = actualizacionDatos + bajaServicio + adhesionTarifa;

        return {
          fecha: item.fecha,
          total,
          'Actualización de datos': actualizacionDatos,
          'Baja del servicio': bajaServicio,
          'Adhesión a Tarifa Social': adhesionTarifa,
        };
      },
    );

    return {
      resumen: {
        totalEnPeriodo,
      },
      tramitesPorTipo,
      tramitesPorFecha,
    };
  }
}
