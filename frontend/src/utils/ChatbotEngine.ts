/**
 * Motor do Chatbot - Assistente Virtual
 *
 * Responde perguntas sobre carros, marcas, preços e funcionalidades do app
 */

import { Car } from "../navigation/car";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
}

export class ChatbotEngine {
  /**
   * Processa a mensagem do usuário e retorna resposta
   */
  static async processMessage(
    userMessage: string,
    cars: Car[],
  ): Promise<ChatMessage> {
    const message = userMessage.toLowerCase().trim();

    const response = this.generateResponse(message, cars);

    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000),
    );

    return {
      id: Date.now().toString(),
      text: response.text,
      sender: "bot",
      timestamp: new Date(),
      suggestions: response.suggestions,
    };
  }

  /**
   * Gera resposta baseada na mensagem do usuário
   */
  private static generateResponse(
    message: string,
    cars: Car[],
  ): { text: string; suggestions?: string[] } {
    if (
      this.matchPatterns(message, [
        "oi",
        "olá",
        "ola",
        "hey",
        "ei",
        "e ai",
        "e aí",
        "opa",
        "fala",
        "bom dia",
        "boa tarde",
        "boa noite",
        "alo",
        "alô",
      ])
    ) {
      return {
        text: "👋 Olá! Sou o assistente virtual da Garagem Premium. Como posso te ajudar hoje?",
        suggestions: [
          "Quais carros você tem?",
          "Qual o mais rápido?",
          "Mostre carros elétricos",
          "Como funciona o app?",
        ],
      };
    }

    if (
      this.matchPatterns(message, [
        "ajuda",
        "help",
        "o que você faz",
        "o que pode fazer",
        "o que voce faz",
        "que você faz",
        "que voce faz",
        "comandos",
        "como funciona",
        "me ajuda",
        "preciso de ajuda",
      ])
    ) {
      return {
        text:
          "🤖 Posso te ajudar com:\n\n" +
          "🚗 Informações sobre carros\n" +
          "💰 Consultas de preços\n" +
          "⚡ Especificações técnicas\n" +
          "🔍 Buscar carros específicos\n" +
          "📊 Comparações\n" +
          "❤️ Favoritos\n\n" +
          "O que gostaria de saber?",
        suggestions: [
          "Carros mais baratos",
          "Carros mais potentes",
          "Ferrari disponíveis",
          "Carros 2024",
        ],
      };
    }

    if (
      this.matchPatterns(message, [
        "quantos carros",
        "quantidade",
        "total de carros",
        "carros disponíveis",
        "quais carros",
        "que carros",
        "carros você tem",
        "carros tem",
        "mostre os carros",
        "ver carros",
        "todos os carros",
        "lista de carros",
      ])
    ) {
      const total = cars.length;
      const totalPrice = cars.reduce((acc, car) => acc + car.price, 0);
      const totalHP = cars.reduce((acc, car) => acc + car.horsepower, 0);

      return {
        text:
          `🚗 Temos ${total} carros incríveis!\n\n` +
          `💰 Valor total: R$ ${(totalPrice / 1000000).toFixed(1)}M\n` +
          `⚡ Potência total: ${totalHP} cv\n\n` +
          `Quer saber mais sobre algum?`,
        suggestions: [
          "Mostre o mais caro",
          "Mostre o mais potente",
          "Marcas disponíveis",
          "Carros esportivos",
        ],
      };
    }

    if (
      this.matchPatterns(message, [
        "mais caro",
        "carro mais caro",
        "preço mais alto",
      ])
    ) {
      const mostExpensive = cars.reduce((prev, current) =>
        current.price > prev.price ? current : prev,
      );

      return {
        text:
          `💎 O carro mais caro é:\n\n` +
          `🚗 ${mostExpensive.name}\n` +
          `💰 R$ ${(mostExpensive.price / 1000000).toFixed(2)}M\n` +
          `⚡ ${mostExpensive.horsepower} cv\n` +
          `🏎️ ${mostExpensive.maxSpeed} km/h\n\n` +
          `${mostExpensive.description.substring(0, 100)}...`,
        suggestions: [
          "Mostre o mais barato",
          "Outros da mesma marca",
          "Ver detalhes",
          "Comparar com outros",
        ],
      };
    }

    if (
      this.matchPatterns(message, [
        "mais barato",
        "carro mais barato",
        "preço mais baixo",
        "barato",
      ])
    ) {
      const cheapest = cars.reduce((prev, current) =>
        current.price < prev.price ? current : prev,
      );

      return {
        text:
          `💰 O carro mais acessível é:\n\n` +
          `🚗 ${cheapest.name}\n` +
          `💰 R$ ${(cheapest.price / 1000000).toFixed(2)}M\n` +
          `⚡ ${cheapest.horsepower} cv\n` +
          `🏎️ ${cheapest.maxSpeed} km/h\n\n` +
          `Ainda assim é incrível! 🔥`,
        suggestions: [
          "Mostre o mais caro",
          "Carros na faixa de R$ 2M",
          "Ver detalhes",
          "Favoritar",
        ],
      };
    }

    if (
      this.matchPatterns(message, [
        "mais potente",
        "mais forte",
        "maior potência",
        "mais cv",
        "mais hp",
      ])
    ) {
      const mostPowerful = cars.reduce((prev, current) =>
        current.horsepower > prev.horsepower ? current : prev,
      );

      return {
        text:
          `⚡ O carro mais potente é:\n\n` +
          `🚗 ${mostPowerful.name}\n` +
          `💪 ${mostPowerful.horsepower} cv\n` +
          `🚀 0-100 em ${mostPowerful.acceleration}\n` +
          `🏎️ ${mostPowerful.maxSpeed} km/h\n` +
          `💰 R$ ${(mostPowerful.price / 1000000).toFixed(2)}M\n\n` +
          `Pura brutalidade! 💥`,
        suggestions: [
          "Mostre o mais rápido",
          "Top 3 potentes",
          "Ver especificações",
          "Comparar com outros",
        ],
      };
    }

    if (
      this.matchPatterns(message, [
        "mais rápido",
        "mais veloz",
        "maior velocidade",
        "velocidade máxima",
      ])
    ) {
      const fastest = cars.reduce((prev, current) =>
        current.maxSpeed > prev.maxSpeed ? current : prev,
      );

      return {
        text:
          `🏎️ O carro mais rápido é:\n\n` +
          `🚗 ${fastest.name}\n` +
          `🚀 ${fastest.maxSpeed} km/h\n` +
          `⚡ ${fastest.horsepower} cv\n` +
          `⏱️ 0-100 em ${fastest.acceleration}\n` +
          `💰 R$ ${(fastest.price / 1000000).toFixed(2)}M\n\n` +
          `Velocidade pura! 💨`,
        suggestions: [
          "Mostre o mais potente",
          "Top 3 velocidade",
          "Ver detalhes",
          "Adicionar aos favoritos",
        ],
      };
    }

    if (
      this.matchPatterns(message, [
        "marcas",
        "quais marcas",
        "fabricantes",
        "montadoras",
      ])
    ) {
      const brands = [...new Set(cars.map((car) => car.brand))];
      const brandList = brands
        .map((brand, index) => `${index + 1}. ${brand}`)
        .join("\n");

      return {
        text:
          `🏢 Marcas disponíveis:\n\n${brandList}\n\n` +
          `Qual marca te interessa?`,
        suggestions: brands.slice(0, 4),
      };
    }

    const carsByBrand = this.findCarsByBrand(message, cars);
    if (carsByBrand.length > 0) {
      const brand = carsByBrand[0].brand;
      const count = carsByBrand.length;
      const avgPrice =
        carsByBrand.reduce((acc, car) => acc + car.price, 0) / count;

      return {
        text:
          `🏢 ${brand}:\n\n` +
          `🚗 ${count} ${count === 1 ? "carro" : "carros"} disponíveis\n` +
          `💰 Preço médio: R$ ${(avgPrice / 1000000).toFixed(2)}M\n\n` +
          `Modelos:\n` +
          carsByBrand
            .map((car, i) => `${i + 1}. ${car.model} - ${car.horsepower}cv`)
            .join("\n"),
        suggestions: [
          "Mostre o mais caro dessa marca",
          "Comparar modelos",
          "Outras marcas",
          "Ver todos",
        ],
      };
    }

    if (
      this.matchPatterns(message, [
        "elétrico",
        "eletricos",
        "carros elétricos",
        "ev",
      ])
    ) {
      const electric = cars.filter(
        (car) =>
          car.fuelType.toLowerCase().includes("elétrico") ||
          car.fuelType.toLowerCase().includes("eletrico"),
      );

      if (electric.length === 0) {
        return {
          text: "⚡ No momento não temos carros 100% elétricos, mas temos híbridos! Quer ver?",
          suggestions: [
            "Mostrar híbridos",
            "Ver todos os carros",
            "Tipos de combustível",
          ],
        };
      }

      return {
        text:
          `⚡ Carros elétricos (${electric.length}):\n\n` +
          electric
            .map(
              (car, i) =>
                `${i + 1}. ${car.name}\n   ${car.horsepower}cv - R$ ${(car.price / 1000000).toFixed(2)}M`,
            )
            .join("\n\n"),
        suggestions: [
          "Ver detalhes",
          "Comparar elétricos",
          "Carros a gasolina",
          "Híbridos",
        ],
      };
    }

    const priceMatch = message.match(/(\d+).*?(?:milhão|milhões|m|mi)/i);
    if (priceMatch) {
      const targetPrice = parseInt(priceMatch[1]) * 1000000;
      const inRange = cars.filter(
        (car) => Math.abs(car.price - targetPrice) <= targetPrice * 0.3,
      );

      if (inRange.length > 0) {
        return {
          text:
            `💰 Carros na faixa de R$ ${priceMatch[1]}M:\n\n` +
            inRange
              .slice(0, 5)
              .map(
                (car, i) =>
                  `${i + 1}. ${car.name}\n   R$ ${(car.price / 1000000).toFixed(2)}M - ${car.horsepower}cv`,
              )
              .join("\n\n"),
          suggestions: [
            "Mais barato",
            "Mais caro",
            "Ver todos",
            "Filtrar por marca",
          ],
        };
      }
    }

    const yearMatch = message.match(/20\d{2}/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0]);
      const byYear = cars.filter((car) => car.year === year);

      if (byYear.length > 0) {
        return {
          text:
            `📅 Carros de ${year}:\n\n` +
            byYear
              .map(
                (car, i) =>
                  `${i + 1}. ${car.name}\n   ${car.horsepower}cv - R$ ${(car.price / 1000000).toFixed(2)}M`,
              )
              .join("\n\n"),
          suggestions: [
            "Mais recentes",
            "Todos os anos",
            "Ver detalhes",
            "Comparar",
          ],
        };
      }
    }

    if (
      this.matchPatterns(message, [
        "favoritos",
        "favorito",
        "curtidos",
        "salvos",
        "meus carros",
      ])
    ) {
      return {
        text:
          "❤️ Para ver seus carros favoritos, vá até a tela de Favoritos no menu principal!\n\n" +
          "Você pode adicionar carros aos favoritos tocando no ícone de coração em qualquer carro. 💝",
        suggestions: [
          "Como favoritar?",
          "Ver todos os carros",
          "Carros recomendados",
          "Comparar carros",
        ],
      };
    }

    if (
      this.matchPatterns(message, [
        "comparar",
        "comparação",
        "versus",
        "vs",
        "diferença",
      ])
    ) {
      return {
        text:
          "🆚 Para comparar carros:\n\n" +
          "1. Vá até a tela de Comparação\n" +
          "2. Selecione 2 carros\n" +
          "3. Veja gráficos e especificações lado a lado!\n\n" +
          "Quer que eu sugira carros para comparar?",
        suggestions: [
          "Comparar mais potentes",
          "Comparar por preço",
          "Top 3 velocidade",
          "Ver todos",
        ],
      };
    }

    if (
      this.matchPatterns(message, [
        "como funciona",
        "funcionalidades",
        "recursos",
        "features",
      ])
    ) {
      return {
        text:
          "✨ Funcionalidades do App:\n\n" +
          "🔍 Busca e filtros avançados\n" +
          "❤️ Sistema de favoritos\n" +
          "🆚 Comparação de carros\n" +
          "⭐ Avaliações e reviews\n" +
          "📊 Estatísticas detalhadas\n" +
          "🎨 Temas claro e escuro\n" +
          "🏆 Sistema de conquistas\n" +
          "📱 Compartilhamento\n\n" +
          "Explore e aproveite! 🚀",
        suggestions: [
          "Ver carros",
          "Como comparar?",
          "Sistema de níveis",
          "Ajuda",
        ],
      };
    }

    if (
      this.matchPatterns(message, [
        "obrigado",
        "obrigada",
        "valeu",
        "thanks",
        "vlw",
      ])
    ) {
      return {
        text: "😊 Por nada! Estou aqui para ajudar. Precisa de mais alguma coisa?",
        suggestions: ["Mostrar carros", "Buscar marca", "Comparar", "Ajuda"],
      };
    }

    if (
      this.matchPatterns(message, [
        "tchau",
        "até logo",
        "bye",
        "até mais",
        "falou",
      ])
    ) {
      return {
        text: "👋 Até logo! Volte sempre que precisar. Boas compras! 🚗💨",
        suggestions: [
          "Ver carros novamente",
          "Meus favoritos",
          "Buscar",
          "Comparar",
        ],
      };
    }

    if (
      message.includes("carro") ||
      message.includes("auto") ||
      message.includes("veículo") ||
      message.includes("veiculo")
    ) {
      return {
        text:
          "🚗 Parece que você está perguntando sobre nossos carros!\n\n" +
          "Tente perguntas como:\n" +
          '• "Quantos carros tem?"\n' +
          '• "Qual o mais rápido?"\n' +
          '• "Mostre Ferrari"\n' +
          '• "Carros elétricos"\n' +
          '• "Mais barato"\n\n' +
          "Como posso ajudar?",
        suggestions: ["Ver todos", "Mais rápido", "Marcas", "Ajuda"],
      };
    }

    return {
      text:
        "🤔 Desculpe, não entendi muito bem.\n\n" +
        "Você pode me perguntar sobre:\n" +
        "• Carros disponíveis\n" +
        "• Preços e especificações\n" +
        "• Marcas e modelos\n" +
        "• Funcionalidades do app\n\n" +
        "O que gostaria de saber?",
      suggestions: [
        "Quais carros tem?",
        "Qual o mais rápido?",
        "Marcas disponíveis",
        "Ajuda",
      ],
    };
  }

  /**
   * Verifica se a mensagem contém algum dos padrões
   */
  private static matchPatterns(message: string, patterns: string[]): boolean {
    return patterns.some((pattern) => message.includes(pattern));
  }

  /**
   * Busca carros por marca mencionada na mensagem
   */
  private static findCarsByBrand(message: string, cars: Car[]): Car[] {
    const brands = [...new Set(cars.map((car) => car.brand))];
    const mentionedBrand = brands.find((brand) =>
      message.includes(brand.toLowerCase()),
    );

    if (mentionedBrand) {
      return cars.filter((car) => car.brand === mentionedBrand);
    }

    return [];
  }

  /**
   * Mensagem de boas-vindas
   */
  static getWelcomeMessage(): ChatMessage {
    return {
      id: "0",
      text:
        "👋 Olá! Sou o assistente virtual da Garagem Premium.\n\n" +
        "Posso te ajudar a encontrar o carro perfeito, responder dúvidas sobre especificações, preços e muito mais!\n\n" +
        "Como posso ajudar?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "Quais carros você tem?",
        "Mostre o mais rápido",
        "Carros elétricos",
        "Como funciona o app?",
      ],
    };
  }
}
