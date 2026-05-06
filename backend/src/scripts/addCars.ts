import mongoose from "mongoose";
import dotenv from "dotenv";
import Car from "../models/Car.model";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const newCars = [
  {
    name: "BMW M5 Competition",
    brand: "BMW",
    carModel: "M5 Competition",
    year: 2022,
    engine: "4.4L V8 Biturbo",
    horsepower: 625,
    torque: "76.5",
    transmission: "Automático 8 marchas",
    drivetrain: "AWD (Tração Integral)",
    fuelType: "Gasolina",
    maxSpeed: 305,
    acceleration: "3,3s",
    weight: 1895,
    price: 1060000,
    description:
      "O BMW M5 Competition é a personificação do equilíbrio entre luxo executivo e desempenho extremo. Trata-se de um sedã que, à primeira vista, pode passar despercebido, mas que esconde sob sua aparência elegante uma capacidade dinâmica comparável à de supercarros.",
  },
  {
    name: "Audi RS6 Avant Performance",
    brand: "Audi",
    carModel: "RS6 Avant Performance",
    year: 2026,
    engine: "4.0 V8 Biturbo TFSI",
    horsepower: 630,
    torque: "86.7",
    transmission: "Automático 8 marchas",
    drivetrain: "AWD (Tração Integral)",
    fuelType: "Gasolina",
    maxSpeed: 280,
    acceleration: "3,4s",
    weight: 2090,
    price: 1251990,
    description:
      "O Audi RS6 Avant Performance é a definição perfeita de um carro que desafia categorias. Ele combina a praticidade de uma perua com o desempenho de um supercarro, criando um dos veículos mais versáteis e impressionantes da atualidade.",
  },
  {
    name: "Nissan Silvia S15 Spec R",
    brand: "Nissan",
    carModel: "Silvia S15 Spec R",
    year: 1999,
    engine: "2.0L I4 Turbo",
    horsepower: 250,
    torque: "28",
    transmission: "Manual 6 marchas",
    drivetrain: "RWD (Tração Traseira)",
    fuelType: "Gasolina",
    maxSpeed: 260,
    acceleration: "5.6s",
    weight: 1240,
    price: 350000,
    description:
      "O Nissan Silvia S15 Spec-R é um dos esportivos japoneses mais cultuados de todos os tempos, conhecido por seu equilíbrio excepcional, leveza e enorme potencial para preparação. Lançado no fim da era de ouro dos esportivos japoneses, o S15 representa a forma mais refinada da linhagem Silvia, combinando design agressivo, mecânica confiável e uma dirigibilidade que o tornou referência no drift.",
  },
  {
    name: "Volkswagen Arteon Shooting Brake R",
    brand: "Volkswagen",
    carModel: "Arteon Shooting Brake R",
    year: 2025,
    engine: "2.0L I4 Turbo",
    horsepower: 320,
    torque: "42,8",
    transmission: "DSG 7 marchas",
    drivetrain: "4Motion (Tração Integral)",
    fuelType: "Gasolina",
    maxSpeed: 250,
    acceleration: "4,9s",
    weight: 1793,
    price: 900000,
    description:
      "O Volkswagen Arteon Shooting Brake R é a combinação perfeita entre elegância europeia, versatilidade de uma perua e desempenho esportivo de alto nível. Ele representa o lado mais sofisticado e ousado da Volkswagen, trazendo um design refinado aliado à engenharia da divisão R.",
  },
  {
    name: "Porsche Carrera GT",
    brand: "Porsche",
    carModel: "Carrera GT",
    year: 2004,
    engine: "5.7L V10 Aspirado",
    horsepower: 612,
    torque: "60.2",
    transmission: "Manual 6 marchas",
    drivetrain: "RWD (Tração Traseira)",
    fuelType: "Gasolina",
    maxSpeed: 330,
    acceleration: "3,9s",
    weight: 1380,
    price: 2000000,
    description:
      "O Porsche Carrera GT é um dos supercarros mais puros e lendários já produzidos, representando uma era em que a conexão entre homem e máquina era direta, intensa e sem filtros eletrônicos excessivos.",
  },
  {
    name: "Pagani Utopia",
    brand: "Pagani",
    carModel: "Utopia",
    year: 2023,
    engine: "6.0L V12 Biturbo",
    horsepower: 864,
    torque: "112.2",
    transmission: "Automático 7 marchas",
    drivetrain: "RWD (Tração Traseira)",
    fuelType: "Gasolina",
    maxSpeed: 360,
    acceleration: "3,3s",
    weight: 1280,
    price: 30000000,
    description:
      "O Pagani Utopia é a expressão mais pura da filosofia de Horacio Pagani: unir arte, engenharia e emoção em um automóvel. Mais do que um hipercarro, o Utopia é uma peça de design funcional, onde cada componente é tratado como uma obra artesanal.",
  },
  {
    name: "Maserati GT2 Stradale",
    brand: "Maserati",
    carModel: "GT2 Stradale",
    year: 2025,
    engine: "3.0L V6 Biturbo",
    horsepower: 640,
    torque: "73.4",
    transmission: "Automático 8 marchas",
    drivetrain: "RWD (Tração Traseira)",
    fuelType: "Gasolina",
    maxSpeed: 320,
    acceleration: "2,8s",
    weight: 1365,
    price: 6000000,
    description:
      "O Maserati GT2 Stradale é a tradução direta de um carro de corrida para as ruas, representando o retorno da Maserati ao universo das competições com uma proposta extremamente focada em desempenho.",
  },
  {
    name: "Lotus Emira V6 SE",
    brand: "Lotus",
    carModel: "Emira V6 SE",
    year: 2026,
    engine: "3.5L V6 Supercharged",
    horsepower: 405,
    torque: "42.8",
    transmission: "Manual de 6 marchas",
    drivetrain: "RWD (Tração Traseira)",
    fuelType: "Gasolina",
    maxSpeed: 290,
    acceleration: "4,3s",
    weight: 1405,
    price: 1300000,
    description:
      "O Lotus Emira V6 SE representa uma nova era para a Lotus, sendo o último modelo da marca equipado exclusivamente com motor a combustão. Ele combina o DNA tradicional da Lotus, leveza, precisão e foco na dirigibilidade.",
  },
  {
    name: "Alfa Romeo Giulia Quadrifoglio Estrema",
    brand: "Alfa Romeo",
    carModel: "Giulia Quadrifoglio Estrema",
    year: 2026,
    engine: "2.9L V6 BiTurbo",
    horsepower: 505,
    torque: "61.2",
    transmission: "Automático 8 marchas",
    drivetrain: "RWD (Tração Traseira)",
    fuelType: "Gasolina",
    maxSpeed: 307,
    acceleration: "3,9s",
    weight: 1695,
    price: 980000,
    description:
      "A Alfa Romeo Giulia Quadrifoglio Estrema é a expressão mais pura da filosofia de desempenho da marca, combinando tecnologia avançada com design elegante e uma experiência de condução emocionante.",
  },
  {
    name: "Cadillac CT5-V Blackwing F1 Collector Series",
    brand: "Cadillac",
    carModel: "CT5-V Blackwing F1 Collector Series",
    year: 2026,
    engine: "6.2L Supercharged V8",
    horsepower: 685,
    torque: "92.9",
    transmission: "Manual 6 marchas",
    drivetrain: "RWD (Tração Traseira)",
    fuelType: "Gasolina",
    maxSpeed: 322,
    acceleration: "3,4s",
    weight: 1860,
    price: 4000000,
    description:
      "O Cadillac CT5-V Blackwing F1 Collector Series é uma edição especial que celebra a entrada da Cadillac no universo da Fórmula 1, combinando o caráter brutal de um dos sedãs mais potentes do mundo com elementos exclusivos inspirados no automobilismo de elite.",
  },
  {
    name: "Gordon Murray Automotive T.33",
    brand: "Gordon Murray Automotive",
    carModel: "T.33",
    year: 2024,
    engine: "3.9L V12 Aspirado",
    horsepower: 617,
    torque: "46",
    transmission: "Manual 6 marchas",
    drivetrain: "RWD (Tração Traseira)",
    fuelType: "Gasolina",
    maxSpeed: 320,
    acceleration: "2,9s",
    weight: 1090,
    price: 9200000,
    description:
      "O Gordon Murray Automotive T.33 é a materialização de uma filosofia rara no mundo automotivo moderno: a busca pela pureza absoluta na experiência de dirigir.",
  },
  {
    name: "Honda Civic Type R Ultimate Edition",
    brand: "Honda",
    carModel: "Civic Type R Ultimate Edition",
    year: 2025,
    engine: "2.0L I4 Turbo",
    horsepower: 329,
    torque: "42.8",
    transmission: "Manual 6 marchas",
    drivetrain: "FWD (Tração Dianteira)",
    fuelType: "Gasolina",
    maxSpeed: 275,
    acceleration: "5,4s",
    weight: 1451,
    price: 550000,
    description:
      "O Honda Civic Type R Ultimate Edition representa o ápice de um dos hot hatches mais respeitados da história. Ele combina a tradição da Honda em engenharia de precisão com uma abordagem focada em desempenho extremo.",
  },
  {
    name: "Mazda RX-7 Fortune by Veilside",
    brand: "Mazda",
    carModel: "RX-7 Fortune by Veilside",
    year: 1991,
    engine: "1.3L Rotary Turbo",
    horsepower: 306,
    torque: "45",
    transmission: "Manual 5 marchas",
    drivetrain: "RWD (Tração Traseira)",
    fuelType: "Gasolina",
    maxSpeed: 280,
    acceleration: "4,9s",
    weight: 1280,
    price: 1000000,
    description:
      "O Mazda RX-7 Fortune by VeilSide é uma das customizações mais icônicas da cultura automotiva japonesa, elevando o já lendário RX-7 FD a um nível completamente novo de presença visual e exclusividade.",
  },
  {
    name: "Mitsubishi Lancer Evolution X Carbon Series",
    brand: "Mitsubishi",
    carModel: "Lancer Evolution X Carbon Series",
    year: 2012,
    engine: "2.0L I4 Turbo",
    horsepower: 295,
    torque: "37,3",
    transmission: "Automatizada 6 marchas",
    drivetrain: "AWD (Tração Integral)",
    fuelType: "Gasolina",
    maxSpeed: 242,
    acceleration: "6,3s",
    weight: 1590,
    price: 400000,
    description:
      "O Mitsubishi Lancer Evolution X Carbon Series é uma das versões mais especiais e desejadas do lendário Evo X, elevando ainda mais o caráter agressivo e técnico do modelo com foco em leveza, estética e exclusividade.",
  },
  {
    name: "Nissan 370Z S-Tune by Nismo",
    brand: "Nissan",
    carModel: "370Z S-Tune by Nismo",
    year: 2008,
    engine: "3.7L V6 Aspirado",
    horsepower: 332,
    torque: "37,3",
    transmission: "Manual 6 marchas",
    drivetrain: "RWD (Tração Traseira)",
    fuelType: "Gasolina",
    maxSpeed: 250,
    acceleration: "5,3s",
    weight: 1490,
    price: 400000,
    description:
      "O Nissan 370Z S-Tune by NISMO é uma interpretação mais refinada e equilibrada do clássico esportivo japonês, combinando o DNA puro da linha Z com o know-how da divisão de performance da Nissan.",
  },
];

const addCars = async () => {
  try {
    const uri = process.env.MONGODB_URI as string;
    const uriWithDb = uri.includes("/test") ? uri : uri.replace("/?", "/test?");
    await mongoose.connect(uriWithDb);
    console.log("Conectado ao MongoDB");

    for (const car of newCars) {
      const exists = await Car.findOne({ name: car.name });
      if (exists) {
        console.log(`⚠️  Já existe: ${car.name}`);
        continue;
      }
      await new Car(car).save();
      console.log(`✅ Adicionado: ${car.name}`);
    }

    console.log("🎉 Concluído!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
};

addCars();