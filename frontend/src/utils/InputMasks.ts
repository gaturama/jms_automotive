/**
 * Máscaras de Formatação de Inputs
 *
 * Formata imputs em tempo real enquanto o usuário digita
 */

export class InputMasks {
  /**
   * Formata telefone: (11) 98765-4321
   */
  static formatPhone(value: string): string {
    const numbers = value.replace(/\D/g, "");

    const truncated = numbers.slice(0, 11);

    if (truncated.length <= 2) {
      return truncated.length > 0 ? `(${truncated}` : "";
    } else if (truncated.length <= 7) {
      return `(${truncated.slice(0, 2)}) ${truncated.slice(2)}`;
    } else {
      return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 7)}-${truncated.slice(7)}`;
    }
  }

  /**
   * Remove a formatação do telefone, retorna apenas números
   */
  static unformatPhone(value: string): string {
    return value.replace(/\D/g, "");
  }

  /**
   * Formata data: 10/03/2026
   */
  static formatDate(value: string): string {
    const numbers = value.replace(/\D/g, "");

    const truncated = numbers.slice(0, 8);

    if (truncated.length <= 2) {
      return truncated;
    } else if (truncated.length <= 4) {
      return `${truncated.slice(0, 2)}/${truncated.slice(2)}`;
    } else {
      return `${truncated.slice(0, 2)}/${truncated.slice(2, 4)}/${truncated.slice(4)}`;
    }
  }

  /**
   * Remove a formatação da data, retorna apenas números
   */
  static unformatDate(value: string): string {
    return value.replace(/\D/g, "");
  }

  /**
   * Valida se a data está completa e é válida
   */
  static isValidDate(value: string): boolean {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(dateRegex);

    if (!match) return false;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
      daysInMonth[1] = 29;
    }

    if (day > daysInMonth[month - 1]) return false;

    return true;
  }

  /**
   * Valida se o telefone está completo
   */
  static isValidPhone(value: string): boolean {
    const numbers = value.replace(/\D/g, '');
    return numbers.length === 10 || numbers.length === 11;
  }

  /**
   * Formata CPF: 123.456.789-01
   */
  static formatCPF(value: string): string {
    const numbers = value.replace(/\D/g, '');
    const truncated = numbers.slice(0, 11);
    
    if (truncated.length <= 3) {
      return truncated;
    } else if (truncated.length <= 6) {
      return `${truncated.slice(0, 3)}.${truncated.slice(3)}`;
    } else if (truncated.length <= 9) {
      return `${truncated.slice(0, 3)}.${truncated.slice(3, 6)}.${truncated.slice(6)}`;
    } else {
      return `${truncated.slice(0, 3)}.${truncated.slice(3, 6)}.${truncated.slice(6, 9)}-${truncated.slice(9)}`;
    }
  }
}
